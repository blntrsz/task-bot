import { DomainEvent } from "#common/domain/domain-event";
import { randomUUID } from "crypto";
import { TaskEntity, TaskSchema } from "./task.entity";

export class TaskCreatedDomainEvent extends DomainEvent {
  constructor(task: TaskEntity) {
    super({
      name: "TaskCreated",
      version: 1,
      data: {
        ...task.getProps(),
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    });
  }
}

export class TaskStatusUpdatedDomainEvent extends DomainEvent {
  constructor(oldStatus: TaskSchema["status"], task: TaskEntity) {
    super({
      name: "TaskStatusUpdated",
      version: 1,
      data: {
        ...task.getProps(),
        oldStatus,
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    });
  }
}

export class TaskNameUpdatedDomainEvent extends DomainEvent {
  constructor(oldName: TaskSchema["name"], task: TaskEntity) {
    super({
      name: "TaskNameUpdated",
      version: 1,
      data: {
        ...task.getProps(),
        oldName,
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    });
  }
}

export class TaskDeletedDomainEvent extends DomainEvent {
  constructor(task: TaskEntity) {
    super({
      name: "TaskDeleted",
      version: 1,
      data: {
        ...task.getProps(),
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    });
  }
}
