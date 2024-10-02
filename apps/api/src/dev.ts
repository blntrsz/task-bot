import { serve } from "@hono/node-server";
import { app } from "./application";
import { dependencies, inject } from "./di";

inject(dependencies, () =>
  serve({
    fetch: app.fetch,
    port: 8787,
  }),
);
