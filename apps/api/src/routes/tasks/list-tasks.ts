import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { listTasksUseCase } from "@task-bot/core/task/use-cases/list-tasks.use-case";
import { TaskMapper } from "@task-bot/core/task/mapper/task.mapper";
import { createApi } from "../../utils/create-api";

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
