export const DOCS_TITLE = "Documentation";

export const DOCS_DESCRIPTION =
  "A unified web search SDK for AI agents. Install, search, scrape, hand tools to your agent, and add providers — Firecrawl, Tavily, Exa, Brave, Serper.";

// Markdown mirror of the docs page. Used by the "Copy as Markdown" button and
// kept in sync with the JSX content below it.
export const DOCS_MARKDOWN = `# search-sdk documentation

> ${DOCS_DESCRIPTION}

## Introduction

Every web-search and scrape provider has a different API shape, auth scheme, and response format — and every agent framework has its own tool format. You end up rewriting glue for each combination. \`search-sdk\` normalizes both sides.

- **Unified output** — \`search()\` and \`scrape()\` always return the same shape, regardless of provider.
- **Plug-and-play providers** — one small factory per provider; switch by changing a single line.
- **Framework adapters** — turn the unified capabilities into framework-native tools via \`web.tools()\`.

## Installation

Install the core package plus whichever provider you need. The Vercel AI SDK adapter is built into core; add \`ai\` (v5) only if you want agent tools.

\`\`\`bash
# pnpm
pnpm add @search-sdk/core @search-sdk/firecrawl

# npm
npm install @search-sdk/core @search-sdk/firecrawl

# optional — for web.tools()
pnpm add ai
\`\`\`

Requires Node.js 18+ (uses the global fetch).

## Quick start

Pass a provider to \`WebSearch\`, then call the unified API or hand tools to your agent.

\`\`\`ts
import { WebSearch } from "@search-sdk/core";
import { firecrawl } from "@search-sdk/firecrawl";

const web = new WebSearch({
  // apiKey is optional — falls back to FIRECRAWL_API_KEY
  provider: firecrawl(),
});

// Direct, unified API
const results = await web.search({ query: "latest TypeScript release" });
const page = await web.scrape({ url: "https://example.com" });

// Or hand tools to an agent — defaults to the built-in AI SDK adapter
const tools = web.tools(); // -> { web_search, web_scrape }
\`\`\`

## Search

\`search()\` accepts a query string or an options object and resolves to a \`SearchResponse\`.

\`\`\`ts
const res = await web.search({
  query: "best TypeScript monorepo tools",
  maxResults: 5,
  includeDomains: ["github.com"],
  timeRange: "month",
  includeContent: true, // pull page content into each result (when supported)
});

for (const r of res.results) {
  console.log(r.title, r.url, r.snippet);
}

// A bare string works too:
await web.search("typescript 5.7 release notes");
\`\`\`

Pass provider-specific knobs that aren't part of the unified API through \`providerOptions\` — they're forwarded verbatim to the provider.

\`\`\`ts
await web.search({
  query: "rust async runtimes",
  providerOptions: { search_depth: "advanced" },
});
\`\`\`

## Scrape

\`scrape()\` resolves to a \`ScrapeResult\`. It throws a \`WebSearchError\` if the active provider doesn't support scraping (e.g. Brave, Serper).

\`\`\`ts
const page = await web.scrape({
  url: "https://example.com/article",
  formats: ["markdown"],
  onlyMainContent: true,
});

console.log(page.title);
console.log(page.markdown);
\`\`\`

## Tools for agents

\`web.tools()\` returns a Vercel AI SDK \`ToolSet\` you can pass straight into \`generateText\` / \`streamText\`. The AI SDK adapter is built into core and used by default — no extra package or \`framework\` option required.

\`\`\`ts
import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  tools: web.tools(), // default AI SDK tools
  stopWhen: stepCountIs(5),
  prompt: "Find the latest stable pnpm version and summarize what changed.",
});
\`\`\`

See [Adapters](/adapters) for customizing tool names or targeting other frameworks.

## Error handling

Errors are normalized to \`WebSearchError\` (with \`provider\` and optional \`status\`), so you can handle failures uniformly. A missing key throws \`MissingApiKeyError\`.

\`\`\`ts
import { MissingApiKeyError, isMissingApiKeyError } from "@search-sdk/core";

try {
  const web = new WebSearch({ provider: tavily() });
} catch (err) {
  if (isMissingApiKeyError(err)) {
    console.error(err.message); // No API key provided for "tavily". ...
    console.error(err.envVars); // ["TAVILY_API_KEY"]
  }
}
\`\`\`

## Unified types

\`search()\` resolves to a \`SearchResponse\`; \`scrape()\` to a \`ScrapeResult\`.

\`\`\`ts
interface SearchResponse {
  query: string;
  provider: string;            // e.g. "firecrawl"
  results: SearchResult[];
  answer?: string;             // synthesized answer when available
  images?: { url: string; description?: string }[];
  responseTime?: number;
  raw?: unknown;               // untouched provider payload
}

interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  content?: string;            // present when includeContent is set
  publishedDate?: string;
  author?: string;
  score?: number;
  favicon?: string;
  image?: string;
  source?: string;
  raw?: unknown;
}
\`\`\`

## Architecture

\`core\` is provider-agnostic and ships the AI SDK adapter as the default framework; providers depend only on core. Adding a provider or framework is purely additive.

\`\`\`
@search-sdk/core         WebSearch class + unified types + provider
                            contracts + built-in Vercel AI SDK adapter
@search-sdk/<provider>   firecrawl · tavily · exa · brave · serper
\`\`\`

## Adding a provider

Implement the \`SearchProvider\` contract from core, add a pure \`normalize*\` function that maps the raw response to the unified types, and unit-test it with a mocked fetch. No changes to core are required.

\`\`\`ts
import type { SearchProvider } from "@search-sdk/core";

export function myProvider(opts: { apiKey: string }): SearchProvider {
  return {
    name: "my-provider",
    capabilities: { search: true, scrape: false },
    async search(options) {
      // call API, return normalizeSearch(...)
    },
  };
}
\`\`\`
`;
