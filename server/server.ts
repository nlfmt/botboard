import path from "path"
import cors from "cors"
import https from "https"
import morgan from "morgan"
import helmet from "helmet"
import express from "express"
import { readFileSync } from "fs"
import cookieParser from "cookie-parser"
import apiRouter from "@/routes/api/root"
import { trpcRouter } from "@/routes/trpc/root"
import { initEnv } from "@/shared/util/init-env"
import { fileURLToPath } from "url"
import { csp } from "./shared/util/csp"

const relativePath = (...paths: string[]) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), ...paths)

initEnv(relativePath(
  import.meta.env.PROD ? "../.env" : "../.env.dev"
))


const cert = "../certs/cert.pem"
const key = "../certs/key.pem"
const PORT = process.env.PORT ?? 3000

const app = express()

app.use(cors({ credentials: true }))
app.use(helmet())
app.use(morgan("common"))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))


app.use("/static", express.static(relativePath("static")))
app.use("/static/manifest.json", express.static(relativePath("manifest.json")))
app.use("/static/registerSW.js", express.static(relativePath("registerSW.js")))

app.use("/api/trpc", trpcRouter)
app.use("/api", apiRouter)

app.get("*", csp, (req, res) => {
  if (import.meta.env.PROD) {
    res.sendFile(relativePath("index.html"))
  } else {
    res.redirect("http://localhost:3000")
  }
})


if (import.meta.env.PROD) {
  try {
    const server = https.createServer(
      {
        cert: readFileSync(relativePath(cert)),
        key: readFileSync(relativePath(key)),
      },
      app
    )
    server.listen(PORT, () => {
      console.log(`\n\x1b[1;94mBotBoard Backend running on port ${PORT}\x1b[0m\n`)
    })
  } catch (err) {
    if ((err as { code: string }).code === "ENOENT") {
      console.error(
        "\x1b[1;91mERROR: Certificate or key not found.\x1b[0m\n"
      )
    }
  }
}

export const viteNodeApp: express.Express = app