import { z } from "zod";
import { Entity } from "../../common/entity";
import { ValidationError } from "../../common/domain-error";
import { randomUUID } from "node:crypto";

export const taskSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(6),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TaskSchema = z.infer<typeof taskSchema>;

export class Task extends Entity {
  data: TaskSchema;

  constructor(data: TaskSchema) {
    super();
    this.data = data;
  }

  validate() {
    const parsedTask = taskSchema.safeParse(this.data);

    if (!parsedTask.success) return new ValidationError(parsedTask.error);
  }

  static create(data: Pick<TaskSchema, "name">) {
    const task = new Task({
      id: randomUUID(),
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const err = task.validate();
    if (err) return [err, undefined] as const;

    return [undefined, task] as const;
  }
}
