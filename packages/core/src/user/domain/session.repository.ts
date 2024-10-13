import { SessionEntity, SessionEntitySchema } from "./session.entity";
import { BaseRepository } from "@task-bot/core/shared/domain/base-repository";
import { createContext } from "@task-bot/core/shared/contex";

export interface SessionRepository extends BaseRepository<SessionEntity> {
  findOne(
    props: Pick<SessionEntitySchema, "id" | "userId">,
  ): Promise<SessionEntity>;
}

export const SessionRepository = createContext<SessionRepository>();
