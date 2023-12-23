import z from "zod"

export const GetTokenModel = z.object({
    clientSecret: z.string().length(96),
})