import { createApi } from "#utils/create-api";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { taskSchema } from "@task-bot/core/task/domain/task.entity";
import {
  TaskMapper,
  taskResponseSchema,
} from "@task-bot/core/task/infrastructure/task.mapper";
import { CreateTaskUseCase } from "@task-bot/core/task/use-cases/create-task.use-case";

export const createTask = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks",
    method: "post",
    request: {
      body: {
        content: {
          "application/json": {
            schema: taskSchema.pick({ name: true }),
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
              data: taskResponseSchema,
            }),
          },
        },
      },
      400: {
        description: "",
      },
    },
  }),
  async (c) => {
    return createApi(c)(async () => {
      const { name } = c.req.valid("json");

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
