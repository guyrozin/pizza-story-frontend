import React, { useState, useEffect } from 'react';

const RED  = '#E31837';
const DARK = '#1A1A1A';

const UPSELLS = [
  {
    id:    'extra-cheese',
    label: 'גבינה מוגברת',
    desc:  'כפליים גבינה על הפיצה',
    emoji: '🧀',
    price: 5,
  },
  {
    id:    'cheesy-crust',
    label: 'שוליים גבינה',
    desc:  'גבינה נמסה בתוך השוליים',
    emoji: '🍕',
    price: 15,
  },
  {
    id:    'giant-size',
    label: 'שדרוג לענק',
    desc:  'מגש גדול יותר',
    emoji: '📏',
    price: 12,
  },
];

const SAUCE_OPTIONS = [
  { qty: 3, price: 5,  label: '3 רטבים' },
  { qty: 7, price: 10, label: '7 רטבים' },
];

/**
 * Post-pizza upsell bottom sheet.
 *
 * Props:
 *   baseTotal            — pizza subtotal (number) for live price display
 *   onConfirm(addons)    — called with selected addon objects
 *   onSkip()             — called when user skips
 */
export default function UpsellModal({ baseTotal, onConfirm, onSkip }) {
  const [selected,     setSelected]     = useState({});  // { [id]: bool }
  const [sauceOption,  setSauceOption]  = useState(null); // { qty, price, label } | null

  // Block body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const toggleUpsell = (id) =>
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleSauce = (opt) =>
    setSauceOption(prev => prev?.qty === opt.qty ? null : opt);

  const extraCost =
    UPSELLS.filter(u => selected[u.id]).reduce((sum, u) => sum + u.price, 0) +
    (sauceOption?.price || 0);

  const hasSelections = Object.values(selected).some(Boolean) || sauceOption;

  const handleConfirm = () => {
    const addons = [
      ...UPSELLS.filter(u => selected[u.id]).map(u => ({ id: u.id, label: u.label, price: u.price })),
      ...(sauceOption
        ? [{ id: `sauces-${sauceOption.qty}`, label: `${sauceOption.label} לטבילה`, price: sauceOption.price }]
        : []),
    ];
    onConfirm(addons);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
    >
      <div
        className="bg-white w-full max-w-md flex flex-col overflow-hidden"
        style={{ borderRadius: '24px 24px 0 0', maxHeight: '88vh' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-xl" style={{ color: DARK }}>רגע לפני שמוסיפים...</h3>
              <p className="text-gray-400 text-sm mt-0.5">שדרגו את ההזמנה שלכם 🚀</p>
            </div>
            <button onClick={onSkip}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 flex-shrink-0"
              style={{ fontSize: 14 }}>✕</button>
          </div>
        </div>

        {/* Scrollable options */}
        <div className="flex-1 overflow-y-auto px-5 pb-3 space-y-3">

          {/* ── Upgrade options ── */}
          {UPSELLS.map(u => (
            <button key={u.id} onClick={() => toggleUpsell(u.id)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition text-right"
              style={selected[u.id]
                ? { borderColor: RED, background: `${RED}08` }
                : { borderColor: '#f0f0f0', background: 'white' }}>
              {/* Emoji */}
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: selected[u.id] ? `${RED}12` : '#f9f9f9' }}>
                {u.emoji}
              </div>
              {/* Text */}
              <div className="flex-1 text-right">
                <div className="font-black text-base" style={{ color: DARK }}>{u.label}</div>
                <div className="text-gray-400 text-xs mt-0.5">{u.desc}</div>
              </div>
              {/* Price + check */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="font-black text-lg" style={{ color: RED }}>+{u.price}₪</span>
                <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: selected[u.id] ? RED : '#d1d5db',
                           background:  selected[u.id] ? RED : 'white' }}>
                  {selected[u.id] && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}

          {/* ── Sauces ── */}
          <div className="rounded-2xl border-2 p-4 space-y-3"
            style={{ borderColor: sauceOption ? RED : '#f0f0f0',
                     background:  sauceOption ? `${RED}08` : 'white' }}>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: sauceOption ? `${RED}12` : '#f9f9f9' }}>🥣</div>
              <div>
                <div className="font-black text-base" style={{ color: DARK }}>רטבים לטבילה</div>
                <div className="text-gray-400 text-xs">ברברה, צ'ילי מתוק, גארלי ועוד</div>
              </div>
            </div>
            <div className="flex gap-2">
              {SAUCE_OPTIONS.map(opt => (
                <button key={opt.qty} onClick={() => toggleSauce(opt)}
                  className="flex-1 py-3 rounded-xl border-2 font-black text-sm transition"
                  style={sauceOption?.qty === opt.qty
                    ? { borderColor: RED, background: RED, color: 'white' }
                    : { borderColor: '#e5e7eb', background: 'white', color: DARK }}>
                  {opt.label}<br />
                  <span className="font-bold" style={{ fontSize: 11 }}>
                    {opt.price}₪
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-white flex-shrink-0"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          {/* Live price */}
          {extraCost > 0 && (
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-gray-400 text-sm">תוספת שדרוגים</span>
              <span className="font-black text-lg" style={{ color: RED }}>+{extraCost}₪</span>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onSkip}
              className="flex-1 py-4 rounded-full border-2 font-bold text-sm transition active:scale-95"
              style={{ borderColor: '#e5e7eb', color: '#9ca3af' }}>
              לא תודה
            </button>
            <button onClick={handleConfirm}
              className="font-black text-white py-4 rounded-full transition active:scale-95 shadow-sm"
              style={{
                background: RED,
                fontSize: 15,
                flex: hasSelections ? 2 : 1,
              }}>
              {hasSelections
                ? `הוסף לסל · ${baseTotal + extraCost}₪`
                : 'הוסף לסל'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
