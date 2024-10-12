import { withDatabaseConnection } from "@task-bot/core/shared/infrastructure/db-pool";
import { withEventBridgeEventEmitter } from "@task-bot/core/shared/infrastructure/event-bridge.event-emitter";
import {
  withLoggerContext,
  withMetricsContext,
  withTracerContext,
} from "@task-bot/core/shared/infrastructure/powertools.observability";
import { withPostgresTaskRepository } from "@task-bot/core/task/infrastructure/postgres.task.repository";
import { withPostgresUserRepository } from "@task-bot/core/user/infrastructure/postgres.user.repository";

export const dependencies = [
  withLoggerContext,
  withTracerContext,
  withMetricsContext,

  withDatabaseConnection,

  withPostgresUserRepository,
  withPostgresTaskRepository,

  withEventBridgeEventEmitter,
];

export function inject(d: Function[], fn: Function) {
  if (d.length > 1) {
    const [firstDependency, ...otherDependencies] = d;

    return firstDependency(() => inject(otherDependencies, fn));
  }

  const [firstDependency] = d;
  return firstDependency(() => fn());
}
