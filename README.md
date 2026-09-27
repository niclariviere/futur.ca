# futur.ca

Static one-page site for FUTUR inc. plus a small Cloudflare Worker that delivers the contact form to Telegram.

- `public/` — the site (English at `/`, French at `/fr/`), plain HTML/CSS, readable by browsers and agents alike
- `src/worker.ts` — language negotiation, `/lang/:code` cookie toggle, `POST /api/contact`
- `legacy/lovable/` — the 2025 Lovable-generated React app, kept for reference

## Run locally

```sh
npm install
cp .dev.vars.example .dev.vars   # fill in the Telegram bot token and chat id
npm run dev                      # http://localhost:8787
```

## Deploy

```sh
npx wrangler login
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npm run deploy
```

Then point `futur.ca` and `www.futur.ca` at the Worker (uncomment `routes` in `wrangler.jsonc`, or add the custom domains in the dashboard) and remove the Netlify CNAME.

## Telegram setup

1. Talk to @BotFather, `/newbot`, copy the token.
2. Send your new bot any message, then run `scripts/telegram-chat-id.sh` and paste the token when asked. It prints the numeric chat id.
3. Store both as secrets (above). Optional: bind a KV namespace named `LEADS` to keep a copy of every submission.
