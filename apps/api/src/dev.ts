import { serve } from "@hono/node-server";
import { app } from "./application";
import { createContainer } from "./di";
import { ContainerContext } from "@task-bot/core/common/domain/container";

ContainerContext.with(createContainer())(() => {
  serve({
    fetch: app.fetch,
    port: 8787,
  });
});
