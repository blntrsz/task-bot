import { TaskEntity } from "#task/domain/task.entity";
import { z } from "zod";
import { TaskModel } from "./task.model";

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
  export function toPersistence({ data }: TaskEntity): TaskModel {
    return {
      id: data.id,
      name: data.name,
      updated_at: data.updatedAt.toISOString(),
      created_at: data.createdAt.toISOString(),
    };
  }

  export function fromPersistence(task: TaskModel): TaskEntity {
    return new TaskEntity({
      id: task.id,
      name: task.name,
      updatedAt: new Date(task.updated_at),
      createdAt: new Date(task.created_at),
    });
  }

  export function toResponse({
    data,
  }: TaskEntity): z.infer<typeof taskResponseSchema> {
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
