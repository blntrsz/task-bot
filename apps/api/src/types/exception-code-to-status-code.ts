import { ExceptionCode } from "@task-bot/core/shared/domain/exceptions/exception-to-response";
import { StatusCode } from "hono/utils/http-status";

export const exceptionCodesToStatusCode: Record<ExceptionCode, StatusCode> = {
  [ExceptionCode.VALIDATION]: 400,
  [ExceptionCode.UNAUTHORIZED]: 401,
  [ExceptionCode.FORBIDDEN]: 403,
  [ExceptionCode.NOT_FOUND]: 404,
  [ExceptionCode.INTERNAL_SERVER]: 500,
  [ExceptionCode.EXCEPTION]: 500,
};
