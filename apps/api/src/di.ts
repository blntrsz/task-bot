import { withDynamoTaskRepository } from "@task-bot/core/task/infrastructure/dynamo.task.repository";
import { withObservability } from "@task-bot/core/common/infrastructure/services/aws.observability";
import { withEventBridgeEventEmitter } from "@task-bot/core/common/infrastructure/services/event-bridge.event-emitter";

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
