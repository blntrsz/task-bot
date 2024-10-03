import { z } from "zod";
import { randomUUID } from "node:crypto";
import { BaseEntity } from "#domain/common/base-entity";
import { ValidationException } from "#domain/exceptions/exception";

export const taskSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(6),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TaskSchema = z.infer<typeof taskSchema>;

export class TaskEntity extends BaseEntity {
  data: TaskSchema;

  constructor(data: TaskSchema) {
    super();
    this.data = data;
  }

  validate() {
    const parsedTask = taskSchema.safeParse(this.data);

    if (!parsedTask.success) throw new ValidationException(parsedTask.error);
  }

  static create(data: Pick<TaskSchema, "name">) {
    const task = new TaskEntity({
      id: randomUUID(),
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    task.validate();

    return task;
  }
}
