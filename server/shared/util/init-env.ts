import dotenv from "dotenv"
import { envModel } from "@/env"

export function initEnv(path: string) {
  const res = dotenv.config({
    path,
  })

  if (res.parsed) {
    process.env = { ...process.env, ...res.parsed }
  }

  if (res.error) {
    console.error("\n❌ Invalid environment variables:")
    console.error(` - ${res.error}`)
    console.error("\n")
    process.exit(1)
  }

  const result = envModel.safeParse(process.env)

  if (!result.success) {
    console.error("\n❌ Invalid environment variables:")
    for (const entry of Object.entries(result.error.flatten().fieldErrors)) {
      console.error(` - ${entry[0]}: ${entry[1]}`)
    }
    console.error("\n")
    process.exit(1)
  }
}
