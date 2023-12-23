import z from "zod"

export const tokenDataModel = z.object({
  appId: z.string(),
  name: z.string(),
  iat: z.number(),
  exp: z.number(),
})
export type TokenData = z.infer<typeof tokenDataModel>
export type TokenDataPayload = Omit<z.infer<typeof tokenDataModel>, "iat" | "exp">