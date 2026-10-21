# AGENTS.md

Guidance for AI coding agents working in this repository. For user-facing
documentation, see [README.md](README.md) and the docs site in `docs/`.

## Repository layout

A pnpm workspace (`pnpm-workspace.yaml`) with the published packages in
`packages/` and a private docs site in `docs/`.

| Package                                     | Path                       | Role                                                                     |
| ------------------------------------------- | -------------------------- | ------------------------------------------------------------------------ |
| `@starknet-io/get-starknet-core`            | `packages/core`            | Re-exports discovery and wallet-standard, plus `wallets` / `virtual-wallet` entry points |
| `@starknet-io/get-starknet-discovery`       | `packages/discovery`       | Finds wallets (injected, Wallet Standard, EIP-6963) and keeps a store    |
| `@starknet-io/get-starknet-wallet-standard` | `packages/wallet-standard` | Starknet Wallet Standard features and chains, injected-wallet adapter   |
| `@starknet-io/get-starknet-virtual-wallet`  | `packages/virtual-wallet`  | Virtual wallets, e.g. MetaMask via EIP-1193                              |
| `@starknet-io/get-starknet-wallets`         | `packages/wallets`         | Static list of known wallets (id, name, icon, download links)            |
| `@starknet-io/get-starknet-modal`           | `packages/modal`           | Headless React provider and hooks for the connect flow                   |
| `@starknet-io/get-starknet-ui`              | `packages/ui`              | Styled React UI (shadcn/Radix/Tailwind) on top of `modal`                |
| `get-starknet-docs` (private)               | `docs`                     | Vocs docs site, deployed by Vercel from `docs/dist`                      |

Packages depend on each other with `workspace:` ranges and build with
`tsdown`.

## Setup and commands

Requires Node >= 22 and pnpm 10 (`packageManager` pins the exact version).

```bash
pnpm install
pnpm build          # all packages and the docs site
pnpm typecheck
pnpm lint:check     # Biome lint + format check
pnpm format:check
pnpm test           # Vitest, single run (sets CI=true)
```

- **Build before testing.** Some tests import sibling packages through their
  published entry points, which resolve to `dist/`.
- **Run one package's tests** with
  `pnpm --filter @starknet-io/get-starknet-wallets exec vitest run`. A bare
  `vitest` inside a package starts watch mode.
- **CI** (`.github/workflows/pr.yml`) runs `format:check`, `build` and `test`.
  Run `typecheck` and `lint:check` yourself too.
- `pnpm lint` and `pnpm format` apply fixes.

## Code style

- Biome is the formatter and linter (`biome.json`): 2-space indent, double
  quotes, trailing commas. Imports are organized by Biome, and unused imports
  are errors. No script uses `.prettierrc`.
- Tests use Vitest and live in `tests/` (`test/` in `packages/wallets`). DOM
  tests opt in with `// @vitest-environment happy-dom`.
- Match the surrounding code; keep changes scoped to the task.

## Branches, commits and pull requests

- `master` is the only long-lived branch. Branch from it and open PRs against
  it. A PR needs one approving review before merging.
- Commit messages follow Conventional Commits (`.commitlintrc`), e.g.
  `feat(wallets): add Bramble wallet` or `chore(deps): ...`.

## Changesets and releases

- Add a changeset (`pnpm changeset`) for any change to the shipped code or
  runtime dependencies of a published package. Changes to dev dependencies,
  CI, tests or the private docs site don't need one.
- By convention, adding a wallet and bumping a dependency are `patch` changes.
- Never edit package `version` fields or `CHANGELOG.md` files by hand, and never
  publish from a local machine. Changesets generates both.
- Releasing: when changesets land on `master`, `.github/workflows/release.yml`
  opens a "Master branch version bump" PR. Merging it publishes to npm under
  `latest` through trusted publishing (OIDC). Nothing publishes to the `next`
  dist-tag any more.
- `.changeset/config.json` links all `@starknet-io/*` packages, so packages
  bumped in the same release share a version.

## Dependencies

- Versions shared across packages live in the pnpm catalog in
  `pnpm-workspace.yaml` (`@starknet-io/types-js`, `tsdown`, `typescript`,
  `vitest`). Packages reference them as `"catalog:"`; change the catalog, not
  individual `package.json` files.
- Packages that run install scripts must be listed in `onlyBuiltDependencies`.
- For security fixes in transitive dependencies, prefer in-range lockfile
  updates (`pnpm update -r --depth Infinity <pkg>`). Add `overrides` in
  `pnpm-workspace.yaml` only when the fix is outside the parent's declared
  range. Avoid version-selector keys such as `vite@<7.3.7` for packages that
  appear in multi-range peer specs: pnpm also rewrites any spec that merely
  intersects the selector.

## Common tasks

### Add a wallet to the list

1. In `packages/wallets/src/wallets.ts`, export a new `WalletInformation`
   constant (icon as a `data:` URI; download URL formats are typed in
   `packages/wallets/src/types.ts`).
2. Append it to the `wallets` array. The test fails if an exported wallet is
   missing from the array.
3. Add a `patch` changeset for `@starknet-io/get-starknet-wallets`.

### Bump `@starknet-io/types-js`

1. Update the version in the `pnpm-workspace.yaml` catalog and run
   `pnpm install`.
2. Add a `patch` changeset for `@starknet-io/get-starknet-discovery`,
   `@starknet-io/get-starknet-virtual-wallet` and
   `@starknet-io/get-starknet-wallet-standard`.
3. Run `pnpm typecheck`. The wallet API is passed through generically
   (`RequestFn` is generic over `RpcTypeToMessageMap`), so new RPC methods need
   no source changes. Check instead that the upstream change is additive and
   that nothing here narrows a union that changed.
