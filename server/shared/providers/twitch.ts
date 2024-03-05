import { Twitch } from "arctic";
import { defineProvider } from "@/shared/util/auth-provider";
import { getRedirectUri } from "@/shared/util/helpers";
import env from "@/env";

export default defineProvider({
  provider: new Twitch(
    env.TWITCH_CLIENT_ID,
    env.TWITCH_CLIENT_SECRET,
    getRedirectUri("/api/auth/callback/twitch")
  ),

  createAuthUrl: async (provider, state) => {
    // https://dev.twitch.tv/docs/authentication/scopes/
    return await provider.createAuthorizationURL(state, {
      scopes: ["user:read:email"]
    })
  },

  getUser: async tokens => {
    // https://dev.twitch.tv/docs/api/reference/#get-users
    const res = await fetch("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "Client-Id": env.TWITCH_CLIENT_ID
      }
    }).then(r => r.json()) as TwitchRes
    
    if ("error" in res) {
      throw new Error("[Twitch API Error] " + res.error)
    }
    const user = res.data[0]

    return {
      externalId: user.id,
      user: {
        name: user.login,
        email: user.email,
        avatar: user.profile_image_url,
      }
    }
  }
})

type TwitchUser = {
  id: string
  login: string
  profile_image_url: string
  email: string | null
}

type TwitchRes = {
  data: [TwitchUser]
} | { error: string }