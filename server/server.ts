import express from "express"
import path from "path"
import cors from "cors"
import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter } from "./routers/root"
import morgan from "morgan"

const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use("/api/trpc", trpcExpress.createExpressMiddleware({ router: appRouter }))
app.use("/static", express.static(path.join(__dirname, "static")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.get("*", (req, res) => {
  res.status(404).send("Not Found")
})

const PORT =
  process.env.NODE_ENV === "production" ? process.env.PORT ?? 3000 : 3001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
