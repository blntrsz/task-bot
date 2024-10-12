import { createContext } from "../contex";
import { DomainEvent } from "./domain-event";

export interface EventEmitter {
  add(event: DomainEvent<any, any>): void;
  emit(): Promise<void>;
}

export const EventEmitter = createContext<EventEmitter>();
