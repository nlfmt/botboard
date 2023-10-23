import { createTRPCRouter, createTRPCContext } from "@/shared/trpc";
import * as trpcExpress from "@trpc/server/adapters/express"
import { authRouter } from "./auth/auth.router";
import { testRouter } from "./test/test.router";

/**
 * All TRPC subrouters
 */
export const appRouter = createTRPCRouter({
    auth: authRouter,
    test: testRouter
})

export type AppRouter = typeof appRouter;
export const trpcRouter = trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
})