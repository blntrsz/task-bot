import { EventBridgeEventEmitter } from "@task-bot/core/common/infrastructure/services/event-bridge.event-emitter";
import { EVENT_EMITTER_DI_TOKEN } from "@task-bot/core/common/domain/services/event-emitter";
import { OBSERVABILITY_DI_TOKEN } from "@task-bot/core/common/domain/services/observability";
import { AwsObservability } from "@task-bot/core/common/infrastructure/services/aws.observability";
import { DynamoTaskRepository } from "@task-bot/core/task/infrastructure/dynamo.task.repository";
import { DynamoUserRepository } from "@task-bot/core/user/infrastructure/dynamo.user.repository";
import { Container } from "@task-bot/core/common/domain/container";
import { TASK_REPOSITORY_DI_TOKEN } from "@task-bot/core/task/domain/task.repository";
import { USER_REPOSITORY_DI_TOKEN } from "@task-bot/core/user/domain/user.repository";

export function createContainer() {
  const container = new Container();

  container.addDependency(EVENT_EMITTER_DI_TOKEN, EventBridgeEventEmitter);
  container.addDependency(OBSERVABILITY_DI_TOKEN, AwsObservability);

  // repositories
  container.addDependency(TASK_REPOSITORY_DI_TOKEN, DynamoTaskRepository);
  container.addDependency(USER_REPOSITORY_DI_TOKEN, DynamoUserRepository);

  return container;
}
