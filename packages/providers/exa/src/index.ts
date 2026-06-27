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
  normalizeContents,
  normalizeSearch,
  type ExaContentsPayload,
  type ExaSearchPayload,
} from "./normalize";

const optionsSchema = z.object({
  apiKey: z.string().min(1).optional(),
  baseUrl: z.string().url().optional(),
});

export interface ExaOptions {
  /** Defaults to the `EXA_API_KEY` environment variable. */
  apiKey?: string;
  /** Override the API base URL (defaults to https://api.exa.ai). */
  baseUrl?: string;
}

const DEFAULT_BASE_URL = "https://api.exa.ai";
const ENV_VARS = ["EXA_API_KEY"];

function startDateFor(range: SearchOptions["timeRange"]): string | undefined {
  if (!range || typeof range === "string") {
    if (!range) return undefined;
    const now = Date.now();
    const day = 86_400_000;
    const offsets: Record<string, number> = {
      day,
      week: 7 * day,
      month: 30 * day,
      year: 365 * day,
    };
    return new Date(now - (offsets[range] ?? 0)).toISOString();
  }
  return range.start;
}

export function exa(options: ExaOptions = {}): SearchProvider {
  const parsed = optionsSchema.parse(options);
  const apiKey = resolveApiKey({
    provider: "exa",
    apiKey: parsed.apiKey,
    envVars: ENV_VARS,
  });
  const baseUrl = parsed.baseUrl;
  const base = (baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
  const headers = { "x-api-key": apiKey };

  return {
    name: "exa",
    capabilities: { search: true, scrape: true },

    async search(opts: SearchOptions): Promise<SearchResponse> {
      const start = startDateFor(opts.timeRange);
      const end =
        opts.timeRange && typeof opts.timeRange === "object"
          ? opts.timeRange.end
          : undefined;

      const body: Record<string, unknown> = {
        query: opts.query,
        ...(opts.maxResults ? { numResults: opts.maxResults } : {}),
        ...(opts.includeDomains ? { includeDomains: opts.includeDomains } : {}),
        ...(opts.excludeDomains ? { excludeDomains: opts.excludeDomains } : {}),
        ...(start ? { startPublishedDate: start } : {}),
        ...(end ? { endPublishedDate: end } : {}),
        ...(opts.includeContent ? { contents: { text: true } } : {}),
        ...opts.providerOptions,
      };

      const payload = await requestJson<ExaSearchPayload>(`${base}/search`, {
        provider: "exa",
        method: "POST",
        headers,
        body,
      });
      return normalizeSearch(opts.query, payload);
    },

    async scrape(opts: ScrapeOptions): Promise<ScrapeResult> {
      const body: Record<string, unknown> = {
        urls: [opts.url],
        text: true,
        ...opts.providerOptions,
      };
      const payload = await requestJson<ExaContentsPayload>(`${base}/contents`, {
        provider: "exa",
        method: "POST",
        headers,
        body,
      });
      return normalizeContents(opts.url, payload);
    },
  };
}

export type { ExaSearchPayload, ExaContentsPayload } from "./normalize";
