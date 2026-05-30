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
