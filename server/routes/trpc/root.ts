import { createTRPCRouter, createTRPCContext } from "../../shared/util/trpc";
import { authRouter } from "./auth/auth.router";
import * as trpcExpress from "@trpc/server/adapters/express"

/**
 * All TRPC subrouters
 */
export const appRouter = createTRPCRouter({
    auth: authRouter
})

export type AppRouter = typeof appRouter;
export const trpcRouter = trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
})