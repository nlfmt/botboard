import { ApiError } from "../util/error";
import { middleware } from "../util/route-builder";
import { verifyToken } from "../util/tokens";

export const AuthorizedAppGuard = middleware(async (ctx) => {
  const authorization = ctx.req.headers.authorization;
  if (!authorization)
    throw new ApiError({ code: 401, name: "Unauthorized", message: "No authorization header"  });
  const [type, token] = authorization.split(" ");
  if (type !== "Bearer")
    throw new ApiError({ code: 401, name: "Unauthorized", message: "Invalid authorization type" });
  const tokenData = verifyToken(token);
  if (!tokenData.success)
    throw new ApiError({ code: 401, name: "Unauthorized", message: "Invalid token" });
  return {
      app: tokenData.data,
  }
})