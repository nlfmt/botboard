import { providers } from "@/shared/lucia"
import z from "zod"

const isValidProvider = (
  provider: string
): provider is keyof typeof providers => {
  return provider in providers
}

export const providerSchema = z.string().refine(isValidProvider, {
  message: "Invalid provider",
})

export const callbackQuerySchema = z.union([
  z.object({
    state: z.string(),
    code: z.string(),
  }),
  z.object({
    error: z.string(),
    error_description: z.string().optional(),
  }),
])
