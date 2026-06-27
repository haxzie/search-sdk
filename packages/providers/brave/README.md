# @search-sdk/brave

[Brave Search API](https://brave.com/search/api/) provider for [`websearch-sdk`](https://github.com/haxzie/websearch-sdk) — web search backed by Brave's **own independent index** (not reselling Google/Bing), with a strong privacy stance.

> **Search-only.** Brave returns snippets and metadata, not full page content. Pair it with a scrape-capable provider (Firecrawl, Tavily, Exa) if you need page bodies. `web.scrape()` and the `web_scrape` tool are not available with this provider.

## Install

```bash
pnpm add @search-sdk/core @search-sdk/brave
```

## Get an API key

1. Go to the **[API dashboard](https://api-dashboard.search.brave.com)** and sign up / log in.
2. Subscribe to a plan (e.g. "Data for Search"). **A credit card is required at signup**, even to use the included monthly credit.
3. Open **API Keys** and generate a key — this is your **subscription token**, sent in the `X-Subscription-Token` header.

As of 2026 Brave uses **metered billing**: every plan includes ~$5 of free credit per month (roughly 1,000 requests on the entry plan, and claiming it requires attributing Brave Search on your site), then bills per request (~$5 / 1,000 requests). See **[pricing](https://api-dashboard.search.brave.com/documentation/pricing)**. _Pricing is subject to change — verify before relying on the free credit._

## Usage

`apiKey` is optional — it falls back to the `BRAVE_API_KEY` (or `BRAVE_SEARCH_API_KEY`) environment variable.

```ts
import { WebSearch } from "@search-sdk/core";
import { brave } from "@search-sdk/brave";

const web = new WebSearch({
  provider: brave({ apiKey: process.env.BRAVE_API_KEY }), // or just brave()
});

const { results } = await web.search({
  query: "privacy-friendly search engines",
  maxResults: 10,
  country: "us",
  safeSearch: "moderate",
  timeRange: "week", // mapped to Brave's freshness param
});
for (const r of results) console.log(r.title, r.url, r.snippet);
```

### As AI SDK tools

```ts
import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  tools: web.tools(), // { web_search } only — Brave does not scrape
  stopWhen: stepCountIs(5),
  prompt: "What's the latest news on the EU AI Act?",
});
```

## Capabilities

| Search | Scrape | Auth | Env variable |
| :---: | :---: | --- | --- |
| ✅ | — | `X-Subscription-Token: <key>` | `BRAVE_API_KEY` / `BRAVE_SEARCH_API_KEY` |

Supported unified options: `maxResults` (`count`, max 20), `country`, `language` (`search_lang`), `safeSearch`, `timeRange` (`freshness`). Brave-specific params (e.g. `extra_snippets`, `offset`) can be passed via `providerOptions`.

## Links

- [API overview](https://brave.com/search/api/)
- [Web search reference](https://api-dashboard.search.brave.com/api-reference/web/search/get)
- [Pricing](https://api-dashboard.search.brave.com/documentation/pricing)
- [Dashboard](https://api-dashboard.search.brave.com)

## License

MIT
