import { createTRPCRouter, protectedProcedure } from "@/shared/trpc";


export const testRouter = createTRPCRouter({
  abc: protectedProcedure.query(() => {
    return "Hello, youre authenticated!"
  })
})