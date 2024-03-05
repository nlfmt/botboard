import { Discord } from "arctic";
import { defineProvider } from "@/shared/util/auth-provider";
import { getRedirectUri } from "@/shared/util/helpers";
import env from "@/env";

export default defineProvider({
  provider: new Discord(
    env.DISCORD_CLIENT_ID,
    env.DISCORD_CLIENT_SECRET,
    getRedirectUri("/api/auth/callback/discord")
  ),

  createAuthUrl: async (provider, state) => {
    // https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
    return await provider.createAuthorizationURL(state, {
      scopes: ["identify", "email"]
    })
  },

  getUser: async tokens => {
    // https://discord.com/developers/docs/resources/user#get-current-user
    const user = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    }).then(r => r.json()) as DiscordUser

    // https://discord.com/developers/docs/reference#image-formatting
    const avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=480`

    return {
      externalId: user.id,
      user: {
        name: user.username,
        email: user.email ?? null,
        avatar,
      }
    }
  },
})

type DiscordUser = {
  id: string
  username: string
  avatar: string
  email?: string | null
}