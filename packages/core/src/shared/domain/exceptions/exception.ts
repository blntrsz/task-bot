import { ExceptionCode } from "./exception-to-response";

export class Exception {
  message: string;
  code: ExceptionCode;

  constructor(message: string, code: ExceptionCode) {
    this.message = message;
    this.code = code;
  }
}
