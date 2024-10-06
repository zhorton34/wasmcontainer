import { ServiceContainer } from "./container.ts";
import { LoggingServiceProvider, Logger } from './LoggingServiceProvider.ts';

class TestService {
  private logger: Logger;

  constructor(container: ServiceContainer) {
    this.logger = container.make(Logger)!;
  }

  doSomething() {
    this.logger.log('TestService is doing something');
  }
}

async function main() {
  const container = new ServiceContainer();
  const loggingProvider = new LoggingServiceProvider();

  container.registerProvider(loggingProvider);
  container.bootProvider(loggingProvider);

  const logger = container.make(Logger);
  logger?.log('Logging from the main application.');

  container.bind(TestService, TestService);
  const testService = new TestService(container);
  testService.doSomething();
}

main().catch(console.error);


