import { createRouter } from "@/shared/util/route-builder";
import { GetTokenModel } from "./application.types";
import prisma from "@/shared/prisma";
import { z } from "zod";
import { createToken, verifyToken } from "@/shared/util/tokens";
import env from "@/env";
import { TokenData } from "@/shared/models/token.model";
import { applicationAuthCheck } from "@/shared/middleware/auth.middleware";

const applicationRouter = createRouter();

applicationRouter
  .path("/:id/token")
  .params({ id: z.string().nonempty() })
  .body(GetTokenModel)
  .post(async ({ ctx: { res }, body, params }) => {
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
  .path("/me")
  .use(applicationAuthCheck)
  .get(async ({ ctx }) => {
    ctx.app
  })

export default applicationRouter;