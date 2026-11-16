// ជំនួយ សម្រាប់ ហៅ Telegram Bot API (ឯកសារ ដែល ចាប់ផ្ដើម ដោយ _ មិនមែន ជា API ទេ)
import crypto from "node:crypto";

export async function tg(botToken, method, body) {
  const r = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!data.ok) throw new Error(`Telegram ${method} failed: ${data.description || r.status}`);
  return data.result;
}

// លេខសម្ងាត់ សម្រាប់ Webhook — បង្កើត ពី BOT_TOKEN ដូច្នេះ មិនចាំបាច់ កំណត់ អ្វី បន្ថែម
export function webhookSecret(botToken) {
  return crypto.createHash("sha256").update("webhook:" + botToken).digest("hex").slice(0, 48);
}

export const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
