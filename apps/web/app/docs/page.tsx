import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { DocsSidebar, type DocsNavGroup } from "@/components/docs-sidebar";
import { CopyMarkdownButton } from "@/components/copy-markdown-button";
import { JsonLd } from "@/components/json-ld";
import {
  DOCS_DESCRIPTION,
  DOCS_MARKDOWN,
  DOCS_TITLE,
} from "@/lib/docs-content";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Docs",
  description: DOCS_DESCRIPTION,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: `${DOCS_TITLE} · search-sdk`,
  description: DOCS_DESCRIPTION,
  url: `${SITE_URL}/docs/`,
  inLanguage: "en",
  isPartOf: {
    "@type": "WebSite",
    name: "search-sdk",
    url: SITE_URL,
  },
};

const nav: DocsNavGroup[] = [
  {
    title: "Getting started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick start" },
    ],
  },
  {
    title: "Usage",
    items: [
      { id: "search", label: "Search" },
      { id: "scrape", label: "Scrape" },
      { id: "tools", label: "Tools for agents" },
      { id: "errors", label: "Error handling" },
    ],
  },
  {
    title: "Reference",
    items: [
      { id: "types", label: "Unified types" },
      { id: "architecture", label: "Architecture" },
      { id: "adding-a-provider", label: "Adding a provider" },
    ],
  },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-20 border-b border-border pb-2 text-2xl font-semibold tracking-tight"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="leading-7 text-muted-foreground">{children}</p>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.8125rem] text-foreground">
      {children}
    </code>
  );
}

