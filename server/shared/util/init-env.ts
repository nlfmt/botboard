import { ZodError } from "zod"
import dotenv from "dotenv"
import { envModel } from "@/env"

export function onInvalidEnv(err: ZodError) {
  console.error("\n❌ Invalid environment variables:")
  for (const entry of Object.entries(err.flatten().fieldErrors)) {
    console.error(` - ${entry[0]}: ${entry[1]}`)
  }
  console.error("\n")
  process.exit(1)
}

export function initEnv(path: string) {
  dotenv.config({
    path,
  })
  const result = envModel.safeParse(process.env)
  if (!result.success) onInvalidEnv(result.error)
}
