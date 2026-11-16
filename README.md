# M Keto Bakery — Telegram Mini App លក់នំ

Mini App នេះ មាន៖ ម៉ឺនុយ តាម ប្រភេទ · កន្ត្រក · ទម្រង់ ឈ្មោះ/លេខទូរស័ព្ទ/អាសយដ្ឋាន · ជម្រើស បង់ប្រាក់ (បង់ ពេល ទទួល ឬ KHQR) · ផ្ញើ ការកុម្ម៉ង់ ចូល Group ហាង និង ផ្ញើ វិក្កយបត្រ ទៅ អតិថិជន។

## ឯកសារ

| ឯកសារ | តួនាទី |
|---|---|
| `index.html` | ទំព័រ Mini App (ម៉ឺនុយ កន្ត្រក ទម្រង់) |
| `api/_menu.js` | **ម៉ឺនុយ និង តម្លៃ — កែ នៅទីនេះ** |
| `api/menu.js` | ផ្ញើ ម៉ឺនុយ ទៅ ទំព័រ |
| `api/order.js` | ពិនិត្យ ថា មក ពី Telegram ពិត គណនា តម្លៃ ហើយ ផ្ញើ ចូល Group ហាង |
| `logo.png` | **ដាក់ ឡូហ្គោ M Keto Bakery (រាងការ៉េ)** |
| `khqr.png` | (មិនចាំបាច់) រូប KHQR របស់ ហាង |
| `images/` | (មិនចាំបាច់) រូបថត នំ |

---

## ជំហាន ១ — ដាក់ ឡូហ្គោ ម៉ឺនុយ និង រូប

1. ដាក់ ឡូហ្គោ ឈ្មោះ `logo.png` ក្នុង folder នេះ (បើ គ្មាន ទំព័រ នឹង បង្ហាញ ឡូហ្គោ បណ្ដោះអាសន្ន)។
2. បើក `api/_menu.js` ហើយ កែ ឈ្មោះ និង **តម្លៃ** (ជា សេន: `1800` = $18.00)។ តម្លៃ ក្នុង ឯកសារនេះ ជា តម្លៃ គំរូ។
3. បើ មាន រូបថត នំ ដាក់ ក្នុង `images/` ហើយ សរសេរ `image: "images/choco-cake.jpg"`។
4. បើ ចង់ ប្រើ KHQR ដាក់ រូប QR ហាង ឈ្មោះ `khqr.png`។

## ជំហាន ២ — បង្កើត Bot និង Group ហាង

1. ក្នុង Telegram បើក **@BotFather** → ផ្ញើ `/newbot` → ដាក់ ឈ្មោះ និង username (បញ្ចប់ ដោយ `bot`)។
2. ចម្លង **Token** ទុក ឲ្យ សម្ងាត់ (កុំ ដាក់ ក្នុង កូដ ឬ ផ្ញើ ឲ្យ អ្នកណា)។
3. បង្កើត Group ហាង ហើយ **បន្ថែម Bot ចូល Group**។
4. រក **SHOP_CHAT_ID**៖ ផ្ញើ សារ មួយ ក្នុង Group រួច បើក Link នេះ ក្នុង Browser (ដាក់ Token ជំនួស `<TOKEN>`)៖
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
   រក `"chat":{"id":-100...` — លេខ ដែល ចាប់ផ្ដើម ដោយ `-` គឺ SHOP_CHAT_ID។
   បើ មិន ឃើញ៖ ដក Bot ចេញ ហើយ បន្ថែម ចូល វិញ រួច បើក Link ម្ដងទៀត។

## ជំហាន ៣ — ដាក់ លើ Vercel (ឥតគិតថ្លៃ)

