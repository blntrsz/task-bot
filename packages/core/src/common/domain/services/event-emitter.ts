import { createContext } from "#common/context";
import { DomainEvent } from "./domain-event";

export interface EventEmitter {
  emit(event: DomainEvent[]): Promise<void>;
}

export const EventEmitterContext = createContext<EventEmitter>();
export const useEventEmitter = EventEmitterContext.use;
