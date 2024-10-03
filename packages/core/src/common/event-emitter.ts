import { createContext } from "./context";
import { DomainEvent } from "./domain-event";

export const EventEmitterContext = createContext();

class EventBridgeEventEmitter {
  emit(event: DomainEvent) {
    console.log(event);
  }
}

export const withEventBridgeEventEmitter = EventEmitterContext.with(
  new EventBridgeEventEmitter(),
);
