import { afterEach, describe, expect, it, vi } from "vitest";
import { exa } from "./index";

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

describe("exa provider", () => {
  it("sends the x-api-key header and normalizes results", async () => {
    const fetchSpy = mockFetchOnce({
      requestId: "req_1",
      results: [
        {
          id: "1",
          title: "Neural search",
          url: "https://example.com/neural",
          publishedDate: "2025-12-01",
          author: "Ada",
          score: 0.77,
          favicon: "https://example.com/fav.ico",
          text: "Long text body about neural search.",
        },
      ],
    });

    const provider = exa({ apiKey: "exa-test" });
    const res = await provider.search({ query: "neural", maxResults: 2 });

    expect(res.provider).toBe("exa");
    expect(res.results[0]).toMatchObject({
      title: "Neural search",
      author: "Ada",
      score: 0.77,
      source: "example.com",
    });

    const init = fetchSpy.mock.calls[0]![1] as RequestInit;
    expect((init.headers as Record<string, string>)["x-api-key"]).toBe("exa-test");
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({ query: "neural", numResults: 2 });
  });

  it("maps scrape to the contents endpoint", async () => {
    mockFetchOnce({
      results: [
        { url: "https://example.com", title: "T", text: "page contents" },
      ],
    });
    const provider = exa({ apiKey: "exa-test" });
    const res = await provider.scrape!({ url: "https://example.com" });
    expect(res).toMatchObject({
      url: "https://example.com",
      title: "T",
      content: "page contents",
    });
  });
});
