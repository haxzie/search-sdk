import type {
  ScrapeOptions,
  ScrapeResult,
  SearchOptions,
  SearchResponse,
} from "./types";

export interface ProviderCapabilities {
  search: boolean;
  scrape: boolean;
}

/**
 * The contract every provider package implements. A provider is created by its
 * factory (e.g. `firecrawl({ apiKey })`) and knows how to talk to one backend
 * and normalize the response into the unified types.
 */
export interface SearchProvider {
  /** Stable provider identifier, e.g. "firecrawl". */
  readonly name: string;
  /** Which operations this provider supports. */
  readonly capabilities: ProviderCapabilities;
  search(options: SearchOptions): Promise<SearchResponse>;
  /** Present only when `capabilities.scrape` is true. */
  scrape?(options: ScrapeOptions): Promise<ScrapeResult>;
}
