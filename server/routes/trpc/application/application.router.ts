import { createTRPCRouter, protectedProcedure } from "@/shared/trpc";
import { CreateApplicationModel } from "./application.types";
import { createClientSecret } from "@/shared/util/tokens";

export const applicationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateApplicationModel)
    .mutation(async ({ ctx, input }) => {
      const application = await ctx.prisma.application.create({
        data: {
          name: input.name,
          secret: createClientSecret(),
          ownerId: ctx.user.userId,
        },
        select: { id: true, name: true },
      })

      return application
    }),
  all: protectedProcedure
    .query(async ({ ctx }) => {
      const applications = await ctx.prisma.application.findMany({
        where: {
          ownerId: ctx.user.userId,
        },
        select: {
          id: true,
          name: true,
        },
      })

      return applications
    })
})