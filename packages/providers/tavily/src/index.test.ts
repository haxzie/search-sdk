import { afterEach, describe, expect, it, vi } from "vitest";
import { tavily } from "./index";

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

describe("tavily provider", () => {
  it("declares search + scrape capabilities", () => {
    const provider = tavily({ apiKey: "tvly-test" });
    expect(provider.capabilities).toEqual({ search: true, scrape: true });
  });

  it("normalizes search results and answer", async () => {
    const fetchSpy = mockFetchOnce({
      query: "ai agents",
      answer: "AI agents are programs that...",
      response_time: 1.23,
      results: [
        {
          title: "Agents 101",
          url: "https://example.com/agents",
          content: "snippet",
          raw_content: "full text",
          score: 0.98,
          published_date: "2026-01-01",
        },
      ],
      images: ["https://img.example.com/1.png"],
    });

    const provider = tavily({ apiKey: "tvly-test" });
    const res = await provider.search({
      query: "ai agents",
      maxResults: 3,
      includeContent: true,
    });

    expect(res.answer).toContain("AI agents");
    expect(res.responseTime).toBe(1.23);
    expect(res.results[0]).toMatchObject({
      title: "Agents 101",
      snippet: "snippet",
      content: "full text",
      score: 0.98,
      source: "example.com",
    });
    expect(res.images?.[0]).toEqual({ url: "https://img.example.com/1.png" });

    const body = JSON.parse(
      (fetchSpy.mock.calls[0]![1] as RequestInit).body as string,
    );
    expect(body).toMatchObject({
      query: "ai agents",
      max_results: 3,
      include_raw_content: true,
      include_answer: true,
    });
  });

  it("maps scrape to the extract endpoint", async () => {
    const fetchSpy = mockFetchOnce({
      results: [{ url: "https://example.com", raw_content: "extracted" }],
    });

    const provider = tavily({ apiKey: "tvly-test" });
    const res = await provider.scrape!({ url: "https://example.com" });

    expect(res).toMatchObject({
      url: "https://example.com",
      content: "extracted",
      markdown: "extracted",
    });
    expect(fetchSpy.mock.calls[0]![0]).toBe("https://api.tavily.com/extract");
  });
});
