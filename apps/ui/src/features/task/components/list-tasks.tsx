import { useListTasks } from "../api/list-tasks";

export function ListTasks() {
  const tasks = useListTasks();

  if (tasks.isLoading || !tasks.data || tasks.error) return null;

  return (
    <ul>
      {tasks.data.data.map((task) => (
        <li key={task.id}>{task.attributes.name}</li>
      ))}
    </ul>
  );
}
