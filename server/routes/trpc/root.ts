import { createTRPCRouter, createTRPCContext } from "@/shared/trpc";
import * as trpcExpress from "@trpc/server/adapters/express"
import { testRouter } from "./test/test.router";
import { userRouter } from "./user/user.router";

/**
 * All TRPC subrouters
 */
export const appRouter = createTRPCRouter({
    user: userRouter,
    test: testRouter,
})

export type AppRouter = typeof appRouter;
export const trpcRouter = trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
})