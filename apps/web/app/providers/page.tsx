import type { Metadata } from "next";
import {
  ArrowUpRight,
  Check,
  Minus,
  Search as SearchIcon,
  FileText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Container, SectionHeading } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { providers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Providers",
  description:
    "Pluggable search and scrape providers for websearch-sdk: Firecrawl, Tavily, Exa, Brave and Serper. Same unified API, swap with one line.",
};

function Cap({ ok, label }: { ok: boolean | string; label: string }) {
  const enabled = ok !== false;
  return (
    <span
      className={
        enabled
          ? "inline-flex items-center gap-1.5 text-sm text-foreground"
          : "inline-flex items-center gap-1.5 text-sm text-muted-foreground"
      }
    >
      {enabled ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Minus className="h-3.5 w-3.5" />
      )}
      {label}
      {typeof ok === "string" ? (
        <span className="text-muted-foreground">({ok})</span>
      ) : null}
    </span>
  );
}

export default function ProvidersPage() {
  return (
    <>
      <section className="border-b border-border py-16">
        <Container>
          <SectionHeading
            eyebrow="Providers"
            title="Pick a provider, keep your code"
            description="Every provider factory accepts an optional { apiKey?, baseUrl? } and reads its env variable by default. Scrape is only exposed where the provider supports it."
          />
        </Container>
      </section>

      <section className="py-12">
        <Container className="grid gap-6 md:grid-cols-2">
          {providers.map((p) => (
            <div
              key={p.id}
              className="flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background font-mono text-sm font-semibold">
                    {p.name.slice(0, 2)}
                  </span>
                  <div>
                    <h3 className="font-semibold leading-tight">{p.name}</h3>
                    <code className="font-mono text-xs text-muted-foreground">
                      {p.pkg}
                    </code>
                  </div>
                </div>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Site
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">{p.blurb}</p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                <Cap ok={p.search} label="Search" />
                <Cap ok={p.scrape} label="Scrape" />
                {p.answer ? (
                  <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
                    <Check className="h-3.5 w-3.5" />
                    Synthesized answer
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Badge variant="muted" className="font-mono">
                  {p.envVar}
                </Badge>
                <a
                  href={p.keyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Get a key
                </a>
              </div>

              <div className="mt-5">
                <CodeBlock
                  code={`import { ${p.factory} } from "${p.pkg}";

const web = new WebSearch({ provider: ${p.factory}() });`}
                />
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* Capability matrix */}
      <section className="border-t border-border py-16">
        <Container>
          <SectionHeading title="Capability matrix" />
          <div className="mt-8 overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-card text-left">
                  <th className="px-4 py-3 font-medium">Package</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <SearchIcon className="h-3.5 w-3.5" /> Search
                    </span>
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Scrape
                    </span>
                  </th>
                  <th className="px-4 py-3 font-medium">Env variable</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{p.pkg}</td>
                    <td className="px-4 py-3">
                      <Cap ok={p.search} label="" />
                    </td>
                    <td className="px-4 py-3">
                      <Cap ok={p.scrape} label="" />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {p.envVar}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Calling{" "}
            <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">
              scrape()
            </code>{" "}
            on a search-only provider throws a{" "}
            <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">
              WebSearchError
            </code>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
