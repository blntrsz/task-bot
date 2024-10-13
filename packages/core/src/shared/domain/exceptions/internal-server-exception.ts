import { Exception } from "./exception";
import { ExceptionCode } from "./exception-to-response";

export class InternalServerException extends Exception {
  constructor() {
    super("Internal Server Error", ExceptionCode.INTERNAL_SERVER);
  }
}
