import { BaseRepository } from "#common/domain/base-repository";
import { NotFoundException } from "#common/domain/exception";
import { Observe } from "#common/domain/services/observability";
import { TaskEntity } from "#task/domain/task.entity";
import {
  TaskRepository,
  TaskRepositoryContext,
} from "#task/domain/task.repository";
import { TaskMapper } from "./task.mapper";
import { TaskModel } from "./task.model";

export class DynamoTaskRepository
  extends BaseRepository<TaskEntity>
  implements TaskRepository
{
  @Observe("repository")
  async findOne(id: string) {
    const task = await TaskModel.get({
      id,
    }).go();

    if (!task.data) throw new NotFoundException();

    return TaskMapper.fromPersistence(task.data);
  }

  @Observe("repository")
  async save() {
    await Promise.all(
      this.entities.map((entity) => {
        return TaskModel.upsert(TaskMapper.toPersistence(entity)).go();
      }),
    );
  }

  @Observe("repository")
  async list() {
    const tasks = await TaskModel.query.task({}).go();

    return tasks.data.map((task) => TaskMapper.fromPersistence(task));
  }

  @Observe("repository")
  async remove(task: TaskEntity) {
    await TaskModel.delete({
      id: task.getProps().id,
    }).go();
  }
}

export const withDynamoTaskRepository = TaskRepositoryContext.with(
  new DynamoTaskRepository(),
);
