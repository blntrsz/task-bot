import { createApi } from "#utils/create-api";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { taskSchema } from "@task-bot/core/task/domain/task.entity";
import { useTaskRepository } from "@task-bot/core/task/domain/task.repository";
import {
  TaskMapper,
  taskResponseSchema,
} from "@task-bot/core/task/infrastructure/task.mapper";

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
            schema: z.object({
              data: taskResponseSchema,
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    return createApi(c)(async () => {
      const { id } = c.req.valid("param");
      const task = await useTaskRepository().findOne(id);

      return c.json(
        {
          data: TaskMapper.toResponse(task),
        },
        200,
      );
    });
  },
);
