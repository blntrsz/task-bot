import { DomainEvent } from "#common/domain/domain-event";
import { randomUUID } from "crypto";
import { TaskEntity, TaskSchema } from "./task.entity";

export class TaskCreatedDomainEvent extends DomainEvent {
  constructor(task: TaskEntity) {
    super(
      "TaskCreated",
      1,
      {
        ...task.getProps(),
      },
      {
        idempotencyKey: randomUUID(),
      },
    );
  }
}

export class TaskStatusUpdatedDomainEvent extends DomainEvent {
  constructor(oldStatus: TaskSchema["status"], task: TaskEntity) {
    super(
      "TaskStatusUpdated",
      1,
      {
        ...task.getProps(),
        oldStatus,
      },
      {
        idempotencyKey: randomUUID(),
      },
    );
  }
}

export class TaskNameUpdatedDomainEvent extends DomainEvent {
  constructor(oldName: TaskSchema["name"], task: TaskEntity) {
    super(
      "TaskNameUpdated",
      1,
      {
        ...task.getProps(),
        oldName,
      },
      {
        idempotencyKey: randomUUID(),
      },
    );
  }
}
