import express from "express"
import path from "path"
import cors from "cors"
import morgan from "morgan"
import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter } from "./routers/root"
import { createTRPCContext } from "./util/trpc"
import { initEnv } from "./util/util"
import https from "https"
import { readFileSync } from "fs"

initEnv("../.env")

const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/api/trpc", trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext: createTRPCContext,
}))

app.use("/static", express.static(path.join(__dirname, "static")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.get("*", (req, res) => {
  res.status(404).send("Not Found")
})

const server = https.createServer({
  cert: readFileSync(path.join(__dirname, "../certs/cert.pem")),
  key: readFileSync(path.join(__dirname, "../certs/privkey.pem")),
}, app)


const PORT =
  process.env.NODE_ENV === "production" ? process.env.PORT ?? 3000 : 3001
server.listen(PORT, () => {
  console.log(`BotBoard Backend running on port ${PORT}`)
})
