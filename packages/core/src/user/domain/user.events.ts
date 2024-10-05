import { DomainEvent } from "#common/domain/domain-event";
import { randomUUID } from "crypto";
import { UserEntity } from "./user.entity";

export class UserCreatedDomainEvent extends DomainEvent {
  constructor(user: UserEntity) {
    super({
      name: "UserCreated",
      version: 1,
      data: {
        ...user.getProps(),
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    });
  }
}

export class UserDeletedDomainEvent extends DomainEvent {
  constructor(user: UserEntity) {
    super({
      name: "UserDeleted",
      version: 1,
      data: {
        ...user.getProps(),
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    });
  }
}

export class UserLoggedInDomainEvent extends DomainEvent {
  constructor(user: UserEntity) {
    const session = user.session?.getProps();
    super({
      name: "UserLoggedIn",
      version: 1,
      data: {
        ...user.getProps(),
        session,
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    });
  }
}

export class UserLoggedOutDomainEvent extends DomainEvent {
  constructor(user: UserEntity) {
    super({
      name: "UserLoggedOut",
      version: 1,
      data: {
        ...user.getProps(),
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    });
  }
}
