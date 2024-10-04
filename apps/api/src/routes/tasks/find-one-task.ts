import { createApi } from "#utils/create-api";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { taskSchema } from "@task-bot/core/task/domain/task.entity";
import {
  TaskMapper,
  taskResponseSchema,
} from "@task-bot/core/task/infrastructure/task.mapper";
import { FindOneTaskUseCase } from "@task-bot/core/task/use-cases/find-one-task.use-case";

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
      const task = await new FindOneTaskUseCase().execute({ id });

      return c.json(TaskMapper.toResponse(task), 200);
    });
  },
);
