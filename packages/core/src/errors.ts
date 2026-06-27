/**
 * Shared error type. Providers wrap transport/API failures in this so callers
 * can handle errors uniformly regardless of the underlying provider.
 */
export class WebSearchError extends Error {
  /** Name of the provider that produced the error. */
  readonly provider: string;
  /** HTTP status code when the failure came from an API response. */
  readonly status?: number;
  /** The original error or response body, when available. */
  override readonly cause?: unknown;

  constructor(
    message: string,
    options: { provider: string; status?: number; cause?: unknown },
  ) {
    super(message);
    this.name = "WebSearchError";
    this.provider = options.provider;
    this.status = options.status;
    this.cause = options.cause;
    // Maintain proper prototype chain when targeting ES5-ish runtimes.
    Object.setPrototypeOf(this, WebSearchError.prototype);
  }
}

/** Type guard for {@link WebSearchError}. */
export function isWebSearchError(value: unknown): value is WebSearchError {
  return value instanceof WebSearchError;
}

/**
 * Thrown when a provider is initialized without an API key and none can be
 * resolved from the environment. Subclasses {@link WebSearchError} so callers
 * can catch both uniformly.
 */
export class MissingApiKeyError extends WebSearchError {
  /** Environment variables that were checked for a key. */
  readonly envVars: string[];

  constructor(options: { provider: string; envVars: string[] }) {
    const list = options.envVars.join(", ");
    super(
      `No API key provided for "${options.provider}". Pass { apiKey } when ` +
        `creating the provider${
          list ? `, or set one of these environment variables: ${list}` : ""
        }.`,
      { provider: options.provider },
    );
    this.name = "MissingApiKeyError";
    this.envVars = options.envVars;
    Object.setPrototypeOf(this, MissingApiKeyError.prototype);
  }
}

/** Type guard for {@link MissingApiKeyError}. */
export function isMissingApiKeyError(
  value: unknown,
): value is MissingApiKeyError {
  return value instanceof MissingApiKeyError;
}
