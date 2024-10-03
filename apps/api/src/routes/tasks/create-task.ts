import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { createApi } from "../../utils/create-api";
import { taskSchema } from "@task-bot/core/domain/entities/task.entity";
import {
  TaskMapper,
  taskResponseSchema,
} from "@task-bot/core/infrastructure/mapper/task.mapper";
import { Exception } from "@task-bot/core/domain/exceptions/exception";
import { createTaskUseCase } from "@task-bot/core/use-cases/task/create-task.use-case";

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
      400: {
        description: "",
      },
    },
  }),
  async (c) => {
    return createApi(c)(async () => {
      const { name } = c.req.valid("json");

      try {
        const task = await createTaskUseCase({
          name,
        });
        return c.json(TaskMapper.toResponse(task), 201);
      } catch (error) {
        if (error instanceof Exception) {
          return c.json(error.message, 400);
        }

        throw error;
      }
    });
  },
);
