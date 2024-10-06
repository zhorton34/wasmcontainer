use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmServiceContainer {
    bindings: HashMap<u32, u32>,
}

#[wasm_bindgen]
impl WasmServiceContainer {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        WasmServiceContainer {
            bindings: HashMap::new(),
        }
    }

    #[wasm_bindgen]
    pub fn bind_service(&mut self, abstract_type: u32, concrete_type: u32) {
        self.bindings.insert(abstract_type, concrete_type);
    }

    #[wasm_bindgen]
    pub fn resolve_service(&self, abstract_type: u32) -> Option<u32> {
        self.bindings.get(&abstract_type).cloned()
    }
}

#[wasm_bindgen]
pub fn new_wasm_service_container() -> WasmServiceContainer {
    WasmServiceContainer::new()
}

#[wasm_bindgen]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_bind_and_resolve_service() {
        let mut container = WasmServiceContainer::new();
        container.bind_service(1, 2);
        assert_eq!(container.resolve_service(1), Some(2));
    }

    #[test]
    fn test_resolve_nonexistent_service() {
        let container = WasmServiceContainer::new();
        assert_eq!(container.resolve_service(3), None);
    }
}
