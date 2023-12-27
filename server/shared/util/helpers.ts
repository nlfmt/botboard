import { fileURLToPath } from "url"
import path from "path"

export function relativePath(meta: ImportMeta, ...paths: string[]) {
  return path.join(path.dirname(fileURLToPath(meta.url)), ...paths)
}

export function getUrl(host: string, port: number) {
  return host + (port === 80 ? "" : `:${port}`)
}
