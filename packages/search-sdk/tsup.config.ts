import { defineConfig } from "tsup";
import { baseConfig } from "../../tsup.config.base";

// Keep core (and its peers) external so this stays a thin re-export rather than
// bundling a duplicate copy of @search-sdk/core.
export default defineConfig(
  baseConfig({ external: ["@search-sdk/core", "ai", "zod"] })
);
