import prisma from "./prisma"
import { Lucia, verifyRequestOrigin } from "lucia"
import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import { User as PrismaUser } from "@prisma/client"
import { defineProviders } from "./util/auth-provider"
import { Request, Response } from "express"

import twitch from "./providers/twitch"
import discord from "./providers/discord"
import github from "./providers/github"


/**
 * The Lucia authentication instance.
 */
export const lucia = new Lucia(
  new PrismaAdapter(prisma.session, prisma.user),
  {
    sessionCookie: {
      attributes: {
        secure: import.meta.env.PROD,
      }
    },
    getUserAttributes(databaseUserAttributes) {
      return databaseUserAttributes
    },
  }
)

export const providers = defineProviders({
  github,
  discord,
  twitch
})

/**
 * Check if the request origin is allowed.
 * @param req The request object.
 * @returns 
 */
export function checkOrigin(req: Request) {
  if (req.method === "GET") return true
  const originHeader = req.headers.origin ?? null;
	// NOTE: You may need to use `X-Forwarded-Host` instead
	const hostHeader = req.headers.host ?? null;
	return originHeader && hostHeader && verifyRequestOrigin(originHeader, [hostHeader])
}

/**
 * Get the session and user from the request.
 * @param req
 * @param res 
 * @returns 
 */
export async function handleRequest(req: Request, res: Response) {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "")
  if (!sessionId) return { session: null, user: null }

  const { session, user } = await lucia.validateSession(sessionId)
  if (session && session.fresh) {
    res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
  }
  if (!session) {
    res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())
  }

  return { session, user }
}


declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: Omit<PrismaUser, "id">
  }
}
export type Auth = typeof lucia
