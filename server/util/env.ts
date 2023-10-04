import z from "zod"

export const envModel = z.object({
  AUTH_SECRET: z.string().min(1),
})

export default process.env as z.infer<typeof envModel>
