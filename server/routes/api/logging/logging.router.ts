import { createRouter } from "../../../shared/util/express";
import { logCreateModel } from "./logging.types";
import { Error } from "../../../shared/util/error";

const loggingRouter = createRouter()

loggingRouter.input(logCreateModel).post("/log", ({ input, error }) => {
  console.log(input)
  error(Error.FORBIDDEN)
})



export default loggingRouter