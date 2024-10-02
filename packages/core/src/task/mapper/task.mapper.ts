import { z } from "zod";
import { Task } from "../domain/task.entity";
import { TaskEntity } from "../infrastructure/dynamo.task.repository";

export const taskResponseSchema = z.object({
  id: z.string(),
  type: z.literal("tasks"),
  attributes: z.object({
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

export namespace TaskMapper {
  export function toPersistence({ data }: Task): TaskEntity {
    return {
      id: data.id,
      name: data.name,
      updated_at: data.updatedAt.toISOString(),
      created_at: data.createdAt.toISOString(),
    };
  }

  export function fromPersistence(task: TaskEntity): Task {
    return new Task({
      id: task.id,
      name: task.name,
      updatedAt: new Date(task.updated_at),
      createdAt: new Date(task.created_at),
    });
  }

  export function toResponse({
    data,
  }: Task): z.infer<typeof taskResponseSchema> {
    return {
      id: data.id,
      type: "tasks",
      attributes: {
        name: data.name,
        created_at: data.createdAt.toISOString(),
        updated_at: data.updatedAt.toISOString(),
      },
    };
  }
}
