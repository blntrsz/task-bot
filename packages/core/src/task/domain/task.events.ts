import { DomainEvent } from "#common/domain/domain-event";
import { randomUUID } from "crypto";
import { TaskEntity } from "./task.entity";

export class TaskCreatedDomainEvent extends DomainEvent {
  constructor(task: TaskEntity) {
    super(
      "TaskCreated",
      1,
      {
        ...task.data,
      },
      {
        idempotencyKey: randomUUID(),
      },
    );
  }
}
