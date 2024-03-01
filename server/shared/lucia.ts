import env from "@/env"
import prisma from "./prisma"
import { Lucia, verifyRequestOrigin } from "lucia"
import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import { User as PrismaUser } from "@prisma/client"
import { getUrl } from "./util/helpers"
import { Discord, GitHub } from "arctic"
import { defineProviders } from "./util/auth-provider"
import { Request, Response } from "express"

/** The OAuth redirect URI */
export const REDIRECT_URI = "https://" + getUrl(env.HOST, env.PORT)

const adapter = new PrismaAdapter(prisma.session, prisma.user)

/**
 * The Lucia authentication instance.
 */
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    }
  },
  getUserAttributes(databaseUserAttributes) {
    return databaseUserAttributes
  },
})

export const providers = defineProviders({
  github: {
    provider: new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET),
    getUser: async tokens => {
      return {
        externalId: tokens.accessToken,
        user: {
          name: "github",
          email: "",
          avatar: "",
        }
      }
    }
  },
  discord: {
    provider: new Discord(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, ""),
    getUser: async tokens => {
      return {
        externalId: tokens.accessToken,
        user: {
          name: "github",
          email: "",
          avatar: "",
        }
      }
    }
  }
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
