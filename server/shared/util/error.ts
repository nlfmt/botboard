export type Error = { name: string; code: number; message?: string }

type Errors<T> = { [k in keyof T]: Error }
type ErrorsIn<Keys extends string> = { [K in Keys]: [number, string] }

/**
 * Creates an object of errors
 * @param errors An object of error declarations
 * @returns An object of errors
 */
function defineErrors<Keys extends string, T extends ErrorsIn<Keys>>(
  errors: T
): Errors<T> {
  const res = {} as Errors<T>

  for (const k in errors)
    res[k] = { name: k, code: errors[k][0], message: errors[k][1] }

  return res
}

/**
 * All errors that can be thrown by the server
 */
export const Error = defineErrors({
  BAD_REQUEST: [400, "Bad Request"],
  UNAUTHORIZED: [401, "You are not authorized to perform this action"],
  FORBIDDEN: [403, "You are forbidden from performing this action"],
  NOT_FOUND: [404, "Not Found"],
})
