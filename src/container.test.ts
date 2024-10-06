import { assertEquals } from "jsr:@std/assert";
import { ServiceContainer } from "./container.ts";
import { Logger, ConsoleLogger } from "./LoggingServiceProvider.ts";

Deno.test("ServiceContainer - bind and resolve", async () => {
  const container = new ServiceContainer();
  await container.initialize(); // Add this line

  container.bind(Logger, ConsoleLogger);
  const logger = container.make(Logger);
  assertEquals(logger instanceof ConsoleLogger, true);
});

Deno.test("ServiceContainer - resolve non-existent service", async () => {
  const container = new ServiceContainer();
  await container.initialize(); // Add this line

  const nonExistentService = container.make(class NonExistentService { });
  assertEquals(nonExistentService, null);
});

Deno.test("ServiceContainer - bind abstract class to concrete implementation", async () => {
  const container = new ServiceContainer();
  await container.initialize(); // Add this line

  container.bind(Logger, ConsoleLogger);
  const logger = container.make(Logger);
  assertEquals(logger instanceof ConsoleLogger, true);
});