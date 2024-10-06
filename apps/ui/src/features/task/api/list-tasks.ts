import { api } from "#lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { taskKeys } from "./task-keys";

export async function listTasks() {
  const result = await api.tasks.$get();

  if (!result.ok) throw result;
  const body = await result.json();

  return body;
}

export function useListTasks() {
  return useQuery({
    queryKey: taskKeys.list(""),
    queryFn: listTasks,
  });
}
