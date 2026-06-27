import { defineConfig, type Options } from "tsup";

/**
 * Shared tsup preset re-used by every package. Each package does:
 *   import { baseConfig } from "../../../tsup.config.base";
 *   export default defineConfig(baseConfig());
 */
export function baseConfig(overrides: Options = {}): Options {
  return {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    target: "es2022",
    ...overrides,
  };
}
