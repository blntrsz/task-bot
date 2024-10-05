import { createApi } from "#utils/create-api";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createPasswordSchema } from "@task-bot/core/user/domain/password.value-object";
import { userSchema } from "@task-bot/core/user/domain/user.entity";
import {
  UserMapper,
  userResponseSchema,
} from "@task-bot/core/user/infrastructure/user.mapper";
import { CreateUserUseCase } from "@task-bot/core/user/use-cases/create-user.use-case";

export const createUser = new OpenAPIHono().openapi(
  createRoute({
    path: "/users",
    method: "post",
    request: {
      body: {
        content: {
          "application/json": {
            schema: userSchema
              .pick({ email: true })
              .merge(createPasswordSchema.pick({ password: true })),
          },
        },
      },
    },
    responses: {
      201: {
        description: "Create",
        content: {
          "application/json": {
            schema: z.object({
              data: userResponseSchema,
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    return createApi(c)(async () => {
      const { email, password } = c.req.valid("json");

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
