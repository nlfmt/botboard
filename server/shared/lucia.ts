import "lucia/polyfill/node"
import env from "@/env"
import prisma from "./prisma"
import { lucia } from "lucia"
import { express } from "lucia/middleware"
import { github, discord } from "@lucia-auth/oauth/providers"
import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma"
import { provider } from "./util/auth-provider"

/** The OAuth redirect URI */
export const REDIRECT_URI = import.meta.env.PROD
  ? env.REDIRECT_URI
  : "http://localhost:3000"

/**
 * The Lucia authentication instance.
 */
export const auth = lucia({
  env: import.meta.env.PROD ? "PROD" : "DEV",
  middleware: express(),
  adapter: prismaAdapter(prisma),

  getUserAttributes: (data) => {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    }
  },
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
    ({ githubUser }) => ({
      avatar: githubUser.avatar_url,
      name: githubUser.login,
      email: githubUser.email ?? undefined,
    })
  ),
  discord: provider(
    auth,
    discord,
    {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      redirectUri: new URL("/api/login/discord/callback", REDIRECT_URI).href,
    },
    ({ discordUser }) => ({
      avatar: discordUser.avatar,
      name: discordUser.username,
      email: discordUser.email,
    })
  ),
} as const

export function getProvider(provider: Provider) {
  return providers[provider]
}

export type Auth = typeof auth
export type Provider = keyof typeof providers
