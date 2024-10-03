import { DomainEvent } from "#domain/common/domain-event";
import {
  EventEmitter,
  EventEmitterContext,
} from "#domain/services/event-emitter";

class EventBridgeEventEmitter implements EventEmitter {
  async emit(event: DomainEvent) {
    console.log(event);
  }
}

export const withEventBridgeEventEmitter = EventEmitterContext.with(
  new EventBridgeEventEmitter(),
);
