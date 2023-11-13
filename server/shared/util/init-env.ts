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
  const res = dotenv.config({
    path,
  })
  if (res.parsed) {
    process.env = { ...process.env, ...res.parsed }
  } else {
    console.error("\n❌ Invalid environment variables:")
    console.error(` - ${res.error}`)
    console.error("\n")
    process.exit(1)
  }
  console.log(path, process.env.GITHUB_CLIENT_ID)
  const result = envModel.safeParse(process.env)
  if (!result.success) onInvalidEnv(result.error)
}
