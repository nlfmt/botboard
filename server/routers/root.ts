import z from "zod";
import { publicProcedure, router } from "../util/trpc";
import prisma from "../util/prisma";

export const appRouter = router({
    test: publicProcedure.input(z.string()).query(async ({ input } )=> {
        await prisma.example.create({
            data: {
                body: input,
                title: `Hello ${input}!`
            }
        })
        return await prisma.example.findMany()
    }),
})
export type AppRouter = typeof appRouter;