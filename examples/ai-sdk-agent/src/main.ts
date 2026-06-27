/**
 * Runnable demo. Requires API keys in the environment:
 *   FIRECRAWL_API_KEY, OPENAI_API_KEY
 *
 * Run with: pnpm --filter @websearch-sdk/example-ai-sdk-agent start
 *
 * Swap `firecrawl(...)` for `tavily(...)`, `exa(...)`, `brave(...)` or
 * `serper(...)` and the rest of the code stays identical — that's the point:
 * the unified core means downstream code never changes when you change provider.
 */
import { openai } from "@ai-sdk/openai";
import { WebSearch } from "@websearch-sdk/core";
import { aiSdk } from "@websearch-sdk/ai-sdk";
import { firecrawl } from "@websearch-sdk/firecrawl";
import { stepCountIs, streamText } from "ai";

async function main() {
  const web = new WebSearch({
    provider: firecrawl(),
    framework: aiSdk(),
  });

  // 1. Direct, unified API.
  const { results } = await web.search({ query: "best TypeScript monorepo tools 2026" });
  console.log(`Direct search returned ${results.length} unified results.`);
  console.log(results.map((r) => `- ${r.title} (${r.url})`).join("\n"));

  console.log("Running agent with tools...");
  const prompt = `
  Find the latest stable version of pnpm and summarize what changed. Use web_search.
  `;
  console.log("Prompt: ", prompt);
  // 2. As agent tools.
  const { textStream } = await streamText({
    model: openai("gpt-4o-mini"),
    tools: web.tools(),
    stopWhen: stepCountIs(5),
    prompt,
  });

  for await (const chunk of textStream) {
    process.stdout.write(chunk);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
