import { ServiceContainer } from './container.ts';

export interface ServiceProvider {
  register(container: ServiceContainer): void;
  boot?(container: ServiceContainer): void;
}
