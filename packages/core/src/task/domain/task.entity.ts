import { z } from "zod";
import { BaseEntity, baseEntitySchema } from "#common/domain/base-entity";
import {
  TaskCreatedDomainEvent,
  TaskNameUpdatedDomainEvent,
  TaskDeletedDomainEvent,
  TaskStatusUpdatedDomainEvent,
} from "./task.events";
import { randomUUID } from "crypto";

export enum TaskStatus {
  TO_DO = "to_do",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export const taskSchema = baseEntitySchema.merge(
  z.object({
    name: z.string().min(6),
    status: z.nativeEnum(TaskStatus),
  }),
);

export type TaskSchema = z.infer<typeof taskSchema>;

export class TaskEntity extends BaseEntity<typeof taskSchema> {
  schema = taskSchema;

  constructor(props: TaskSchema) {
    super({
      ...props,
      props: props,
    });
  }

  static create(data: Pick<TaskSchema, "name">) {
    const now = new Date();
    const task = new TaskEntity({
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      name: data.name,
      status: TaskStatus.TO_DO,
    });

    task.validate();
    task.addEvent(new TaskCreatedDomainEvent(task));

    return task;
  }

  setStatus(status: TaskSchema["status"]) {
    const oldStatus = this.getProps().status;
    this.props.status = status;
    this.updatedAt = new Date();
    this.validate();
    this.addEvent(new TaskStatusUpdatedDomainEvent(oldStatus, this));
  }

  setName(name: TaskSchema["name"]) {
    const oldName = this.getProps().name;
    this.props.name = name;
    this.updatedAt = new Date();
    this.validate();
    this.addEvent(new TaskNameUpdatedDomainEvent(oldName, this));
  }

  delete() {
    this.addEvent(new TaskDeletedDomainEvent(this));
  }
}
