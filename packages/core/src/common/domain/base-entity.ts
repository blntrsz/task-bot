import { DomainEvent } from "./domain-event";

export class BaseEntity {
  domainEvents: DomainEvent[];

  constructor() {
    this.domainEvents = [];
  }

  protected addEvent(e: DomainEvent) {
    this.domainEvents.push(e);
  }

  consumeEvents() {
    const copy = [...this.domainEvents];
    this.domainEvents = [];

    return copy;
  }
}
