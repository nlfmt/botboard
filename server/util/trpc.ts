import { TRPCError, initTRPC } from "@trpc/server"
import prisma from "./prisma"
import { Request, Response } from "express"
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http"
import { TokenData, tokenDataModel } from "../models/auth"

export async function createTRPCContext({
  req,
}: NodeHTTPCreateContextFnOptions<Request, Response>) {
  const token = req.headers.authorization?.split(" ")[1]
  let user: TokenData | undefined
  if (token) {
    const data = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    )
    const res = tokenDataModel.safeParse(data)
    if (res.success) {
      user = res.data
    }
  }

  return {
    prisma,
    user,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create()

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

export const createRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
