import { BaseRepository } from "../domain/base-repository";
import { EventEmitter } from "../domain/event-emitter";
import { UnitOfWork } from "../domain/unit-of-work";
import { DatabaseConnection, DatabaseConnectionContext } from "./db-pool";

class PostgresUnitOfWork implements UnitOfWork<any> {
  constructor(private readonly db = DatabaseConnectionContext.use) {}
  async save(
    repositories: BaseRepository<any>[],
    eventEmitter: EventEmitter,
  ): Promise<void> {
    const conn = await this.db().get();

    return conn.transaction(async (tx) => {
      await DatabaseConnectionContext.with(new DatabaseConnection(tx))(
        async () => {
          await Promise.all(
            repositories.map((repository) => repository.save()),
          );

          await eventEmitter.emit();
        },
      );
    });
  }
}

export const withPostgresUnitOfWork = UnitOfWork.with(new PostgresUnitOfWork());
