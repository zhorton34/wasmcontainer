use wasm_bindgen_test::*;
use wasm_service_container::new_wasm_service_container;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn test_wasm_service_container() {
    let container = new_wasm_service_container();
    // Add your test assertions here
}