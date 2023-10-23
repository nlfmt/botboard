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

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const relativePath = (...paths: string[]) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), ...paths)

initEnv(relativePath("../.env"))


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

app.use("/api/trpc", trpcRouter)
app.use("/api", apiRouter)

app.get("*", (req, res) => {
  res.sendFile(relativePath("index.html"))
})


const server = https.createServer(
  {
    cert: readFileSync(path.join(__dirname, cert)),
    key: readFileSync(path.join(__dirname, key)),
  },
  app
)

if (import.meta.env.PROD) {
  server.listen(PORT, () => {
    console.log(`\n\x1b[1;94mBotBoard Backend running on port ${PORT}\x1b[0m\n`)
  })
}

export const viteNodeApp: express.Express = app