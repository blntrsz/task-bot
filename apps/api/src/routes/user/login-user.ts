import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { CreateUserSchema, UserResponseSchema } from "../../types/user.types";
import { Response } from "../../lib/types";
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
      201: {
        description: "Login user",
        content: Response(UserResponseSchema),
      },
    },
  }),
  async (c) => {
    using segment = addApiSegment(c);

    const result = await segment.try(async () => {
      const {
        attributes: { email, password },
      } = c.req.valid("json");

      const { session, user } = await new LoginUserUseCase().execute({
        email,
        password,
      });
      setCookie(c, "_session", session.props.id);
      return c.json(
        {
          data: UserResponseSchema.parse(user.toResponse()),
        },
        201,
      );
    });

    return result;
  },
);
