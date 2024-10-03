import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { createApi } from "../../utils/create-api";
import { listTasksUseCase } from "@task-bot/core/use-cases/task/list-tasks.use-case";
import { TaskMapper } from "@task-bot/core/infrastructure/mapper/task.mapper";

export const listTasks = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks",
    method: "get",
    responses: {
      200: {
        description: "List",
      },
    },
  }),
  async (c) => {
    return createApi(c)(async () => {
      const tasks = await listTasksUseCase({});

      return c.json(tasks.map((task) => TaskMapper.toResponse(task)));
    });
  },
);
