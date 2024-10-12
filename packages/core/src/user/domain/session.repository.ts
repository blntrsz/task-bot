import { z } from "zod";
import { SessionEntity, SessionEntitySchema } from "./session.entity";
import { BaseRepository } from "@task-bot/core/shared/domain/base-repository";
import { objectToCamelCase } from "@task-bot/core/shared/infrastructure/util";
import { createContext } from "@task-bot/core/shared/contex";

export interface SessionRepository extends BaseRepository<SessionEntity> {
  findOne(props: Pick<SessionEntitySchema, "id">): Promise<SessionEntity>;
}

export const SessionRepository = createContext<SessionRepository>();

export const SessionRepositoryQuerySchema = z.preprocess(
  objectToCamelCase,
  SessionEntitySchema,
);
