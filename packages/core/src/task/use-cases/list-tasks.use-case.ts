import { Observe } from "#common/domain/services/observability";
import { useTaskRepository } from "#task/domain/task.repository";

export class ListTasksUseCase {
  @Observe("use-case")
  execute() {
    return useTaskRepository().list();
  }
}
