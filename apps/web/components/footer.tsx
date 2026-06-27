import Link from "next/link";

import { Logo } from "./logo";

const GITHUB_URL = "https://github.com/haxzie/websearch-sdk";

const columns = [
  {
    title: "Documentation",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Quick start", href: "/docs#quick-start" },
      { label: "Search", href: "/docs#search" },
      { label: "Scrape", href: "/docs#scrape" },
    ],
  },
  {
    title: "Reference",
    links: [
      { label: "Providers", href: "/providers" },
      { label: "Adapters", href: "/adapters" },
      { label: "Unified types", href: "/docs#types" },
      { label: "Errors", href: "/docs#errors" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub", href: GITHUB_URL },
      { label: "npm", href: "https://www.npmjs.com/package/@websearch-sdk/core" },
      { label: "Issues", href: GITHUB_URL + "/issues" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              One unified web search API for AI agents. Swap providers without
              touching your app code.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-medium text-foreground">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>MIT License © {new Date().getFullYear()} websearch-sdk</p>
          <p>Built with Next.js, Tailwind CSS & shadcn/ui</p>
        </div>
      </div>
    </footer>
  );
}
