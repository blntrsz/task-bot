import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: Component,
});

function Component() {
  return (
    <div className="p-2">
      <h3>About</h3>
    </div>
  );
}
