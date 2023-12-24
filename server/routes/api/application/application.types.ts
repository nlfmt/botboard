import z from "zod"

export const GetTokenModel = z.object({
    secret: z.string().length(96),
})