import z from "zod"

/**
 * The environment variables that are required for the server to run.
 */
export const envModel = z.object({
  AUTH_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXPIRES_IN: z.string().min(1),
  REFRESH_TOKEN_EXPIRES_IN: z.string().min(1),
})

/**
 * All defined Environment Variables
 */
export default process.env as z.infer<typeof envModel>
