import { Router, Request, Response } from "express"
import z from "zod"
import { Error } from "./error"

export type RouteSchema = {
  body: z.ZodSchema
  query: z.ZodSchema
  cookies: z.ZodSchema
}

export type ErrorFunction = (error: Error) => void
export type Handler<Schema extends RouteSchema, Data extends object | null = null, UrlParams extends string = ""> = (v: {
  body: z.infer<Schema["body"]>
  query: z.infer<Schema["query"]>
  cookies: z.infer<Schema["cookies"]>
  params: { [k in UrlParams]: string }
  req: Request
  res: Response
  data: Data
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

type Combine<
  T extends object | null,
  U extends object | null
> = T extends object
  ? U extends object
    ? T & U
    : T
  : U extends object
  ? U
  : null
type ExtractUrlParams<T extends string> =
  T extends `${infer _}:${infer Param}/${infer Rest}`
    ? Param | ExtractUrlParams<Rest>
    : T extends `${infer _}:${infer Param}`
    ? Param
    : never
type VoidToNull<T> = T extends void ? null : T
type Middleware<Data extends object | null = object, NewData extends object | void = object> = (args: {req: Request, res: Response, data: Data }) => NewData
export class RouteBuilder<
  B extends z.ZodSchema = z.ZodSchema<null>,
  Q extends z.ZodSchema = z.ZodSchema<null>,
  C extends z.ZodSchema = z.ZodSchema<null>,
  M extends object | null = null,
  Schema extends RouteSchema = { body: B; query: Q; cookies: C }
> {
  public router!: Router
  private bodySchema?: B
  private querySchema?: Q
  private cookieSchema?: C
  private middleware: Middleware<object | null>[] = []

  constructor(router: Router, opts?: { body?: B; cookies?: C; query?: Q }) {
    this.router = router || Router()
    this.bodySchema = opts?.body
    this.querySchema = opts?.query
    this.cookieSchema = opts?.cookies
  }

  use<NewData extends object | void>(middleware: Middleware<M, NewData>) {
    this.middleware.push(middleware as unknown as Middleware<object | null>)
    return this as unknown as RouteBuilder<B, Q, C, Combine<M, VoidToNull<NewData>>>
  }

  body<BodySchema extends z.ZodSchema>(schema: BodySchema) {
    this.bodySchema = schema as unknown as B
    return this as unknown as RouteBuilder<BodySchema, Q, C>
  }

  query<QuerySchema extends z.ZodSchema>(schema: QuerySchema) {
    this.querySchema = schema as unknown as Q
    return this as unknown as RouteBuilder<B, QuerySchema, C>
  }

  cookies<CookiesSchema extends z.ZodSchema>(schema: CookiesSchema) {
    this.cookieSchema = schema as unknown as C
    return this as unknown as RouteBuilder<B, Q, CookiesSchema>
  }
  input<
    BodySchema extends z.ZodSchema = z.ZodSchema<null>,
    QuerySchema extends z.ZodSchema = z.ZodSchema<null>,
    CookiesSchema extends z.ZodSchema = z.ZodSchema<null>
  >(schema: {
    body?: BodySchema
    query?: QuerySchema
    cookies?: CookiesSchema
  }) {
    this.bodySchema = schema.body as unknown as B
    this.querySchema = schema.query as unknown as Q
    this.cookieSchema = schema.cookies as unknown as C
    return this as unknown as RouteBuilder<
      BodySchema,
      QuerySchema,
      CookiesSchema,
      M
    >
  }

  private applyRoute<Path extends string>(method: Methods, path: Path, handler: Handler<Schema, M, ExtractUrlParams<Path>>) {
    this.router[method](path, (req, res) => {
      const error = (error: Error) => {
        res.status(error.code).json(error)
      }

      const data = {
        body: null,
        query: null,
        cookies: null,
      }

      if (this.bodySchema) {
        const body = this.bodySchema.safeParse(req.body)
        if (!body.success)
          return res
            .status(400)
            .json({ ...Error.BAD_REQUEST, cause: body.error.flatten() })
        data.body = body.data
      }

      if (this.querySchema) {
        console.log(req)
        const queryParams = this.querySchema.safeParse(req.query)
        if (!queryParams.success)
          return res
            .status(400)
            .json({ ...Error.BAD_REQUEST, cause: queryParams.error.flatten() })
        data.query = queryParams.data
      }

      if (this.cookieSchema) {
        const cookies = this.cookieSchema.safeParse(req.cookies)
        if (!cookies.success)
          return res
            .status(400)
            .json({ ...Error.BAD_REQUEST, cause: cookies.error.flatten() })
        data.cookies = cookies.data
      }

      let middlewareData: null | object = null
      
      this.middleware.forEach((middleware) => {
        const newData = middleware({ req, res, data: middlewareData })
        if (typeof newData === "object") {
          middlewareData = { ...middlewareData, ...newData }
        }
      })

      handler({ ...data, req, res, data: middlewareData as M, error, params: req.params as unknown as ({ [k in ExtractUrlParams<Path>]: string }) })
    })
  }

  all<Path extends string>(path: Path, handler: Handler<Schema, M, ExtractUrlParams<Path>>) {
    this.applyRoute("all", path, handler)
  }

  get<Path extends string>(path: Path, handler: Handler<Schema, M, ExtractUrlParams<Path>>) {
    this.applyRoute("get", path, handler)
  }

  post<Path extends string>(path: Path, handler: Handler<Schema, M, ExtractUrlParams<Path>>) {
    this.applyRoute("post", path, handler)
  }

  put<Path extends string>(path: Path, handler: Handler<Schema, M, ExtractUrlParams<Path>>) {
    this.applyRoute("put", path, handler)
  }

  delete<Path extends string>(path: Path, handler: Handler<Schema, M, ExtractUrlParams<Path>>) {
    this.applyRoute("delete", path, handler)
  }

  patch<Path extends string>(path: Path, handler: Handler<Schema, M, ExtractUrlParams<Path>>) {
    this.applyRoute("patch", path, handler)
  }

  options<Path extends string>(path: Path, handler: Handler<Schema, M, ExtractUrlParams<Path>>) {
    this.applyRoute("options", path, handler)
  }

  head<Path extends string>(path: Path, handler: Handler<Schema, M, ExtractUrlParams<Path>>) {
    this.applyRoute("head", path, handler)
  }
}

export function createRouter(): RouteBuilder {
  return new RouteBuilder(Router())
}
