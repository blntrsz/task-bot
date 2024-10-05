import { TaskEntity, taskSchema } from "#task/domain/task.entity";
import { z } from "zod";
import { TaskModel } from "./task.model";
import { baseEntitySchema } from "#common/domain/base-entity";

export const taskResponseSchema = z.object({
  id: baseEntitySchema.shape.id,
  type: z.literal("tasks"),
  attributes: z.object({
    name: taskSchema.shape.name,
    status: taskSchema.shape.status,
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

export namespace TaskMapper {
  export function toPersistence(task: TaskEntity): TaskModel {
    const props = task.getProps();
    return {
      id: props.id,
      name: props.name,
      status: props.status,
      updated_at: props.updatedAt.toISOString(),
      created_at: props.createdAt.toISOString(),
    };
  }

  export function fromPersistence(task: TaskModel): TaskEntity {
    return new TaskEntity({
      id: task.id,
      name: task.name,
      status: task.status,
      updatedAt: new Date(task.updated_at),
      createdAt: new Date(task.created_at),
    });
  }

  export function toResponse(
    task: TaskEntity,
  ): z.infer<typeof taskResponseSchema> {
    const props = task.getProps();
    return {
      id: props.id,
      type: "tasks",
      attributes: {
        name: props.name,
        status: props.status,
        created_at: props.createdAt.toISOString(),
        updated_at: props.updatedAt.toISOString(),
      },
    };
  }
}
