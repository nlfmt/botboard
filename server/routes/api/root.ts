import express, { Router } from "express"
import loggingRouter from "./logging/logging.router"

const apiRouter: Router = express.Router()

/**
 * All API subrouters
 */
apiRouter.use(
  loggingRouter,
)

export default apiRouter