import { hostnameOf } from "@search-sdk/core";
import type {
  ScrapeResult,
  SearchResponse,
  SearchResult,
} from "@search-sdk/core";

export interface ExaResultItem {
  id?: string;
  title?: string;
  url: string;
  publishedDate?: string;
  author?: string;
  score?: number;
  image?: string;
  favicon?: string;
  text?: string;
}

export interface ExaSearchPayload {
  results?: ExaResultItem[];
  requestId?: string;
}

export interface ExaContentsPayload {
  results?: ExaResultItem[];
}

export function normalizeSearch(
  query: string,
  payload: ExaSearchPayload,
): SearchResponse {
  const results: SearchResult[] = (payload.results ?? []).map((item) => ({
    title: item.title ?? item.url,
    url: item.url,
    snippet: item.text ? item.text.slice(0, 300) : undefined,
    content: item.text,
    publishedDate: item.publishedDate,
    author: item.author,
    score: item.score,
    image: item.image,
    favicon: item.favicon,
    source: hostnameOf(item.url),
    raw: item,
  }));

  return { query, provider: "exa", results, raw: payload };
}

export function normalizeContents(
  url: string,
  payload: ExaContentsPayload,
): ScrapeResult {
  const match = payload.results?.find((r) => r.url === url) ?? payload.results?.[0];
  return {
    url,
    title: match?.title,
    content: match?.text,
    markdown: match?.text,
    author: match?.author,
    publishedDate: match?.publishedDate,
    raw: payload,
  };
}
