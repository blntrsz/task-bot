import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import {
  TaskMapper,
  taskResponseSchema,
} from "@task-bot/core/task/infrastructure/task.mapper";
import { createApi } from "#utils/create-api";
import { useTaskRepository } from "@task-bot/core/task/domain/task.repository";

export const listTasks = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks",
    method: "get",
    responses: {
      200: {
        description: "List",
        content: {
          "application/json": {
            schema: z.object({
              data: z.array(taskResponseSchema),
            }),
          },
        },
      },
    },
  }),
  async (c) =>
    createApi(c)(async () => {
      const tasks = await useTaskRepository().list();

      return c.json({ data: tasks.map((task) => TaskMapper.toResponse(task)) });
    }),
);
