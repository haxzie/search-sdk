import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { GITHUB_URL, SITE_URL } from "@/lib/site";

const SITE_NAME = "websearch-sdk";
const TITLE = "websearch-sdk — One web search API for every provider";
const DESCRIPTION =
  "A unified web search SDK for AI agents. Swap search and scrape providers — Firecrawl, Tavily, Exa, Brave, Serper — without touching your app code, and hand framework-native tools straight to your agent.";
const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Web Search SDK — one unified web search API for every provider",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: TITLE,
    template: "%s · websearch-sdk",
  },
  description: DESCRIPTION,
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
  authors: [{ name: "haxzie", url: "https://github.com/haxzie" }],
  creator: "haxzie",
  publisher: "haxzie",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@haxzie",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