export default function DocsPage() {
  return (
    <Container className="py-12">
      <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <DocsSidebar groups={nav} />
          </div>
        </aside>

        {/* Content */}
        <article className="min-w-0 max-w-3xl space-y-16">
          <JsonLd data={jsonLd} />

          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-tight">
              {DOCS_TITLE}
            </h1>
            <CopyMarkdownButton markdown={DOCS_MARKDOWN} className="mt-1" />
          </div>

          <section className="space-y-4">
            <H2 id="introduction">Introduction</H2>
            <P>
              Every web-search and scrape provider has a different API shape,
              auth scheme, and response format — and every agent framework has
              its own tool format. You end up rewriting glue for each
              combination. <Code>websearch-sdk</Code> normalizes both sides.
            </P>
            <ul className="space-y-2 text-muted-foreground">
              <li className="leading-7">
                <span className="text-foreground">Unified output</span> —{" "}
                <Code>search()</Code> and <Code>scrape()</Code> always return the
                same shape, regardless of provider.
              </li>
              <li className="leading-7">
                <span className="text-foreground">Plug-and-play providers</span>{" "}
                — one small factory per provider; switch by changing a single
                line.
              </li>
              <li className="leading-7">
                <span className="text-foreground">Framework adapters</span> —
                turn the unified capabilities into framework-native tools via{" "}
                <Code>web.tools()</Code>.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <H2 id="installation">Installation</H2>
            <P>
              Install the core package plus whichever provider you need. The
              Vercel AI SDK adapter is built into core; add <Code>ai</Code> (v5)
              only if you want agent tools.
            </P>
            <CodeBlock
              filename="terminal"
              code={`# pnpm
pnpm add @search-sdk/core @search-sdk/firecrawl

# npm
npm install @search-sdk/core @search-sdk/firecrawl

# optional — for web.tools()
pnpm add ai`}
            />
            <P>Requires Node.js 18+ (uses the global fetch).</P>
          </section>

          <section className="space-y-4">
            <H2 id="quick-start">Quick start</H2>
            <P>
              Pass a provider to <Code>WebSearch</Code>, then call the unified
              API or hand tools to your agent.
            </P>
            <CodeBlock
              filename="quick-start.ts"
              code={`import { WebSearch } from "@search-sdk/core";
import { firecrawl } from "@search-sdk/firecrawl";

const web = new WebSearch({
  // apiKey is optional — falls back to FIRECRAWL_API_KEY
  provider: firecrawl(),
});

// Direct, unified API
const results = await web.search({ query: "latest TypeScript release" });
const page = await web.scrape({ url: "https://example.com" });

// Or hand tools to an agent — defaults to the built-in AI SDK adapter
const tools = web.tools(); // -> { web_search, web_scrape }`}
            />
          </section>

          <section className="space-y-4">
            <H2 id="search">Search</H2>
            <P>
              <Code>search()</Code> accepts a query string or an options object
              and resolves to a <Code>SearchResponse</Code>.
            </P>
            <CodeBlock
              filename="search.ts"
              code={`const res = await web.search({
  query: "best TypeScript monorepo tools",
  maxResults: 5,
  includeDomains: ["github.com"],
  timeRange: "month",
  includeContent: true, // pull page content into each result (when supported)
});

for (const r of res.results) {
  console.log(r.title, r.url, r.snippet);
}

// A bare string works too:
await web.search("typescript 5.7 release notes");`}
            />
            <P>
              Pass provider-specific knobs that aren&apos;t part of the unified
              API through <Code>providerOptions</Code> — they&apos;re forwarded
              verbatim to the provider.
            </P>
            <CodeBlock
              code={`await web.search({
  query: "rust async runtimes",
  providerOptions: { search_depth: "advanced" },
});`}
            />
          </section>

          <section className="space-y-4">
            <H2 id="scrape">Scrape</H2>
            <P>
              <Code>scrape()</Code> resolves to a <Code>ScrapeResult</Code>. It
              throws a <Code>WebSearchError</Code> if the active provider
              doesn&apos;t support scraping (e.g. Brave, Serper).
            </P>
            <CodeBlock
              filename="scrape.ts"
              code={`const page = await web.scrape({
  url: "https://example.com/article",
  formats: ["markdown"],
  onlyMainContent: true,
});

console.log(page.title);
console.log(page.markdown);`}
            />
          </section>

          <section className="space-y-4">
            <H2 id="tools">Tools for agents</H2>
            <P>
              <Code>web.tools()</Code> returns a Vercel AI SDK{" "}
              <Code>ToolSet</Code> you can pass straight into{" "}
              <Code>generateText</Code> / <Code>streamText</Code>. The AI SDK
              adapter is built into core and used by default — no extra package
              or <Code>framework</Code> option required.
            </P>
            <CodeBlock
              filename="agent.ts"
              code={`import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  tools: web.tools(), // default AI SDK tools
  stopWhen: stepCountIs(5),
  prompt: "Find the latest stable pnpm version and summarize what changed.",
});`}
            />
            <P>
              See <Link href="/adapters" className="text-foreground underline underline-offset-4">Adapters</Link>{" "}
              for customizing tool names or targeting other frameworks.
            </P>
          </section>

          <section className="space-y-4">
            <H2 id="errors">Error handling</H2>
            <P>
              Errors are normalized to <Code>WebSearchError</Code> (with{" "}
              <Code>provider</Code> and optional <Code>status</Code>), so you can
              handle failures uniformly. A missing key throws{" "}
              <Code>MissingApiKeyError</Code>.
            </P>
            <CodeBlock
              filename="errors.ts"
              code={`import { MissingApiKeyError, isMissingApiKeyError } from "@search-sdk/core";

try {
  const web = new WebSearch({ provider: tavily() });
} catch (err) {
  if (isMissingApiKeyError(err)) {
    console.error(err.message); // No API key provided for "tavily". ...
    console.error(err.envVars); // ["TAVILY_API_KEY"]
  }
}`}
            />
          </section>

          <section className="space-y-4">
            <H2 id="types">Unified types</H2>
            <P>
              <Code>search()</Code> resolves to a <Code>SearchResponse</Code>;{" "}
              <Code>scrape()</Code> to a <Code>ScrapeResult</Code>.
            </P>
            <CodeBlock
              filename="types.ts"
              code={`interface SearchResponse {
  query: string;
  provider: string;            // e.g. "firecrawl"
  results: SearchResult[];
  answer?: string;             // synthesized answer when available
  images?: { url: string; description?: string }[];
  responseTime?: number;
  raw?: unknown;               // untouched provider payload
}

interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  content?: string;            // present when includeContent is set
  publishedDate?: string;
  author?: string;
  score?: number;
  favicon?: string;
  image?: string;
  source?: string;
  raw?: unknown;
}`}
            />
          </section>

          <section className="space-y-4">
            <H2 id="architecture">Architecture</H2>
            <P>
              <Code>core</Code> is provider-agnostic and ships the AI SDK adapter
              as the default framework; providers depend only on core. Adding a
              provider or framework is purely additive.
            </P>
            <CodeBlock
              code={`@search-sdk/core         WebSearch class + unified types + provider
                            contracts + built-in Vercel AI SDK adapter
@search-sdk/<provider>   firecrawl · tavily · exa · brave · serper`}
            />
          </section>

          <section className="space-y-4">
            <H2 id="adding-a-provider">Adding a provider</H2>
            <P>
              Implement the <Code>SearchProvider</Code> contract from core, add a
              pure <Code>normalize*</Code> function that maps the raw response to
              the unified types, and unit-test it with a mocked fetch. No changes
              to core are required.
            </P>
            <CodeBlock
              filename="my-provider.ts"
              code={`import type { SearchProvider } from "@search-sdk/core";

export function myProvider(opts: { apiKey: string }): SearchProvider {
  return {
    name: "my-provider",
    capabilities: { search: true, scrape: false },
    async search(options) {
      // call API, return normalizeSearch(...)
    },
  };
}`}
            />
          </section>
        </article>
      </div>
    </Container>
  );
}
