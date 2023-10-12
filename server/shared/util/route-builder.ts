import { Router, Request, Response } from "express"
import z from "zod"
import { Error } from "./error"

type HttpMethod =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head"

/** Combines two objects while ignoring null values */
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
/** Extract Param Names from a route string */
type ExtractUrlParamNames<T extends string> =
  T extends `${infer _}:${infer Param}/${infer Rest}`
    ? Param | ExtractUrlParamNames<Rest>
    : T extends `${infer _}:${infer Param}`
    ? Param
    : never
/** Get object of params from url string */
type ExtractUrlParams<T extends string> = { [K in ExtractUrlParamNames<T>]: string }
/** Replaces `void` with `null` */
type VoidToNull<T> = T extends void ? null : T


type RouteSchema = {
  body: z.ZodSchema
  query: z.ZodSchema
  cookies: z.ZodSchema
}

export type ErrorFunction = (error: Error) => void

/**
 * Route Handler function
 */
export type RouteHandler<Schema extends RouteSchema, Data extends object | null = null, UrlParams extends object = object > = (v: {
  body: z.infer<Schema["body"]>
  query: z.infer<Schema["query"]>
  cookies: z.infer<Schema["cookies"]>
  params: UrlParams
  req: Request
  res: Response
  data: Data
  error: ErrorFunction
}) => void

/** A Middleware function */
type Middleware<Data extends object | null = null, NewData extends object | void = object> = (args: {req: Request, res: Response, data: Data }) => NewData

/**
 * Route Builder class that allows for easy creation of routes
 */
export class RouteBuilder<
  Path extends string,
  TBody extends z.ZodSchema = z.ZodSchema<null>,
  TQuery extends z.ZodSchema = z.ZodSchema<null>,
  TCookies extends z.ZodSchema = z.ZodSchema<null>,
  TData extends object | null = null,
  Schema extends RouteSchema = { body: TBody; query: TQuery; cookies: TCookies }
> {
  public router: Router
  private bodySchema?: TBody
  private querySchema?: TQuery
  private cookieSchema?: TCookies
  private middleware: Middleware<object | null>[] = []
  private path: Path

  constructor(router: Router, path: Path, opts?: { body?: TBody; cookies?: TCookies; query?: TQuery }) {
    this.path = path
    this.router = router || Router()
    this.bodySchema = opts?.body
    this.querySchema = opts?.query
    this.cookieSchema = opts?.cookies
  }

  use<NewData extends object | void>(middleware: Middleware<TData, NewData>) {
    this.middleware.push(middleware as unknown as Middleware<object | null>)
    return this as unknown as RouteBuilder<Path, TBody, TQuery, TCookies, Combine<TData, VoidToNull<NewData>>>
  }

  /**
   * Specify a body schema
   * @param schema
   */
  body<BodySchema extends z.ZodSchema>(schema: BodySchema) {
    this.bodySchema = schema as unknown as TBody
    return this as unknown as RouteBuilder<Path, BodySchema, TQuery, TCookies>
  }

  /**
   * Specify a query schema
   * @param schema 
   */
  query<QuerySchema extends z.ZodSchema>(schema: QuerySchema) {
    this.querySchema = schema as unknown as TQuery
    return this as unknown as RouteBuilder<Path, TBody, QuerySchema, TCookies>
  }

  /**
   * SPecify a cookie schema
   * @param schema 
   */
  cookies<CookiesSchema extends z.ZodSchema>(schema: CookiesSchema) {
    this.cookieSchema = schema as unknown as TCookies
    return this as unknown as RouteBuilder<Path, TBody, TQuery, CookiesSchema>
  }

  /**
   * Specify all input schemas at once
   * @param schema 
   */
  input<
    BodySchema extends z.ZodSchema = z.ZodSchema<null>,
    QuerySchema extends z.ZodSchema = z.ZodSchema<null>,
    CookiesSchema extends z.ZodSchema = z.ZodSchema<null>
  >(schema: {
    body?: BodySchema
    query?: QuerySchema
    cookies?: CookiesSchema
  }) {
    this.bodySchema = schema.body as unknown as TBody
    this.querySchema = schema.query as unknown as TQuery
    this.cookieSchema = schema.cookies as unknown as TCookies
    return this as unknown as RouteBuilder<
      Path,
      BodySchema,
      QuerySchema,
      CookiesSchema,
      TData
    >
  }

  private applyRoute(method: HttpMethod, handler: RouteHandler<Schema, TData, ExtractUrlParams<Path>>) {
    this.router[method](this.path, (req, res) => {
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

      // TODO: Add error handling
      // TODO: Turn return type into a response object
      handler({ ...data, req, res, data: middlewareData as TData, error, params: req.params as unknown as ExtractUrlParams<Path> })
    })
  }

  all(handler: RouteHandler<Schema, TData, ExtractUrlParams<Path>>) {
    this.applyRoute("all", handler)
  }

  get(handler: RouteHandler<Schema, TData, ExtractUrlParams<Path>>) {
    this.applyRoute("get", handler)
  }

  post(handler: RouteHandler<Schema, TData, ExtractUrlParams<Path>>) {
    this.applyRoute("post", handler)
  }

  put(handler: RouteHandler<Schema, TData, ExtractUrlParams<Path>>) {
    this.applyRoute("put", handler)
  }

  delete(handler: RouteHandler<Schema, TData, ExtractUrlParams<Path>>) {
    this.applyRoute("delete", handler)
  }

  patch(handler: RouteHandler<Schema, TData, ExtractUrlParams<Path>>) {
    this.applyRoute("patch", handler)
  }

  options(handler: RouteHandler<Schema, TData, ExtractUrlParams<Path>>) {
    this.applyRoute("options", handler)
  }

  head(handler: RouteHandler<Schema, TData, ExtractUrlParams<Path>>) {
    this.applyRoute("head", handler)
  }
}


export function createRouter(): { router: Router, path<Path extends string>(path: Path): RouteBuilder<Path> } {
  const router = Router()

  return {
    router,
    path: (path) => new RouteBuilder(router, path)
  }
}
