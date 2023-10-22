import { lucia } from "lucia"
import { express } from "lucia/middleware"
import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma"
import prisma from "./prisma"
import "lucia/polyfill/node"


export const auth = lucia({
  env: import.meta.env.PROD ? "PROD" : "DEV",
  middleware: express(),
  adapter: prismaAdapter(prisma),
})

export type Auth = typeof auth
