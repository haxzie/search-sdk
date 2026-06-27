/**
 * Unified, provider-agnostic types. Every provider normalizes its native API
 * response into these shapes, so consumers get an identical structure no matter
 * which search backend is plugged in.
 */

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export type TimeRange =
  | "day"
  | "week"
  | "month"
  | "year"
  | { start?: string; end?: string };

export type SafeSearch = "off" | "moderate" | "strict";

export type SearchTopic = "general" | "news";

export interface SearchOptions {
  /** The search query. */
  query: string;
  /** Maximum number of results to return. */
  maxResults?: number;
  /** Only return results from these domains (e.g. ["github.com"]). */
  includeDomains?: string[];
  /** Exclude results from these domains. */
  excludeDomains?: string[];
  /** ISO-3166 alpha-2 country code to localize results (e.g. "us"). */
  country?: string;
  /** BCP-47 / locale language code (e.g. "en"). */
  language?: string;
  /** Restrict results to a relative or absolute time range. */
  timeRange?: TimeRange;
  /** Safe-search level. */
  safeSearch?: SafeSearch;
  /** Result category. */
  topic?: SearchTopic;
  /**
   * Pull full page content (markdown/raw text) into each result when the
   * provider supports it. Costs more credits / latency on most providers.
   */
  includeContent?: boolean;
  /** Escape hatch for provider-specific knobs not covered by the unified API. */
  providerOptions?: Record<string, unknown>;
}

export interface SearchResultImage {
  url: string;
  description?: string;
}

export interface SearchResult {
  title: string;
  url: string;
  /** Short description / snippet. */
  snippet?: string;
  /** Full / raw markdown content, present only when `includeContent` is set. */
  content?: string;
  /** ISO 8601 publish date when known. */
  publishedDate?: string;
  author?: string;
  /** Relevance score (0..1) when the provider returns one. */
  score?: number;
  favicon?: string;
  /** A representative image for the result. */
  image?: string;
  /** Hostname of the result URL. */
  source?: string;
  /** The untouched provider object, for power users. */
  raw?: unknown;
}

export interface SearchResponse {
  query: string;
  /** Name of the provider that produced this response. */
  provider: string;
  results: SearchResult[];
  /** LLM-generated answer (Tavily / Exa / Perplexity-style), when requested. */
  answer?: string;
  images?: SearchResultImage[];
  /** Wall-clock time the provider reported, in seconds. */
  responseTime?: number;
  /** The untouched provider payload. */
  raw?: unknown;
}

// ---------------------------------------------------------------------------
// Scrape
// ---------------------------------------------------------------------------

export type ScrapeFormat =
  | "markdown"
  | "html"
  | "rawHtml"
  | "links"
  | "screenshot";

export interface ScrapeOptions {
  url: string;
  /** Output formats to request. Defaults to ["markdown"]. */
  formats?: ScrapeFormat[];
  /** Strip nav/header/footer/boilerplate and return only the main content. */
  onlyMainContent?: boolean;
  /** Only include content within these HTML tags. */
  includeTags?: string[];
  /** Exclude content within these HTML tags. */
  excludeTags?: string[];
  /** Milliseconds to wait for the page to settle before scraping. */
  waitFor?: number;
  /** Request timeout in milliseconds. */
  timeout?: number;
  /** Escape hatch for provider-specific knobs. */
  providerOptions?: Record<string, unknown>;
}

export interface ScrapeResult {
  url: string;
  title?: string;
  markdown?: string;
  html?: string;
  rawHtml?: string;
  /** Best-available text content (markdown if present, else extracted text). */
  content?: string;
  links?: string[];
  /** Screenshot URL or base64 data URI. */
  screenshot?: string;
  metadata?: Record<string, unknown>;
  publishedDate?: string;
  author?: string;
  /** The untouched provider payload. */
  raw?: unknown;
}
