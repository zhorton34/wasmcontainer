import { assertEquals } from "@std/assert";
import { ServiceContainer } from "./container.ts";

// Define an abstract class
abstract class Logger {
  abstract log(message: string): void;
}

// Define a concrete implementation
class ConsoleLogger extends Logger {
  log(message: string): void {
    console.log(message);
  }
}

Deno.test("ServiceContainer - integration test", async () => {
  const container = new ServiceContainer();
  await container.initialize(); // Add this line

  // Bind an abstract class to a concrete implementation
  container.bind(Logger, ConsoleLogger);

  // Resolve the abstract class
  const resolvedLogger = container.make(Logger);
  assertEquals(resolvedLogger instanceof ConsoleLogger, true);

  // Test the resolved instance
  if (resolvedLogger) {
    resolvedLogger.log("Test message");
  }

  // Attempt to resolve a non-existent service
  class NonExistentService { }
  const nonExistentService = container.make(NonExistentService);
  assertEquals(nonExistentService, null);
});