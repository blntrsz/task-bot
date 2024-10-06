import { createApi } from "#lib/create-api";
import { Response } from "#lib/types";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { TaskMapper } from "@task-bot/core/task/infrastructure/task.mapper";
import { DeleteTaskUseCase } from "@task-bot/core/task/use-cases/delete-task.use-case";
import { TaskResponseSchema } from "@task-bot/shared/task.types";

export const deleteTask = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks/{id}",
    method: "delete",
    tags: ["tasks"],
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: "Delete",
        content: Response(TaskResponseSchema.pick({ id: true, type: true })),
      },
    },
  }),
  async (c) => {
    return createApi(c)(async () => {
      const { id } = c.req.valid("param");

      const task = await new DeleteTaskUseCase().execute({
        id,
      });
      const response = TaskMapper.toResponse(task);
      return c.json(
        {
          data: {
            id: response.id,
            type: response.type,
          },
        },
        200,
      );
    });
  },
);
