import env from "@/env"
import prisma from "./prisma"
import { lucia } from "lucia"
import { express } from "lucia/middleware"
import { github, discord, twitch } from "@lucia-auth/oauth/providers"
import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma"
import { provider } from "./util/auth-provider"
import { User as PrismaUser } from "@prisma/client"
import { getUrl } from "./util/helpers"

/** The Hostname and OAuth redirect URI */
export const HOSTNAME = getUrl(env.HOST, env.PORT)
export const REDIRECT_URI = "https://" + HOSTNAME

/**
 * The Lucia authentication instance.
 */
export const auth = lucia({
  env: import.meta.env.PROD ? "PROD" : "DEV",
  csrfProtection: {
    allowedSubDomains: "*",
    host: HOSTNAME
  },
  experimental: {
    debugMode: import.meta.env.DEV,
  },
  middleware: express(),
  adapter: prismaAdapter(prisma),
  getUserAttributes: (data: PrismaUser): Lucia.DatabaseUserAttributes => {
    return {
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    }
  },
  getSessionAttributes: (): Lucia.DatabaseSessionAttributes => ({}),
})

/**
 * All providers that are supported by this application.
 */
export const providers = {
  github: provider(
    auth,
    github,
    {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    ({ githubUser }): Lucia.DatabaseUserAttributes => ({
      name: githubUser.login,
      email: githubUser.email,
      avatar: githubUser.avatar_url,
    })
  ),
  discord: provider(
    auth,
    discord,
    {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      redirectUri: new URL("/api/auth/callback/discord", REDIRECT_URI).href,
    },
    ({ discordUser }): Lucia.DatabaseUserAttributes => {
      return {
        name: discordUser.username,
        email: discordUser.email ?? null,
        avatar:
          discordUser.avatar &&
          `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}?size=480`,
      }
    }
  ),
  twitch: provider(
    auth,
    twitch,
    {
      clientId: env.TWITCH_CLIENT_ID,
      clientSecret: env.TWITCH_CLIENT_SECRET,
      redirectUri: new URL("/api/auth/callback/twitch", REDIRECT_URI).href,
    },
    ({ twitchUser }): Lucia.DatabaseUserAttributes => ({
      name: twitchUser.login,
      email: twitchUser.email ?? null,
      avatar: twitchUser.profile_image_url,
    })
  ),
} as const

export function getProvider(provider: Provider) {
  return providers[provider]
}

export type Auth = typeof auth
export type Provider = keyof typeof providers
