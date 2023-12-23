import { createRouter } from "@/shared/util/route-builder"
import { logCreateModel } from "./logging.types"

const loggingRouter = createRouter()

loggingRouter
  .path("")
  .body(logCreateModel)
  .use(async ({ req }) => {
    return { somedata: req.url }
  })
  .use(async (ctx) => {
    console.log("got data:", ctx.somedata)
  })
  .post(({ ctx }) => {
    ctx.res.status(200).send("noice dddd1234 " + ctx.somedata)
  })

loggingRouter
  .path("")
  .body(logCreateModel)
  .post(({ctx}) => {
    console.log({ ctx })
    ctx.res.status(200).send("noice")
  })

export default loggingRouter
