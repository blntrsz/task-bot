import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { addApiSegment } from "../../lib/create-api";
import { deleteCookie } from "hono/cookie";
import { LogoutUserUseCase } from "@task-bot/core/user/use-cases/logout-user.use-case";

export const logoutUser = new OpenAPIHono().openapi(
  createRoute({
    path: "/logout",
    method: "post",
    tags: ["users"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              sessionId: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      204: {
        description: "Logout user",
      },
    },
  }),
  async (c) => {
    using segment = addApiSegment(c);

    const result = await segment.try(async () => {
      const { sessionId } = c.req.valid("json");

      await new LogoutUserUseCase().execute({
        id: sessionId,
      });

      deleteCookie(c, "_session");
      return c.json("", 204);
    });

    return result;
  },
);
