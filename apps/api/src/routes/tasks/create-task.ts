import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { createTaskUseCase } from "@task-bot/core/task/use-cases/create-task.use-case";
import { taskSchema } from "@task-bot/core/task/domain/task.entity";
import {
  TaskMapper,
  taskResponseSchema,
} from "@task-bot/core/task/mapper/task.mapper";
import { createApi } from "../../utils/create-api";

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
            schema: taskResponseSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    return createApi(c)(async () => {
      const [error, task] = await createTaskUseCase({
        name: "",
      });
      if (error) {
        throw c.json(error, 400);
      }
      return c.json(TaskMapper.toResponse(task), 201);
    });
  },
);
