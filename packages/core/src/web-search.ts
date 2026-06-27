import { WebSearchError } from "./errors";
import type { FrameworkAdapter } from "./framework";
import type { SearchProvider } from "./provider";
import type {
  ScrapeOptions,
  ScrapeResult,
  SearchOptions,
  SearchResponse,
} from "./types";

export interface WebSearchConfig<TFramework extends FrameworkAdapter> {
  provider: SearchProvider;
  framework?: TFramework;
}

/**
 * The unified entry point. Wraps a provider (and optionally a framework
 * adapter) behind a single, stable API:
 *
 * ```ts
 * const web = new WebSearch({ provider: firecrawl({ apiKey }), framework: aiSdk() });
 * const results = await web.search("latest TS releases");
 * const page = await web.scrape("https://example.com");
 * const tools = web.tools();
 * ```
 */
export class WebSearch<
  TFramework extends FrameworkAdapter = FrameworkAdapter,
> {
  readonly provider: SearchProvider;
  private readonly framework?: TFramework;

  constructor(config: WebSearchConfig<TFramework>) {
    this.provider = config.provider;
    this.framework = config.framework;
  }

  /** Run a web search. A bare string is treated as the query. */
  async search(input: string | SearchOptions): Promise<SearchResponse> {
    const options = typeof input === "string" ? { query: input } : input;
    return this.provider.search(options);
  }

  /** Scrape a single URL. A bare string is treated as the URL. */
  async scrape(input: string | ScrapeOptions): Promise<ScrapeResult> {
    if (!this.provider.capabilities.scrape || !this.provider.scrape) {
      throw new WebSearchError(
        `Provider "${this.provider.name}" does not support scrape.`,
        { provider: this.provider.name },
      );
    }
    const options = typeof input === "string" ? { url: input } : input;
    return this.provider.scrape(options);
  }

  /** Build framework-native tools from the configured framework adapter. */
  tools(): ReturnType<TFramework["createTools"]> {
    if (!this.framework) {
      throw new WebSearchError(
        "No framework adapter configured. Pass one to the WebSearch constructor, e.g. `new WebSearch({ provider, framework: aiSdk() })`.",
        { provider: this.provider.name },
      );
    }
    return this.framework.createTools({
      web: this,
      provider: this.provider,
    }) as ReturnType<TFramework["createTools"]>;
  }
}
