# search-sdk

Alias package for [`@search-sdk/core`](../core). It re-exports the entire core
public surface so you can install and import `search-sdk` directly:

```bash
pnpm add search-sdk @search-sdk/firecrawl
```

```ts
import { WebSearch } from "search-sdk";
import { firecrawl } from "@search-sdk/firecrawl";

const web = new WebSearch({ provider: firecrawl() });
```

Everything exported by `@search-sdk/core` is available here unchanged.
