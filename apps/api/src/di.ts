import { withObservability } from "@task-bot/core/common/observability";
import { withDynamoTaskRepository } from "@task-bot/core/task/infrastructure/dynamo.task.repository";

export const dependencies = [
  // repositories
  withDynamoTaskRepository,

  // utils
  withObservability,
];

export function inject(d: Function[], fn: Function) {
  if (d.length > 1) {
    const [firstDependency, ...otherDependencies] = d;

    return firstDependency(() => inject(otherDependencies, fn));
  }

  const [firstDependency] = d;
  return firstDependency(() => fn());
}