1. ចុះឈ្មោះ https://github.com និង https://vercel.com (ចូល Vercel ដោយ GitHub)។
2. នៅ GitHub បង្កើត Repository ថ្មី → **Add file → Upload files** → អូស ឯកសារ ទាំងអស់ ក្នុង folder នេះ ចូល → **Commit**។
3. នៅ Vercel ចុច **Add New → Project** → ជ្រើស Repository → មុន ចុច Deploy បើក **Environment Variables** ហើយ បន្ថែម៖
   - `BOT_TOKEN` = Token ពី BotFather
   - `SHOP_CHAT_ID` = លេខ Group ពី ជំហាន ២
4. ចុច **Deploy**។ អ្នក នឹង ទទួល Link ដូចជា `https://m-keto-miniapp.vercel.app`។
5. សាកល្បង៖ បើក `https://<link>/api/menu` ត្រូវ ឃើញ ម៉ឺនុយ ជា JSON។

> បើ កែ Environment Variables ក្រោយ Deploy រួច ត្រូវ ចុច **Redeploy** ទើប វា ប្រើ តម្លៃ ថ្មី។

## ជំហាន ៤ — ភ្ជាប់ Mini App ទៅ Bot

1. @BotFather → `/mybots` → ជ្រើស Bot → **Bot Settings → Configure Mini App → Enable Mini App** → បិទភ្ជាប់ Link Vercel។
2. (ល្អ ណាស់) **Bot Settings → Menu Button** → ដាក់ Link ដដែល និង ឈ្មោះ ប៊ូតុង ឧ. `🛒 កុម្ម៉ង់`។
3. បើក Bot លើ ទូរស័ព្ទ → ចុច ប៊ូតុង → សាក កុម្ម៉ង់ មួយ → ពិនិត្យ ថា សារ ចូល Group ហាង។

ឈ្មោះ Menu ក្នុង BotFather អាច ប្រែប្រួល តាម កំណែ Telegram។ BotFather ក៏ មាន Mini App ផ្ទាល់ខ្លួន សម្រាប់ កំណត់ ដូចគ្នា។

## ពេល មាន បញ្ហា

| អ្វី ដែល ឃើញ | មូលហេតុ និង វិធីដោះស្រាយ |
|---|---|
| ផ្ទាំង លឿង «កំពុង បើក ជា Demo» | ទំព័រ ហៅ `/api/menu` មិនបាន — ពិនិត្យ ថា Deploy លើ Vercel ជោគជ័យ |
| «Server មិនទាន់ កំណត់ BOT_TOKEN...» | មិនទាន់ ដាក់ Environment Variables ឬ មិនទាន់ Redeploy |
| «សូម បើក ពី Telegram ម្ដងទៀត» | បើក ក្នុង Browser ធម្មតា ឬ BOT_TOKEN ខុស Bot |
| «ផ្ញើ ទៅ ហាង មិនបាន» | SHOP_CHAT_ID ខុស ឬ Bot មិន នៅ ក្នុង Group — មើល Logs នៅ Vercel → Project → Logs |

## សុវត្ថិភាព

- Token នៅ តែ លើ Server (Vercel Environment Variables) ប៉ុណ្ណោះ។ បើ Token លេចធ្លាយ ចូល @BotFather → `/revoke` ដើម្បី ប្ដូរ Token ថ្មី។
- Server គណនា តម្លៃ ពី `api/_menu.js` ដូច្នេះ អតិថិជន មិនអាច កែ តម្លៃ បាន។
- Server ពិនិត្យ ហត្ថលេខា `initData` របស់ Telegram ដូច្នេះ ការកុម្ម៉ង់ ក្លែងក្លាយ ពី ខាងក្រៅ Telegram ត្រូវ បដិសេធ។
- KHQR ក្នុង កំណែ នេះ ជា ការ ផ្ទៀងផ្ទាត់ ដោយ ដៃ (អតិថិជន ផ្ញើ រូប វិក្កយបត្រ)។ បើ ចង់ ផ្ទៀងផ្ទាត់ ស្វ័យប្រវត្តិ ត្រូវ ភ្ជាប់ API ពី ធនាគារ នៅ លើ Server។
