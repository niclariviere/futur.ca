# CLAUDE.md — futur.ca

One-page bilingual site for FUTUR inc., served by a Cloudflare Worker. Read `HANDOFF.md` first for the why and the current state.

## Layout
- `public/` — the site. `index.html` (EN), `fr/index.html` (FR), `thanks/`, `fr/merci/`, `404.html`, `styles.css`, `llms.txt`, `robots.txt`, `sitemap.xml`, `favicon.svg`, `brand/futur-logo.jpg`.
- `src/worker.ts` — language negotiation on `/`, `/lang/:code` cookie toggle, `POST /api/contact` to Telegram (optional `LEADS` KV backup).
- `scripts/telegram-chat-id.sh` — prints the numeric chat id for a bot token.
- `legacy/lovable/` — the 2025 Lovable React app. Reference only. Never serve it.
- `wrangler.jsonc` — Worker `futur-ca`, assets from `public/`, custom domains `futur.ca` and `www.futur.ca`, workers.dev disabled.

## Commands
```sh
npm install
npm run typecheck      # tsc over src/
npm run dev            # wrangler dev on :8787 (needs .dev.vars, see .dev.vars.example)
npm run deploy         # wrangler deploy (Nic is logged in on the Mini)
```
Secrets live in Cloudflare, never in the repo: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.

## Rules of the house
- Plain HTML and CSS. No framework, no build step, no tracking. Agents must be able to read the page with curl.
- Two languages, always. A copy change in one language is either mirrored or consciously left divergent. FR is Nic's voice; EN is not a literal translation.
- Copy is Nic's. Do not rewrite text for style without being asked. Fix typos and accents, and say so.
- The form must never fake success. If delivery fails, the visitor sees an error.
- Design language: "operator's console printed on paper". Cream paper with dot + square grid, near-black ink, the wordmark's orange as the only accent, cool slate for holds. Sharp corners, hard offset shadows, mono for metadata, runbook section numbers. Never cyberpunk, never corporate.
- Wordmark is FU+UR (the plus is the T, in orange). Set in Jost 300 in the header and footer.
- Commit with Nic as author; end messages with the Claude co-author line. Push when asked.

## Claims on the page that must stay true
- Legion: live on Nic's own capital since April 2026, over a thousand commits, no human decision influences trades, strategies promoted paper to live on evidence.
- wemake.music: in production, self-hosted, Stripe, zero-downtime deploys, "1,000 true fans" model.
- futur.ca: plain HTML, no tracking, form delivered to Nic's phone.
If any of these stops being true, change the page the same day.
