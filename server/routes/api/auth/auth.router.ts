import { auth, getProvider } from "@/shared/lucia"
import { OAuthRequestError } from "@lucia-auth/oauth"
import { createRouter } from "@/shared/util/route-builder"
import { callbackQuerySchema, providerSchema } from "./auth.types"

const authRouter = createRouter()

authRouter
  .path("/login/:provider")
  .params({ provider: providerSchema })
  .get(async ({ req, res, params }) => {
    const authRequest = auth.handleRequest(req, res)
    const session = await authRequest.validate()

    if (session) {
      return res.redirect("/")
    }

    const provider = getProvider(params.provider)
    const [url, state] = await provider.getAuthorizationUrl()

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
  .get(async ({ req, res, query, params }) => {
    if ("error" in query) {
      const params = new URLSearchParams({
        error: query.error,
        error_description: query.error_description ?? "",
      })
      return res.redirect("/login?" + params)
    }
    const storedState = req.cookies[`${params.provider}-oauth-state`]
    const provider = getProvider(params.provider)

    if (
      !storedState ||
      !query.state ||
      storedState !== query.state ||
      typeof query.code !== "string"
    ) {
      return res.redirect("/login?error=" + encodeURIComponent("Invalid state"))
    }
    try {
      const { getExistingUser, userData, createUser } =
        await provider.validateCallback(query.code)

      const getUser = async () => {
        const existingUser = await getExistingUser()
        if (existingUser) return existingUser
        const user = await createUser({
          attributes: userData,
        })
        return user
      }

      const user = await getUser()
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      })
      const authRequest = auth.handleRequest(req, res)
      authRequest.setSession(session)

      // do some cleanup
      await auth.deleteDeadUserSessions(session.userId)

      res.redirect("/")
    } catch (e) {
      if (e instanceof OAuthRequestError) {
        return res.sendStatus(400)
      }
      return res.sendStatus(500)
    }
  })

authRouter.path("/logout").get(async ({ req, res }) => {
  const authRequest = auth.handleRequest(req, res)
  const session = await authRequest.validate()

  if (!session) {
    return res.sendStatus(401)
  }

  await auth.invalidateSession(session.sessionId)
  authRequest.setSession(null)

  await auth.deleteDeadUserSessions(session.userId)

  return res.redirect("/login")
})

export default authRouter
