import { requestJson, resolveApiKey } from "@websearch-sdk/core";
import type {
  SearchOptions,
  SearchProvider,
  SearchResponse,
} from "@websearch-sdk/core";
import { z } from "zod";
import { normalizeSearch, type BraveSearchPayload } from "./normalize";

const optionsSchema = z.object({
  apiKey: z.string().min(1).optional(),
  baseUrl: z.string().url().optional(),
});

export interface BraveOptions {
  /** Defaults to the `BRAVE_API_KEY` (or `BRAVE_SEARCH_API_KEY`) environment variable. */
  apiKey?: string;
  /** Override the API base URL (defaults to https://api.search.brave.com). */
  baseUrl?: string;
}

const DEFAULT_BASE_URL = "https://api.search.brave.com";
const ENV_VARS = ["BRAVE_API_KEY", "BRAVE_SEARCH_API_KEY"];

const FRESHNESS: Record<string, string> = {
  day: "pd",
  week: "pw",
  month: "pm",
  year: "py",
};

export function brave(options: BraveOptions = {}): SearchProvider {
  const parsed = optionsSchema.parse(options);
  const apiKey = resolveApiKey({
    provider: "brave",
    apiKey: parsed.apiKey,
    envVars: ENV_VARS,
  });
  const baseUrl = parsed.baseUrl;
  const base = (baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");

  return {
    name: "brave",
    capabilities: { search: true, scrape: false },

    async search(opts: SearchOptions): Promise<SearchResponse> {
      const params = new URLSearchParams({ q: opts.query });
      if (opts.maxResults) params.set("count", String(opts.maxResults));
      if (opts.country) params.set("country", opts.country);
      if (opts.language) params.set("search_lang", opts.language);
      if (opts.safeSearch) params.set("safesearch", opts.safeSearch);
      if (typeof opts.timeRange === "string" && FRESHNESS[opts.timeRange]) {
        params.set("freshness", FRESHNESS[opts.timeRange]!);
      }
      for (const [key, value] of Object.entries(opts.providerOptions ?? {})) {
        params.set(key, String(value));
      }

      const payload = await requestJson<BraveSearchPayload>(
        `${base}/res/v1/web/search?${params.toString()}`,
        {
          provider: "brave",
          method: "GET",
          headers: {
            "x-subscription-token": apiKey,
            "accept-encoding": "gzip",
          },
        },
      );
      return normalizeSearch(opts.query, payload);
    },
  };
}

export type { BraveSearchPayload } from "./normalize";
