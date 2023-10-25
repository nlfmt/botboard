import express, { Router } from "express"
import loggingRouter from "./logging/logging.router"
import oauthRouter from "./auth/auth.router"

const apiRouter: Router = express.Router()

/**
 * All API subrouters
 */
apiRouter.use("/auth", oauthRouter.router)
apiRouter.use("/log", loggingRouter.router)
apiRouter.use("*", (_, res) => res.status(400).send("Invalid API route"))


export default apiRouter