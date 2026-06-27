# @search-sdk/firecrawl

[Firecrawl](https://firecrawl.dev) provider for [`websearch-sdk`](https://github.com/haxzie/websearch-sdk) — a web-data API for AI that does both **web search** and **single-URL scraping** (markdown / HTML / screenshots), returning LLM-ready content.

## Install

```bash
pnpm add @search-sdk/core @search-sdk/firecrawl
```

## No key required (keyless)

Firecrawl offers a **[keyless free tier](https://www.firecrawl.dev/blog/firecrawl-keyless-launch)**: `search` and `scrape` work with **no API key** (rate-limited). This provider runs keyless automatically when no key is supplied — great for getting started or quick demos:

```ts
const web = new WebSearch({ provider: firecrawl() }); // no key needed
await web.search({ query: "hello world" });
```

The keyless tier is rate-limited and meant as a fallback — add a key as soon as you have one.

## Get an API key (recommended)

1. Sign up at **[firecrawl.dev](https://www.firecrawl.dev)** (no credit card required).
2. Open the **[dashboard](https://www.firecrawl.dev/app)** → **API Keys**.
3. Copy your key — it starts with `fc-`. It's shown once, so store it safely.

The free plan includes **1,000 credits/month** (search = 2 credits per 10 results; scrape = 1 credit per page). Heavier features cost more; see **[pricing](https://www.firecrawl.dev/pricing)**. _Pricing is subject to change._

## Usage

`apiKey` is optional — it falls back to the `FIRECRAWL_API_KEY` environment variable, and if no key is found it runs keyless (see above).

```ts
import { WebSearch } from "@search-sdk/core";
import { firecrawl } from "@search-sdk/firecrawl";

const web = new WebSearch({
  provider: firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY }), // or just firecrawl()
});

// Search
const { results } = await web.search({
  query: "best TypeScript monorepo tools",
  maxResults: 5,
  includeContent: true, // pull page markdown into each result
});
for (const r of results) console.log(r.title, r.url);

// Scrape a single URL
const page = await web.scrape({
  url: "https://example.com/article",
  formats: ["markdown"],
  onlyMainContent: true,
});
console.log(page.markdown);
```

### As AI SDK tools

```ts
import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  tools: web.tools(), // { web_search, web_scrape }
  stopWhen: stepCountIs(5),
  prompt: "Summarize the latest pnpm release notes.",
});
```

## Capabilities

| Search | Scrape | Auth | Env variable |
| :---: | :---: | --- | --- |
| ✅ | ✅ | `Authorization: Bearer fc-...` | `FIRECRAWL_API_KEY` |

Firecrawl-specific request options (e.g. `crawl`/`extract` knobs, `proxy`, `actions`) can be passed through `providerOptions` on `search()` / `scrape()`.

## Links

- [API reference](https://docs.firecrawl.dev/introduction)
- [Pricing](https://www.firecrawl.dev/pricing)
- [Rate limits](https://docs.firecrawl.dev/rate-limits)
- [Dashboard](https://www.firecrawl.dev/app)

## License

MIT
