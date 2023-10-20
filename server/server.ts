import path from "path"
import cors from "cors"
import https from "https"
import morgan from "morgan"
import helmet from "helmet"
import express from "express"
import { readFileSync } from "fs"
import apiRouter from "./routes/api/root"
import { trpcRouter } from "./routes/trpc/root"
import { initEnv } from "./shared/util/init-env"

initEnv(path.join(__dirname, "../.env"))

const cert = "../certs/cert.pem"
const key = "../certs/key.pem"
const PORT = process.env.PORT ?? 3000

const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan("common"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/static", express.static(path.join(__dirname, "static")))

app.use("/api/trpc", trpcRouter)
app.use("/api", apiRouter)

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})


const server = https.createServer(
  {
    cert: readFileSync(path.join(__dirname, cert)),
    key: readFileSync(path.join(__dirname, key)),
  },
  app
)

const SERVER_PORT = process.env.NODE_ENV === "production" ? PORT : 3001

server.listen(SERVER_PORT, () => {
  console.log(`\n\x1b[1;94mBotBoard Backend running on port ${SERVER_PORT}\x1b[0m\n`)
})
