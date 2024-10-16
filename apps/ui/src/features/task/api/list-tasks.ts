import { useQuery } from "@tanstack/react-query";
import { taskKeys } from "./task";
import { api } from "@task-bot/ui/lib/api-client";

export async function listTasks() {
  const result = await api.tasks.$get({
    query: {
      "page[size]": "50",
      "page[number]": "1",
    },
  });

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
