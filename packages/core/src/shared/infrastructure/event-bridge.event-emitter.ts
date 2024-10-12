import { EventEmitter } from "../domain/event-emitter";
import { DomainEvent } from "../domain/domain-event";

export class EventBridgeEventEmitter implements EventEmitter {
  private domainEvents: DomainEvent<Object, Object>[] = [];

  add(event: DomainEvent<Object, Object>): void {
    this.domainEvents.push(event);
  }

  async emit() {
    for (const event of this.domainEvents) {
      console.log(event);
    }
  }
}

export const withEventBridgeEventEmitter = EventEmitter.with(
  new EventBridgeEventEmitter(),
);
