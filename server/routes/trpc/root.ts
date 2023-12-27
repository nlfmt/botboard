import { createTRPCRouter, createTRPCContext } from "@/shared/trpc";
import * as trpcExpress from "@trpc/server/adapters/express"
import { testRouter } from "./test/test.router";
import { userRouter } from "./user/user.router";
import { applicationRouter } from "./application/application.router";

/**
 * All TRPC subrouters
 */
const appRouter = createTRPCRouter({
    user: userRouter,
    test: testRouter,
    application: applicationRouter,
})
export type AppRouter = typeof appRouter;

const trpcRouter = trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
})

export default trpcRouter