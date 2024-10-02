import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { taskSchema } from "@task-bot/core/task/domain/task.entity";
import { findOneTaskUseCase } from "@task-bot/core/task/use-cases/find-one-task.use-case";
import {
  TaskMapper,
  taskResponseSchema,
} from "@task-bot/core/task/mapper/task.mapper";
import { createApi } from "../../utils/create-api";

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
      const [error, task] = await findOneTaskUseCase({ id });

      if (error) {
        throw c.json(error, 400);
      }

      return c.json(TaskMapper.toResponse(task), 200);
    });
  },
);
