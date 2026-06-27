import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  Bot,
  Boxes,
  Feather,
  Package,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container, SectionHeading } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { CodeTabs } from "@/components/code-tabs";
import { HeroCode } from "@/components/hero-code";
import { providers, stats } from "@/lib/content";

const installCmd = "npm install @search-sdk/core @search-sdk/firecrawl";

const swapTabs = providers.map((p) => ({
  value: p.id,
  label: p.name,
  filename: "search.ts",
  code: `import { WebSearch } from "@search-sdk/core";
import { ${p.factory} } from "${p.pkg}";

// Only this line changes between providers.
const web = new WebSearch({ provider: ${p.factory}() });

const { results${p.answer ? ", answer" : ""} } = await web.search(
  "who won the 2026 super bowl?"
);${p.answer ? "\n\nconsole.log(answer);  // synthesized answer" : ""}
console.log(results); // always SearchResult[]`,
}));

const capabilities = [
  {
    icon: Boxes,
    title: "Pluggable providers",
    body: "Firecrawl, Tavily, Exa, Brave, Serper — one small factory each. Switch by changing a single line.",
  },
  {
    icon: Blocks,
    title: "Always-unified results",
    body: "Identical SearchResult / ScrapeResult shapes across every provider, no matter the underlying API.",
  },
  {
    icon: Bot,
    title: "Agent-ready tools",
    body: "web.tools() returns a Vercel AI SDK ToolSet (web_search + web_scrape) ready for your agent.",
  },
  {
    icon: ShieldCheck,
    title: "Capability-aware",
    body: "Scrape tools and methods are only exposed when the active provider actually supports them.",
  },
  {
    icon: Feather,
    title: "Lightweight",
    body: "Providers use native fetch — no heavy vendor SDKs dragged into your dependency tree.",
  },
  {
    icon: Package,
    title: "ESM + CJS + types",
    body: "Ships dual builds with full TypeScript declarations. Works everywhere on Node 18+.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
        <Container className="relative py-20 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Link href="/docs">
                <Badge
                  variant="outline"
                  className="mb-5 gap-1.5 py-1 font-normal text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  Unified web search for AI agents
                </Badge>
              </Link>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                One web search API for every provider
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
                A unified TypeScript SDK to search and scrape the web from your
                agents. Swap providers without touching your app code, and hand
                framework-native tools straight to your model.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/docs">
                    Read the docs
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/providers">Browse providers</Link>
                </Button>
              </div>
              <div className="mt-6 max-w-md">
                <CodeBlock code={installCmd} filename="terminal" />
              </div>
            </div>
            <HeroCode />
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <Container>
          <dl className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-8 text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {s.value}
                </dd>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Swap providers */}
      <section className="border-b border-border py-20">
        <Container>
          <SectionHeading
            eyebrow="Provider-agnostic"
            title="Swap providers, keep your code"
            description="search() and scrape() always return the same shape. Change the provider factory on one line — the rest of your code never moves."
          />
          <div className="mt-8 max-w-3xl">
            <CodeTabs tabs={swapTabs} />
          </div>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="border-b border-border py-20">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="Everything an agent needs to read the web"
          />
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <div key={c.title} className="bg-background p-6">
                <c.icon className="h-5 w-5 text-foreground" />
                <h3 className="mt-4 font-medium">{c.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Quick start */}
      <section className="border-b border-border py-20">
        <Container>
          <SectionHeading
            eyebrow="Quick start"
            title="From install to first search in two steps"
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-sm font-medium">
                  1
                </span>
                <h3 className="font-medium">Install core + a provider</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                The Vercel AI SDK adapter is built into core. Add{" "}
                <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">
                  ai
                </code>{" "}
                only if you want agent tools.
              </p>
              <div className="mt-4">
                <CodeBlock
                  filename="terminal"
                  code={`pnpm add @search-sdk/core @search-sdk/firecrawl
pnpm add ai   # optional, for web.tools()`}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-sm font-medium">
                  2
                </span>
                <h3 className="font-medium">Search the web</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Pass a provider, then call the unified API. A bare string works
                too.
              </p>
              <div className="mt-4">
                <CodeBlock
                  filename="search.ts"
                  code={`import { WebSearch } from "@search-sdk/core";
import { firecrawl } from "@search-sdk/firecrawl";

const web = new WebSearch({ provider: firecrawl() });
const res = await web.search("typescript 5.7 release notes");

for (const r of res.results) {
  console.log(r.title, r.url);
}`}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card px-6 py-14 text-center">
            <Workflow className="h-7 w-7 text-foreground" />
            <h2 className="max-w-xl text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Give your agent the whole web, one API at a time
            </h2>
            <p className="max-w-lg text-muted-foreground">
              Start with one provider and switch any time. Adding a provider or
              framework adapter is purely additive.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/docs">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href="https://github.com/haxzie/websearch-sdk"
                  target="_blank"
                  rel="noreferrer"
                >
                  Star on GitHub
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
