import { GitHub } from "arctic";
import { defineProvider } from "@/shared/util/auth-provider";
import env from "@/env";

export default defineProvider({
  provider: new GitHub(
    env.GITHUB_CLIENT_ID,
    env.GITHUB_CLIENT_SECRET
  ),

  createAuthUrl: async (provider, state) => {
    // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
    return await provider.createAuthorizationURL(state, {
      scopes: ["read:user", "read:email"]
    })
  },

  getUser: async tokens => {
    // https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
    const user = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    }).then(r => r.json()) as GitHubUser

    return {
      externalId: String(user.id),
      user: {
        name: user.login,
        email: user.email,
        avatar: user.avatar_url,
      }
    }
  }
})

type GitHubUser = {
  id: number
  login: string
  avatar_url: string
  email: string | null
}