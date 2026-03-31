import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MENU_ITEMS, CATEGORIES, TOPPING_PRICE, addItemToCart, getCart } from '../menu';
import ToppingModal from './ToppingModal';

const RED  = '#E31837';
const DARK = '#1A1A1A';

export default function PizzaMenu() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalItem, setModalItem] = useState(null);   // menu item whose modal is open
  const [cartItems, setCartItems] = useState(() => getCart().items);
  const auth = JSON.parse(localStorage.getItem('pizzaAuth') || '{}');

  const cartCount = cartItems.length;

  // ── Filter ───────────────────────────────────────────────────────────────────
  const filtered = MENU_ITEMS.filter(item => {
    if (activeCategory === 'all')   return true;
    if (activeCategory === 'vegan') return item.isVegan;
    return item.category === activeCategory;
  });

  // ── Add item handler ─────────────────────────────────────────────────────────
  const handleAdd = item => {
    if (item.category === 'pizza') {
      // Always open modal for pizzas (can always add toppings)
      setModalItem(item);
    } else {
      // Sides: add directly, no toppings
      const newItems = addItemToCart(item, []);
      setCartItems(newItems);
    }
  };

  const handleModalSave = toppings => {
    const newItems = addItemToCart(modalItem, toppings);
    setCartItems(newItems);
    setModalItem(null);
  };

  // ── Tag badge ────────────────────────────────────────────────────────────────
  const TagBadge = ({ item }) => {
    if (!item.tag) return null;
    return (
      <span
        className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={{
          background: item.tagColor || RED,
          color: item.tagTextColor || 'white',
        }}
      >
        {item.tag}
      </span>
    );
  };

  return (
    <div className="max-w-md mx-auto min-h-screen pb-20" style={{ background: '#f5f5f5' }}>

      {/* ── Header ── */}
      <div
        className="bg-white px-5 py-4 flex items-center relative"
        style={{ borderBottom: '1px solid #f0f0f0' }}
      >
        <div className="flex-1 text-center">
          <span className="font-black text-xl tracking-widest text-dark">PIZZA STORY</span>
        </div>
        {/* Cart button */}
        <button
          onClick={() => navigate('/cart')}
          className="absolute left-4 relative"
          aria-label="עגלה"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {cartCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center font-black text-white"
              style={{ background: RED, fontSize: 10 }}
            >{cartCount}</span>
          )}
        </button>
      </div>

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden" style={{ height: 180 }}>
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
          alt="pizza"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 flex flex-col justify-end px-5 pb-5"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)' }}
        >
          <h2 className="text-white font-black text-2xl leading-tight">
            פיצה טרייה,<br />מוכנה בשבילך 🍕
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span
              className="text-xs font-bold text-dark px-3 py-1 rounded-full"
              style={{ background: '#FFC107' }}
            >
              🕐 20–35 דק'
            </span>
            <span className="text-white/80 text-xs font-semibold">● פתוח עכשיו</span>
          </div>
        </div>
      </div>

      {/* ── Category Chips ── */}
      <div
        className="bg-white px-4 py-3 flex gap-2 overflow-x-auto"
        style={{ borderBottom: '1px solid #f0f0f0', scrollbarWidth: 'none' }}
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition flex-shrink-0 active:scale-95"
            style={activeCategory === cat.id
              ? { background: RED, color: 'white', border: `2px solid ${RED}` }
              : { background: 'white', color: '#6b7280', border: '2px solid #e5e7eb' }
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Menu Items List ── */}
      <div className="px-4 pt-4 space-y-3">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
            style={{ border: '1px solid #f0f0f0' }}
          >
            <div className="flex items-center gap-4 p-4">
              {/* Emoji thumbnail */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: '#f9f9f9', border: '1px solid #f0f0f0' }}
              >
                {item.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <span className="font-black text-dark text-base leading-tight">{item.name}</span>
                  <TagBadge item={item} />
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{item.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-black text-dark text-lg">{item.price}₪</span>
                  {item.buildOwn && (
                    <span className="text-xs text-gray-400">+ תוספות מ-{TOPPING_PRICE}₪</span>
                  )}
                </div>
              </div>

              {/* Add button */}
              <button
                onClick={() => handleAdd(item)}
                className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-xl flex-shrink-0 transition active:scale-90 shadow-sm"
                style={{ background: RED }}
                aria-label={`הוסף ${item.name}`}
              >
                +
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🍕</div>
            <p>אין פריטים בקטגוריה זו</p>
          </div>
        )}
      </div>

      {/* ── Floating Cart CTA (when cart has items) ── */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 z-40 max-w-md mx-auto">
          <button
            onClick={() => navigate('/cart')}
            className="w-full font-black text-white py-4 rounded-full shadow-lg flex items-center justify-between px-6 transition active:scale-95"
            style={{ background: RED }}
          >
            <span
              className="bg-white/20 w-7 h-7 rounded-full flex items-center justify-center font-black"
              style={{ fontSize: 13 }}
            >{cartCount}</span>
            <span style={{ fontSize: 17 }}>לצפייה בעגלה</span>
            <span className="bg-white/20 px-3 py-1 rounded-full font-bold text-sm">
              {getCart().total}₪
            </span>
          </button>
        </div>
      )}

      {/* ── Topping Modal ── */}
      {modalItem && (
        <ToppingModal
          item={modalItem}
          initialToppings={[]}
          onSave={handleModalSave}
          onClose={() => setModalItem(null)}
        />
      )}
    </div>
  );
}
