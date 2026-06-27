"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";

const humansCode = `import { WebSearch } from "@search-sdk/core";
import { firecrawl } from "@search-sdk/firecrawl";

const web = new WebSearch({
  provider: firecrawl(), // reads FIRECRAWL_API_KEY
});

// One unified shape, whatever the provider
const { results } = await web.search({
  query: "latest TypeScript release",
  maxResults: 5,
});

const page = await web.scrape({
  url: "https://example.com/article",
});`;

const agentsCode = `import { WebSearch } from "@search-sdk/core";
import { firecrawl } from "@search-sdk/firecrawl";
import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";

const web = new WebSearch({ provider: firecrawl() });

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  tools: web.tools(), // -> { web_search, web_scrape }
  stopWhen: stepCountIs(5),
  prompt: "Find the latest stable pnpm version and summarize it.",
});`;

const tabs = [
  { value: "humans", label: "For humans", code: humansCode, file: "search.ts" },
  { value: "agents", label: "For agents", code: agentsCode, file: "agent.ts" },
];

export function HeroCode() {
  const [active, setActive] = React.useState("humans");
  const current = tabs.find((t) => t.value === active) ?? tabs[0];

  return (
    <div className="w-full">
      <div className="mb-3 inline-flex rounded-lg border border-border bg-card p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActive(tab.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active === tab.value
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <CodeBlock code={current.code} filename={current.file} />
    </div>
  );
}
