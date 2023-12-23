import { createRouter } from "@/shared/util/route-builder";
import { GetTokenModel } from "./application.types";
import prisma from "@/shared/prisma";
import { z } from "zod";
import { createToken, verifyToken } from "@/shared/util/tokens";
import env from "@/env";

const applicationRouter = createRouter();

applicationRouter
  .path("/:id/token")
  .params({ id: z.string().nonempty() })
  .body(GetTokenModel)
  .post(async ({ res, body, params }) => {
    const application = await prisma.application.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    if (application.clientSecret !== body.clientSecret) {
      return res.status(401).json({
        error: "Invalid client secret",
      });
    }

    return res.json({
      token: createToken(
        {
          appId: application.id,
          name: application.name,
        },
        env.ACCESS_TOKEN_EXPIRES_IN
      ),
    })
  })

applicationRouter
  .path("/")
  .use(({ req }) => {
    const authorization = req.headers.authorization;
    if (!authorization) return null;
    const [type, token] = authorization.split(" ");
    if (type !== "Bearer") return null;
    const tokenData = verifyToken(token);
    if (!tokenData.success) return null;
    return {
      app: tokenData.data,
    }
  })
  .get(async ({ res, data }) => { })


const abc = () => {
    const authorization: string | undefined = "";//req.headers.authorization;
    if (!authorization) return;
    const [type, token] = authorization.split(" ");
    if (type !== "Bearer") return;
    const tokenData = verifyToken(token);
    if (!tokenData.success) return;
    return {
      app: tokenData.data,
    }
  }