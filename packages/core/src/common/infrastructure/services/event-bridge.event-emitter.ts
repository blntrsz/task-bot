import { DomainEvent } from "#common/domain/domain-event";
import {
  EventEmitter,
  EventEmitterContext,
} from "#common/domain/services/event-emitter";

class EventBridgeEventEmitter implements EventEmitter {
  async emit(events: DomainEvent[]) {
    console.log(events);
  }
}

export const withEventBridgeEventEmitter = EventEmitterContext.with(
  new EventBridgeEventEmitter(),
);
