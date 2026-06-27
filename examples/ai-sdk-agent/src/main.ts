/**
 * Runnable demo. Requires API keys in the environment:
 *   FIRECRAWL_API_KEY, OPENAI_API_KEY
 *
 * Run with: pnpm --filter @search-sdk/example-ai-sdk-agent start
 *
 * Swap `firecrawl(...)` for `tavily(...)`, `exa(...)`, `brave(...)` or
 * `serper(...)` and the rest of the code stays identical — that's the point:
 * the unified core means downstream code never changes when you change provider.
 */
import { openai } from "@ai-sdk/openai";
import { WebSearch } from "@search-sdk/core";
import { firecrawl } from "@search-sdk/firecrawl";
import { stepCountIs, streamText } from "ai";

async function main() {
  // No `framework` needed — tools() uses the built-in AI SDK adapter by default.
  // (Import `aiSdk` from "@search-sdk/core" and pass `framework: aiSdk({...})` to customize.)
  const web = new WebSearch({
    provider: firecrawl(),
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
