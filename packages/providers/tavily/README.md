# @search-sdk/tavily

[Tavily](https://tavily.com) provider for [`websearch-sdk`](https://github.com/haxzie/websearch-sdk) — a search API purpose-built for AI agents and RAG. Returns ranked results plus an optional **LLM-generated answer**, and can **extract** raw content from URLs.

## Install

```bash
pnpm add @search-sdk/core @search-sdk/tavily
```

## Get an API key

1. Sign up at **[app.tavily.com](https://app.tavily.com)** (email or Google/GitHub — no credit card required).
2. Copy an API key from the dashboard home → **API Keys**.
3. Keys start with `tvly-`.

The free tier includes **1,000 credits/month** (basic search = 1 credit, advanced search = 2). See **[pricing](https://www.tavily.com/pricing)** and the **[credits guide](https://docs.tavily.com/documentation/api-credits)**. _Pricing is subject to change._

## Usage

`apiKey` is optional — it falls back to the `TAVILY_API_KEY` environment variable.

```ts
import { WebSearch } from "@search-sdk/core";
import { tavily } from "@search-sdk/tavily";

const web = new WebSearch({
  provider: tavily({ apiKey: process.env.TAVILY_API_KEY }), // or just tavily()
});

// Search — Tavily can synthesize an answer
const res = await web.search({
  query: "who won the 2026 super bowl?",
  maxResults: 5,
  topic: "news",
  timeRange: "month",
});
console.log(res.answer);   // LLM-generated answer
console.log(res.results);  // ranked SearchResult[]

// Extract (scrape) content from a URL
const page = await web.scrape({ url: "https://example.com/article" });
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
  prompt: "What are the newest features in TypeScript?",
});
```

## Capabilities

| Search | Scrape | Auth | Env variable |
| :---: | :---: | --- | --- |
| ✅ (with `answer`) | ✅ (`/extract`) | `Authorization: Bearer tvly-...` | `TAVILY_API_KEY` |

Supported unified options: `maxResults`, `includeDomains`, `excludeDomains`, `topic` (`general`/`news`), `timeRange`, `includeContent`. Tavily-specific knobs (e.g. `search_depth: "advanced"`, `chunks_per_source`) can be passed via `providerOptions`.

## Links

- [Search API reference](https://docs.tavily.com/documentation/api-reference/endpoint/search)
- [Pricing](https://www.tavily.com/pricing)
- [API credits](https://docs.tavily.com/documentation/api-credits)
- [Dashboard](https://app.tavily.com)

## License

MIT
