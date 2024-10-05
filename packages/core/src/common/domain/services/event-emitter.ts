import { createContext } from "#common/context";
import { ZodTypeAny } from "zod";
import { BaseEntity } from "../base-entity";

export interface EventEmitter {
  emit(entities: readonly BaseEntity<ZodTypeAny>[]): Promise<void>;
}

export const EventEmitterContext = createContext<EventEmitter>();
export const useEventEmitter = EventEmitterContext.use;
