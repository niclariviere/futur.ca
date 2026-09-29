# HANDOFF — futur.ca

Checkpoint written 2026-09-28. Everything below is live at https://www.futur.ca and pushed to `main`.

## What FUTUR is
FUTUR inc. is the holding company for what Nic Larivière builds (Legion, wemake.music, and future ventures) and a one-person studio that takes a few client engagements to fund them. The site is the studio's offer.

## The offer, in one line
**Agents that do the work, under governance.** FUTUR designs, deploys and operates AI agents that act inside businesses of 5 to 50 people. Each agent earns autonomy through a three-rung ladder (paper, supervised, autonomous), every action lands in a ledger the owner can read, and demotion is one rung down, never a debate. The ladder is lifted directly from Legion's evidence ladder for trading strategies.

Why this and not "bot development": the thing that stops a business owner from using agents is not the technology, it is trust. Trust is the product. Nic is one of few people who has run autonomous agents unattended, on his own money, for months. That is the case study.

## The page, section by section (the funnel)
01 Hero: promise + illustrative ledger · 02 Problem: you want an agent to act, you don't trust it · 03 How: the ladder + agent/ledger/operator · 04 Proof: Legion, wemake.music, this site · 05 Studio: fit / not a fit · 06 Start: form asking for the one process to hand off first.

## History
- 2025: Lovable-generated cyberpunk one-pager ("Summon AI wizards"), Netlify, fake form, never iterated. Kept in `legacy/lovable/`.
- 2026-09-24: audit, repositioning, rebuild as plain HTML + Worker, Telegram form, deploy to Cloudflare, DNS moved off Netlify.
- 2026-09-26: design pass (console on paper), FU+UR wordmark and orange accent, visible grid.
- 2026-09-27/28: Nic's French copy revisions from an annotated PDF; EN kept intentionally divergent except the wemake "1,000 true fans" line.
- 2026-09-28: first spam through the form (LLM-written text echoing the page, throwaway email domain, six-day-old link domain, AWS IP). Walked past the honeypot. Added the anti-spam layers below.

## Infrastructure
- Cloudflare account `2da0d656…`, Worker `futur-ca`, custom domains `futur.ca` + `www.futur.ca`. workers.dev and preview URLs disabled.
- DNS zone on Cloudflare. Web records are managed by the Worker's custom domains. Mail records (iCloud MX, DKIM, SPF) untouched.
- Telegram: leads arrive in Nic's private chat with the bot (chat id is a 10-digit number, stored as a secret). Replying in that chat reaches nobody; answer leads by email.
- No analytics, no KV bound yet. `LEADS` KV is scaffolded in the worker and commented out in `wrangler.jsonc`.
- Form anti-spam, in `src/worker.ts`, cheapest first: honeypot field `website`; hidden `t` set by the page on load, submissions under 4 s are dropped; `Sec-Fetch-Site: cross-site` refused; no links in name/company/process (regex on `://`, `www.`, bare domain with a common TLD); rate limit binding `CONTACT_RL`, 3 sends per IP per minute, counted after the free checks; email domain must have MX or A (DNS over HTTPS, fails open). Honeypot and timing return a quiet `ok` because a human cannot trip them; every other rule shows the visitor an error. Anything URL-like that still gets through is defanged before Telegram. Drops and rejections are logged with the reason and IP, visible in the Worker's observability logs. No captcha, no third-party script, curl still works. Escalation if it keeps up: Cloudflare Turnstile on the form, at the cost of a script.

## Known gaps / next candidates
1. **Outreach.** The page is done enough. The step that decides whether the offer is real is five conversations with owners of 5–50 person businesses. Nic's Reelrail playbook (`~/postproductor/ops/`) has the outreach shape. This has been the unfinished stage on every previous venture; name it.
2. **Agent on the page.** A live agent visitors (and their agents) can talk to, reachable from the site and from Telegram, as the third proof. Build only after the first real lead.
3. **Reply button in the Telegram lead** (deep link to a pre-filled mailto).
4. **OG image** at 1200×630 (currently the logo JPEG).
5. **LEADS KV** backup so a Telegram outage never loses a lead.
6. **Tagline.** Rejected: "FUTUR vous appartient" (cliché, wrong conjugation). Candidate Nic liked the reasoning for: "FUTUR. Des agents qui vous appartiennent." Not on the page yet.
7. Wordmark: if a vector of the logo exists, swap the typed plus for the drawn one.

## People and preferences
- Nic writes French on the iMac and English in this CLI (accent dead-keys don't survive keyboard sharing to the Mini). Accents in French copy are set by Claude when placing text.
- Nic reviews copy in Apple Notes and exports an annotated PDF: italic underline = change, strikethrough = delete. Unmarked differences count too.
- Nic's stance: build the site around the only credible case study, himself; storytelling yes, cyberpunk never; sharp and technical, not corporate.
