// ── Topping price ─────────────────────────────────────────────────────────────
export const TOPPING_PRICE = 13;

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
];

// ── Menu items ────────────────────────────────────────────────────────────────
// buildOwn: true  → tapping "הוסף" opens the ToppingModal
// category: 'pizza' | 'side'
export const MENU_ITEMS = [
  {
    id: 'custom-family',
    name: 'מגש משפחתי - הרכבה עצמית',
    price: 30,
    category: 'pizza',
    buildOwn: true,
    emoji: '🍕',
    description: 'בנו את הפיצה שלכם עם התוספות שתרצו',
  },
  {
    id: 'personal',
    name: 'פיצה אישית',
    price: 23,
    category: 'pizza',
    buildOwn: true,
    emoji: '🍕',
    description: 'פיצה אישית + תוספות לבחירה',
  },
  {
    id: 'gluten-free',
    name: 'פיצה ללא גלוטן',
    price: 42,
    category: 'pizza',
    buildOwn: true,
    emoji: '🌾',
    description: 'בצק ללא גלוטן + תוספות לבחירה',
    tag: 'ללא גלוטן',
    tagColor: '#3b82f6',
  },
  {
    id: 'vegan',
    name: 'פיצה טבעונית',
    price: 42,
    category: 'pizza',
    buildOwn: true,
    emoji: '🌱',
    description: 'בצק טבעוני, גבינה טבעונית + תוספות',
    isVegan: true,
    tag: '🌱 טבעוני',
    tagColor: '#22c55e',
  },
  {
    id: 'cream-mushroom',
    name: 'פיצה משפחתית שמנת פטריות',
    price: 45,
    category: 'pizza',
    buildOwn: true,
    emoji: '🍄',
    description: 'שמנת טרייה, פטריות, גבינת פרמזן',
    tag: 'פרמיום',
    tagColor: '#FFC107',
    tagTextColor: '#1A1A1A',
  },
  {
    id: 'greek',
    name: 'פיצה משפחתית יוונית',
    price: 45,
    category: 'pizza',
    buildOwn: true,
    emoji: '🫒',
    description: 'זיתים, עגבניות שרי, בולגרית',
    tag: 'פרמיום',
    tagColor: '#FFC107',
    tagTextColor: '#1A1A1A',
  },
  {
    id: 'garlic-bread',
    name: 'לחם שום',
    price: 30,
    category: 'side',
    buildOwn: false,
    emoji: '🥖',
    description: 'לחם שום קריספי מהתנור',
  },
  {
    id: 'ziva',
    name: 'זיוה',
    price: 35,
    category: 'side',
    buildOwn: false,
    emoji: '🥗',
    description: 'סלט זיוה טרי',
  },
];

// ── Category filter chips ─────────────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'all',   label: 'הכל' },
  { id: 'pizza', label: '🍕 פיצות' },
  { id: 'side',  label: '🥗 תוספות' },
  { id: 'vegan', label: '🌱 טבעוני' },
];

// ── Cart helpers ──────────────────────────────────────────────────────────────
export function getCart() {
  try {
    const raw = localStorage.getItem('cart');
    if (!raw) return { items: [], total: 0 };
    const parsed = JSON.parse(raw);
    // Support both old format { toppings, total } and new format { items, total }
    if (parsed.items) return parsed;
    // Migrate old format
    if (parsed.toppings) {
      return {
        items: [{
          cartId: 'legacy',
          id: 'custom-family',
          name: 'פיצה קלאסית',
          basePrice: 30,
          toppings: parsed.toppings,
          buildOwn: true,
          total: parsed.total || 30,
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

export function addItemToCart(menuItem, toppings) {
  const cart = getCart();
  const toppingCost = toppings.length * TOPPING_PRICE;
  const newItem = {
    cartId: `${menuItem.id}-${Date.now()}`,
    id: menuItem.id,
    name: menuItem.name,
    basePrice: menuItem.price,
    toppings,
    buildOwn: menuItem.buildOwn,
    total: menuItem.price + toppingCost,
  };
  const newItems = [...cart.items, newItem];
  saveCart(newItems);
  return newItems;
}
