import z from "zod";
import { createRouter } from "../util/trpc";
import { authRouter } from "./auth";

export const appRouter = createRouter({
    auth: authRouter
})
export type AppRouter = typeof appRouter;