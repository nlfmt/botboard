import path from "path"
import { fileURLToPath } from "url"

export const relativePath = (...paths: string[]) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", ...paths)