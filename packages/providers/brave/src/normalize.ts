import { hostnameOf } from "@search-sdk/core";
import type { SearchResponse, SearchResult } from "@search-sdk/core";

export interface BraveWebResult {
  title?: string;
  url: string;
  description?: string;
  age?: string;
  page_age?: string;
  thumbnail?: { src?: string };
  meta_url?: { favicon?: string };
  profile?: { name?: string };
}

export interface BraveSearchPayload {
  web?: { results?: BraveWebResult[] };
}

export function normalizeSearch(
  query: string,
  payload: BraveSearchPayload,
): SearchResponse {
  const results: SearchResult[] = (payload.web?.results ?? []).map((item) => ({
    title: item.title ?? item.url,
    url: item.url,
    snippet: item.description,
    publishedDate: item.page_age ?? item.age,
    image: item.thumbnail?.src,
    favicon: item.meta_url?.favicon,
    source: item.profile?.name ?? hostnameOf(item.url),
    raw: item,
  }));

  return { query, provider: "brave", results, raw: payload };
}
