// POST /api/webhook — Telegram ផ្ញើ សារ ដែល អតិថិជន ផ្ញើ មក Bot មកទីនេះ
//
// • អតិថិជន ផ្ញើ រូប វិក្កយបត្រ KHQR ឬ សារ មក Bot  → Bot បញ្ជូន ចូល Group ហាង
// • បុគ្គលិក ហាង Reply លើ សារ នោះ ក្នុង Group      → Bot ផ្ញើ ចម្លើយ ទៅ អតិថិជន វិញ
// • អតិថិជន ចុច /start                              → Bot ស្វាគមន៍ និង បង្ហាញ ប៊ូតុង កុម្ម៉ង់

import { tg, webhookSecret, esc } from "./_tg.js";

const ID_RE = /ID:\s*(\d+)/;

function customerHeader(from) {
  const name = [from.first_name, from.last_name].filter(Boolean).join(" ") || "អតិថិជន";
  const user = from.username ? ` @${esc(from.username)}` : "";
  return `📩 <b>សារ ពី អតិថិជន</b>\n👤 ${esc(name)}${user}\nID: ${from.id}\n<i>↩️ Reply លើ សារនេះ ដើម្បី ឆ្លើយ ទៅ អតិថិជន</i>`;
}

async function handlePrivate(TOKEN, SHOP, msg, appUrl) {
  const from = msg.from || {};
  const chatId = msg.chat.id;

  if (msg.text && msg.text.startsWith("/start")) {
    await tg(TOKEN, "sendMessage", {
      chat_id: chatId,
      text: "សូមស្វាគមន៍ មកកាន់ M Keto Bakery 💚\nនំ Keto គ្មាន ស្ករ។ ចុច ប៊ូតុង ខាងក្រោម ដើម្បី មើល ម៉ឺនុយ និង កុម្ម៉ង់។\n\nបន្ទាប់ពី បង់ប្រាក់ តាម KHQR សូម ផ្ញើ រូប វិក្កយបត្រ មក Chat នេះ។",
      reply_markup: { inline_keyboard: [[{ text: "🛒 កុម្ម៉ង់នំ", web_app: { url: appUrl } }]] },
    });
    return;
  }

  const header = customerHeader(from);
  if (msg.text) {
    await tg(TOKEN, "sendMessage", { chat_id: SHOP, text: `${header}\n\n💬 ${esc(msg.text)}`, parse_mode: "HTML" });
  } else {
    // រូប ឯកសារ វីដេអូ ... — ចម្លង ទៅ Group ជាមួយ ព័ត៌មាន អតិថិជន
    const caption = header + (msg.caption ? `\n\n💬 ${esc(msg.caption)}` : "");
    try {
      await tg(TOKEN, "copyMessage", { chat_id: SHOP, from_chat_id: chatId, message_id: msg.message_id, caption, parse_mode: "HTML" });
    } catch {
      // Sticker / សំឡេង មួយចំនួន មិនអាច មាន caption — ផ្ញើ ព័ត៌មាន ដាច់ដោយឡែក
      await tg(TOKEN, "sendMessage", { chat_id: SHOP, text: header, parse_mode: "HTML" });
      await tg(TOKEN, "copyMessage", { chat_id: SHOP, from_chat_id: chatId, message_id: msg.message_id });
    }
  }

  const isReceipt = msg.photo || msg.document;
  await tg(TOKEN, "sendMessage", {
    chat_id: chatId,
    text: isReceipt ? "✅ ហាង បាន ទទួល រូប វិក្កយបត្រ របស់អ្នក ហើយ។ អរគុណ! 💚" : "✅ ហាង បាន ទទួល សារ របស់អ្នក ហើយ នឹង ឆ្លើយ ឆាប់ៗ។",
  }).catch(() => {});
}

async function handleShopReply(TOKEN, msg) {
  const replied = msg.reply_to_message;
  if (!replied || !replied.from || !replied.from.is_bot) return;
  const m = ID_RE.exec(replied.text || replied.caption || "");
  if (!m) return;
  const customerId = Number(m[1]);
  try {
    await tg(TOKEN, "copyMessage", { chat_id: customerId, from_chat_id: msg.chat.id, message_id: msg.message_id });
    await tg(TOKEN, "sendMessage", { chat_id: msg.chat.id, text: "✓ បាន ផ្ញើ ទៅ អតិថិជន", reply_parameters: { message_id: msg.message_id } });
  } catch (e) {
    await tg(TOKEN, "sendMessage", {
      chat_id: msg.chat.id,
      text: "⚠️ ផ្ញើ ទៅ អតិថិជន មិនបាន (ប្រហែល អតិថិជន មិនទាន់ ចុច START ក្នុង Bot)",
      reply_parameters: { message_id: msg.message_id },
    }).catch(() => {});
  }
}

export default async function handler(req, res) {
  const TOKEN = process.env.BOT_TOKEN;
  const SHOP = process.env.SHOP_CHAT_ID;
  if (req.method !== "POST") return res.status(200).send("Webhook OK");
  if (!TOKEN || !SHOP) return res.status(200).json({ ok: false });

  if (req.headers["x-telegram-bot-api-secret-token"] !== webhookSecret(TOKEN)) {
    return res.status(401).json({ ok: false });
  }

  const update = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const msg = update.message;
  const appUrl = `https://${req.headers["x-forwarded-host"] || req.headers.host}`;

  try {
    if (msg && msg.chat) {
      if (msg.chat.type === "private") await handlePrivate(TOKEN, SHOP, msg, appUrl);
      else if (String(msg.chat.id) === String(SHOP)) await handleShopReply(TOKEN, msg);
    }
  } catch (e) {
    console.error(e);
  }
  // ឆ្លើយ 200 ជានិច្ច ដើម្បី កុំ ឲ្យ Telegram ផ្ញើ ម្ដងហើយម្ដងទៀត
  return res.status(200).json({ ok: true });
}
