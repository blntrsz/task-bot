import { OpenAPIHono } from "@hono/zod-openapi";
import { listTasks } from "./routes/task/list-tasks";
import { createTask } from "./routes/task/create-task";
import { findOneTask } from "./routes/task/find-one-task";
import { apiReference } from "@scalar/hono-api-reference";
import { deleteTask } from "./routes/task/delete-task";
import { createUser } from "./routes/user/create-user";
import { updateTask } from "./routes/task/update-task";
import { addCorrelationHeaders } from "./middlewares/add-correation-headers";
import { authenticate } from "./middlewares/authenticate";
import { handleError } from "./middlewares/handle-error";
import { loginUser } from "./routes/user/login-user";

export const app = new OpenAPIHono();

app.use(addCorrelationHeaders).use(authenticate);
app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});

handleError(app);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "TaskBot API",
  },
});
app.get(
  "/ui",
  apiReference({
    spec: {
      url: "/doc",
    },
  }),
);

export const routes = app
  // task
  .route("/", listTasks)
  .route("/", createTask)
  .route("/", findOneTask)
  .route("/", deleteTask)
  .route("/", updateTask)

  // user
  .route("/", createUser)
  .route("/", loginUser);
