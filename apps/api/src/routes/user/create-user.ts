import { createApi } from "#lib/create-api";
import { Response } from "#lib/types";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { UserMapper } from "@task-bot/core/user/infrastructure/user.mapper";
import { CreateUserUseCase } from "@task-bot/core/user/use-cases/create-user.use-case";
import {
  CreateUserSchema,
  UserResponseSchema,
} from "@task-bot/shared/user.types";

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
    return createApi(c)(async () => {
      const {
        attributes: { email, password },
      } = c.req.valid("json");

      const user = await new CreateUserUseCase().execute({
        email,
        password,
      });
      return c.json(
        {
          data: UserMapper.toResponse(user),
        },
        201,
      );
    });
  },
);
