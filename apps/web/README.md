# @websearch-sdk/web

Marketing + documentation site for [`websearch-sdk`](../../README.md), styled
after [chat-sdk.dev](https://chat-sdk.dev) with flat, Vercel-like colors.

Lives in the monorepo at `apps/web` and is orchestrated by Turborepo — see the
root README for `dev:web` / `build:web` commands.

## Stack

- **Next.js 16** (App Router, Turbopack, static export via `output: "export"`)
- **React 19.2**
- **Tailwind CSS v4**
- **shadcn/ui** primitives (new-york style, neutral base)
- **CodeMirror** (`@uiw/react-codemirror`) for read-only syntax highlighting
- **Geist** sans + mono fonts

> **Note on the Next version:** the request was Next.js 16.3, which at build
> time is only published as `16.3.0-preview.5` / canary. Because the `geist`
> peer dependency rejects prerelease `next` ranges, this app pins the latest
> **stable** Next 16 (`16.2.9`). To use the 16.3 preview instead:
> `npm install next@16.3.0-preview.5 --legacy-peer-deps`.

## Structure

```
apps/web/
  app/
    layout.tsx          # root layout, fonts, dark-default theme script
    page.tsx            # landing page
    providers/page.tsx  # provider catalogue + capability matrix
    adapters/page.tsx   # framework adapters (AI SDK built-in + custom)
    docs/page.tsx       # single-page docs with sticky sidebar
    globals.css         # Tailwind v4 theme tokens (flat neutral palette)
  components/
    ui/                 # shadcn primitives (button, card, badge, tabs)
    code-block.tsx      # CodeMirror code block w/ copy button
    code-tabs.tsx       # provider-swap tabbed code
    navbar.tsx footer.tsx ...
  lib/
    content.ts          # providers + adapters data (single source of truth)
    utils.ts            # cn() helper
```

## Develop

From the repo root (recommended — uses Turborepo):

```bash
pnpm install
pnpm dev:web     # http://localhost:3000
```

Or from this directory directly:

```bash
pnpm dev
```

## Build (static)

```bash
pnpm build:web   # from repo root
# or, from here:
pnpm build       # outputs static site to ./out
```

The site is a fully static export — deploy `out/` to any static host
(Vercel, Netlify, GitHub Pages, S3, …).
