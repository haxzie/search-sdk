export interface ProviderInfo {
  id: string;
  name: string;
  pkg: string;
  factory: string;
  search: boolean;
  scrape: boolean | string;
  envVar: string;
  url: string;
  keyUrl: string;
  blurb: string;
  answer?: boolean;
}

export const providers: ProviderInfo[] = [
  {
    id: "firecrawl",
    name: "Firecrawl",
    pkg: "@websearch-sdk/firecrawl",
    factory: "firecrawl",
    search: true,
    scrape: true,
    envVar: "FIRECRAWL_API_KEY",
    url: "https://firecrawl.dev",
    keyUrl: "https://firecrawl.dev",
    blurb:
      "Search and full-page scraping with clean markdown output. The most complete provider — supports both search and scrape.",
  },
  {
    id: "tavily",
    name: "Tavily",
    pkg: "@websearch-sdk/tavily",
    factory: "tavily",
    search: true,
    scrape: "extract",
    envVar: "TAVILY_API_KEY",
    url: "https://tavily.com",
    keyUrl: "https://tavily.com",
    answer: true,
    blurb:
      "Search built for LLMs with optional synthesized answers and content extraction from result URLs.",
  },
  {
    id: "exa",
    name: "Exa",
    pkg: "@websearch-sdk/exa",
    factory: "exa",
    search: true,
    scrape: "contents",
    envVar: "EXA_API_KEY",
    url: "https://exa.ai",
    keyUrl: "https://exa.ai",
    answer: true,
    blurb:
      "Neural, embeddings-based search with page contents retrieval and synthesized answers.",
  },
  {
    id: "brave",
    name: "Brave",
    pkg: "@websearch-sdk/brave",
    factory: "brave",
    search: true,
    scrape: false,
    envVar: "BRAVE_API_KEY",
    url: "https://brave.com/search/api/",
    keyUrl: "https://brave.com/search/api/",
    blurb:
      "Independent web index with fast, privacy-first search results. Search only.",
  },
  {
    id: "serper",
    name: "Serper",
    pkg: "@websearch-sdk/serper",
    factory: "serper",
    search: true,
    scrape: false,
    envVar: "SERPER_API_KEY",
    url: "https://serper.dev",
    keyUrl: "https://serper.dev",
    answer: true,
    blurb:
      "Fast, affordable Google SERP results with knowledge-graph answers. Search only.",
  },
];

export interface AdapterInfo {
  id: string;
  name: string;
  status: "Built-in" | "Community" | "Custom";
  blurb: string;
  toolset: string;
}

export const adapters: AdapterInfo[] = [
  {
    id: "ai-sdk",
    name: "Vercel AI SDK",
    status: "Built-in",
    toolset: "{ web_search, web_scrape }",
    blurb:
      "Shipped inside core and used by default. web.tools() returns a Vercel AI SDK ToolSet you can pass straight into generateText / streamText.",
  },
  {
    id: "custom",
    name: "Custom adapter",
    status: "Custom",
    toolset: "FrameworkAdapter",
    blurb:
      "Implement the FrameworkAdapter contract to target any agent framework while reusing the exact same provider and unified API.",
  },
];

export const stats = [
  { value: "5", label: "Providers" },
  { value: "1", label: "Unified API" },
  { value: "ESM + CJS", label: "Dual builds" },
  { value: "0", label: "Heavy deps" },
];
