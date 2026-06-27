# @search-sdk/serper

[Serper](https://serper.dev) provider for [`websearch-sdk`](https://github.com/haxzie/websearch-sdk) — a fast, low-cost **Google Search (SERP) API**. Returns structured Google results (organic listings, answer box, knowledge graph) in ~1–2s.

> **Search-only.** Serper returns SERP listings and snippets, not full page content. Pair it with a scrape-capable provider (Firecrawl, Tavily, Exa) if you need page bodies. `web.scrape()` and the `web_scrape` tool are not available with this provider.

## Install

```bash
pnpm add @search-sdk/core @search-sdk/serper
```

## Get an API key

1. Sign up at **[serper.dev](https://serper.dev)** (no credit card required).
2. Copy your key from **[API Keys](https://serper.dev/api-keys)**.
3. New accounts get **2,500 free queries** to start.

Paid usage is credit-based, pay-as-you-go (from ~$1.00 down to ~$0.30 per 1,000 queries by volume; credits valid ~6 months). See the pricing section on **[serper.dev](https://serper.dev)**. _Pricing is subject to change._

## Usage

`apiKey` is optional — it falls back to the `SERPER_API_KEY` environment variable.

```ts
import { WebSearch } from "@search-sdk/core";
import { serper } from "@search-sdk/serper";

const web = new WebSearch({
  provider: serper({ apiKey: process.env.SERPER_API_KEY }), // or just serper()
});

const res = await web.search({
  query: "meaning of life",
  maxResults: 10,
  country: "us",   // gl
  language: "en",  // hl
});
console.log(res.answer);   // from Google's answer box / knowledge graph, when present
for (const r of res.results) console.log(r.title, r.url, r.snippet);

// News topic uses Serper's /news endpoint:
await web.search({ query: "ai regulation", topic: "news" });
```

### As AI SDK tools

```ts
import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  tools: web.tools(), // { web_search } only — Serper does not scrape
  stopWhen: stepCountIs(5),
  prompt: "Find the official Node.js LTS schedule.",
});
```

## Capabilities

| Search | Scrape | Auth | Env variable |
| :---: | :---: | --- | --- |
| ✅ (Google SERP) | — | `X-API-KEY: <key>` | `SERPER_API_KEY` |

Supported unified options: `maxResults` (`num`), `country` (`gl`), `language` (`hl`), `topic` (`general`/`news`), `timeRange` (`tbs`). Serper-specific params (e.g. `page`, `autocorrect`) can be passed via `providerOptions`.

## Links

- [Playground](https://serper.dev/playground)
- [API keys](https://serper.dev/api-keys)
- [Site & pricing](https://serper.dev)

## License

MIT
