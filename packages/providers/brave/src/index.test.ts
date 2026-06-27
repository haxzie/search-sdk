import { afterEach, describe, expect, it, vi } from "vitest";
import { brave } from "./index";

function mockFetchOnce(json: unknown) {
  const spy = vi.fn(async () =>
    new Response(JSON.stringify(json), {
      status: 200,
      headers: { "content-type": "application/json" },
    }),
  );
  vi.stubGlobal("fetch", spy);
  return spy;
}

afterEach(() => vi.unstubAllGlobals());

describe("brave provider", () => {
  it("is search-only", () => {
    const provider = brave({ apiKey: "brave-test" });
    expect(provider.capabilities).toEqual({ search: true, scrape: false });
    expect(provider.scrape).toBeUndefined();
  });

  it("builds query params, sends subscription token, and normalizes results", async () => {
    const fetchSpy = mockFetchOnce({
      web: {
        results: [
          {
            title: "Brave Result",
            url: "https://example.com/b",
            description: "desc",
            meta_url: { favicon: "https://example.com/fav.ico" },
            profile: { name: "Example" },
          },
        ],
      },
    });

    const provider = brave({ apiKey: "brave-test" });
    const res = await provider.search({
      query: "privacy search",
      maxResults: 5,
      country: "us",
      timeRange: "week",
    });

    expect(res.results[0]).toMatchObject({
      title: "Brave Result",
      snippet: "desc",
      favicon: "https://example.com/fav.ico",
      source: "Example",
    });

    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toContain("/res/v1/web/search?");
    expect(url).toContain("q=privacy+search");
    expect(url).toContain("count=5");
    expect(url).toContain("freshness=pw");
    expect(
      (init as RequestInit).headers as Record<string, string>,
    ).toMatchObject({ "x-subscription-token": "brave-test" });
  });
});
