# Nominal Typed Service Container powered by Rust/WASM

This project implements a service container using Deno and Rust (compiled to WebAssembly). Rust provides nominal typing and strict type safety.

## Running the project

1. Compile Rust to WASM:
    ```
    cd rust/
    ../wasm-pack/build.sh
    ```

2. Run the Deno application:
    ```
    deno run --allow-read --allow-net src/main.ts
    ```
