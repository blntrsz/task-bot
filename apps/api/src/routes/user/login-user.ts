import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { CreateUserSchema, UserResponseSchema } from "../../types/user.types";
import { addApiSegment } from "../../lib/create-api";
import { LoginUserUseCase } from "@task-bot/core/user/use-cases/login-user.use-case";
import { setCookie } from "hono/cookie";

export const loginUser = new OpenAPIHono().openapi(
  createRoute({
    path: "/login",
    method: "post",
    tags: ["users"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Login user",
        content: {
          "application/json": {
            schema: z.object({ data: UserResponseSchema }),
          },
        },
      },
    },
  }),
  async (c) => {
    using segment = addApiSegment(c);

    const result = await segment.try(async () => {
      const { attributes } = c.req.valid("json");

      const { session, user } = await new LoginUserUseCase().execute(
        attributes,
      );

      setCookie(c, "_session", session.props.id);
      return c.json(
        {
          data: UserResponseSchema.parse(user.toResponse()),
        },
        200,
      );
    });

    return result;
  },
);
