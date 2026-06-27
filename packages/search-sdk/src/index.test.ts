import { describe, it, expect } from "vitest";

import * as sdk from "./index";

// The alias must keep re-exporting the full core surface. If core adds or
// renames an export, this guards against the alias silently drifting.
describe("search-sdk alias", () => {
  it("re-exports core's runtime values", () => {
    expect(typeof sdk.WebSearch).toBe("function");
    expect(typeof sdk.WebSearchError).toBe("function");
    expect(typeof sdk.isWebSearchError).toBe("function");
    expect(typeof sdk.MissingApiKeyError).toBe("function");
    expect(typeof sdk.aiSdk).toBe("function");
    expect(typeof sdk.resolveApiKey).toBe("function");
    expect(typeof sdk.requestJson).toBe("function");
  });
});
