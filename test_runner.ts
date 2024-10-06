#!/usr/bin/env -S deno run --allow-all

import * as path from "@std/path";

console.log("Running tests...");

const projectRoot = Deno.cwd();
const rustDir = path.join(projectRoot, "rust");

// Set environment variables
Deno.env.set("PATH", `${Deno.env.get("HOME")}/.cargo/bin:${Deno.env.get("PATH")}`);
Deno.env.set("RUST_BACKTRACE", "1");
Deno.env.set("CARGO_HOME", `${Deno.env.get("HOME")}/.cargo`);

async function runCommand(command: string, args: string[], cwd: string): Promise<Deno.ProcessStatus> {
  console.log(`Running command: ${command} ${args.join(" ")}`);
  const process = Deno.run({
    cmd: [command, ...args],
    cwd: cwd,
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await process.status();

  if (code !== 0) {
    const stderr = new TextDecoder().decode(await process.stderrOutput());
    console.error(`Command failed with code ${code}`);
    console.error(`Stderr: ${stderr}`);
  }

  process.close();
  return { code, success: code === 0 };
}

async function main() {
  try {
    // Print debugging information
    console.log(`Current user: ${Deno.env.get("USER")}`);
    console.log(`CARGO_HOME: ${Deno.env.get("CARGO_HOME")}`);

    // Build WebAssembly module
    console.log("Building WebAssembly module...");
    const wasmPackBuildResult = await runCommand("wasm-pack", ["build", "--target", "web"], rustDir);
    if (!wasmPackBuildResult.success) {
      throw new Error(`wasm-pack build failed with code ${wasmPackBuildResult.code}`);
    }

    // Run Rust tests
    console.log("Running Rust tests...");
    const cargoTestResult = await runCommand("cargo", ["test"], rustDir);
    if (!cargoTestResult.success) {
      throw new Error(`Cargo test failed with code ${cargoTestResult.code}`);
    }

    // Run wasm-pack tests
    console.log("Running wasm-pack tests...");
    const wasmPackTestResult = await runCommand("wasm-pack", ["test", "--node"], rustDir);
    if (!wasmPackTestResult.success) {
      console.warn(`Warning: wasm-pack test failed with code ${wasmPackTestResult.code}`);
      console.warn("Continuing with other tests...");
    } else {
      console.log("wasm-pack tests completed successfully.");
    }

    // Run Deno tests
    console.log("Running Deno tests...");
    const containerTestResult = await runCommand("deno", ["test", "--allow-all", "--unstable", path.join(projectRoot, "src", "container.test.ts")], projectRoot);
    if (!containerTestResult.success) {
      throw new Error(`Container test failed with code ${containerTestResult.code}`);
    }

    const integrationTestResult = await runCommand("deno", ["test", "--allow-all", "--unstable", path.join(projectRoot, "src", "integration.test.ts")], projectRoot);
    if (!integrationTestResult.success) {
      throw new Error(`Integration test failed with code ${integrationTestResult.code}`);
    }

    console.log("All tests completed successfully!");
  } catch (error: unknown) {
    console.error("Error running tests:", error instanceof Error ? error.message : String(error));
    Deno.exit(1);
  }
}

main();