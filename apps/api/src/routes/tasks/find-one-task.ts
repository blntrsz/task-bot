import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { createApi } from "../../utils/create-api";
import { taskSchema } from "@task-bot/core/domain/entities/task.entity";
import {
  TaskMapper,
  taskResponseSchema,
} from "@task-bot/core/infrastructure/mapper/task.mapper";
import { findOneTaskUseCase } from "@task-bot/core/use-cases/task/find-one-task.use-case";

export const findOneTask = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks/{id}",
    method: "get",
    request: {
      params: taskSchema.pick({ id: true }),
    },
    responses: {
      200: {
        description: "Find One",
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
      const { id } = c.req.valid("param");
      const task = await findOneTaskUseCase({ id });

      return c.json(TaskMapper.toResponse(task), 200);
    });
  },
);
