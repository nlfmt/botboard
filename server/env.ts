import z from "zod"
import { initEnv } from "./shared/util/init-env"

/**
 * The environment variables that are required for the server to run.
 */
export const envModel = z.object({
  AUTH_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXPIRES_IN: z.string().min(1),
  REFRESH_TOKEN_EXPIRES_IN: z.string().min(1),

  HOST: z.string().min(1),
  PORT: z.coerce.number().int().min(1).default(3000),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
  TWITCH_CLIENT_ID: z.string().min(1),
  TWITCH_CLIENT_SECRET: z.string().min(1),
})
const env = initEnv(envModel,
  import.meta.env.PROD ? "./.env" : "./.env.dev"
)
/**
 * All defined Environment Variables
 */
export default env
