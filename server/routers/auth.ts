import { SignupRequestModel } from "../models/auth"
import { publicProcedure, createRouter } from "../util/trpc"
import jwt from "jsonwebtoken"
import env from "../util/env"

export const authRouter = createRouter({
  signup: publicProcedure
    .input(SignupRequestModel)
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input
      const user = await ctx.prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      })

      const payload = {
        name: user.name,
        email: user.email,
      }
      // TODO: refactor these into util helper `createTokens`
      const accessToken = jwt.sign(payload, env.AUTH_SECRET, {
        expiresIn: "1d",
      })
      const refreshToken = jwt.sign(payload, env.AUTH_SECRET, {
        expiresIn: "30d",
      })

      return {
        accessToken,
        refreshToken,
        user: {
          name: user.name,
          email: user.email,
        }
      }
    }),
})
