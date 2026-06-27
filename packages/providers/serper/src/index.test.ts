import { afterEach, describe, expect, it, vi } from "vitest";
import { serper } from "./index";

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

describe("serper provider", () => {
  it("is search-only", () => {
    const provider = serper({ apiKey: "serper-test" });
    expect(provider.capabilities).toEqual({ search: true, scrape: false });
  });

  it("normalizes organic results and answerBox", async () => {
    const fetchSpy = mockFetchOnce({
      organic: [
        {
          title: "Result 1",
          link: "https://example.com/1",
          snippet: "snippet 1",
          position: 1,
          date: "2026-02-02",
        },
      ],
      answerBox: { answer: "42" },
    });

    const provider = serper({ apiKey: "serper-test" });
    const res = await provider.search({ query: "meaning of life", country: "us" });

    expect(res.answer).toBe("42");
    expect(res.results[0]).toMatchObject({
      title: "Result 1",
      url: "https://example.com/1",
      snippet: "snippet 1",
      score: 1,
      source: "example.com",
    });

    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toBe("https://google.serper.dev/search");
    expect(
      (init as RequestInit).headers as Record<string, string>,
    ).toMatchObject({ "x-api-key": "serper-test" });
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toMatchObject({ q: "meaning of life", gl: "us" });
  });
});
