// GET /api/menu — ផ្ញើ ម៉ឺនុយ ទៅ ទំព័រ Mini App
import { SHOP, CATEGORIES, MENU } from "./_menu.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "public, max-age=60");
  res.status(200).json({ shop: SHOP, categories: CATEGORIES, menu: MENU });
}
