import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { CreateUserSchema, UserResponseSchema } from "../../types/user.types";
import { CreateUserUseCase } from "@task-bot/core/user/use-cases/create-user.use-case";
import { Response } from "../../lib/types";
import { addSegment } from "@task-bot/core/shared/domain/observability";

export const createUser = new OpenAPIHono().openapi(
  createRoute({
    path: "/users",
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
      201: {
        description: "Create",
        content: Response(UserResponseSchema),
      },
    },
  }),
  async (c) => {
    using segment = addSegment("api", `${c.req.method} ${c.req.routePath}`);
    const {
      attributes: { email, password },
    } = c.req.valid("json");

    const user = await segment.try(() =>
      new CreateUserUseCase().execute({
        email,
        password,
      }),
    );
    return c.json(
      {
        data: UserResponseSchema.parse(user.toResponse()),
      },
      201,
    );
  },
);
