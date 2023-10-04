import z from "zod"

export const PasswordModel = z.string().min(8).max(100)

export const SignupRequestModel = z.object({
    name: z.string().min(3).max(20),
    email: z.string().email(),
    password: PasswordModel
})
export type SignupRequest = z.infer<typeof SignupRequestModel>

export const LoginRequestModel = z.object({
    name: z.string(),
    password: PasswordModel
})
export type LoginRequest = z.infer<typeof LoginRequestModel>

export const tokenDataModel = z.object({
    name: z.string(),
    email: z.string()
})
export type TokenData = z.infer<typeof tokenDataModel>