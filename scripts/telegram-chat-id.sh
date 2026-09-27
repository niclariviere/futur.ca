#!/usr/bin/env bash
# Prints the numeric chat ids that have talked to your bot.
# 1. Open Telegram, find your bot, send it any message (e.g. "hello").
# 2. Run this script and paste the bot token when asked (input is hidden).
set -euo pipefail
read -rsp "Bot token: " TOKEN; echo
RESP=$(curl -s "https://api.telegram.org/bot${TOKEN}/getUpdates")
if ! echo "$RESP" | grep -q '"ok":true'; then
  echo "Telegram refused the token:"; echo "$RESP"; exit 1
fi
python3 - "$RESP" <<'PY'
import json, sys
data = json.loads(sys.argv[1])
seen = {}
for u in data.get("result", []):
    m = u.get("message") or u.get("edited_message") or u.get("channel_post") or {}
    c = m.get("chat")
    if c: seen[c["id"]] = f'{c.get("type")}: {c.get("first_name") or c.get("title") or ""} {c.get("last_name") or ""} @{c.get("username") or ""}'
if not seen:
    print("No messages yet. Send your bot a message in Telegram first, then run this again.")
else:
    print("\nChat ids:")
    for cid, who in seen.items(): print(f"  {cid}   {who.strip()}")
    print("\nThen run:  npx wrangler secret put TELEGRAM_CHAT_ID   and paste the number.")
PY
