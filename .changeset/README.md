# Changesets

This folder is managed by [changesets](https://github.com/changesets/changesets). It tracks
intended version bumps and changelog entries for the published `@search-sdk/*` packages.

## Adding a changeset

When you make a change that should be released, run:

```bash
pnpm changeset
```

Pick the affected packages, choose the bump type (patch / minor / major), and write a short
summary. This creates a markdown file in this folder — commit it with your change.

## Releasing

On merge to `main`, the **Release** GitHub workflow opens (or updates) a "Version Packages" PR
that consumes the pending changesets and bumps versions + changelogs. Merging that PR publishes
the updated packages to npm.

See [the docs](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
for more.
