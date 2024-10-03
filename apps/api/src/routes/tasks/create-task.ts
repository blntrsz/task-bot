import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { createTaskUseCase } from "@task-bot/core/task/use-cases/create-task.use-case";
import { taskSchema } from "@task-bot/core/task/domain/task.entity";
import {
  TaskMapper,
  taskResponseSchema,
} from "@task-bot/core/task/mapper/task.mapper";
import { createApi } from "../../utils/create-api";
import { DomainError } from "@task-bot/core/common/domain-error";

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
        if (error instanceof DomainError) {
          return c.json(error.message, 400);
        }

        throw error;
      }
    });
  },
);
