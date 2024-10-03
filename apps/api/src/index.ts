import { handle } from "hono/aws-lambda";
import { app } from "./application";
import { dependencies, inject } from "./di";
import { useObservability } from "@task-bot/core/domain/services/observability";

export function handler(event: any, context: any) {
  return inject(dependencies, () => {
    useObservability().setup(event, context);
    return handle(app)(event, context);
  });
}
