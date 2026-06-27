import type { ToolSet } from "ai";
import { WebSearchError } from "./errors";
import type { FrameworkAdapter } from "./framework";
import { aiSdk } from "./frameworks/ai-sdk";
import type { SearchProvider } from "./provider";
import type {
  ScrapeOptions,
  ScrapeResult,
  SearchOptions,
  SearchResponse,
} from "./types";

export interface WebSearchConfig<TFramework extends FrameworkAdapter> {
  provider: SearchProvider;
  /**
   * Framework adapter used by {@link WebSearch.tools}. Defaults to the built-in
   * Vercel AI SDK adapter ({@link aiSdk}) when omitted.
   */
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
  TFramework extends FrameworkAdapter = FrameworkAdapter<ToolSet>,
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

  /**
   * Build framework-native tools. Uses the configured framework adapter, or the
   * built-in Vercel AI SDK adapter ({@link aiSdk}) when none was provided.
   */
  tools(): ReturnType<TFramework["createTools"]> {
    const framework = this.framework ?? (aiSdk() as unknown as TFramework);
    return framework.createTools({
      web: this as WebSearch,
      provider: this.provider,
    }) as ReturnType<TFramework["createTools"]>;
  }
}
