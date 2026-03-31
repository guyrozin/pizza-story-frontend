import React, { useState, useEffect } from 'react';
import { TOPPINGS, TOPPING_PRICE } from '../menu';

const RED  = '#E31837';
const DARK = '#1A1A1A';

/**
 * Bottom-sheet modal for toppings + addons selection.
 *
 * Props:
 *   item                    — menu item object
 *   initialToppings         — string[] for edit mode
 *   onSave({ toppings, selectedAddons }) — called with selections
 *   onClose()               — dismiss without saving
 */
export default function ToppingModal({ item, initialToppings = [], onSave, onClose }) {
  const [selected,      setSelected]      = useState([...initialToppings]);
  const [addonChecked,  setAddonChecked]  = useState({});   // checkbox addons
  const [selectedSauce, setSelectedSauce] = useState('');   // select addon
  const [sauceError,    setSauceError]    = useState(false);

  const toppingUnitPrice = item.unlimitedToppings ? 0 : (item.toppingPrice || TOPPING_PRICE);
  const addons           = item.addons || [];
  const sauceAddon       = addons.find(a => a.type === 'select');
  const checkboxAddons   = addons.filter(a => a.type !== 'select');
  const showToppings     = item.buildOwn && !item.noToppings;

  useEffect(() => {
    const handler = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const toggleTopping = t =>
    setSelected(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const toggleAddon = (id) =>
    setAddonChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const toppingCost = selected.length * toppingUnitPrice;
  const addonCost   = checkboxAddons
    .filter(a => addonChecked[a.id])
    .reduce((sum, a) => sum + (a.price || 0), 0);
  const totalPrice  = item.price + toppingCost + addonCost;

  const handleSave = () => {
    if (sauceAddon && !selectedSauce) {
      setSauceError(true);
      return;
    }

    const selectedAddons = [
      ...(sauceAddon && selectedSauce
        ? [{ id: selectedSauce, label: sauceAddon.options.find(o => o.id === selectedSauce)?.label, price: 0, isOption: true }]
        : []),
      ...checkboxAddons
        .filter(a => addonChecked[a.id])
        .map(a => ({ id: a.id, label: a.label, price: a.price || 0 })),
    ];

    onSave({ toppings: selected, selectedAddons });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-full max-w-md flex flex-col overflow-hidden"
        style={{ borderRadius: '24px 24px 0 0', maxHeight: '90vh' }}
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
                {item.note && (
                  <p className="text-xs font-semibold mt-1" style={{ color: RED }}>★ {item.note}</p>
                )}
                <p className="font-black text-dark text-base mt-1">בסיס: {item.price}₪</p>
              </div>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0 mt-1"
              style={{ fontSize: 14, color: DARK }}>✕</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* ── Sauce selector (required) ── */}
          {sauceAddon && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-black text-dark text-sm">{sauceAddon.label}</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: RED }}>
                  חובה
                </span>
              </div>
              <div className="space-y-2">
                {sauceAddon.options.map(opt => (
                  <button key={opt.id}
                    onClick={() => { setSelectedSauce(opt.id); setSauceError(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition text-right"
                    style={selectedSauce === opt.id
                      ? { borderColor: RED, background: `${RED}10` }
                      : { borderColor: '#e5e7eb', background: 'white' }}>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: selectedSauce === opt.id ? RED : '#d1d5db' }}>
                      {selectedSauce === opt.id && (
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: RED }} />
                      )}
                    </div>
                    <span className="font-semibold text-sm" style={{ color: DARK }}>{opt.label}</span>
                  </button>
                ))}
              </div>
              {sauceError && (
                <p className="text-xs mt-1.5" style={{ color: RED }}>יש לבחור רוטב לפני ההוספה</p>
              )}
            </div>
          )}

          {/* ── Toppings ── */}
          {showToppings && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-black text-dark text-sm">בחרו תוספות</p>
                {item.unlimitedToppings ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: '#22c55e' }}>
                    ללא הגבלה חינם!
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: `${RED}15`, color: RED }}>
                    +{toppingUnitPrice}₪ לתוספת
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {TOPPINGS.map(t => {
                  const active = selected.includes(t);
                  return (
                    <button key={t} onClick={() => toggleTopping(t)}
                      className="px-3 py-2 rounded-full text-sm font-semibold border-2 transition select-none active:scale-95"
                      style={active
                        ? { background: RED, borderColor: RED, color: 'white' }
                        : { background: 'white', borderColor: '#e5e7eb', color: '#6b7280' }}>
                      {active ? '✓ ' : ''}{t}
                    </button>
                  );
                })}
              </div>
              {selected.length > 0 && (
                <div className="mt-3 rounded-xl px-4 py-3 border border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-400 font-semibold mb-1">נבחרו:</p>
                  <p className="text-sm font-medium" style={{ color: DARK }}>{selected.join(' · ')}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Checkbox addons ── */}
          {checkboxAddons.length > 0 && (
            <div>
              <p className="font-black text-dark text-sm mb-2">תוספות מיוחדות</p>
              <div className="space-y-2">
                {checkboxAddons.map(addon => (
                  <button key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition"
                    style={addonChecked[addon.id]
                      ? { borderColor: RED, background: `${RED}10` }
                      : { borderColor: '#e5e7eb', background: 'white' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: addonChecked[addon.id] ? RED : '#d1d5db',
                                 background: addonChecked[addon.id] ? RED : 'white' }}>
                        {addonChecked[addon.id] && (
                          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                            <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="font-semibold text-sm text-right" style={{ color: DARK }}>
                        {addon.label}
                        {addon.recommended && (
                          <span className="mr-2 text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                            style={{ background: '#F59E0B' }}>מומלץ!</span>
                        )}
                      </span>
                    </div>
                    <span className="font-black text-sm" style={{ color: RED }}>+{addon.price}₪</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-white flex-shrink-0"
          style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 text-sm">
              {item.price}₪
              {!item.unlimitedToppings && selected.length > 0 && ` + ${selected.length} × ${toppingUnitPrice}₪`}
              {addonCost > 0 && ` + תוספות ${addonCost}₪`}
            </span>
            <span className="font-black text-dark text-2xl">{totalPrice}₪</span>
          </div>
          <button onClick={handleSave}
            className="w-full font-black text-white py-4 rounded-full transition active:scale-95 shadow-sm"
            style={{ background: RED, fontSize: 17 }}>
            הוסף לסל · {totalPrice}₪
          </button>
        </div>
      </div>
    </div>
  );
}
