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

## Update 2026-11-18: field notes (essays) and form hardening
Live on futur.ca. Deployed worker versions: form hardening `79346943`, essay meta tags `2f7215da`. Git: see the log; check `git status` against `origin/main` before assuming everything is pushed.

### Field notes
- First essay, "The Dragon's War-Chant" (a ZX81 summer, tolerance for ambiguity): `public/notes/dragons-war-chant/` (EN) and `public/fr/notes/le-chant-de-guerre-du-dragon/` (FR). Each has `index.html` and a 1200×630 `og.png`; the ZX81 photo (CC BY 2.0, Mike Cattell) lives in the EN folder and the FR page points at it.
- Styles: `.essay` block appended to `public/styles.css`. Template for the next essay = copy an essay folder, change the text, the slug, the `og.png`, the canonical/hreflang/og/twitter tags, and add both URLs to `sitemap.xml` and `llms.txt`.
- Share cards are made by rendering an HTML card in headless Brave (`--screenshot`, 1200×630). The card HTML is not in the repo; rebuild from the page's A/B/C screen block.
- Copy edits agreed with Nic: fog section cut (product-owner residue that pulled the story out of itself); the "it had a name: ambiguity" moment folded into "The quiet part in the middle"; fog wording replaced by "the unknown" / "the quiet middle" (EN) and "l'inconnu" / "le grand silence du milieu" (FR).
- The closing "what this has to do with your business" box (EN and FR) is Claude's first draft, kept as is by Nic for now. FR uses "vous" there and "tu" in the story, on purpose.
- Intent: soft pull, not a blog. One page per essay, hand-picked, no CMS, no comments (spam and tracking cost), no `/notes/` index until there are 2 or 3. Essays filter for the kind of organisation Nic wants to work with.
- Home pages link to the essay from the footer.
- X card did not show on first try. Server side is fine (Twitterbot gets 200, PNG 1200×630). Explicit `twitter:*` tags added after. Retest in the composer, or with `?v=2`; X caches misses. Result not yet known.

### Contact form, hardening round 2 (`src/worker.ts`)
Probed locally with Telegram overridden (`wrangler dev --var TELEGRAM_BOT_TOKEN:bogus --var TELEGRAM_CHAT_ID:0`; never probe with `.dev.vars`, it holds the real secrets). Closed: free-text `channel` (now limited to the dropdown values, else blank), newlines in name/company/email/channel (collapsed), single-token or mostly non-Latin messages (refused with a visible EN/FR error). Left open on purpose: JSON POSTs without `t` skip honeypot and timing (agents are invited to POST per `llms.txt`); fluent LLM-written pitches still pass. Next escalations: bind `LEADS` KV to keep a record, then Cloudflare Turnstile. Nic should paste a few real junk leads from Telegram so the pattern can be read.

### Outreach and strategy
- LinkedIn is a no-go for now (Nic left that circle in 2018). Public presence goes on X, slowly. No mining of the old network.
- Christian Gelinas has seen the site; around spring 2027 Nic will ask him to introduce a few decision-makers exploring AI implementation. The setup with Christian is to be refined with Nic. Parked idea: a short forwardable "what the paper stage is" blurb.
- Nic accepts any inbound unless he doubts he can deliver or the fit feels likely to turn sour. The essays are the filter.

### Next session
1. Retest the X card (composer preview, then `?v=2`).
2. Content calendar for essays: subjects, tone, cadence, which kind of organisation each one filters for.
3. Decide on the reply form (small worker change) and on `LEADS` KV.
4. Rewrite the closing boxes in Nic's own voice when he is ready.
