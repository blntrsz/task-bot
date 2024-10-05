import { handle } from "hono/aws-lambda";
import { app } from "./application";
import { createContainer } from "./di";
import { useObservability } from "@task-bot/core/common/domain/services/observability";
import { ContainerContext } from "@task-bot/core/common/domain/container";

export function handler(event: any, context: any) {
  return ContainerContext.with(createContainer())(() => {
    useObservability().setup(event, context);
    return handle(app)(event, context);
  });
}
