import { createApi } from "#lib/create-api";
import { Response } from "#lib/types";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { TaskMapper } from "@task-bot/core/task/infrastructure/task.mapper";
import { CreateTaskUseCase } from "@task-bot/core/task/use-cases/create-task.use-case";
import {
  CreateTaskSchema,
  TaskResponseSchema,
} from "@task-bot/shared/task.types";

export const createTask = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks",
    method: "post",
    tags: ["tasks"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateTaskSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Create",
        content: Response(TaskResponseSchema),
      },
    },
  }),
  async (c) => {
    return createApi(c)(async () => {
      const {
        attributes: { name },
      } = c.req.valid("json");

      const task = await new CreateTaskUseCase().execute({
        name,
      });
      return c.json(
        {
          data: TaskMapper.toResponse(task),
        },
        201,
      );
    });
  },
);
