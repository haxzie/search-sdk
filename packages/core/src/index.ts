export { WebSearch } from "./web-search";
export type { WebSearchConfig } from "./web-search";

export {
  WebSearchError,
  isWebSearchError,
  MissingApiKeyError,
  isMissingApiKeyError,
} from "./errors";

export { resolveApiKey } from "./env";
export type { ResolveApiKeyOptions } from "./env";

export type { SearchProvider, ProviderCapabilities } from "./provider";
export type { FrameworkAdapter, FrameworkContext } from "./framework";

export type {
  SearchOptions,
  SearchResult,
  SearchResponse,
  SearchResultImage,
  SearchTopic,
  SafeSearch,
  TimeRange,
  ScrapeOptions,
  ScrapeResult,
  ScrapeFormat,
} from "./types";

// Shared helpers for provider authors.
export { requestJson } from "./http";
export type { RequestJsonOptions } from "./http";
export { hostnameOf } from "./utils";
