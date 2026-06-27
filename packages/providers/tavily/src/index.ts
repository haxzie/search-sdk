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
  normalizeExtract,
  normalizeSearch,
  type TavilyExtractPayload,
  type TavilySearchPayload,
} from "./normalize";

const optionsSchema = z.object({
  apiKey: z.string().min(1).optional(),
  baseUrl: z.string().url().optional(),
});

export interface TavilyOptions {
  /** Defaults to the `TAVILY_API_KEY` environment variable. */
  apiKey?: string;
  /** Override the API base URL (defaults to https://api.tavily.com). */
  baseUrl?: string;
}

const DEFAULT_BASE_URL = "https://api.tavily.com";
const ENV_VARS = ["TAVILY_API_KEY"];

function toTimeRange(
  range: SearchOptions["timeRange"],
): string | undefined {
  if (typeof range === "string") return range;
  return undefined;
}

export function tavily(options: TavilyOptions = {}): SearchProvider {
  const parsed = optionsSchema.parse(options);
  const apiKey = resolveApiKey({
    provider: "tavily",
    apiKey: parsed.apiKey,
    envVars: ENV_VARS,
  });
  const baseUrl = parsed.baseUrl;
  const base = (baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
  const headers = { authorization: `Bearer ${apiKey}` };

  return {
    name: "tavily",
    capabilities: { search: true, scrape: true },

    async search(opts: SearchOptions): Promise<SearchResponse> {
      const body: Record<string, unknown> = {
        query: opts.query,
        ...(opts.maxResults ? { max_results: opts.maxResults } : {}),
        ...(opts.includeDomains ? { include_domains: opts.includeDomains } : {}),
        ...(opts.excludeDomains ? { exclude_domains: opts.excludeDomains } : {}),
        ...(opts.topic ? { topic: opts.topic } : {}),
        ...(toTimeRange(opts.timeRange)
          ? { time_range: toTimeRange(opts.timeRange) }
          : {}),
        ...(opts.includeContent ? { include_raw_content: true } : {}),
        include_answer: true,
        ...opts.providerOptions,
      };

      const payload = await requestJson<TavilySearchPayload>(`${base}/search`, {
        provider: "tavily",
        method: "POST",
        headers,
        body,
      });
      return normalizeSearch(opts.query, payload);
    },

    async scrape(opts: ScrapeOptions): Promise<ScrapeResult> {
      const body: Record<string, unknown> = {
        urls: [opts.url],
        ...opts.providerOptions,
      };
      const payload = await requestJson<TavilyExtractPayload>(
        `${base}/extract`,
        { provider: "tavily", method: "POST", headers, body },
      );
      return normalizeExtract(opts.url, payload);
    },
  };
}

export type { TavilySearchPayload, TavilyExtractPayload } from "./normalize";
