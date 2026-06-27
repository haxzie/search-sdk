import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Container, SectionHeading } from "@/components/section";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = {
  title: "Adapters",
  description:
    "Framework adapters turn the unified websearch-sdk capabilities into framework-native agent tools. The Vercel AI SDK adapter is built into core.",
};

export default function AdaptersPage() {
  return (
    <>
      <section className="border-b border-border py-16">
        <Container>
          <SectionHeading
            eyebrow="Adapters"
            title="Framework-native tools, one provider"
            description="Adapters turn web.search() and web.scrape() into the tool format your agent framework expects. Keep provider-specific code out of your app — and switch frameworks without rewriting your search layer."
          />
        </Container>
      </section>

      {/* Built-in AI SDK */}
      <section className="py-12">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight">
                Vercel AI SDK
              </h2>
              <Badge>Built-in</Badge>
            </div>
            <p className="mt-3 text-muted-foreground">
              Shipped inside <code className="font-mono text-sm">core</code> and
              used by default.{" "}
              <code className="font-mono text-sm">web.tools()</code> returns a
              Vercel AI SDK <code className="font-mono text-sm">ToolSet</code>{" "}
              you can pass straight into{" "}
              <code className="font-mono text-sm">generateText</code> /{" "}
              <code className="font-mono text-sm">streamText</code>.{" "}
              <code className="font-mono text-sm">web_scrape</code> is included
              only when the provider supports it.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li>
                — No extra package or{" "}
                <code className="font-mono text-xs">framework</code> option
                required.
              </li>
              <li>
                — Install <code className="font-mono text-xs">ai</code> (v5) — an
                optional peer dependency of core.
              </li>
              <li>— Customize tool names and descriptions when you need to.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <CodeBlock
              filename="default.ts"
              code={`import { WebSearch } from "@search-sdk/core";
import { firecrawl } from "@search-sdk/firecrawl";

const web = new WebSearch({ provider: firecrawl() });

// Built-in AI SDK adapter — no framework option needed
const tools = web.tools(); // { web_search, web_scrape }`}
            />
            <CodeBlock
              filename="customize.ts"
              code={`import { WebSearch, aiSdk } from "@search-sdk/core";

const web = new WebSearch({
  provider: firecrawl(),
  framework: aiSdk({
    searchToolName: "search_the_web",
    scrapeToolName: "read_url",
    searchDescription: "Search the public web for current information.",
  }),
});`}
            />
          </div>
        </Container>
      </section>

      {/* Custom adapter */}
      <section className="border-t border-border py-12">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight">
                Custom adapter
              </h2>
              <Badge variant="outline">Any framework</Badge>
            </div>
            <p className="mt-3 text-muted-foreground">
              <code className="font-mono text-sm">framework</code> accepts any
              object implementing the{" "}
              <code className="font-mono text-sm">FrameworkAdapter</code>{" "}
              contract, so you can target other agent frameworks while reusing
              the same provider and unified API.
            </p>
            <p className="mt-3 text-muted-foreground">
              Build your framework&apos;s tools from{" "}
              <code className="font-mono text-sm">web.search</code> /{" "}
              <code className="font-mono text-sm">web.scrape</code> — adding an
              adapter is purely additive and requires no changes to core.
            </p>
          </div>

          <div className="space-y-4">
            <CodeBlock
              filename="my-adapter.ts"
              code={`import type { FrameworkAdapter } from "@search-sdk/core";

const myAdapter: FrameworkAdapter = {
  name: "my-framework",
  createTools({ web, provider }) {
    return {
      // build your framework's tools from
      // web.search / web.scrape
    };
  },
};

const web = new WebSearch({
  provider: firecrawl(),
  framework: myAdapter,
});`}
            />
          </div>
        </Container>
      </section>

      {/* Contract */}
      <section className="border-t border-border py-16">
        <Container>
          <SectionHeading
            title="The FrameworkAdapter contract"
            description="Two fields: a name, and a createTools function that receives the WebSearch instance and active provider."
          />
          <div className="mt-8 max-w-3xl">
            <CodeBlock
              filename="contract.ts"
              code={`interface FrameworkAdapter {
  name: string;
  createTools(ctx: {
    web: WebSearch;        // call web.search / web.scrape
    provider: SearchProvider;
  }): Record<string, unknown>;  // your framework's tools
}`}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
