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
- **Tests:** none in the repo (no test runner or CI workflows).

### Gotchas

- **`npm run preview` is blocking** and holds port **8787**. Do not run it in the same tmux session as `npm run dev` if you need both; use separate tmux sessions.
- Wrangler may log TLS/`Request.cf` warnings in restricted network environments; preview can still serve pages on **8787** once you see `Ready on http://localhost:8787`.
- If port **3000** is stuck after a crash, stop stray `next-server` / `node` dev processes and remove `.next` before restarting `npm run dev`.
- After changing `wrangler.jsonc` bindings, run `npm run cf-typegen`.
