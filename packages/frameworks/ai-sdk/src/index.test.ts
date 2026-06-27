import { WebSearch } from "@websearch-sdk/core";
import type { SearchProvider } from "@websearch-sdk/core";
import { describe, expect, it, vi } from "vitest";
import { aiSdk } from "./index";

function makeProvider(scrape: boolean): SearchProvider {
  return {
    name: "fake",
    capabilities: { search: true, scrape },
    search: vi.fn(async () => ({
      query: "q",
      provider: "fake",
      results: [
        { title: "T", url: "https://e.com", snippet: "s", content: "c" },
      ],
      answer: "the answer",
    })),
    ...(scrape
      ? {
          scrape: vi.fn(async () => ({
            url: "https://e.com",
            title: "T",
            markdown: "# md",
            content: "# md",
          })),
        }
      : {}),
  };
}

describe("aiSdk adapter", () => {
  it("returns web_search + web_scrape for scrape-capable providers", () => {
    const web = new WebSearch({
      provider: makeProvider(true),
      framework: aiSdk(),
    });
    const tools = web.tools();
    expect(Object.keys(tools).sort()).toEqual(["web_scrape", "web_search"]);
  });

  it("omits web_scrape for search-only providers", () => {
    const web = new WebSearch({
      provider: makeProvider(false),
      framework: aiSdk(),
    });
    const tools = web.tools();
    expect(Object.keys(tools)).toEqual(["web_search"]);
  });

  it("honors custom tool names", () => {
    const web = new WebSearch({
      provider: makeProvider(true),
      framework: aiSdk({ searchToolName: "search", scrapeToolName: "scrape" }),
    });
    const tools = web.tools();
    expect(Object.keys(tools).sort()).toEqual(["scrape", "search"]);
  });

  it("builds tools with an inputSchema and an execute that calls the provider", async () => {
    const provider = makeProvider(true);
    const web = new WebSearch({ provider, framework: aiSdk() });
    const tools = web.tools();

    const searchTool = tools["web_search"]!;
    expect(searchTool.inputSchema).toBeDefined();
    expect(typeof searchTool.execute).toBe("function");

    const out = await searchTool.execute!(
      { query: "hello", maxResults: 2 },
      { toolCallId: "1", messages: [] },
    );
    expect(provider.search).toHaveBeenCalledWith({
      query: "hello",
      maxResults: 2,
    });
    expect(out).toMatchObject({
      query: "q",
      answer: "the answer",
      results: [{ title: "T", url: "https://e.com" }],
    });
  });
});
