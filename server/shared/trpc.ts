import { TRPCError, initTRPC } from "@trpc/server"
import prisma from "./prisma"
import { Request, Response } from "express"
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http"
import { checkOrigin, handleRequest} from "./lucia"

export async function createTRPCContext({
  req,
  res,
}: NodeHTTPCreateContextFnOptions<Request, Response>) {
  return {
    prisma,
    req, res
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create()

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!checkOrigin(ctx.req)) {
    throw new TRPCError({ code: "FORBIDDEN" })
  }
  
  const { session, user } = await handleRequest(ctx.req, ctx.res)
    
  if (!session || !user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next({
    ctx: {
      ...ctx,
      user,
      session,
    },
  })
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
