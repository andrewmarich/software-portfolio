# marich.dev

Personal portfolio for Andrew Marich. Mostly static [Astro](https://astro.build) with React islands for the interactive pieces (boot sequence, hidden terminal, achievements), styled with Tailwind CSS 4 and served from Cloudflare.

Content mirrors my resume; the resume is the source of truth for roles, dates, and claims.

## Development

```sh
bun install
bun dev          # http://localhost:4321
bun run build    # static output in ./dist
bun run lint
bun run format:check
```

Requires Node 22.12+.
