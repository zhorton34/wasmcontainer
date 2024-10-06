import { ServiceContainer, ServiceProvider } from './container.ts';

export abstract class Logger {
  abstract log(message: string): void;
}

export class ConsoleLogger extends Logger {
  log(message: string) {
    console.log(`ConsoleLogger: ${message}`);
  }
}

export class LoggingServiceProvider implements ServiceProvider {
  register(container: ServiceContainer): void {
    container.bind(Logger, ConsoleLogger);
  }

  boot(container: ServiceContainer): void {
    const logger = container.make(Logger);
    if (logger) {
      logger.log("LoggerService has been booted!");
    } else {
      console.error("Failed to resolve Logger");
    }
  }
}
