import { Logger as PTLogger } from "@aws-lambda-powertools/logger";
import { Logger } from "../domain/logger";

class PowertoolsLogger implements Logger {
  logger: PTLogger;

  constructor() {
    this.logger = new PTLogger({ serviceName: "task-bot" });
  }

  info() {
    this.logger.info({
      message,
    });
  }
}
