import { createTRPCRouter, protectedProcedure } from "@/shared/trpc";


export const userRouter = createTRPCRouter({
  me: protectedProcedure
  .query(({ ctx }) => {
    return {
      userId: ctx.user.userId,
      email: ctx.user.email,
      name: ctx.user.name,
      avatar: ctx.user.avatar,
    }
  })
})