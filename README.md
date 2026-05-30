# Next.js on Cloudflare Workers

A Next.js 15 app configured to deploy to Cloudflare Workers using [@opennextjs/cloudflare](https://opennext.js.org/cloudflare/get-started).

## Getting started

Install dependencies:

```bash
npm install
```

Run the local Next.js dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Cloudflare Workers

Preview in the Workers runtime locally:

```bash
npm run preview
```

Deploy to Cloudflare:

```bash
npm run deploy
```

You need to be logged in with Wrangler (`npx wrangler login`) before deploying.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server with Turbopack |
| `npm run build` | Standard Next.js production build |
| `npm run preview` | Build for Workers and preview locally |
| `npm run deploy` | Build and deploy to Cloudflare Workers |
| `npm run cf-typegen` | Generate TypeScript types for Wrangler bindings |
