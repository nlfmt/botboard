import { lucia, providers, handleRequest } from "@/shared/lucia"
import { OAuth2RequestError } from "arctic"
import { createRouter } from "@/shared/util/route-builder"
import { callbackQuerySchema, providerSchema } from "./auth.types"
import { Error } from "@/shared/util/error"

const authRouter = createRouter()

authRouter
  .path("/login/:provider")
  .params({ provider: providerSchema })
  .get(async ({ ctx: { req, res }, params }) => {
    const { session } = await handleRequest(req, res)
    if (session) return res.redirect("/")

    const provider = providers[params.provider]
    const { url, state } = await provider.createAuthUrl()

    res.cookie(`${params.provider}-oauth-state`, state, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      path: "/",
      maxAge: 60 * 60 * 1000,
    })
    res.redirect(url.toString())
  })

authRouter
  .path("/callback/:provider")
  .params({ provider: providerSchema })
  .query(callbackQuerySchema)
  .get(async ({ ctx: { req, res }, query, params }) => {
    if ("error" in query) {
      const params = new URLSearchParams({
        error: query.error,
        error_description: query.error_description ?? "",
      })
      return res.redirect("/login?" + params)
    }
    const storedState = req.cookies[`${params.provider}-oauth-state`]

    if (
      !query.code ||
      !query.state ||
      !storedState ||
      storedState !== query.state
    ) {
      return res.redirect("/login?error=" + encodeURIComponent("Invalid state"))
    }

    try {
      const provider = providers[params.provider]
      const userId = await provider.validateCallback(query.code)
      const session = await lucia.createSession(userId, {})

      res.appendHeader(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize()
      )
      return res.redirect("/")
    } catch (e) {
      if (
        e instanceof OAuth2RequestError &&
        e.message === "bad_verification_code"
      ) {
        const params = new URLSearchParams({
          error: Error.INVALID_AUTH_CODE.name,
          error_description: Error.INVALID_AUTH_CODE.message ?? "",
        })
        return res.redirect("/login?" + params)
      }

      console.log(e)

      const params = new URLSearchParams({
        error: Error.INTERNAL_SERVER_ERROR.name,
        error_description: Error.INTERNAL_SERVER_ERROR.message ?? "",
      })
      return res.redirect("/login?" + params)
    }
  })

authRouter.path("/logout").get(async ({ ctx: { req, res } }) => {
  const { session } = await handleRequest(req, res)

  if (!session) {
    return res.sendStatus(401)
  }

  await lucia.invalidateSession(session.id)

  res.setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())
  return res.redirect("/login")
})

export default authRouter
