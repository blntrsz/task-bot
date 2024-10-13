import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { CreateUserSchema, UserResponseSchema } from "../../types/user.types";
import { addApiSegment } from "../../lib/create-api";
import { SignUpUserUseCase } from "@task-bot/core/user/use-cases/sign-up-user.use-case";

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
    const {
      attributes: { email, password },
    } = c.req.valid("json");

    const user = await segment.try(() =>
      new SignUpUserUseCase().execute({
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
