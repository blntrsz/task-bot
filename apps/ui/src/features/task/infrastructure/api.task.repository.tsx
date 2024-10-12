import { api } from "#lib/api-client";
import { createContext, useState, ReactNode, useContext } from "react";
import { taskKeys } from "../api/task-keys";

export class ApiTaskRepository {
  async create(name: string) {
    const result = await api.tasks.$post({
      json: {
        type: taskKeys.all[0],
        attributes: {
          name: name,
        },
      },
    });

    if (!result.ok) throw result;
    const body = await result.json();

    return body;
  }

  async get(id: string) {
    const result = await api.tasks[":id"].$get({
      param: {
        id,
      },
    });

    if (!result.ok) throw result;
    const body = await result.json();

    return body;
  }

  async list() {
    const result = await api.tasks.$get();

    if (!result.ok) throw result;
    const body = await result.json();

    return body;
  }
}

const ApiTaskRepositoryContext = createContext<ApiTaskRepository | null>(null);

export function ApiTaskRepositoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [repository] = useState(() => new ApiTaskRepository());

  return (
    <ApiTaskRepositoryContext.Provider value={repository}>
      {children}
    </ApiTaskRepositoryContext.Provider>
  );
}

export function useTaskRepository() {
  const repository = useContext(ApiTaskRepositoryContext);

  if (!repository) throw new Error("No Task Repository context is available.");

  return repository;
}
