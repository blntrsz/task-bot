import { createApi } from "#lib/create-api";
import { Response } from "#lib/types";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { useTaskRepository } from "@task-bot/core/task/domain/task.repository";
import { TaskMapper } from "@task-bot/core/task/infrastructure/task.mapper";
import { TaskResponseSchema, TaskSchema } from "@task-bot/shared/task.types";

export const findOneTask = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks/{id}",
    method: "get",
    tags: ["tasks"],
    request: {
      params: TaskSchema.pick({ id: true }),
    },
    responses: {
      200: {
        description: "Find One",
        content: Response(TaskResponseSchema),
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
