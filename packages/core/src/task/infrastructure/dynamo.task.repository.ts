import { NotFoundException } from "#common/domain/exception";
import { Observe } from "#common/domain/services/observability";
import { TaskEntity } from "#task/domain/task.entity";
import {
  TaskRepository,
  TaskRepositoryContext,
} from "#task/domain/task.repository";
import { TaskMapper } from "./task.mapper";
import { TaskModel } from "./task.model";

export class DynamoTaskRepository implements TaskRepository {
  private entities: TaskEntity[];
  constructor() {
    this.entities = [];
  }

  add(entity: TaskEntity) {
    this.entities.push(entity);
  }

  popAll(): TaskEntity[] {
    const copy = [...this.entities];
    this.entities = [];
    return copy;
  }

  @Observe("repository")
  async findOne(id: string) {
    const task = await TaskModel.get({
      id,
    }).go();

    if (!task.data) throw new NotFoundException();

    const taskEntity = TaskMapper.fromPersistence(task.data);

    this.add(taskEntity);

    return taskEntity;
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
}

export const withDynamoTaskRepository = TaskRepositoryContext.with(
  new DynamoTaskRepository(),
);
