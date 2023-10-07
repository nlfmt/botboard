import { Router, Request, Response } from "express"
import z from "zod"
import { Error } from "./error"

export type ErrorFunction = (error: Error) => void
export type Handler<Schema extends z.ZodSchema> = (v: {
  input: z.infer<Schema>
  req: Request
  res: Response
  error: ErrorFunction
}) => void

type Methods =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head"


export class TypedRouter<Schema extends z.ZodSchema> {
  private router!: Router
  private schema!: Schema

  constructor(router: Router, schema: Schema) {
    this.router = router || Router()
    this.schema = schema
  }

  private applyRoute(method: Methods, path: string, handler: Handler<Schema>) {
    this.router[method](path, (req, res) => {
      const error = (error: Error) => {
        res.status(error.code).json(error)
      }

      const data = this.schema.safeParse(req.body)
      if (!data.success) return res.status(400).json({ ...Error.BAD_REQUEST, cause: data.error.flatten()})

      handler({ input: data.data, req, res, error })
    })
  }

  all(path: string, handler: Handler<Schema>) {
    this.applyRoute("all", path, handler)
  }

  get(path: string, handler: Handler<Schema>) {
    this.applyRoute("get", path, handler)
  }

  post(path: string, handler: Handler<Schema>) {
    this.applyRoute("post", path, handler)
  }

  put(path: string, handler: Handler<Schema>) {
    this.applyRoute("put", path, handler)
  }

  delete(path: string, handler: Handler<Schema>) {
    this.applyRoute("delete", path, handler)
  }

  patch(path: string, handler: Handler<Schema>) {
    this.applyRoute("patch", path, handler)
  }

  options(path: string, handler: Handler<Schema>) {
    this.applyRoute("options", path, handler)
  }

  head(path: string, handler: Handler<Schema>) {
    this.applyRoute("head", path, handler)
  }
}

type InputFunction = <Schema extends z.ZodSchema>(input: Schema) => TypedRouter<Schema>
export interface AdvancedRouter extends Router {
  input: InputFunction
}

export function createRouter(): AdvancedRouter {
  const router = Router()
  const input: InputFunction = (schema) => new TypedRouter(router, schema)
  return Object.assign(router, { input })
}
