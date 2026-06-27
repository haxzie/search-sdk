import { hostnameOf } from "@search-sdk/core";
import type {
  ScrapeResult,
  SearchResponse,
  SearchResult,
} from "@search-sdk/core";

export interface TavilySearchResultItem {
  title?: string;
  url: string;
  content?: string;
  raw_content?: string;
  score?: number;
  published_date?: string;
}

export interface TavilySearchPayload {
  query?: string;
  answer?: string;
  results?: TavilySearchResultItem[];
  images?: ({ url: string; description?: string } | string)[];
  response_time?: number;
}

export interface TavilyExtractPayload {
  results?: {
    url: string;
    raw_content?: string;
    images?: string[];
  }[];
  failed_results?: { url: string; error?: string }[];
}

export function normalizeSearch(
  query: string,
  payload: TavilySearchPayload,
): SearchResponse {
  const results: SearchResult[] = (payload.results ?? []).map((item) => ({
    title: item.title ?? item.url,
    url: item.url,
    snippet: item.content,
    content: item.raw_content,
    score: item.score,
    publishedDate: item.published_date,
    source: hostnameOf(item.url),
    raw: item,
  }));

  return {
    query,
    provider: "tavily",
    results,
    answer: payload.answer,
    images: (payload.images ?? []).map((img) =>
      typeof img === "string"
        ? { url: img }
        : { url: img.url, description: img.description },
    ),
    responseTime: payload.response_time,
    raw: payload,
  };
}

export function normalizeExtract(
  url: string,
  payload: TavilyExtractPayload,
): ScrapeResult {
  const match = payload.results?.find((r) => r.url === url) ?? payload.results?.[0];
  return {
    url,
    content: match?.raw_content,
    markdown: match?.raw_content,
    raw: payload,
  };
}
