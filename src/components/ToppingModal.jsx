import React, { useState, useEffect } from 'react';
import { TOPPINGS, TOPPING_PRICE } from '../menu';

const RED  = '#E31837';
const DARK = '#1A1A1A';

/**
 * Bottom-sheet modal for selecting toppings.
 *
 * Props:
 *  item              — menu item object (name, price, description, emoji)
 *  initialToppings   — string[] for edit mode (default [])
 *  onSave(toppings)  — called with final topping array
 *  onClose()         — called to dismiss without saving
 */
export default function ToppingModal({ item, initialToppings = [], onSave, onClose }) {
  const [selected, setSelected] = useState([...initialToppings]);

  // Close on Escape key
  useEffect(() => {
    const handler = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const toggle = t =>
    setSelected(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const toppingCost = selected.length * TOPPING_PRICE;
  const totalPrice  = item.price + toppingCost;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-full max-w-md flex flex-col overflow-hidden"
        style={{ borderRadius: '24px 24px 0 0', maxHeight: '88vh' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pt-1 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{item.emoji}</span>
              <div>
                <h3 className="font-black text-dark text-lg leading-tight">{item.name}</h3>
                <p className="text-gray-400 text-sm mt-0.5">{item.description}</p>
                <p className="font-black text-dark text-base mt-1">בסיס: {item.price}₪</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0 mt-1"
              style={{ fontSize: 14, color: DARK }}
            >✕</button>
          </div>
        </div>

        {/* Toppings grid — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-dark text-sm">בחרו תוספות</p>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: `${RED}15`, color: RED }}
            >
              +{TOPPING_PRICE}₪ לתוספת
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {TOPPINGS.map(t => {
              const active = selected.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggle(t)}
                  className="px-3 py-2 rounded-full text-sm font-semibold border-2 transition select-none active:scale-95"
                  style={active
                    ? { background: RED, borderColor: RED, color: 'white' }
                    : { background: 'white', borderColor: '#e5e7eb', color: '#6b7280' }
                  }
                >
                  {active ? '✓ ' : ''}{t}
                </button>
              );
            })}
          </div>

          {selected.length > 0 && (
            <div className="mt-4 rounded-xl px-4 py-3 border border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400 font-semibold mb-1">נבחרו:</p>
              <p className="text-sm text-dark font-medium">{selected.join(' · ')}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 border-t border-gray-100 bg-white flex-shrink-0"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
        >
          {/* Price breakdown */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 text-sm">
              {item.price}₪
              {selected.length > 0 && ` + ${selected.length} × ${TOPPING_PRICE}₪`}
            </span>
            <span className="font-black text-dark text-2xl">{totalPrice}₪</span>
          </div>

          <button
            onClick={() => onSave(selected)}
            className="w-full font-black text-white py-4 rounded-full transition active:scale-95 shadow-sm"
            style={{ background: RED, fontSize: 17 }}
          >
            הוסף לסל · {totalPrice}₪
          </button>
        </div>
      </div>
    </div>
  );
}
