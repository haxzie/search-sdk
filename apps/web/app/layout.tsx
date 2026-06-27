import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { GITHUB_URL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://websearch-sdk.dev"),
  title: {
    default: "websearch-sdk — One web search API for every provider",
    template: "%s · websearch-sdk",
  },
  description:
    "A unified web search SDK for AI agents. Swap search and scrape providers — Firecrawl, Tavily, Exa, Brave, Serper — without touching your app code, and hand framework-native tools straight to your agent.",
  keywords: [
    "web search",
    "ai agents",
    "vercel ai sdk",
    "firecrawl",
    "tavily",
    "exa",
    "brave search",
    "serper",
    "scraping",
    "typescript",
  ],
  openGraph: {
    title: "websearch-sdk",
    description:
      "One unified web search API for AI agents. Swap providers without touching your app code.",
    type: "website",
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "search-sdk",
      url: SITE_URL,
      description:
        "A unified web search SDK for AI agents — swap Firecrawl, Tavily, Exa, Brave and Serper without touching your app code.",
    },
    {
      "@type": "SoftwareSourceCode",
      name: "search-sdk",
      description:
        "One unified web search and scrape API for AI agents, with pluggable providers and framework-native tool adapters.",
      codeRepository: GITHUB_URL,
      url: SITE_URL,
      programmingLanguage: "TypeScript",
      license: "https://opensource.org/licenses/MIT",
    },
  ],
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark' : true;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd data={siteJsonLd} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
