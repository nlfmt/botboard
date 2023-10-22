import { scryptSync, randomBytes } from "crypto"

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptHash(password, salt)
  return `${salt}:${hash}`
}

function verifyPassword(password: string, hash: string) {
  const [salt, key] = hash.split(":")
  const newKey = scryptHash(password, salt)
  return newKey === key
}

function scryptHash(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex")
}

export default {
  hashPassword,
  verifyPassword,
}