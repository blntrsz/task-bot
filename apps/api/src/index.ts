import { handle } from "hono/aws-lambda";
import { app } from "./application";
import { setupObservability } from "@task-bot/core/shared/domain/observability";
import { dependencies, inject } from "./di";

export function handler(event: any, context: any) {
  return inject(dependencies, () => {
    setupObservability(event, context);
    handle(app)(event, context);
  });
}
