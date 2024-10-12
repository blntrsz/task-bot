import { z } from "@hono/zod-openapi";
import { BaseEntitySchema, BaseResponse } from "./base.types";

export enum TaskStatus {
  TO_DO = "to_do",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export type TaskSchema = z.infer<typeof TaskSchema>;
export const TaskSchema = BaseEntitySchema.merge(
  z.object({
    title: z.string().min(6).openapi({
      description: "The title of the Task.",
    }),
    description: z.string().min(6).openapi({
      description: "The title of the Task.",
    }),
    status: z.nativeEnum(TaskStatus).openapi({
      description: "The status of the Task.",
    }),
  }),
);

export type TaskResponseSchema = z.infer<typeof TaskResponseSchema>;
export const TaskResponseSchema = BaseResponse(
  "tasks",
  TaskSchema.pick({
    title: true,
    description: true,
    status: true,
  }),
).openapi({
  example: {
    id: "84cfd7dc-2004-414e-93dd-4ae8625160d1",
    type: "tasks",
    attributes: {
      status: TaskStatus.TO_DO,
      title: "My Task",
      description: "My description",
      created_at: "2024-10-06T10:40:26.105Z",
      updated_at: "2024-10-06T10:40:26.105Z",
    },
  },
});

export type CreateTaskSchema = z.infer<typeof CreateTaskSchema>;
export const CreateTaskSchema = TaskResponseSchema.pick({
  type: true,
}).extend({
  attributes: TaskResponseSchema.shape.attributes.pick({
    title: true,
  }),
});

export type UpdateTaskSchema = z.infer<typeof UpdateTaskSchema>;
export const UpdateTaskSchema = TaskResponseSchema.pick({
  id: true,
  type: true,
}).extend({
  attributes: TaskResponseSchema.shape.attributes
    .pick({
      title: true,
      description: true,
      status: true,
    })
    .partial(),
});
