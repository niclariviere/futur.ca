/**
 * futur.ca — static site + contact endpoint.
 *
 * Routes handled here (everything else is served from ./public by the ASSETS binding):
 *   GET  /            language negotiation on first visit (Accept-Language fr -> /fr/)
 *   GET  /lang/:code  remember a language choice in a cookie, then redirect
 *   POST /api/contact filter bots, validate, forward to Telegram, optionally store in KV
 *
 *   Anti-spam layers on the form, cheapest first: honeypot field, 4 s minimum fill time,
 *   Sec-Fetch-Site check, per-IP rate limit, no links in text fields, email domain must
 *   receive mail. No captcha, no third-party script, curl still works.
 */

export interface Env {
  ASSETS: Fetcher;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  LEADS?: KVNamespace;
  CONTACT_RL?: RateLimit; // wrangler.jsonc "ratelimits", per-IP burst limit on POST /api/contact
}

type Lang = "en" | "fr";

interface Lead {
  name: string;
  email: string;
  company: string;
  channel: string;
  process: string;
  lang: Lang;
  receivedAt: string;
  ip: string;
  userAgent: string;
}

const LANG_COOKIE = "lang";
const ONE_YEAR = 60 * 60 * 24 * 365;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
      return handleContact(request, env);
    }

    if (url.pathname.startsWith("/lang/")) {
      const code = url.pathname.slice("/lang/".length) === "fr" ? "fr" : "en";
      return redirect(code === "fr" ? "/fr/" : "/", { setLang: code });
    }

    if (url.pathname === "/" && request.method === "GET") {
      const chosen = readCookie(request, LANG_COOKIE);
      if (!chosen && prefersFrench(request.headers.get("accept-language"))) {
        return redirect("/fr/");
      }
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

// ---------------------------------------------------------------- contact

async function handleContact(request: Request, env: Env): Promise<Response> {
  const wantsJson = (request.headers.get("accept") ?? "").includes("application/json");
  const ip = request.headers.get("cf-connecting-ip") ?? "";
  const fields = await readFields(request);
  const lang: Lang = fields.lang === "fr" ? "fr" : "en";

  // Bot tells. These get a quiet "ok" so the sender learns nothing.
  // A real visitor cannot trip either: the honeypot is invisible and the
  // timestamp is set by the page on load, so a human always takes longer than 4 s.
  if (fields.website) return drop("honeypot", ip, lang, wantsJson);
  const startedAt = Number(fields.t);
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 4000) {
    return drop("too-fast", ip, lang, wantsJson);
  }

  // Browsers always send Sec-Fetch-Site. A form posted from another site is never ours.
  // (No header at all is fine: curl and agents do not send it.)
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return respond(lang, wantsJson, { ok: false, error: t(lang, "rejected") }, 403);
  }

  const lead: Lead = {
    name: oneLine(fields.name, 120),
    email: oneLine(fields.email, 200),
    company: oneLine(fields.company, 160),
    channel: knownChannel(fields.channel),
    process: clip(fields.process, 3000),
    lang,
    receivedAt: new Date().toISOString(),
    ip,
    userAgent: clip(request.headers.get("user-agent") ?? "", 200),
  };

  const reject = (problem: string): Response => {
    console.log(`contact rejected ${ip}: ${problem}`);
    return respond(lang, wantsJson, { ok: false, error: problem }, 400);
  };
  const problem = validate(lead, lang);
  if (problem) return reject(problem);

  // Per-IP burst limit so one script cannot fill the phone. Counted after the free
  // checks, so a visitor who fumbles a field twice is not locked out on the third try.
  if (env.CONTACT_RL && ip) {
    const { success } = await env.CONTACT_RL.limit({ key: ip });
    if (!success) {
      console.log(`contact rate-limited ${ip}`);
      return respond(lang, wantsJson, { ok: false, error: t(lang, "slowDown") }, 429);
    }
  }

  const domainProblem = await checkEmailDomain(lead.email, lang);
  if (domainProblem) return reject(domainProblem);

  const results = await Promise.allSettled([sendTelegram(lead, env), storeLead(lead, env)]);
  const telegram = results[0];
  if (telegram.status === "rejected") {
    console.error("telegram failed", telegram.reason);
    // If we could not deliver anywhere, tell the visitor instead of pretending.
    const stored = results[1].status === "fulfilled" && results[1].value;
    if (!stored) {
      return respond(lang, wantsJson, { ok: false, error: t(lang, "deliveryFailed") }, 502);
    }
  }

  return respond(lang, wantsJson, { ok: true });
}

