import { createRouter } from "../../../shared/util/express";
import { logCreateModel } from "./logging.types";
import { Error } from "../../../shared/util/error";
import z from "zod";
import { Router } from "express";

const loggingRouter = createRouter()


// loggingRouter.input(logCreateModel).post("/log", ({ input, error }) => {
//   console.log(input)
//   error(Error.FORBIDDEN)
// })

loggingRouter
  .body(logCreateModel)
  .query(logCreateModel)
  .use(({ req, res }) => {
    return { somedata: req.url }
  })
  .use((data) => {
    console.log("got data:", data.data.somedata)
  })
  .post("/log", ({ body, error, res, data }) => {
    
    console.log({data})
    res.status(200).send("noice")
  })

loggingRouter
  .body(logCreateModel)
  .query(logCreateModel)
  .use(({ req, res }) => {
    return { somedata: req.url }
  })
  .use((data) => {
    console.log("got data:", data.data.somedata)
  })
  .post("/log", ({ body, error, res, data, params }) => {
    
    console.log({data})
    res.status(200).send("noice")
  })

export default loggingRouter.router