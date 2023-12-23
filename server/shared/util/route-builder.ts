import { Request, Response, Router } from "express"
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

  type test = undefined extends (undefined | { app: number }) ? true : false
  type c = VoidToNull<{ key2: string } | undefined>
  type e = void extends undefined ? true : false
  type abc = Combine<null, VoidToNull<{ key2: string } | undefined>>

/** Combines two objects while ignoring null values */
type Combine<
  T extends object | null,
  U extends object | null | undefined
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
type UrlParamSchema<Path extends string> = { [K in ExtractUrlParamNames<Path>]: z.ZodSchema<string> }
/** Replaces `void` with `null` */
type VoidToNull<T> = T extends void ? null : T

type RouteSchema = {
  path: string
  body: z.ZodSchema
  query: z.ZodSchema
  cookies: z.ZodSchema
  params: z.ZodSchema
  data: object | null
}

export type ErrorFunction = (error: Error) => void

/**
 * Route Handler function
 */
export type RouteHandler<Schema extends RouteSchema> = (v: {
  body: z.infer<Schema["body"]>
  query: z.infer<Schema["query"]>
  cookies: z.infer<Schema["cookies"]>
  params: ExtractUrlParamNames<Schema["path"]> extends never
    ? null
    : Schema["params"] extends z.ZodSchema<null>
      ? { [K in ExtractUrlParamNames<Schema["path"]>]: string }
      : z.infer<Schema["params"]>
  data: Schema["data"]
  req: Request
  res: Response
  error: ErrorFunction
}) => void

/** A Middleware function */
type Middleware<Data extends object | null = null, NewData extends object | null | void = object> = (args: {req: Request, res: Response, data: Data }) => NewData

type ConstrainedSchema<Keys, Schema> = {
  [K in keyof Schema]: K extends Keys ? Schema[K] : never;
};

/**
 * Route Builder class that allows for easy creation of routes
 */
export class RouteBuilder<
  Path extends string,
  TBody extends z.ZodSchema = z.ZodSchema<null>,
  TQuery extends z.ZodSchema = z.ZodSchema<null>,
  TCookies extends z.ZodSchema = z.ZodSchema<null>,
  TParams extends z.ZodSchema = z.ZodSchema<null>,
  TData extends object | null = null,
  Schema extends RouteSchema = { path: Path; body: TBody; query: TQuery; cookies: TCookies, params: TParams, data: TData }
> {
  public router: Router
  private bodySchema?: TBody
  private querySchema?: TQuery
  private cookieSchema?: TCookies
  private paramSchema?: TParams
  private middleware: Middleware<object | null>[] = []
  private path: Path

  constructor(router: Router, path: Path, opts?: { body?: TBody; cookies?: TCookies; query?: TQuery }) {
    this.path = path
    this.router = router || Router()
    this.bodySchema = opts?.body
    this.querySchema = opts?.query
    this.cookieSchema = opts?.cookies
  }

  // TODO rewrite this to use return next({}) like trpc
  use<NewData extends object | null | void>(middleware: Middleware<TData, NewData>) {
    this.middleware.push(middleware as unknown as Middleware<object | null>)
    return this as unknown as RouteBuilder<Path, TBody, TQuery, TCookies, TParams, Combine<TData, VoidToNull<NewData>>>
  }

  /**
   * Specify a body schema
   * @param schema
   */
  body<BodySchema extends z.ZodSchema>(schema: BodySchema) {
    this.bodySchema = schema as unknown as TBody
    return this as unknown as RouteBuilder<Path, BodySchema, TQuery, TCookies, TParams>
  }

  /**
   * Specify a query schema
   * @param schema 
   */
  query<QuerySchema extends z.ZodSchema>(schema: QuerySchema) {
    this.querySchema = schema as unknown as TQuery
    return this as unknown as RouteBuilder<Path, TBody, QuerySchema, TCookies, TParams>
  }

  /**
   * Specify a param schema
   * @param schema 
   */
  params<ParamSchema extends UrlParamSchema<Path>>(schema: ConstrainedSchema<ExtractUrlParamNames<Path>, ParamSchema>) {
    const zodSchema = z.object(schema)
    this.paramSchema = zodSchema as unknown as TParams
    return this as unknown as RouteBuilder<Path, TBody, TQuery, TCookies, typeof zodSchema>
  }

  /**
   * SPecify a cookie schema
   * @param schema 
   */
  cookies<CookiesSchema extends z.ZodSchema>(schema: CookiesSchema) {
    this.cookieSchema = schema as unknown as TCookies
    return this as unknown as RouteBuilder<Path, TBody, TQuery, CookiesSchema, TParams>
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
      TParams,
      TData
    >
  }

  private applyRoute(method: HttpMethod, handler: RouteHandler<Schema>) {
    this.router[method](this.path, (req, res) => {
      const error = (error: Error) => {
        res.status(error.code).json(error)
      }

      const data = {
        body: null,
        query: null,
        cookies: null,
        params: null,
      }

      if(this.paramSchema) {
        const params = this.paramSchema.safeParse(req.params)
        if (!params.success)
          return res
            .status(400)
            .json({ ...Error.BAD_REQUEST, cause: params.error.flatten() })
        data.params = params.data
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
      handler({
        body: data.body,
        cookies: data.cookies,
        query: data.query,
        params: data.params as unknown as z.infer<Schema["params"]>,
        req,
        res,
        data: middlewareData as TData,
        error,
      })
    })
  }

  all(handler: RouteHandler<Schema>) {
    this.applyRoute("all", handler)
  }

  get(handler: RouteHandler<Schema>) {
    this.applyRoute("get", handler)
  }

  post(handler: RouteHandler<Schema>) {
    this.applyRoute("post", handler)
  }

  put(handler: RouteHandler<Schema>) {
    this.applyRoute("put", handler)
  }

  delete(handler: RouteHandler<Schema>) {
    this.applyRoute("delete", handler)
  }

  patch(handler: RouteHandler<Schema>) {
    this.applyRoute("patch", handler)
  }

  options(handler: RouteHandler<Schema>) {
    this.applyRoute("options", handler)
  }

  head(handler: RouteHandler<Schema>) {
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
