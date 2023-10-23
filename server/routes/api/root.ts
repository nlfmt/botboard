import express, { Router } from "express"
import loggingRouter from "./logging/logging.router"
import loginRouter from "./login/login.router"

const apiRouter: Router = express.Router()

/**
 * All API subrouters
 */
apiRouter.use("/log", loggingRouter.router)
apiRouter.use("/login", loginRouter.router)
apiRouter.use("*", (_, res) => res.status(400).send("Invalid API route"))


export default apiRouter