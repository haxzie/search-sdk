# @search-sdk/exa

[Exa](https://exa.ai) provider for [`websearch-sdk`](https://github.com/haxzie/websearch-sdk) — a neural / embeddings-based search API for AI. Retrieves semantically relevant pages and can return scraped page **contents** (text, highlights, summaries).

## Install

```bash
pnpm add @search-sdk/core @search-sdk/exa
```

## Get an API key

1. Sign up at the **[dashboard](https://dashboard.exa.ai)** (login at [dashboard.exa.ai/login](https://dashboard.exa.ai/login)).
2. Create a key in the **API Keys** section — it's an opaque string (no fixed prefix).
3. Store it as `EXA_API_KEY` in your `.env`.

Exa offers a monthly free request allowance, then meters by usage (search ≈ $7 / 1,000 requests for up to 10 results; `contents` ≈ $1 / 1,000 pages per content type). See **[pricing](https://exa.ai/pricing?tab=api)**. _Pricing is subject to change._

> Exa was formerly called **Metaphor** — older docs/SDKs may use that name.

## Usage

`apiKey` is optional — it falls back to the `EXA_API_KEY` environment variable.

```ts
import { WebSearch } from "@search-sdk/core";
import { exa } from "@search-sdk/exa";

const web = new WebSearch({
  provider: exa({ apiKey: process.env.EXA_API_KEY }), // or just exa()
});

// Semantic search
const { results } = await web.search({
  query: "papers on retrieval-augmented generation",
  maxResults: 10,
  includeDomains: ["arxiv.org"],
  includeContent: true, // fetch page text into each result
});
for (const r of results) console.log(r.title, r.url, r.score);

// Retrieve contents of a specific URL
const page = await web.scrape({ url: "https://example.com" });
console.log(page.content);
```

### As AI SDK tools

```ts
import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  tools: web.tools(), // { web_search, web_scrape }
  stopWhen: stepCountIs(5),
  prompt: "Find recent research on agentic web search.",
});
```

## Capabilities

| Search | Scrape | Auth | Env variable |
| :---: | :---: | --- | --- |
| ✅ (neural) | ✅ (`/contents`) | `x-api-key: <key>` | `EXA_API_KEY` |

Supported unified options: `maxResults`, `includeDomains`, `excludeDomains`, `timeRange` (mapped to `startPublishedDate`/`endPublishedDate`), `includeContent`. Exa-specific knobs (e.g. `type: "neural" | "keyword" | "auto"`, `category`) can be passed via `providerOptions`.

## Links

- [Getting started](https://exa.ai/docs/reference/getting-started)
- [Search endpoint](https://exa.ai/docs/reference/search)
- [Pricing](https://exa.ai/pricing?tab=api)
- [Dashboard](https://dashboard.exa.ai)

## License

MIT
