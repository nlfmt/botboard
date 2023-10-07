import z from "zod"

export const tokenDataModel = z.object({
  name: z.string(),
  email: z.string(),
  iat: z.number(),
  exp: z.number(),
})
export type TokenData = z.infer<typeof tokenDataModel>
export type TokenDataPayload = Omit<z.infer<typeof tokenDataModel>, "iat" | "exp">