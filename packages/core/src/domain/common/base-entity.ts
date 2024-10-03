import { DomainEvent } from "./domain-event";

export class BaseEntity {
  domainEvents: DomainEvent[];

  constructor() {
    this.domainEvents = [];
  }

  protected addEvent(e: DomainEvent) {
    this.domainEvents.push(e);
  }

  async consumeEvents(consumer: (event: DomainEvent) => Promise<void>) {
    await Promise.all(
      this.domainEvents.map((e) => {
        return consumer(e);
      }),
    );
    this.domainEvents = [];
  }
}