async function readFields(request: Request): Promise<Record<string, string>> {
  const type = request.headers.get("content-type") ?? "";
  const out: Record<string, string> = {};
  if (type.includes("application/json")) {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    for (const [k, v] of Object.entries(body)) out[k] = typeof v === "string" ? v : "";
    return out;
  }
  const form = await request.formData().catch(() => null);
  if (form) for (const [k, v] of form.entries()) out[k] = typeof v === "string" ? v : "";
  return out;
}

function validate(lead: Lead, lang: Lang): string | null {
  if (!lead.name.trim()) return t(lang, "needName");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return t(lang, "needEmail");
  if (lead.process.trim().length < 10) return t(lang, "needProcess");
  // Contact-form spam exists to deliver a link. Real first messages do not need one.
  if (hasLink(lead.name) || hasLink(lead.company) || hasLink(lead.process)) return t(lang, "noLinks");
  // A real description is a sentence, not one token ("aaaaaaaaaa") and not another alphabet.
  if (lead.process.split(/\s+/).filter(Boolean).length < 2) return t(lang, "needProcess");
  if (mostlyForeignScript(lead.name + " " + lead.process)) return t(lang, "latinOnly");
  return null;
}

/** The channel field is a dropdown on the page. Anything else is not a real choice. */
const CHANNELS = ["Slack", "Microsoft Teams", "Telegram", "WhatsApp", "Email only", "Other"];
function knownChannel(value: string | undefined): string {
  const v = oneLine(value, 60);
  return CHANNELS.find((c) => c.toLowerCase() === v.toLowerCase()) ?? "";
}

/** Collapse every run of whitespace, including newlines, so a field cannot forge extra lines in the Telegram message. */
function oneLine(value: string | undefined, max: number): string {
  return (value ?? "").toString().replace(/\s+/g, " ").trim().slice(0, max);
}

/** FUTUR works in French and English. A message mostly in Cyrillic, CJK, Arabic etc. is not a lead. */
function mostlyForeignScript(text: string): boolean {
  const letters = text.match(/\p{L}/gu) ?? [];
  if (letters.length < 8) return false;
  const latin = letters.filter((ch) => /\p{Script=Latin}/u.test(ch)).length;
  return latin / letters.length < 0.6;
}

const LINK_RE =
  /(?:https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|io|co|ca|fr|ai|app|dev|me|us|uk|de|eu|id|ru|cn|in|cc|tv|ly|to|gg|pro|online|site|xyz|info|biz|link|click|top|shop|store|club|live|vip|icu|buzz|cyou|monster|quest|rest|space|tech|website|world|zip|mov|cfd|sbs|lol|bond)(?=[\/\s.,;:!?)\]]|$))/i;

function hasLink(text: string): boolean {
  return LINK_RE.test(text);
}

/**
 * The email domain must actually receive mail (MX, or at least an A record).
 * Uses DNS over HTTPS so the Worker needs no extra binding. Fails open on lookup errors:
 * a DNS hiccup must never lose a real lead.
 */
