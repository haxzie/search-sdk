import { hostnameOf } from "@search-sdk/core";
import type { SearchResponse, SearchResult } from "@search-sdk/core";

export interface SerperOrganicItem {
  title?: string;
  link: string;
  snippet?: string;
  position?: number;
  date?: string;
  imageUrl?: string;
}

export interface SerperSearchPayload {
  organic?: SerperOrganicItem[];
  answerBox?: { answer?: string; snippet?: string };
  knowledgeGraph?: { description?: string };
  images?: { imageUrl?: string; title?: string }[];
}

export function normalizeSearch(
  query: string,
  payload: SerperSearchPayload,
): SearchResponse {
  const results: SearchResult[] = (payload.organic ?? []).map((item) => ({
    title: item.title ?? item.link,
    url: item.link,
    snippet: item.snippet,
    publishedDate: item.date,
    image: item.imageUrl,
    score: item.position,
    source: hostnameOf(item.link),
    raw: item,
  }));

  const answer =
    payload.answerBox?.answer ??
    payload.answerBox?.snippet ??
    payload.knowledgeGraph?.description;

  return {
    query,
    provider: "serper",
    results,
    answer,
    images: (payload.images ?? [])
      .map((img) => ({ url: img.imageUrl ?? "", description: img.title }))
      .filter((img) => img.url),
    raw: payload,
  };
}
