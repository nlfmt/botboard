import { createRouter } from "../../../shared/util/express";
import { logCreateModel } from "./logging.types";

const loggingRouter = createRouter()

loggingRouter
  .body(logCreateModel)
  .query(logCreateModel)
  .use(({ req }) => {
    return { somedata: req.url }
  })
  .use((data) => {
    console.log("got data:", data.data.somedata)
  })
  .post("/log", ({ res, data }) => {
    
    console.log({data})
    res.status(200).send("noice")
  })

loggingRouter // TODO: force first fn to be .path("/test")
  .body(logCreateModel) // TODO: BodyTypes.File ?
  .query(logCreateModel)
  .use(({ req }) => {
    return { somedata: req.url }
  })
  .use((data) => {
    console.log("got data:", data.data.somedata)
  })
  .post("/log", ({ res, data }) => {
    
    console.log({data})
    res.status(200).send("noice")
  })

export default loggingRouter.router