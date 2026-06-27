import { WebSearchError } from "./errors";

export interface RequestJsonOptions {
  provider: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  /** JSON body for POST requests. */
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Small `fetch` helper shared by providers: sends/receives JSON and converts
 * non-2xx responses and transport errors into a {@link WebSearchError} carrying
 * the provider name and HTTP status.
 */
export async function requestJson<T>(
  url: string,
  options: RequestJsonOptions,
): Promise<T> {
  const { provider, method = "GET", headers = {}, body, signal } = options;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        accept: "application/json",
        ...(body !== undefined ? { "content-type": "application/json" } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (cause) {
    throw new WebSearchError(
      `Network request to ${provider} failed: ${(cause as Error)?.message ?? "unknown error"}`,
      { provider, cause },
    );
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new WebSearchError(
      `${provider} responded with ${response.status} ${response.statusText}${
        text ? `: ${text.slice(0, 500)}` : ""
      }`,
      { provider, status: response.status, cause: text },
    );
  }

  return (await response.json()) as T;
}
