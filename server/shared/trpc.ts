import { TRPCError, initTRPC } from "@trpc/server"
import prisma from "./prisma"
import { Request, Response } from "express"
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http"
import { auth } from "./lucia"

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
  console.log("enforceUserIsAuthed", ctx.req.headers)
  const authRequest = auth.handleRequest(ctx.req, ctx.res)
  const session = await authRequest.validate()

  console.log({ session })

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next({
    ctx: {
      ...ctx,
      user: session.user,
    },
  })
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
