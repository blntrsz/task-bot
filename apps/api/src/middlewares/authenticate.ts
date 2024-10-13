import { VerifyUserUseCase } from "@task-bot/core/user/use-cases/validate-session.use-case";
import { deleteCookie, getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

export const authenticate = createMiddleware(async (c, next) => {
  const isCreateUserPath = c.req.path === "/users" && c.req.method === "POST";
  const isOpenApiPath = c.req.path === "/doc" && c.req.method === "GET";
  const isScalarPath = c.req.path === "/ui" && c.req.method === "GET";
  const isLoginRoute = c.req.path === "/login" && c.req.method === "POST";

  if (isCreateUserPath || isOpenApiPath || isScalarPath || isLoginRoute) {
    return next();
  }

  const authorization = c.req.header("Authorization") ?? "";
  const sessionId =
    authorization.replace("Bearer ", "") ?? getCookie(c, "_session");

  await new VerifyUserUseCase()
    .execute({
      id: sessionId,
    })
    .then(next)
    .catch((error) => {
      deleteCookie(c, "_session");
      console.error(error);

      throw new Error("Unauthorized");
    });
});
