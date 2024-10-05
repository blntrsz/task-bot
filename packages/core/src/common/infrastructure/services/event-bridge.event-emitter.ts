import { BaseEntity } from "#common/domain/base-entity";
import { EventEmitter } from "#common/domain/services/event-emitter";
import { ZodTypeAny } from "zod";

export class EventBridgeEventEmitter implements EventEmitter {
  async emit(entities: BaseEntity<ZodTypeAny>[]) {
    const events = entities
      .map((entity) => {
        return entity.consumeEvents();
      })
      .flat();
    console.log(events);
  }
}
