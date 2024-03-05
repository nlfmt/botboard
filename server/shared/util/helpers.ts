import { fileURLToPath } from "url"
import path from "path"
import env from "@/env"

export function relativePath(meta: ImportMeta, ...paths: string[]) {
  return path.join(path.dirname(fileURLToPath(meta.url)), ...paths)
}

export function getHost(host: string, port: number) {
  return host + (port === 80 ? "" : `:${port}`)
}

export function getRedirectUri(path = "") {
  const hostname = getHost(env.HOST, env.PORT)
  const protocol = import.meta.env.PROD ? "https" : "http"
  return `${protocol}://${hostname}${path}`
}

// function that takes a function that might throw an error and returns an object with either the error message or the return data
export function tryCatch<
  Fn extends (...args: any[]) => Promise<any>
>(fn: Fn): (...args: Parameters<Fn>) => Promise<{ data: Awaited<ReturnType<Fn>>, success: true } | { success: false, error: string }> {
  return async (...args: any[]) => {
    try {
      return { data: await fn(...args), success: true }
    } catch (e) {
      if (e instanceof Error) {
        return { error: e.message, success: false }
      } else {
        return { error: "An unknown error occurred", success: false }
      }
    }
  }
}