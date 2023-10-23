import scrypt from "@/shared/util/scrypt"
import { LoginRequestModel, SignupRequestModel } from "./auth.types"
import { createTokens } from "@/shared/util/tokens"
import { publicProcedure, createTRPCRouter } from "@/shared/trpc"
import { TRPCError } from "@trpc/server"

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(SignupRequestModel)
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input

      const hash = scrypt.hashPassword(password)
      try {
        const user = await ctx.prisma.user.create({
          data: {
            name,
            email,
            password: hash,
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
          },
        }
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        })
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

      if (!user)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })

      if (!(await scrypt.verifyPassword(password, user.password))) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Wrong Password" })
      }

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
        },
      }
    }),
})
