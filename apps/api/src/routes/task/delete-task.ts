import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Response } from "../../lib/types";
import { DeleteTaskUseCase } from "@task-bot/core/task/use-case/delete-task.use-case";
import { TaskResponseSchema } from "../../types/task.types";

const ResponseSchema = TaskResponseSchema.pick({ id: true, type: true });

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
        content: Response(ResponseSchema),
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    const task = await new DeleteTaskUseCase().execute({
      id,
    });
    return c.json(
      {
        data: ResponseSchema.parse(task.toResponse()),
      },
      200,
    );
  },
);
