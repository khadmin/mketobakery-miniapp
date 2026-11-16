// ម៉ឺនុយ ហាង — កែ ឈ្មោះ តម្លៃ និង រូបភាព នៅទីនេះ តែមួយកន្លែង។
// តម្លៃ ជា "សេន" (cents): 350 = $3.50 ។ Server គណនា តម្លៃ ពី ឯកសារនេះ ដូច្នេះ អតិថិជន មិនអាច កែ តម្លៃ បាន។
// image: ដាក់ ឈ្មោះ ឯកសារ រូប ក្នុង folder images/ (ឧ. "images/choco-cake.jpg") ឬ ទុក "" ដើម្បី បង្ហាញ emoji ។
// តម្លៃ ខាងក្រោម ជា តម្លៃ គំរូ — សូម ប្ដូរ ជា តម្លៃ ពិត របស់ ហាង។

export const SHOP = {
  name: "M Keto Bakery",
  currency: "USD",
  rielRate: 4000,          // អត្រា ប្ដូរ ប្រាក់ សម្រាប់ បង្ហាញ ជា រៀល។ ដាក់ 0 បើ មិនចង់ បង្ហាញ ។
  deliveryFee: 0,          // ថ្លៃ ដឹក (សេន)។ 0 = ចរចា ពេល ហាង ឆ្លើយ ។
};

export const CATEGORIES = [
  { id: "cake", name: "នំខេក" },
  { id: "bread", name: "នំប៉័ង" },
  { id: "cookie", name: "ខូគី និង នំតូចៗ" },
];

export const MENU = [
  { id: "choco-cake",  cat: "cake",   name: "នំខេក Keto សូកូឡា",       desc: "គ្មាន ស្ករ · ម្សៅ អាល់ម៉ុន", price: 1800, emoji: "🍫", image: "" },
  { id: "cheesecake",  cat: "cake",   name: "Cheesecake Keto",          desc: "ក្រែមឈីស · ស្ករ Erythritol",  price: 2000, emoji: "🍰", image: "" },
  { id: "cake-slice",  cat: "cake",   name: "នំខេក មួយចំណិត",           desc: "ជ្រើស រសជាតិ ក្នុង កំណត់សម្គាល់", price: 350,  emoji: "🧁", image: "" },
  { id: "keto-bread",  cat: "bread",  name: "នំប៉័ង Keto",               desc: "Carb ទាប · ១ ដុំ",            price: 600,  emoji: "🍞", image: "" },
  { id: "keto-bun",    cat: "bread",  name: "នំប៉័ង មូល Keto (៤ គ្រាប់)", desc: "សម្រាប់ Burger ឬ អាហារពេលព្រឹក", price: 450, emoji: "🥯", image: "" },
  { id: "cookie-box",  cat: "cookie", name: "ខូគី អាល់ម៉ុន (១០ គ្រាប់)", desc: "ស្រួយ · គ្មាន ស្ករ",           price: 500,  emoji: "🍪", image: "" },
  { id: "brownie",     cat: "cookie", name: "Brownie Keto",              desc: "សូកូឡា ខ្មៅ ៨៥%",             price: 300,  emoji: "🟫", image: "" },
];
