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
          clientSecret: createClientSecret(),
          ownerId: ctx.user.userId,
        },
      })

      return {
        application: {
          id: application.id,
          name: application.name,
        },
      }
    }),
})