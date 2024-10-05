import { ZodTypeAny } from "zod";
import { BaseEntity } from "../base-entity";
import { useContainer } from "../container";

export const EVENT_EMITTER_DI_TOKEN = "event-emitter-di-token";
export interface EventEmitter {
  emit(entities: readonly BaseEntity<ZodTypeAny>[]): Promise<void>;
}

export const useEventEmitter = () =>
  useContainer<EventEmitter>(EVENT_EMITTER_DI_TOKEN);
