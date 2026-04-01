// ── Topping price (default, per item override with toppingPrice) ──────────────
export const TOPPING_PRICE = 8;

// ── Available toppings ────────────────────────────────────────────────────────
export const TOPPINGS = [
  'זיתים ירוקים',
  'זיתים שחורים',
  'פטריות',
  'תירס',
  'עגבניות',
  'בצל',
  'פלפל חריף',
  'בולגרית',
  'קלמטה',
  'חציל',
  'בטטה',
  'אננס',
];

// ── Menu items ────────────────────────────────────────────────────────────────
//
// Fields:
//   buildOwn          → opens topping selector
//   unlimitedToppings → toppings are free (price already baked in)
//   toppingPrice      → per-item override of TOPPING_PRICE
//   noToppings        → item has no toppings available
//   addons            → array of extra options shown in modal
//     { id, label, price, recommended, type:'checkbox'|'select', required, options:[{id,label}] }
//   note              → info note shown in modal (e.g. "כולל פרמזן בצד")
//   category          → 'pizza' | 'chefs' | 'pasta' | 'salad' | 'side'

export const MENU_ITEMS = [

  // ── Standard Pizzas ──────────────────────────────────────────────────────
  {
    id: 'regular-pizza',
    name: 'פיצה רגילה',
    price: 30,
    category: 'pizza',
    buildOwn: true,
    emoji: '🍕',
    image: '', // ← Photo 10 (margherita) — paste Cloudinary URL here
    description: 'פיצה משפחתית + תוספות לבחירה',
  },
  {
    id: 'xl-pizza',
    name: 'פיצה XL',
    price: 42,
    category: 'pizza',
    buildOwn: true,
    emoji: '🍕',
    description: 'פיצה ענקית + תוספות לבחירה',
    tag: 'XL',
    tagColor: '#7C3AED',
  },
  {
    id: 'personal',
    name: 'פיצה אישית',
    price: 20,
    category: 'pizza',
    buildOwn: false,
    emoji: '🍕',
    description: 'פיצה אישית',
  },
  {
    id: 'personal-unlimited',
    name: 'פיצה אישית + תוספות ללא הגבלה',
    price: 25,
    category: 'pizza',
    buildOwn: true,
    unlimitedToppings: true,
    emoji: '🍕',
    description: 'פיצה אישית עם תוספות ללא הגבלה',
    tag: 'ללא הגבלה',
    tagColor: '#E31837',
  },
  {
    id: 'vegan',
    name: 'פיצה טבעונית',
    price: 37,
    category: 'pizza',
    buildOwn: true,
    isVegan: true,
    emoji: '🌱',
    image: 'https://res.cloudinary.com/dq34u3zz1/image/upload/v1775001358/%D7%98%D7%91%D7%A2%D7%95%D7%A0%D7%99%D7%AA_gjgexw.jpg',
    description: 'בצק טבעוני, גבינה טבעונית + תוספות לבחירה',
    tag: '🌱 טבעוני',
    tagColor: '#22c55e',
  },
  {
    id: 'gluten-free',
    name: 'פיצה ללא גלוטן',
    price: 37,
    category: 'pizza',
    buildOwn: true,
    emoji: '🌾',
    image: 'https://res.cloudinary.com/dq34u3zz1/image/upload/v1775001362/%D7%9C%D7%9C%D7%90_%D7%92%D7%9C%D7%95%D7%98%D7%9F_bqop6d.jpg',
    description: 'בצק ללא גלוטן + תוספות לבחירה',
    tag: 'ללא גלוטן',
    tagColor: '#3b82f6',
  },
  {
    id: 'alfredo-cream',
    name: 'פיצה אלפרדו שמנת',
    price: 45,
    category: 'pizza',
    buildOwn: false,
    emoji: '🍕',
    description: 'רוטב שמנת אלפרדו עשיר',
    tag: 'פרמיום',
    tagColor: '#FFC107',
    tagTextColor: '#1A1A1A',
  },
  {
    id: 'alfredo-mushroom',
    name: 'פיצה אלפרדו פטריות טרי',
    price: 50,
    category: 'pizza',
    buildOwn: true,
    emoji: '🍄',
    image: 'https://res.cloudinary.com/dq34u3zz1/image/upload/v1775001357/%D7%90%D7%9C%D7%A4%D7%A8%D7%93%D7%95_-_%D7%A9%D7%9E%D7%A0%D7%AA_%D7%A4%D7%98%D7%A8%D7%99%D7%95%D7%AA_k6jpxb.jpg',
    description: 'שמנת אלפרדו, פטריות טריות + תוספות לבחירה',
    tag: 'פרמיום',
    tagColor: '#FFC107',
    tagTextColor: '#1A1A1A',
  },

  // ── Chef's Pizzas ─────────────────────────────────────────────────────────
  {
    id: 'chef-israeli',
    name: 'הישראלית',
    price: 42,
    category: 'chefs',
    buildOwn: false,
    emoji: '🍕',
    image: 'https://res.cloudinary.com/dq34u3zz1/image/upload/v1775001359/%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99%D7%AA_vwtxfn.jpg',
    description: 'זיתים, תירס, פטריות',
    tag: 'המלצת השף',
    tagColor: '#F59E0B',
    tagTextColor: '#1A1A1A',
  },
  {
    id: 'chef-spicy',
    name: 'החריפה',
    price: 42,
    category: 'chefs',
    buildOwn: false,
    emoji: '🌶️',
    image: 'https://res.cloudinary.com/dq34u3zz1/image/upload/v1775001358/%D7%97%D7%A8%D7%99%D7%A4%D7%94_qcby17.jpg',
    description: 'עגבניות, פלפל חריף, בצל',
    tag: 'המלצת השף',
    tagColor: '#F59E0B',
    tagTextColor: '#1A1A1A',
  },
  {
    id: 'chef-alfredo',
    name: 'אלפרדו',
    price: 45,
    category: 'chefs',
    buildOwn: false,
    emoji: '🍕',
    description: 'פיצת שמנת אלפרדו',
    tag: 'המלצת השף',
    tagColor: '#F59E0B',
    tagTextColor: '#1A1A1A',
  },
  {
    id: 'chef-hawaii',
    name: 'הוואי',
    price: 42,
    category: 'chefs',
    buildOwn: false,
    emoji: '🍍',
    description: 'אננס, פלפל חריף, בולגרית',
    tag: 'המלצת השף',
    tagColor: '#F59E0B',
    tagTextColor: '#1A1A1A',
  },
  {
    id: 'chef-unlimited',
    name: 'פיצה ללא הגבלת תוספות',
    price: 46,
    category: 'chefs',
    buildOwn: true,
    unlimitedToppings: true,
    emoji: '🍕',
    description: 'בחרו כמה תוספות שתרצו — ללא תוספת מחיר',
    tag: 'ללא הגבלה',
    tagColor: '#E31837',
  },
  {
    id: 'chef-greek',
    name: 'יוונית',
    price: 42,
    category: 'chefs',
    buildOwn: false,
    emoji: '🫒',
    image: 'https://res.cloudinary.com/dq34u3zz1/image/upload/v1775001360/%D7%99%D7%95%D7%95%D7%A0%D7%99%D7%AA_sneepg.jpg',
    description: 'בולגרית, עגבניות, זיתים שחורים',
    tag: 'המלצת השף',
    tagColor: '#F59E0B',
    tagTextColor: '#1A1A1A',
  },
  {
    id: 'chef-cheesy-crust',
    name: 'פיצה שוליים גבינה',
    price: 45,
    category: 'chefs',
    buildOwn: false,
    noToppings: true,
    emoji: '🧀',
    description: 'גבינה נמסה בתוך שוליים פריכים',
    tag: 'מומלץ!',
    tagColor: '#E31837',
  },

  // ── Pasta ─────────────────────────────────────────────────────────────────
  {
    id: 'pasta-penne',
    name: 'פסטה פנה',
    price: 38,
    category: 'pasta',
    buildOwn: false,
    emoji: '🍝',
    description: 'פנה עם רוטב לבחירה',
    addons: [
      {
        id: 'sauce',
        label: 'בחרו רוטב',
        type: 'select',
        required: true,
        options: [
          { id: 'tomato',          label: 'רוטב עגבניות' },
          { id: 'rose',            label: 'רוטב רוזה' },
          { id: 'mushroom-cream',  label: 'שמנת פטריות' },
        ],
      },
      { id: 'cheese-gratin', label: 'גרטן גבינה מעל', price: 7, recommended: true },
    ],
  },
  {
    id: 'ravioli-sweet-potato',
    name: 'ראביולי בטטה',
    price: 49,
    category: 'pasta',
    buildOwn: false,
    emoji: '🍝',
    description: 'ראביולי בטטה עם רוטב לבחירה',
    note: 'כולל פרמזן בצד',
    addons: [
      {
        id: 'sauce',
        label: 'בחרו רוטב',
        type: 'select',
        required: true,
        options: [
          { id: 'tomato',         label: 'רוטב עגבניות' },
          { id: 'rose',           label: 'רוטב רוזה' },
          { id: 'mushroom-cream', label: 'שמנת פטריות' },
        ],
      },
      { id: 'cheese-gratin', label: 'גרטן גבינה מעל', price: 8, recommended: true },
    ],
  },
  {
    id: 'ravioli-cheese',
    name: 'ראביולי גבינה',
    price: 49,
    category: 'pasta',
    buildOwn: false,
    emoji: '🧀',
    description: 'ראביולי גבינה עם רוטב לבחירה',
    note: 'כולל פרמזן בצד',
    addons: [
      {
        id: 'sauce',
        label: 'בחרו רוטב',
        type: 'select',
        required: true,
        options: [
          { id: 'tomato',         label: 'רוטב עגבניות' },
          { id: 'rose',           label: 'רוטב רוזה' },
          { id: 'mushroom-cream', label: 'שמנת פטריות' },
        ],
      },
      { id: 'cheese-gratin', label: 'גרטן גבינה מעל', price: 8, recommended: true },
    ],
  },

  // ── Salads ────────────────────────────────────────────────────────────────
  {
    id: 'salad-classic',
    name: 'סלט קלאסי',
    price: 22,
    category: 'salad',
    buildOwn: false,
    emoji: '🥗',
    description: 'מלפפון, עגבנייה, בצל',
    addons: [
      { id: 'egg', label: 'הוספת ביצה', price: 5 },
    ],
  },
  {
    id: 'salad-greek',
    name: 'סלט יווני',
    price: 28,
    category: 'salad',
    buildOwn: false,
    emoji: '🥗',
    description: 'זיתים שחורים, בולגרית, מלפפון, עגבנייה',
  },
  {
    id: 'salad-tuna',
    name: 'סלט טונה',
    price: 28,
    category: 'salad',
    buildOwn: false,
    emoji: '🐟',
    image: 'https://res.cloudinary.com/dq34u3zz1/image/upload/v1775001362/%D7%A1%D7%9C%D7%98_rirj1k.jpg',
    description: 'טונה, מלפפון, עגבנייה, תירס',
  },

  // ── Sides ─────────────────────────────────────────────────────────────────
  {
    id: 'garlic-bread',
    name: 'לחם שום משפחתי',
    price: 20,
    category: 'side',
    buildOwn: false,
    emoji: '🥖',
    image: '', // ← Photo 8 (garlic bread ring with tomato sauce)
    description: 'לחם שום קריספי מהתנור',
    addons: [
      { id: 'giant',        label: 'שדרוג לענק',     price: 12 },
      { id: 'cheese-gratin', label: 'גרטן גבינה מעל', price: 8, recommended: true },
    ],
  },
  {
    id: 'ziva-chocolate',
    name: 'זיווה שוקולד',
    price: 32,
    category: 'side',
    buildOwn: false,
    emoji: '🍫',
    image: 'https://res.cloudinary.com/dq34u3zz1/image/upload/v1775001355/%D7%96%D7%99%D7%95%D7%95%D7%94_%D7%A9%D7%95%D7%A7%D7%95%D7%9C%D7%93_o2kpbv.jpg',
    description: 'זיווה שוקולד חמה',
    tag: 'מתוק',
    tagColor: '#7C3AED',
  },
  {
    id: 'ziva',
    name: 'זיוה',
    price: 30,
    category: 'side',
    buildOwn: true,
    toppingPrice: 5,
    emoji: '🥙',
    image: 'https://res.cloudinary.com/dq34u3zz1/image/upload/v1775001356/%D7%96%D7%99%D7%95%D7%95%D7%94_dpyj7z.jpg',
    description: 'מנת זיוה מיוחדת + תוספות לבחירה',
  },
];

