import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveApiKey } from "./env";
import { MissingApiKeyError } from "./errors";

afterEach(() => vi.unstubAllEnvs());

describe("resolveApiKey", () => {
  it("prefers an explicit key over the environment", () => {
    vi.stubEnv("MY_KEY", "from-env");
    expect(
      resolveApiKey({ provider: "p", apiKey: "explicit", envVars: ["MY_KEY"] }),
    ).toBe("explicit");
  });

  it("falls back to the first non-empty env var", () => {
    vi.stubEnv("A", "");
    vi.stubEnv("B", "second");
    expect(
      resolveApiKey({ provider: "p", envVars: ["A", "B"] }),
    ).toBe("second");
  });

  it("trims whitespace-only values and treats them as missing", () => {
    vi.stubEnv("A", "   ");
    expect(() => resolveApiKey({ provider: "p", envVars: ["A"] })).toThrow(
      MissingApiKeyError,
    );
  });

  it("throws MissingApiKeyError listing the checked env vars", () => {
    expect.assertions(2);
    try {
      resolveApiKey({ provider: "tavily", envVars: ["TAVILY_API_KEY"] });
    } catch (err) {
      expect(err).toBeInstanceOf(MissingApiKeyError);
      expect((err as MissingApiKeyError).envVars).toEqual(["TAVILY_API_KEY"]);
    }
  });
});
