# Next.js on Cloudflare Workers

This project uses Next.js with the OpenNext Cloudflare adapter to deploy to Workers.

## Docs

- https://opennext.js.org/cloudflare/get-started
- https://developers.cloudflare.com/workers/
- MCP: `https://docs.mcp.cloudflare.com/mcp`

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js local development |
| `npm run preview` | Build and preview in Workers runtime |
| `npm run deploy` | Build and deploy to Cloudflare Workers |
| `npm run cf-typegen` | Generate TypeScript types for Wrangler bindings |
| `npm run test` | Run all Vitest tests (unit + integration) |
| `npm run test:unit` | Unit tests only (`src/lib/`) |
| `npm run test:integration` | Integration tests only (`src/components/`) |
| `npm run test:e2e` | Playwright end-to-end tests (`e2e/`) |
| `npm run test:all` | Full Test Pyramid: unit → integration → e2e |

Run `npm run cf-typegen` after changing bindings in `wrangler.jsonc`.

## Node.js Compatibility

https://developers.cloudflare.com/workers/runtime-apis/nodejs/

## Product Docs

Retrieve API references and limits from:
`/kv/` · `/r2/` · `/d1/` · `/durable-objects/` · `/queues/` · `/vectorize/` · `/workers-ai/` · `/agents/`

## Cursor Cloud specific instructions

### Runtime

- Use **Node.js 22+** (Wrangler 4 and this stack expect it). The VM image provides Node at `/exec-daemon/node`.
- Package manager is **npm** (`package-lock.json`). Install with `npm install` from the repo root.

### Services and ports

| Service | Command | URL | Notes |
|---------|---------|-----|-------|
| Next.js dev (Turbopack) | `npm run dev` | http://localhost:3000 | Fast local UI iteration; Node runtime, not Workers. |
| Workers preview (Miniflare) | `npm run preview` | http://localhost:8787 | Builds via OpenNext then runs Wrangler locally. Long-running; use tmux. |
| Production deploy | `npm run deploy` | Cloudflare URL | Requires `npx wrangler login` and account credentials. |

There are no databases, Docker compose stacks, or extra Cloudflare bindings (KV/D1/R2) in this template—only static assets and a self service binding in `wrangler.jsonc`.

### Lint, build, tests

- **Lint:** `npm run lint` (ESLint via `next lint`; no warnings in a clean tree).
- **Build:** `npm run build` (standard Next.js production build).
- **Tests:** Vitest (unit + integration) and Playwright (e2e). CI runs all layers via `.github/workflows/test.yml`.

#### Test Pyramid (Mike Cohn)

Prefer many fast unit tests, fewer integration tests, and a small E2E suite:

| Layer | Command | Location | What to test |
|-------|---------|----------|--------------|
| Unit (base) | `npm run test:unit` | `src/lib/**/*.test.ts` | Pure logic — e.g. `src/lib/hydration/calculate.test.ts` |
| Integration (middle) | `npm run test:integration` | `src/components/**/*.test.tsx` | React components wired to lib code — e.g. form updates, tab switching |
| E2E (top) | `npm run test:e2e` | `e2e/**/*.spec.ts` | Full user flows in a real browser |

**Tooling:** Vitest + Testing Library + jsdom (`vitest.config.ts`, `vitest.setup.ts`); Playwright (`playwright.config.ts`). Path alias `@/*` works in Vitest.

**When adding features:** put calculation/business rules in `src/lib/` with unit tests first; add integration tests for interactive UI; add E2E only for critical paths (navigation, primary workflows).

**E2E notes:** Playwright starts `npm run dev` automatically (port **3000**). In CI it uses bundled Chromium (`npx playwright install --with-deps chromium`). Locally, if browser download fails, config falls back to system Chrome (`channel: "chrome"`).

**Artifacts:** `test-results/` and `playwright-report/` are gitignored.

### Gotchas

- **`npm run preview` is blocking** and holds port **8787**. Do not run it in the same tmux session as `npm run dev` if you need both; use separate tmux sessions.
- Wrangler may log TLS/`Request.cf` warnings in restricted network environments; preview can still serve pages on **8787** once you see `Ready on http://localhost:8787`.
- If port **3000** is stuck after a crash, stop stray `next-server` / `node` dev processes and remove `.next` before restarting `npm run dev`.
- After changing `wrangler.jsonc` bindings, run `npm run cf-typegen`.
- **`npm run test:e2e` needs port 3000`** — do not run alongside `npm run dev` in the same session unless Playwright can reuse the existing server (`reuseExistingServer` is enabled outside CI).
- If Playwright E2E fails with missing browser binaries locally, run `npx playwright install chromium` or rely on system Chrome (see `playwright.config.ts`).
