import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { TaskMapper } from "@task-bot/core/task/infrastructure/task.mapper";
import { useTaskRepository } from "@task-bot/core/task/domain/task.repository";
import { Response } from "#lib/types";
import { TaskResponseSchema } from "@task-bot/shared/task.types";
import { createApi } from "#lib/create-api";

export const listTasks = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks",
    method: "get",
    tags: ["tasks"],
    responses: {
      200: {
        description: "List",
        content: Response(z.array(TaskResponseSchema)),
      },
    },
  }),
  async (c) =>
    createApi(c)(async () => {
      const tasks = await useTaskRepository().list();

      return c.json({ data: tasks.map((task) => TaskMapper.toResponse(task)) });
    }),
);
