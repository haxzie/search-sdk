import { afterEach, describe, expect, it, vi } from "vitest";
import { firecrawl } from "./index";

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

describe("firecrawl provider", () => {
  it("declares search + scrape capabilities", () => {
    const provider = firecrawl({ apiKey: "fc-test" });
    expect(provider.name).toBe("firecrawl");
    expect(provider.capabilities).toEqual({ search: true, scrape: true });
  });

  it("runs keyless (no Authorization header) when no key is provided", async () => {
    vi.stubEnv("FIRECRAWL_API_KEY", "");
    const fetchSpy = mockFetchOnce({ success: true, data: { web: [] } });

    const provider = firecrawl();
    await provider.search({ query: "x" });

    const init = fetchSpy.mock.calls[0]![1] as RequestInit;
    const headers = (init.headers ?? {}) as Record<string, string>;
    expect(headers.authorization).toBeUndefined();
    vi.unstubAllEnvs();
  });

  it("sends a bearer token when FIRECRAWL_API_KEY is set", async () => {
    vi.stubEnv("FIRECRAWL_API_KEY", "fc-from-env");
    const fetchSpy = mockFetchOnce({ success: true, data: { web: [] } });

    const provider = firecrawl();
    await provider.search({ query: "x" });

    const init = fetchSpy.mock.calls[0]![1] as RequestInit;
    const headers = (init.headers ?? {}) as Record<string, string>;
    expect(headers.authorization).toBe("Bearer fc-from-env");
    vi.unstubAllEnvs();
  });

  it("normalizes search results from the object-form payload", async () => {
    const fetchSpy = mockFetchOnce({
      success: true,
      data: {
        web: [
          {
            url: "https://example.com/a",
            title: "Result A",
            description: "Snippet A",
            markdown: "# A",
          },
        ],
      },
    });

    const provider = firecrawl({ apiKey: "fc-test" });
    const res = await provider.search({ query: "hello", includeContent: true });

    expect(res.provider).toBe("firecrawl");
    expect(res.results).toHaveLength(1);
    expect(res.results[0]).toMatchObject({
      title: "Result A",
      url: "https://example.com/a",
      snippet: "Snippet A",
      content: "# A",
      source: "example.com",
    });

    // Verify request shape: bearer auth + scrapeOptions when includeContent set.
    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toBe("https://api.firecrawl.dev/v2/search");
    expect((init as RequestInit).method).toBe("POST");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.scrapeOptions).toBeDefined();
  });

  it("normalizes scrape results", async () => {
    mockFetchOnce({
      success: true,
      data: {
        markdown: "# Page",
        links: ["https://x.com"],
        metadata: { title: "Page Title", author: "Jane" },
      },
    });

    const provider = firecrawl({ apiKey: "fc-test" });
    const res = await provider.scrape!({ url: "https://example.com" });

    expect(res).toMatchObject({
      url: "https://example.com",
      title: "Page Title",
      markdown: "# Page",
      content: "# Page",
      author: "Jane",
      links: ["https://x.com"],
    });
  });

  it("wraps non-2xx responses in a WebSearchError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 401 })),
    );
    const provider = firecrawl({ apiKey: "bad" });
    await expect(provider.search({ query: "x" })).rejects.toMatchObject({
      name: "WebSearchError",
      provider: "firecrawl",
      status: 401,
    });
  });
});
