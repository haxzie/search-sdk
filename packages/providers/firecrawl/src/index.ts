import { requestJson, resolveApiKey } from "@websearch-sdk/core";
import type {
  ScrapeOptions,
  ScrapeResult,
  SearchOptions,
  SearchProvider,
  SearchResponse,
} from "@websearch-sdk/core";
import { z } from "zod";
import {
  normalizeScrape,
  normalizeSearch,
  type FirecrawlScrapePayload,
  type FirecrawlSearchPayload,
} from "./normalize";

const optionsSchema = z.object({
  apiKey: z.string().min(1).optional(),
  baseUrl: z.string().url().optional(),
});

export interface FirecrawlOptions {
  /** Defaults to the `FIRECRAWL_API_KEY` environment variable. */
  apiKey?: string;
  /** Override the API base URL (defaults to https://api.firecrawl.dev). */
  baseUrl?: string;
}

const DEFAULT_BASE_URL = "https://api.firecrawl.dev";
const ENV_VARS = ["FIRECRAWL_API_KEY"];

export function firecrawl(options: FirecrawlOptions = {}): SearchProvider {
  const parsed = optionsSchema.parse(options);
  const apiKey = resolveApiKey({
    provider: "firecrawl",
    apiKey: parsed.apiKey,
    envVars: ENV_VARS,
  });
  const baseUrl = parsed.baseUrl;
  const base = (baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
  const headers = { authorization: `Bearer ${apiKey}` };

  return {
    name: "firecrawl",
    capabilities: { search: true, scrape: true },

    async search(opts: SearchOptions): Promise<SearchResponse> {
      const body: Record<string, unknown> = {
        query: opts.query,
        ...(opts.maxResults ? { limit: opts.maxResults } : {}),
        ...(opts.country ? { location: opts.country } : {}),
        ...(opts.timeRange && typeof opts.timeRange === "string"
          ? { tbs: { day: "qdr:d", week: "qdr:w", month: "qdr:m", year: "qdr:y" }[opts.timeRange] }
          : {}),
        // Pull page content into results when requested.
        ...(opts.includeContent
          ? { scrapeOptions: { formats: ["markdown"], onlyMainContent: true } }
          : {}),
        ...opts.providerOptions,
      };

      const payload = await requestJson<FirecrawlSearchPayload>(
        `${base}/v2/search`,
        { provider: "firecrawl", method: "POST", headers, body },
      );
      return normalizeSearch(opts.query, payload);
    },

    async scrape(opts: ScrapeOptions): Promise<ScrapeResult> {
      const body: Record<string, unknown> = {
        url: opts.url,
        formats: opts.formats ?? ["markdown"],
        ...(opts.onlyMainContent !== undefined
          ? { onlyMainContent: opts.onlyMainContent }
          : {}),
        ...(opts.includeTags ? { includeTags: opts.includeTags } : {}),
        ...(opts.excludeTags ? { excludeTags: opts.excludeTags } : {}),
        ...(opts.waitFor ? { waitFor: opts.waitFor } : {}),
        ...(opts.timeout ? { timeout: opts.timeout } : {}),
        ...opts.providerOptions,
      };

      const payload = await requestJson<FirecrawlScrapePayload>(
        `${base}/v2/scrape`,
        { provider: "firecrawl", method: "POST", headers, body },
      );
      return normalizeScrape(opts.url, payload);
    },
  };
}

export type { FirecrawlSearchPayload, FirecrawlScrapePayload } from "./normalize";
