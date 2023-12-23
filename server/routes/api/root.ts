import express, { Router } from "express"
import loggingRouter from "./logging/logging.router"
import authRouter from "./auth/auth.router"
import applicationRouter from "./application/application.router"

const apiRouter: Router = express.Router()

/**
 * All API subrouters
 */
apiRouter.use("/auth", authRouter.router)
apiRouter.use("/log", loggingRouter.router)
apiRouter.use("/application", applicationRouter.router)
apiRouter.use("*", (_, res) => res.status(400).send("Invalid API route"))


export default apiRouter