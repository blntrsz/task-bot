import { BaseEntity } from "@task-bot/core/shared/domain/base-entity";
import { randomUUID } from "crypto";
import { z } from "zod";

export enum TaskStatus {
  TO_DO = "to_do",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export const TaskEntitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.nativeEnum(TaskStatus),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type TaskEntitySchema = z.infer<typeof TaskEntitySchema>;

export class TaskEntity extends BaseEntity<typeof TaskEntitySchema> {
  previous?: TaskEntity;

  fork(toUpdate: Partial<TaskEntitySchema>) {
    const entity = new TaskEntity(
      {
        ...structuredClone(this.props),
        ...toUpdate,
        updatedAt: new Date(),
      },
      toUpdate,
    );
    entity.previous = this;

    return entity;
  }

  static create(props: Pick<TaskEntitySchema, "title" | "description">) {
    const now = new Date();
    return new TaskEntity({
      id: randomUUID(),
      title: props.title,
      description: props.description,
      status: TaskStatus.TO_DO,
      createdAt: now,
      updatedAt: now,
    });
  }

  toResponse() {
    const props = this.props;
    return {
      id: props.id,
      type: "tasks" as const,
      attributes: {
        title: props.title,
        status: props.status,
        created_at: props.createdAt.toISOString(),
        updated_at: props.updatedAt.toISOString(),
      },
    };
  }
}
