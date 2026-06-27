import type { FrameworkAdapter, FrameworkContext } from "@websearch-sdk/core";
import { tool, type ToolSet } from "ai";
import { z } from "zod";

export interface AiSdkOptions {
  /** Override the search tool name (default: "web_search"). */
  searchToolName?: string;
  /** Override the scrape tool name (default: "web_scrape"). */
  scrapeToolName?: string;
  /** Override the search tool description shown to the model. */
  searchDescription?: string;
  /** Override the scrape tool description shown to the model. */
  scrapeDescription?: string;
}

const DEFAULT_SEARCH_DESCRIPTION =
  "Search the web for up-to-date information. Returns a list of results with titles, URLs and snippets.";
const DEFAULT_SCRAPE_DESCRIPTION =
  "Fetch a specific URL and extract its contents as clean markdown.";

/**
 * Vercel AI SDK adapter. Returns a `ToolSet` (a plain record of tools) that
 * drops straight into `generateText` / `streamText`. Targets AI SDK v5, which
 * uses `inputSchema` (v4 used `parameters`).
 *
 * The `web_scrape` tool is only included when the active provider supports
 * scraping, so search-only providers (Brave, Serper) expose just `web_search`.
 */
export function aiSdk(options: AiSdkOptions = {}): FrameworkAdapter<ToolSet> {
  const searchName = options.searchToolName ?? "web_search";
  const scrapeName = options.scrapeToolName ?? "web_scrape";

  return {
    name: "ai-sdk",
    createTools({ web, provider }: FrameworkContext): ToolSet {
      const tools: ToolSet = {
        [searchName]: tool({
          description: options.searchDescription ?? DEFAULT_SEARCH_DESCRIPTION,
          inputSchema: z.object({
            query: z.string().describe("The search query"),
            maxResults: z
              .number()
              .int()
              .positive()
              .optional()
              .describe("Maximum number of results to return"),
          }),
          execute: async ({ query, maxResults }) => {
            const response = await web.search({ query, maxResults });
            // Return a compact, model-friendly shape (drop `raw`).
            return {
              query: response.query,
              answer: response.answer,
              results: response.results.map((r) => ({
                title: r.title,
                url: r.url,
                snippet: r.snippet,
                content: r.content,
                publishedDate: r.publishedDate,
              })),
            };
          },
        }),
      };

      if (provider.capabilities.scrape) {
        tools[scrapeName] = tool({
          description: options.scrapeDescription ?? DEFAULT_SCRAPE_DESCRIPTION,
          inputSchema: z.object({
            url: z.string().url().describe("The URL to fetch and extract"),
            onlyMainContent: z
              .boolean()
              .optional()
              .describe("Strip nav/header/footer boilerplate"),
          }),
          execute: async ({ url, onlyMainContent }) => {
            const result = await web.scrape({ url, onlyMainContent });
            return {
              url: result.url,
              title: result.title,
              content: result.content ?? result.markdown,
              markdown: result.markdown,
            };
          },
        });
      }

      return tools;
    },
  };
}
