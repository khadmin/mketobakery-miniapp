// POST /api/order — ទទួល ការកុម្ម៉ង់ ពី Mini App ហើយ ផ្ញើ ចូល Group ហាង តាម Bot
//
// ត្រូវ កំណត់ Environment Variables នៅ Vercel:
//   BOT_TOKEN     = Token ពី @BotFather (កុំ ដាក់ ក្នុង កូដ!)
//   SHOP_CHAT_ID  = ID របស់ Group ហាង (ឧ. -1001234567890)

import crypto from "node:crypto";
import { SHOP, MENU } from "./_menu.js";

const MAX_AGE_SECONDS = 24 * 60 * 60; // initData ចាស់ ជាង ២៤ ម៉ោង មិន ទទួល

// ពិនិត្យ ថា initData មក ពី Telegram ពិតប្រាកដ (ហត្ថលេខា HMAC)
export function verifyInitData(initData, botToken) {
  if (!initData || typeof initData !== "string") return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const expected = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  const authDate = Number(params.get("auth_date") || 0);
  if (!authDate || Date.now() / 1000 - authDate > MAX_AGE_SECONDS) return null;

  try {
    return { user: JSON.parse(params.get("user") || "null"), authDate };
  } catch {
    return null;
  }
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const money = (cents) => `$${(cents / 100).toFixed(2)}`;

export function normalizePhone(raw) {
  const p = String(raw || "").replace(/[\s\-().]/g, "");
  if (/^\+855\d{8,9}$/.test(p)) return p;
  if (/^855\d{8,9}$/.test(p)) return "+" + p;
  if (/^0\d{8,9}$/.test(p)) return "+855" + p.slice(1);
  return null;
}

// គណនា តម្លៃ នៅ Server ពី ម៉ឺនុយ (មិន ជឿ តម្លៃ ពី អតិថិជន)
export function buildOrder(items) {
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) return null;
  const lines = [];
  let subtotal = 0;
  for (const it of items) {
    const product = MENU.find((m) => m.id === it?.id);
    const qty = Math.floor(Number(it?.qty));
    if (!product || !Number.isFinite(qty) || qty < 1 || qty > 99) return null;
    const lineTotal = product.price * qty;
    subtotal += lineTotal;
    lines.push({ name: product.name, qty, lineTotal });
  }
  const delivery = SHOP.deliveryFee || 0;
  return { lines, subtotal, delivery, total: subtotal + delivery };
}

async function tg(botToken, method, body) {
  const r = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!data.ok) throw new Error(`Telegram ${method} failed: ${data.description || r.status}`);
  return data.result;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "POST only" });

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const SHOP_CHAT_ID = process.env.SHOP_CHAT_ID;
  if (!BOT_TOKEN || !SHOP_CHAT_ID) {
    return res.status(500).json({ ok: false, error: "Server មិនទាន់ កំណត់ BOT_TOKEN ឬ SHOP_CHAT_ID" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

  const auth = verifyInitData(body.initData, BOT_TOKEN);
  if (!auth) return res.status(401).json({ ok: false, error: "សូម បើក ពី Telegram ម្ដងទៀត" });

  const order = buildOrder(body.items);
  if (!order) return res.status(400).json({ ok: false, error: "កន្ត្រក មិន ត្រឹមត្រូវ" });

  const c = body.customer || {};
  const name = String(c.name || "").trim().slice(0, 80);
  const phone = normalizePhone(c.phone);
  const address = String(c.address || "").trim().slice(0, 300);
  const note = String(c.note || "").trim().slice(0, 300);
  const payment = c.payment === "khqr" ? "KHQR / Bakong" : "បង់ ពេល ទទួល";
  if (!name || !phone || !address) {
    return res.status(400).json({ ok: false, error: "សូម បំពេញ ឈ្មោះ លេខទូរស័ព្ទ និង អាសយដ្ឋាន" });
  }

  const orderNo = "M" + Date.now().toString(36).toUpperCase().slice(-6);
  const u = auth.user || {};
  const tgName = [u.first_name, u.last_name].filter(Boolean).join(" ");
  const tgLink = u.username ? `@${esc(u.username)}` : u.id ? `<a href="tg://user?id=${u.id}">${esc(tgName || "អតិថិជន")}</a>` : "";

  const itemsText = order.lines.map((l) => `• ${esc(l.name)} × ${l.qty} = ${money(l.lineTotal)}`).join("\n");
  const text =
    `🧾 <b>ការកុម្ម៉ង់ថ្មី ${orderNo}</b>\n\n` +
    `${itemsText}\n\n` +
    (order.delivery ? `ថ្លៃដឹក: ${money(order.delivery)}\n` : "") +
    `<b>សរុប: ${money(order.total)}</b>\n` +
    `ការបង់ប្រាក់: ${payment}\n\n` +
    `👤 ${esc(name)} ${tgLink}\n` +
    `📞 ${esc(phone)}\n` +
    `📍 ${esc(address)}` +
    (note ? `\n📝 ${esc(note)}` : "") +
    (u.id ? `\nID: ${u.id}\n<i>↩️ Reply លើ សារនេះ ដើម្បី ឆ្លើយ ទៅ អតិថិជន</i>` : "");

  try {
    await tg(BOT_TOKEN, "sendMessage", { chat_id: SHOP_CHAT_ID, text, parse_mode: "HTML" });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ ok: false, error: "ផ្ញើ ទៅ ហាង មិនបាន សូម ព្យាយាម ម្ដងទៀត" });
  }

  // ផ្ញើ វិក្កយបត្រ ទៅ អតិថិជន ផង (បើ បរាជ័យ ក៏ មិនអីដែរ)
  if (u.id) {
    const customerText =
      `✅ <b>${esc(SHOP.name)}</b> បាន ទទួល ការកុម្ម៉ង់ ${orderNo}\n\n${itemsText}\n\n<b>សរុប: ${money(order.total)}</b>\n` +
      `ហាង នឹង ទាក់ទង អ្នក ឆាប់ៗ នេះ។ អរគុណ! 💚`;
    tg(BOT_TOKEN, "sendMessage", { chat_id: u.id, text: customerText, parse_mode: "HTML" }).catch(() => {});
  }

  return res.status(200).json({ ok: true, orderNo, total: order.total });
}
