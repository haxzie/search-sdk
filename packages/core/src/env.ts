import { MissingApiKeyError } from "./errors";

/** Read `process.env` without requiring Node type definitions. */
function readEnv(name: string): string | undefined {
  const env = (
    globalThis as {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process?.env;
  return env?.[name];
}

export interface ResolveApiKeyOptions {
  /** Provider name, used in the thrown error. */
  provider: string;
  /** Explicit key passed by the user (takes precedence over the environment). */
  apiKey?: string;
  /**
   * Environment variable names to fall back to, checked in order. The first
   * non-empty value wins.
   */
  envVars: string[];
}

/**
 * Resolve a provider API key from an explicit value or the environment, without
 * throwing. Returns `undefined` when none is found — for providers that can run
 * without a key (e.g. Firecrawl's keyless tier).
 */
export function resolveOptionalApiKey(options: {
  apiKey?: string;
  envVars: string[];
}): string | undefined {
  const explicit = options.apiKey?.trim();
  if (explicit) return explicit;

  for (const name of options.envVars) {
    const value = readEnv(name)?.trim();
    if (value) return value;
  }

  return undefined;
}

/**
 * Resolve a provider API key from an explicit value or, failing that, from the
 * environment. Throws {@link MissingApiKeyError} when neither is available so
 * every provider reports missing keys the same way.
 */
export function resolveApiKey(options: ResolveApiKeyOptions): string {
  const explicit = options.apiKey?.trim();
  if (explicit) return explicit;

  for (const name of options.envVars) {
    const value = readEnv(name)?.trim();
    if (value) return value;
  }

  throw new MissingApiKeyError({
    provider: options.provider,
    envVars: options.envVars,
  });
}
