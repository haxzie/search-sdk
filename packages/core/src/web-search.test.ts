import { describe, expect, it, vi } from "vitest";
import { WebSearch } from "./web-search";
import { WebSearchError } from "./errors";
import type { SearchProvider } from "./provider";
import type { FrameworkAdapter } from "./framework";
import type { SearchResponse, ScrapeResult } from "./types";

function makeProvider(overrides: Partial<SearchProvider> = {}): SearchProvider {
  return {
    name: "fake",
    capabilities: { search: true, scrape: true },
    search: vi.fn(
      async (): Promise<SearchResponse> => ({
        query: "q",
        provider: "fake",
        results: [],
      }),
    ),
    scrape: vi.fn(
      async (): Promise<ScrapeResult> => ({ url: "https://example.com" }),
    ),
    ...overrides,
  };
}

describe("WebSearch.search", () => {
  it("coerces a bare string into { query }", async () => {
    const provider = makeProvider();
    const web = new WebSearch({ provider });

    await web.search("hello world");

    expect(provider.search).toHaveBeenCalledWith({ query: "hello world" });
  });

  it("passes a full options object through unchanged", async () => {
    const provider = makeProvider();
    const web = new WebSearch({ provider });

    await web.search({ query: "ts", maxResults: 5 });

    expect(provider.search).toHaveBeenCalledWith({ query: "ts", maxResults: 5 });
  });
});

describe("WebSearch.scrape", () => {
  it("coerces a bare string into { url }", async () => {
    const provider = makeProvider();
    const web = new WebSearch({ provider });

    await web.scrape("https://example.com");

    expect(provider.scrape).toHaveBeenCalledWith({ url: "https://example.com" });
  });

  it("throws a WebSearchError when the provider lacks scrape capability", async () => {
    const provider = makeProvider({
      capabilities: { search: true, scrape: false },
      scrape: undefined,
    });
    const web = new WebSearch({ provider });

    await expect(web.scrape("https://example.com")).rejects.toBeInstanceOf(
      WebSearchError,
    );
  });
});

describe("WebSearch.tools", () => {
  it("delegates to the framework adapter with web + provider context", () => {
    const provider = makeProvider();
    const createTools = vi.fn(() => ({ web_search: {} }));
    const framework: FrameworkAdapter = { name: "test", createTools };
    const web = new WebSearch({ provider, framework });

    const tools = web.tools();

    expect(createTools).toHaveBeenCalledWith({ web, provider });
    expect(tools).toEqual({ web_search: {} });
  });

  it("falls back to the built-in AI SDK adapter when no framework is configured", () => {
    const web = new WebSearch({ provider: makeProvider() });
    const tools = web.tools();
    // Default ai-sdk adapter exposes web_search (+ web_scrape for this provider).
    expect(Object.keys(tools)).toContain("web_search");
  });
});
