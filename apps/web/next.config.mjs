import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
// apps/web -> monorepo root. pnpm hoists `next` to the root node_modules, so
// Turbopack must treat the monorepo root as the project root to resolve it.
const monorepoRoot = resolve(__dirname, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  turbopack: { root: monorepoRoot },
  outputFileTracingRoot: monorepoRoot,
};

export default nextConfig;
