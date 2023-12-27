import cookieParser from "cookie-parser"
import { readFileSync } from "fs"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import https from "https"
import cors from "cors"

import { relativePath } from "@/shared/util/helpers"
import { csp } from "@/shared/util/csp"
import env from "@/env"

import trpcRouter from "@/routes/trpc/root"
import apiRouter from "@/routes/api/root"


const cert = "../certs/cert.pem"
const key = "../certs/key.pem"

const app = express()

app.use(
  cors({ credentials: true }),
  helmet(),
  morgan("common"),
  express.json(),
  cookieParser(),
  express.urlencoded({ extended: true }),
)

app.use("/static", express.static(relativePath(import.meta, "static")))
app.use("/static/manifest.json", express.static(relativePath(import.meta, "manifest.json")))
app.use("/static/registerSW.js", express.static(relativePath(import.meta, "registerSW.js")))

app.use("/api/trpc", trpcRouter)
app.use("/api", apiRouter)

app.get("*", csp, (req, res) => {
  if (import.meta.env.PROD) {
    res.sendFile(relativePath(import.meta, "index.html"))
  } else {
    res.redirect("http://localhost:3000")
  }
})


if (import.meta.env.PROD) {
  try {
    const server = https.createServer(
      {
        cert: readFileSync(relativePath(import.meta, cert)),
        key: readFileSync(relativePath(import.meta, key)),
      },
      app
    )

    server.listen(env.PORT, () => {
      console.log(`\n\x1b[1;94mBotBoard Backend running on port ${env.PORT}\x1b[0m\n`)
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