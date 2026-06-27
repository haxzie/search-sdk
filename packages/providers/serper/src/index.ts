import { requestJson, resolveApiKey } from "@search-sdk/core";
import type {
  SearchOptions,
  SearchProvider,
  SearchResponse,
} from "@search-sdk/core";
import { z } from "zod";
import { normalizeSearch, type SerperSearchPayload } from "./normalize";

const optionsSchema = z.object({
  apiKey: z.string().min(1).optional(),
  baseUrl: z.string().url().optional(),
});

export interface SerperOptions {
  /** Defaults to the `SERPER_API_KEY` environment variable. */
  apiKey?: string;
  /** Override the API base URL (defaults to https://google.serper.dev). */
  baseUrl?: string;
}

const DEFAULT_BASE_URL = "https://google.serper.dev";
const ENV_VARS = ["SERPER_API_KEY"];

const TBS: Record<string, string> = {
  day: "qdr:d",
  week: "qdr:w",
  month: "qdr:m",
  year: "qdr:y",
};

export function serper(options: SerperOptions = {}): SearchProvider {
  const parsed = optionsSchema.parse(options);
  const apiKey = resolveApiKey({
    provider: "serper",
    apiKey: parsed.apiKey,
    envVars: ENV_VARS,
  });
  const baseUrl = parsed.baseUrl;
  const base = (baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");

  return {
    name: "serper",
    capabilities: { search: true, scrape: false },

    async search(opts: SearchOptions): Promise<SearchResponse> {
      const body: Record<string, unknown> = {
        q: opts.query,
        ...(opts.maxResults ? { num: opts.maxResults } : {}),
        ...(opts.country ? { gl: opts.country } : {}),
        ...(opts.language ? { hl: opts.language } : {}),
        ...(typeof opts.timeRange === "string" && TBS[opts.timeRange]
          ? { tbs: TBS[opts.timeRange] }
          : {}),
        ...opts.providerOptions,
      };

      const endpoint = opts.topic === "news" ? "/news" : "/search";
      const payload = await requestJson<SerperSearchPayload>(
        `${base}${endpoint}`,
        {
          provider: "serper",
          method: "POST",
          headers: { "x-api-key": apiKey },
          body,
        },
      );
      return normalizeSearch(opts.query, payload);
    },
  };
}

export type { SerperSearchPayload } from "./normalize";
