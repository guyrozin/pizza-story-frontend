import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, saveCart, TOPPING_PRICE, MENU_ITEMS } from '../menu';
import ToppingModal from './ToppingModal';

const RED  = '#E31837';
const DARK = '#1A1A1A';

function TrashIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems]         = useState(() => getCart().items);
  const [editingItem, setEditingItem] = useState(null); // { cartItem, menuItem }

  const total = items.reduce((sum, i) => sum + i.total, 0);

  // ── Delete item ──────────────────────────────────────────────────────────────
  const handleDelete = cartId => {
    const newItems = items.filter(i => i.cartId !== cartId);
    saveCart(newItems);
    setItems(newItems);
  };

  // ── Start edit ───────────────────────────────────────────────────────────────
  const handleEdit = cartItem => {
    const menuItem = MENU_ITEMS.find(m => m.id === cartItem.id) || {
      id: cartItem.id,
      name: cartItem.name,
      price: cartItem.basePrice,
      description: '',
      emoji: '🍕',
    };
    setEditingItem({ cartItem, menuItem });
  };

  // ── Save edited toppings ─────────────────────────────────────────────────────
  const handleEditSave = newToppings => {
    const { cartItem } = editingItem;
    const newItems = items.map(i => {
      if (i.cartId !== cartItem.cartId) return i;
      return {
        ...i,
        toppings: newToppings,
        total: i.basePrice + newToppings.length * TOPPING_PRICE,
      };
    });
    saveCart(newItems);
    setItems(newItems);
    setEditingItem(null);
  };

  // ── Empty cart ───────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center relative">
          <button onClick={() => navigate('/')} className="absolute right-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke={DARK} strokeWidth="1.8" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="flex-1 text-center">
            <span className="font-black text-xl tracking-widest" style={{ color: DARK }}>PIZZA STORY</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-28 text-center px-8">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-5"
            style={{ background: '#fef2f2' }}
          >🛒</div>
          <p className="font-black text-xl mb-2" style={{ color: DARK }}>העגלה ריקה</p>
          <p className="text-gray-400 text-sm mb-8">הוסיפו פריטים מהתפריט</p>
          <button
            onClick={() => navigate('/')}
            className="font-black text-white px-10 py-4 rounded-full shadow-sm transition active:scale-95"
            style={{ background: RED }}
          >
            לתפריט
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen" style={{ background: '#f5f5f5' }}>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center relative">
        <button onClick={() => navigate('/')} className="absolute right-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke={DARK} strokeWidth="1.8" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex-1 text-center">
          <span className="font-black text-xl tracking-widest" style={{ color: DARK }}>PIZZA STORY</span>
        </div>
        <span className="absolute left-4 text-sm text-gray-400 font-semibold">{items.length} פריטים</span>
      </div>

      <div className="px-4 pt-4 pb-10 space-y-3">

        {/* ── Item Cards ── */}
        {items.map(item => (
          <div
            key={item.cartId}
            className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Emoji */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: '#f9f9f9', border: '1px solid #f0f0f0' }}
                >
                  {MENU_ITEMS.find(m => m.id === item.id)?.emoji || '🍕'}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-base leading-tight" style={{ color: DARK }}>{item.name}</p>
                  {item.toppings.length > 0 ? (
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                      + {item.toppings.join(', ')}
                    </p>
                  ) : (
                    <p className="text-gray-300 text-xs mt-1">ללא תוספות</p>
                  )}
                  <p className="font-black text-lg mt-1.5" style={{ color: DARK }}>{item.total}₪</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                {/* Edit — shown for pizza items that support toppings */}
                {item.buildOwn !== false && (
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 font-bold text-sm transition active:scale-95"
                    style={{ borderColor: DARK, color: DARK }}
                  >
                    <EditIcon />
                    ערוך תוספות
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDelete(item.cartId)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border-2 font-bold text-sm transition active:scale-95"
                  style={{ borderColor: '#fca5a5', color: RED }}
                  aria-label="מחק פריט"
                >
                  <TrashIcon />
                  {item.buildOwn === false ? 'הסר' : ''}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* ── Add more ── */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-3.5 rounded-2xl border-2 border-dashed font-bold text-sm transition active:scale-95"
          style={{ borderColor: '#e5e7eb', color: '#9ca3af' }}
        >
          + הוסיפו עוד פריטים
        </button>

        {/* ── Order summary ── */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{ border: '1px solid #f0f0f0' }}
        >
          <p className="font-black text-dark mb-3 text-sm">סיכום הזמנה</p>
          {items.map(item => (
            <div key={item.cartId} className="flex justify-between text-sm text-gray-500 mb-1.5">
              <span className="truncate flex-1 ml-3">{item.name}</span>
              <span className="font-semibold" style={{ color: DARK }}>{item.total}₪</span>
            </div>
          ))}
          <div
            className="flex justify-between items-center pt-3 mt-2"
            style={{ borderTop: '1px solid #f0f0f0' }}
          >
            <span className="font-black text-lg" style={{ color: DARK }}>סה"כ</span>
            <span className="font-black text-2xl" style={{ color: DARK }}>{total}₪</span>
          </div>
        </div>

        {/* ── Checkout CTA ── */}
        <button
          onClick={() => navigate('/checkout')}
          className="w-full font-black text-white py-5 rounded-full flex items-center justify-between px-6 shadow-sm transition active:scale-95"
          style={{ background: RED, fontSize: 18 }}
        >
          <span>לתשלום</span>
          <span
            className="bg-white/20 px-3 py-1 rounded-full font-bold"
            style={{ fontSize: 15 }}
          >{total}₪</span>
        </button>
      </div>

      {/* ── Edit Toppings Modal ── */}
      {editingItem && (
        <ToppingModal
          item={editingItem.menuItem}
          initialToppings={editingItem.cartItem.toppings}
          onSave={handleEditSave}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
