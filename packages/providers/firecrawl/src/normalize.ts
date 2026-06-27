import { hostnameOf } from "@search-sdk/core";
import type {
  ScrapeResult,
  SearchResponse,
  SearchResult,
} from "@search-sdk/core";

/** Raw shapes (a subset of Firecrawl's v2 API responses). */
export interface FirecrawlSearchItem {
  url: string;
  title?: string;
  description?: string;
  markdown?: string;
  metadata?: { sourceURL?: string; statusCode?: number } & Record<
    string,
    unknown
  >;
}

export interface FirecrawlSearchPayload {
  success?: boolean;
  /** v2 returns `data` as either an array or an object grouped by source. */
  data?:
    | FirecrawlSearchItem[]
    | {
        web?: FirecrawlSearchItem[];
        news?: FirecrawlSearchItem[];
        images?: { url?: string; imageUrl?: string; title?: string }[];
      };
}

export interface FirecrawlScrapePayload {
  success?: boolean;
  data?: {
    markdown?: string;
    html?: string;
    rawHtml?: string;
    links?: string[];
    screenshot?: string;
    metadata?: Record<string, unknown> & {
      title?: string;
      author?: string;
      publishedTime?: string;
    };
  };
}

function asWebItems(payload: FirecrawlSearchPayload): FirecrawlSearchItem[] {
  const data = payload.data;
  if (Array.isArray(data)) return data;
  return data?.web ?? [];
}

export function normalizeSearch(
  query: string,
  payload: FirecrawlSearchPayload,
): SearchResponse {
  const items = asWebItems(payload);
  const results: SearchResult[] = items.map((item) => ({
    title: item.title ?? item.url,
    url: item.url,
    snippet: item.description,
    content: item.markdown,
    source: hostnameOf(item.url),
    raw: item,
  }));

  const imagesRaw =
    !Array.isArray(payload.data) && payload.data?.images
      ? payload.data.images
      : [];

  return {
    query,
    provider: "firecrawl",
    results,
    images: imagesRaw
      .map((img) => ({ url: img.imageUrl ?? img.url ?? "", description: img.title }))
      .filter((img) => img.url),
    raw: payload,
  };
}

export function normalizeScrape(
  url: string,
  payload: FirecrawlScrapePayload,
): ScrapeResult {
  const data = payload.data ?? {};
  return {
    url,
    title: data.metadata?.title,
    markdown: data.markdown,
    html: data.html,
    rawHtml: data.rawHtml,
    content: data.markdown,
    links: data.links,
    screenshot: data.screenshot,
    metadata: data.metadata,
    author: data.metadata?.author,
    publishedDate: data.metadata?.publishedTime,
    raw: payload,
  };
}
