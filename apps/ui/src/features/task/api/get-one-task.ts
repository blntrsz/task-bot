import { api } from "#lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { taskKeys } from "./task-keys";

export async function getOneTask(id: string) {
  const result = await api.tasks[":id"].$get({
    param: {
      id,
    },
  });

  if (!result.ok) throw result;
  const body = await result.json();

  return body;
}

export function useGetOneTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getOneTask(id),
  });
}
