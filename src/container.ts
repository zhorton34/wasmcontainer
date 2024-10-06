let wasmModule: any;

export class ServiceContainer {
  private wasmContainer: any;
  private instances: Map<number, any>;
  private typeCounter: number = 0;
  private typeMap: Map<any, number>;

  constructor() {
    this.instances = new Map();
    this.typeMap = new Map();
  }

  async initialize() {
    if (!wasmModule) {
      wasmModule = await import("../rust/pkg/wasm_service_container.js");
      await wasmModule.default();
    }
    this.wasmContainer = new wasmModule.WasmServiceContainer();
  }

  private getOrCreateTypeId(type: any): number {
    if (!this.typeMap.has(type)) {
      this.typeMap.set(type, ++this.typeCounter);
    }
    return this.typeMap.get(type)!;
  }

  bind(abstractType: any, concreteType: any) {
    this.register(abstractType, concreteType);
  }

  register(abstractType: any, concreteType: any) {
    const abstractTypeId = this.getOrCreateTypeId(abstractType);
    const concreteTypeId = this.getOrCreateTypeId(concreteType);
    this.wasmContainer.bind_service(abstractTypeId, concreteTypeId);
    this.instances.set(concreteTypeId, new concreteType());
  }

  make(abstractType: any): any {
    const abstractTypeId = this.getOrCreateTypeId(abstractType);
    const concreteTypeId = this.wasmContainer.resolve_service(abstractTypeId);
    if (concreteTypeId === null) {
      return null;
    }
    return this.instances.get(concreteTypeId) || null;
  }
}

export interface ServiceProvider {
  register(container: ServiceContainer): void;
  boot?(container: ServiceContainer): void;
}
