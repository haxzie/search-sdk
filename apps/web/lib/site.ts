export const SITE_URL = "https://search-sdk.dev";

export const GITHUB_REPO = "haxzie/search-sdk";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

// Static, known routes — used by the sitemap. trailingSlash is on, so each
// entry resolves with a trailing slash to match the emitted HTML files.
export const ROUTES = ["", "/providers", "/adapters", "/docs"] as const;
