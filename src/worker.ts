/**
 * futur.ca — static site + contact endpoint.
 *
 * Routes handled here (everything else is served from ./public by the ASSETS binding):
 *   GET  /            language negotiation on first visit (Accept-Language fr -> /fr/)
 *   GET  /lang/:code  remember a language choice in a cookie, then redirect
 *   POST /api/contact validate, forward to Telegram, optionally store in KV
 */

export interface Env {
  ASSETS: Fetcher;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  LEADS?: KVNamespace;
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
  const fields = await readFields(request);
  const lang: Lang = fields.lang === "fr" ? "fr" : "en";

  // Honeypot: real visitors never see this field.
  if (fields.website) return respond(lang, wantsJson, { ok: true });

  const lead: Lead = {
    name: clip(fields.name, 120),
    email: clip(fields.email, 200),
    company: clip(fields.company, 160),
    channel: clip(fields.channel, 60),
    process: clip(fields.process, 3000),
    lang,
    receivedAt: new Date().toISOString(),
    ip: request.headers.get("cf-connecting-ip") ?? "",
    userAgent: clip(request.headers.get("user-agent") ?? "", 200),
  };

  const problem = validate(lead, lang);
  if (problem) return respond(lang, wantsJson, { ok: false, error: problem }, 400);

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
  return null;
}

async function sendTelegram(lead: Lead, env: Env): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    throw new Error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not configured");
  }
  const text = [
    `📨 futur.ca lead (${lead.lang.toUpperCase()})`,
    ``,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.company ? `Company: ${lead.company}` : null,
    lead.channel ? `Team talks on: ${lead.channel}` : null,
    ``,
    `First process to hand off:`,
    lead.process,
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
    deliveryFailed: "The message could not be delivered. Please try again in a minute.",
  },
  fr: {
    needName: "Dites-moi votre nom.",
    needEmail: "Cette adresse courriel ne semble pas valide.",
    needProcess: "Décrivez le processus en une ou deux phrases.",
    deliveryFailed: "Le message n'a pas pu être livré. Réessayez dans une minute.",
  },
} as const;

function t(lang: Lang, key: keyof (typeof STRINGS)["en"]): string {
  return STRINGS[lang][key];
}