async function checkEmailDomain(email: string, lang: Lang): Promise<string | null> {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return t(lang, "needEmail");
  try {
    const has = async (type: "MX" | "A"): Promise<boolean> => {
      const res = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`,
        { headers: { accept: "application/dns-json" }, signal: AbortSignal.timeout(2500) },
      );
      if (!res.ok) throw new Error(`doh ${res.status}`);
      const body = (await res.json()) as { Status: number; Answer?: unknown[] };
      if (body.Status !== 0 && body.Status !== 3) throw new Error(`doh status ${body.Status}`);
      return body.Status === 0 && (body.Answer?.length ?? 0) > 0;
    };
    if (await has("MX")) return null;
    if (await has("A")) return null;
    return t(lang, "needEmail");
  } catch (err) {
    console.warn("email domain lookup failed, allowing", domain, err);
    return null;
  }
}

/** Log and quietly swallow a bot submission. Only for signals a human cannot trigger. */
function drop(reason: string, ip: string, lang: Lang, wantsJson: boolean): Response {
  console.log(`contact dropped (${reason}) ${ip}`);
  return respond(lang, wantsJson, { ok: true });
}

/** Belt and braces: anything that still looks like a URL is made unclickable on the phone. */
function defang(text: string): string {
  return text.replace(/:\/\//g, "[:]//").replace(/\bwww\./gi, "www[.]");
}

async function sendTelegram(lead: Lead, env: Env): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    throw new Error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not configured");
  }
  const text = [
    `📨 futur.ca lead (${lead.lang.toUpperCase()})`,
    ``,
    `Name: ${defang(lead.name)}`,
    `Email: ${lead.email}`,
    lead.company ? `Company: ${defang(lead.company)}` : null,
    lead.channel ? `Team talks on: ${defang(lead.channel)}` : null,
    ``,
    `First process to hand off:`,
    defang(lead.process),
    ``,
    `${lead.receivedAt} · ${lead.ip}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`telegram ${res.status}: ${await res.text()}`);
}

async function storeLead(lead: Lead, env: Env): Promise<boolean> {
  if (!env.LEADS) return false;
  const key = `${lead.receivedAt}_${lead.email.toLowerCase()}`;
  await env.LEADS.put(key, JSON.stringify(lead));
  return true;
}

// ---------------------------------------------------------------- helpers

function respond(lang: Lang, wantsJson: boolean, body: { ok: boolean; error?: string }, status = 200): Response {
  if (wantsJson) {
    return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  }
  if (body.ok) return redirect(lang === "fr" ? "/fr/merci/" : "/thanks/", { status: 303 });
  const back = lang === "fr" ? "/fr/" : "/";
  return redirect(`${back}?error=${encodeURIComponent(body.error ?? "")}#start`, { status: 303 });
}

function redirect(location: string, opts: { status?: number; setLang?: Lang } = {}): Response {
  const headers = new Headers({ location });
  if (opts.setLang) {
    headers.set("set-cookie", `${LANG_COOKIE}=${opts.setLang}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax; Secure`);
  }
  return new Response(null, { status: opts.status ?? 302, headers });
}

function readCookie(request: Request, name: string): string | null {
  const raw = request.headers.get("cookie");
  if (!raw) return null;
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

function prefersFrench(header: string | null): boolean {
  if (!header) return false;
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("fr");
}

function clip(value: string | undefined, max: number): string {
  return (value ?? "").toString().trim().slice(0, max);
}

const STRINGS = {
  en: {
    needName: "Please tell me your name.",
    needEmail: "That email address does not look right.",
    needProcess: "Describe the process in a sentence or two.",
    noLinks: "Please leave links out for now. I will ask for them when we talk.",
    slowDown: "Too many messages from your connection. Please wait a minute and try again.",
    rejected: "This form only accepts messages sent from futur.ca.",
    latinOnly: "Please write in English or French.",
    deliveryFailed: "The message could not be delivered. Please try again in a minute.",
  },
  fr: {
    needName: "Dites-moi votre nom.",
    needEmail: "Cette adresse courriel ne semble pas valide.",
    needProcess: "Décrivez le processus en une ou deux phrases.",
    noLinks: "Laissez les liens de côté pour l'instant. Je vous les demanderai quand on se parlera.",
    slowDown: "Trop de messages depuis votre connexion. Attendez une minute et réessayez.",
    rejected: "Ce formulaire n'accepte que les messages envoyés depuis futur.ca.",
    latinOnly: "Écrivez en français ou en anglais, s'il vous plaît.",
    deliveryFailed: "Le message n'a pas pu être livré. Réessayez dans une minute.",
  },
} as const;

function t(lang: Lang, key: keyof (typeof STRINGS)["en"]): string {
  return STRINGS[lang][key];
}
