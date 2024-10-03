import { withDynamoTaskRepository } from "@task-bot/core/infrastructure/repositories/dynamo.task.repository";
import { withEventBridgeEventEmitter } from "@task-bot/core/infrastructure/services/event-bridge.event-emitter";
import { withObservability } from "@task-bot/core/infrastructure/services/aws.observability";

export const dependencies = [
  // setup
  withObservability,
  withEventBridgeEventEmitter,

  // repositories
  withDynamoTaskRepository,
];

export function inject(d: Function[], fn: Function) {
  if (d.length > 1) {
    const [firstDependency, ...otherDependencies] = d;

    return firstDependency(() => inject(otherDependencies, fn));
  }

  const [firstDependency] = d;
  return firstDependency(() => fn());
}
