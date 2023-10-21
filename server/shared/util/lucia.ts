import { lucia, Auth as LuciaAuth } from "lucia";
import { express } from "lucia/middleware";
import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "./prisma.js";
import "lucia/polyfill/node";

export const auth: LuciaAuth = lucia({
	env: "DEV", // "PROD" if deployed to HTTPS
	middleware: express(),
  adapter: prismaAdapter(prisma)
});

export type Auth = typeof auth;