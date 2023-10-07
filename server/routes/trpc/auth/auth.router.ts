import { LoginRequestModel, SignupRequestModel } from "./auth.types"
import { createTokens } from "../../../shared/util/tokens"
import { publicProcedure, createTRPCRouter } from "../../../shared/util/trpc"
import { TRPCError } from "@trpc/server"
import { Error } from "../../../shared/util/error"

export const authRouter = createTRPCRouter({
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

      const { accessToken, refreshToken } = createTokens({
        name: user.name,
        email: user.email,
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

  login: publicProcedure
    .input(LoginRequestModel)
    .mutation(async ({ ctx, input }) => {
      const { name, password } = input
      const user = await ctx.prisma.user.findUnique({
        where: {
          name,
        },
      })

      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })

      const { accessToken, refreshToken } = createTokens({
        name: user.name,
        email: user.email,
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