// ── Category filter chips ─────────────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'all',   label: 'הכל' },
  { id: 'pizza', label: '🍕 פיצות' },
  { id: 'chefs', label: '👨‍🍳 פיצות שף' },
  { id: 'pasta', label: '🍝 פסטה' },
  { id: 'salad', label: '🥗 סלטים' },
  { id: 'side',  label: '🥖 תוספות' },
  { id: 'vegan', label: '🌱 טבעוני' },
];

// ── Cart helpers ──────────────────────────────────────────────────────────────
export function getCart() {
  try {
    const raw = localStorage.getItem('cart');
    if (!raw) return { items: [], total: 0 };
    const parsed = JSON.parse(raw);
    if (parsed.items) return parsed;
    if (parsed.toppings) {
      return {
        items: [{
          cartId:    'legacy',
          id:        'regular-pizza',
          name:      'פיצה רגילה',
          basePrice: 30,
          toppings:  parsed.toppings,
          addons:    [],
          buildOwn:  true,
          total:     parsed.total || 30,
        }],
        total: parsed.total || 30,
      };
    }
    return { items: [], total: 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

export function saveCart(items) {
  const total = items.reduce((sum, i) => sum + i.total, 0);
  if (items.length === 0) {
    localStorage.removeItem('cart');
  } else {
    localStorage.setItem('cart', JSON.stringify({ items, total }));
  }
  return total;
}

// selectedAddons: array of { id, label, price } — already-selected addon objects
export function addItemToCart(menuItem, toppings, selectedAddons = []) {
  const cart = getCart();

  const toppingUnitPrice = menuItem.unlimitedToppings ? 0 : (menuItem.toppingPrice || TOPPING_PRICE);
  const toppingCost      = toppings.length * toppingUnitPrice;
  const addonCost        = selectedAddons.reduce((sum, a) => sum + (a.price || 0), 0);

  // Build a human-readable label for the selected sauce (if any)
  const sauceAddon = selectedAddons.find(a => a.type === 'select' || a.isOption);

  const newItem = {
    cartId:    `${menuItem.id}-${Date.now()}`,
    id:        menuItem.id,
    name:      menuItem.name,
    basePrice: menuItem.price,
    toppings,
    addons:    selectedAddons,
    buildOwn:  menuItem.buildOwn,
    total:     menuItem.price + toppingCost + addonCost,
    sauceAddon,
  };

  const newItems = [...cart.items, newItem];
  saveCart(newItems);
  return newItems;
}
