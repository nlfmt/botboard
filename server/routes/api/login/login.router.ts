import { auth, getProvider } from "@/shared/lucia"
import { OAuthRequestError } from "@lucia-auth/oauth"
import { createRouter } from "@/shared/util/route-builder"
import z from "zod"
import { providerSchema } from "./login.types"

const loginRouter = createRouter()

loginRouter
  .path("/:provider")
  .params({
    provider: providerSchema,
  })
  .get(async ({ res, params }) => {
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

  loginRouter
  .path("/:provider/callback")
  .params({
    provider: z.enum(["github", "discord"], { description: "OAuth provider" }),
  })
  .query(
    z.union([
      z.object({
        state: z.string(),
        code: z.string(),
      }),
      z.object({
        error: z.string(),
      }),
    ])
  )
  .get(async ({ req, res, query, params }) => {
    if ("error" in query) {
      return res.redirect("/login")
    }
    console.log("cookies", req.cookies, query.state)

    const storedState = req.cookies[`${params.provider}-oauth-state`]
    const provider = getProvider(params.provider)

    if (
      !storedState ||
      !query.state ||
      storedState !== query.state ||
      typeof query.code !== "string"
    ) {
      console.log(storedState, query.state, query.code, typeof query.code)
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

      if (import.meta.env.PROD) {
        res.redirect("/")
      } else {
        res.redirect("http://localhost:3000")
      }
    } catch (e) {
      if (e instanceof OAuthRequestError) {
        // invalid code
        console.log("error", e)
        return res.sendStatus(400)
      }
      console.log("error", e)
      return res.sendStatus(500)
    }
  })

export default loginRouter
