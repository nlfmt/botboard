import { NextFunction, Request, Response } from "express";

const imgDomains = [
  "cdn.discordapp.com",
  "avatars.githubusercontent.com",
  "static-cdn.jtvnw.net"
] as const

const policy = [
  "default-src 'self'",
  "img-src 'self' " + imgDomains.join(" "),
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self'",
] as const

export const csp = (req: Request, res: Response, next: NextFunction) => {
  res.set("Content-Security-Policy", policy.join(";"))
  next()
}