import jwt, { JsonWebTokenError } from "jsonwebtoken"
import env from "@/env"
import {
  TokenData,
  TokenDataPayload,
  tokenDataModel,
} from "../models/token.model"
import { randomBytes } from "crypto";


export type SafeError<T> =
  | { error: string; success: false }
  | { data: T; success: true }

export function createToken(payload: TokenDataPayload, expiresIn: string) {
  return jwt.sign(payload, env.AUTH_SECRET, {
    expiresIn,
  })
}

export function verifyToken(token: string): SafeError<TokenData> {
  try {
    const data = jwt.verify(token, env.AUTH_SECRET)
    const res = tokenDataModel.safeParse(data)
    if (res.success) {
      return { data: res.data, success: true }
    } else {
      return { error: "Invalid Token Data", success: false } // TODO: move error messages to separate file
    }
  } catch (e) {
    return { error: (e as JsonWebTokenError).message, success: false }
  }
}

export function createClientSecret() {
  return randomBytes(48).toString("hex")
}
