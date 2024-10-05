import { createApi } from "#utils/create-api";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import {
  TaskMapper,
  taskResponseSchema,
} from "@task-bot/core/task/infrastructure/task.mapper";
import { DeleteTaskUseCase } from "@task-bot/core/task/use-cases/delete-task.use-case";

export const createTask = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks/{id}",
    method: "delete",
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: "Create",
        content: {
          "application/json": {
            schema: z.object({
              data: taskResponseSchema.pick({ id: true, type: true }),
            }),
          },
        },
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
