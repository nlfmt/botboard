import { createRouter } from "../../../shared/util/route-builder";
import { logCreateModel } from "./logging.types";

const loggingRouter = createRouter()

loggingRouter
  .path("/log")
  .body(logCreateModel)
  .use(({ req }) => {
    return { somedata: req.url }
  })
  .use(({data}) => {
    console.log("got data:", data.somedata)
  })
  .post(({ res, data }) => {
    
    console.log({data})
    res.status(200).send("noice")
  })

loggingRouter
  .path("/log")
  .body(logCreateModel) // TODO: BodyType.File ?
  .post(({ res, data }) => {
    
    console.log({data})
    res.status(200).send("noice")
  })

export default loggingRouter.router