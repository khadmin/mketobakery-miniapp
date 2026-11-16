// GET /api/setup — បើក ម្ដង ក្នុង Browser ដើម្បី ភ្ជាប់ Bot ទៅ /api/webhook
import { tg, webhookSecret } from "./_tg.js";

export default async function handler(req, res) {
  const TOKEN = process.env.BOT_TOKEN;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (!TOKEN) return res.status(500).send("<h2>❌ មិនទាន់ មាន BOT_TOKEN ក្នុង Vercel</h2>");

  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const url = `https://${host}/api/webhook`;
  try {
    await tg(TOKEN, "setWebhook", {
      url,
      secret_token: webhookSecret(TOKEN),
      allowed_updates: ["message"],
      drop_pending_updates: true,
    });
    const info = await tg(TOKEN, "getWebhookInfo", {});
    res.status(200).send(
      `<meta name="viewport" content="width=device-width,initial-scale=1"><div style="font-family:sans-serif;padding:24px;line-height:1.7">` +
      `<h2>✅ ភ្ជាប់ Webhook ជោគជ័យ</h2><p>Bot នឹង បញ្ជូន សារ និង រូប វិក្កយបត្រ របស់ អតិថិជន ចូល Group ហាង។</p>` +
      `<p style="color:#666">Webhook: ${info.url}</p></div>`
    );
  } catch (e) {
    res.status(500).send(`<h2>❌ មិនបាន ជោគជ័យ</h2><pre>${String(e.message).replace(/</g, "&lt;")}</pre>`);
  }
}
