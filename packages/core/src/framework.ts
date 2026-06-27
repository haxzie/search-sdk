import type { SearchProvider } from "./provider";
import type { WebSearch } from "./web-search";

/**
 * Context handed to a framework adapter when it builds tools. The adapter gets
 * the live `WebSearch` instance (to call `search`/`scrape`) plus the provider
 * (to gate tools by capability, e.g. omit a scrape tool for search-only
 * providers).
 */
export interface FrameworkContext {
  web: WebSearch;
  provider: SearchProvider;
}

/**
 * The contract every framework adapter implements. An adapter is created by its
 * factory (e.g. `aiSdk()`) and converts the unified search/scrape capabilities
 * into framework-native tools.
 */
export interface FrameworkAdapter<TTools = unknown> {
  readonly name: string;
  createTools(context: FrameworkContext): TTools;
}
