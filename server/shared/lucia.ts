import "lucia/polyfill/node"
import env from "@/env"
import prisma from "./prisma"
import { lucia } from "lucia"
import { express } from "lucia/middleware"
import { github, discord } from "@lucia-auth/oauth/providers"
import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma"
import { provider } from "./util/auth-provider"
import { User as PrismaUser } from "@prisma/client"

/** The OAuth redirect URI */
export const REDIRECT_URI = import.meta.env.PROD
  ? env.REDIRECT_URI
  : "http://localhost:3000"

export type DatabaseUserAttributes = {
  name: string
  email: string | null
  avatar: string | null
}
export type DatabaseSessionAttributes = Record<string, never>

/**
 * The Lucia authentication instance.
 */
export const auth = lucia({
  env: import.meta.env.PROD ? "PROD" : "DEV",
  middleware: express(),
  adapter: prismaAdapter(prisma),
  getUserAttributes: (data: PrismaUser): DatabaseUserAttributes => {
    return {
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    }
  },
  getSessionAttributes: (): DatabaseSessionAttributes => ({}),
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
    ({ githubUser }): DatabaseUserAttributes => ({
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
    ({ discordUser }): DatabaseUserAttributes => ({
      name: discordUser.username,
      email: discordUser.email ?? null,
      avatar: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}?size=480`,
    })
  ),
} as const

export function getProvider(provider: Provider) {
  return providers[provider]
}

export type Auth = typeof auth
export type Provider = keyof typeof providers
