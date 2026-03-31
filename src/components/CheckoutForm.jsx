import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import he from '../i18n/he.json';
import { getCart } from '../menu';

const API           = process.env.REACT_APP_API_URL || 'https://pizza-story-backend-u6n0.onrender.com';
const DELIVERY_FEE  = 15;
const STORE_ADDRESS = 'רחוב הפיצה 1, תל אביב';
const RED           = '#E31837';
const DARK          = '#1A1A1A';

const PROMO_CODES = {
  PIZZA10:  { type: 'percent',  value: 10, label: '10% הנחה' },
  PIZZA20:  { type: 'percent',  value: 20, label: '20% הנחה' },
  FREESHIP: { type: 'delivery', value: 0,  label: 'משלוח חינם' },
};

// ── Circular step badge ───────────────────────────────────────────────────────
function StepNum({ n }) {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
      style={{ background: `${RED}18`, color: RED }}
    >{n}</div>
  );
}

// ── Big option card ───────────────────────────────────────────────────────────
function BigOption({ active, onClick, emoji, title, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center py-5 rounded-2xl border-2 transition active:scale-95 font-bold text-sm"
      style={active
        ? { borderColor: RED, background: `${RED}09`, color: DARK }
        : { borderColor: '#e5e7eb', background: 'white', color: '#9ca3af' }
      }
    >
      <span className="text-3xl mb-1.5">{emoji}</span>
      <span style={{ color: active ? DARK : '#9ca3af', fontWeight: 700 }}>{title}</span>
      {sub && (
        <span
          className="text-xs mt-0.5 font-semibold"
          style={{ color: active ? '#6b7280' : '#d1d5db' }}
        >{sub}</span>
      )}
    </button>
  );
}

export default function CheckoutForm() {
  const navigate = useNavigate();

  // Support both new multi-item cart and old single-pizza cart
  const cart      = getCart();
  const cartItems = cart.items || [];
  const cartTotal = cart.total || 0;

  const auth = JSON.parse(localStorage.getItem('pizzaAuth') || '{}');

  const [form, setForm] = useState({
    name:         auth.name || '',
    phone:        auth.phone || '',
    address:      '',
    kitchenNotes: '',
    driverNotes:  '',
    paymentMethod: 'cash',     // default: cash
  });
  const [fulfillmentType,   setFulfillmentType]   = useState('delivery');
  const [promoInput,        setPromoInput]        = useState('');
  const [appliedPromo,      setAppliedPromo]      = useState(null);
  const [promoError,        setPromoError]        = useState('');
  const [addressPrefilled,  setAddressPrefilled]  = useState(false);
  const [loading,           setLoading]           = useState(false);
  const [error,             setError]             = useState('');
  const [showPromo,         setShowPromo]         = useState(false);
  const [agreeTerms,        setAgreeTerms]        = useState(false);

  // Pre-fill address from last order
  useEffect(() => {
    if (!auth.phone) return;
    axios
      .get(`${API}/api/orders/history/${auth.phone}`, { timeout: 10000 })
      .then(res => {
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const last = sorted[0];
        if (!last) return;
        const addr = last.address || last.deliveryAddress;
        if (addr) { setForm(f => ({ ...f, address: addr })); setAddressPrefilled(true); }
        if (last.name && !auth.name) setForm(f => ({ ...f, name: last.name }));
      })
      .catch(() => {}); // silent fail — pre-fill is not critical
  }, []);

  if (cartItems.length === 0 && cartTotal === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, ...PROMO_CODES[code] });
      setPromoError('');
    } else {
      setPromoError(he.promo_invalid);
      setAppliedPromo(null);
    }
  };
  const removePromo = () => { setAppliedPromo(null); setPromoInput(''); setPromoError(''); };

  // ── Price calculation ─────────────────────────────────────────────────────
  const isFreeShip  = appliedPromo?.type === 'delivery';
  const deliveryFee = fulfillmentType === 'delivery' && !isFreeShip ? DELIVERY_FEE : 0;
  const discountAmt = appliedPromo?.type === 'percent'
    ? Math.round(cartTotal * appliedPromo.value / 100) : 0;
  const finalTotal  = cartTotal + deliveryFee - discountAmt;

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) { setError('יש להכניס שם'); return; }
    if (!form.phone.trim()) { setError('יש להכניס מספר טלפון'); return; }
    if (fulfillmentType === 'delivery' && !form.address.trim()) {
      setError('יש להכניס כתובת למשלוח'); return;
    }
    if (!agreeTerms) {
      setError('יש לאשר את תנאי השימוש כדי להמשיך'); return;
    }

    setLoading(true);

    // ── Flatten all toppings from all items (for backward compat) ──
    const allToppings = cartItems.flatMap(i => i.toppings || []);

    // ── Cash orders bypass Stripe completely ──
    const paymentStatus = form.paymentMethod === 'cash' ? 'pending_cash' : 'paid';

    const payload = {
      name:            form.name.trim(),
      phone:           form.phone.trim(),
      customerPhone:   form.phone.trim(),
      address:         fulfillmentType === 'delivery' ? form.address.trim() : STORE_ADDRESS,
      deliveryAddress: fulfillmentType === 'delivery' ? form.address.trim() : '',
      paymentMethod:   form.paymentMethod,   // 'cash' or 'credit'
      paymentStatus,                          // 'pending_cash' or 'paid'
      fulfillmentType,
      kitchenNotes:    form.kitchenNotes || null,
      driverNotes:     fulfillmentType === 'delivery' ? (form.driverNotes || null) : null,
      couponCode:      appliedPromo?.code || null,
      items:           cartItems,             // full multi-item cart
      toppings:        allToppings,           // flat list for backward compat
      total:           finalTotal,
      createdAt:       new Date().toISOString(),
    };

    try {
      await axios.post(`${API}/api/orders`, payload, {
        timeout: 30000,   // 30 s — Render free tier can be slow to wake up
        headers: { 'Content-Type': 'application/json' },
      });

      // Persist name for future pre-fill
      if (form.name && !auth.name) {
        localStorage.setItem('pizzaAuth', JSON.stringify({ ...auth, name: form.name.trim() }));
      }

      localStorage.removeItem('cart');
      navigate('/success');

    } catch (err) {
      console.error('Order submit error:', err);
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('השרת איטי — אנא המתן כמה שניות ונסה שוב');
      } else if (err.response) {
        const detail = err.response.data?.detail ? ` — ${err.response.data.detail}` : '';
        setError(`שגיאה מהשרת: ${err.response.data?.error || err.response.status}${detail}`);
      } else {
        setError('שגיאת רשת — בדוק חיבור אינטרנט ונסה שוב');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none bg-gray-50 text-dark text-sm transition`;
  const focusCls = `focus:border-[#1A1A1A]`;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto min-h-screen" style={{ background: '#f5f5f5' }}>

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center relative">
        <button type="button" onClick={() => navigate('/cart')} className="absolute right-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke={DARK} strokeWidth="1.8" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex-1 text-center">
          <span className="font-black text-xl tracking-widest" style={{ color: DARK }}>PIZZA STORY</span>
        </div>
      </div>

      <div className="px-4 pt-4 pb-10 space-y-4">

        {/* ── Cart summary ── */}
        <div className="bg-white rounded-2xl p-4" style={{ border: '1px solid #f0f0f0' }}>
          <p className="font-black text-dark text-sm mb-2">📋 סיכום הזמנה</p>
          {cartItems.map(item => (
            <div key={item.cartId} className="flex justify-between text-sm text-gray-500 mb-1">
              <span className="truncate flex-1 ml-2">{item.name}
                {item.toppings.length > 0 && (
                  <span className="text-xs text-gray-400"> · {item.toppings.join(', ')}</span>
                )}
              </span>
              <span className="font-bold" style={{ color: DARK }}>{item.total}₪</span>
            </div>
          ))}
        </div>

        {/* ══ STEP 1 — How ═══════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #f0f0f0' }}>
          <div className="flex items-center gap-3 mb-4">
            <StepNum n={1} />
            <span className="font-black text-dark">איך תרצו לקבל?</span>
          </div>
          <div className="flex gap-3">
            <BigOption active={fulfillmentType === 'delivery'} onClick={() => setFulfillmentType('delivery')}
              emoji="🛵" title={he.delivery_label} sub={`+${DELIVERY_FEE}₪`} />
            <BigOption active={fulfillmentType === 'pickup'}   onClick={() => setFulfillmentType('pickup')}
              emoji="🏪" title={he.pickup} sub="חינם" />
          </div>
          {fulfillmentType === 'pickup' && (
            <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-500">
              📍 {he.store_address}
            </div>
          )}
        </div>

        {/* ══ STEP 2 — Contact ════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl p-5 space-y-4" style={{ border: '1px solid #f0f0f0' }}>
          <div className="flex items-center gap-3">
            <StepNum n={2} />
            <span className="font-black text-dark">פרטי קשר</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{he.name}</label>
            <input name="name" value={form.name} onChange={handleChange} required
              placeholder="שם מלא" className={`${inputCls} ${focusCls}`} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{he.phone}</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange}
              required placeholder="050-0000000" dir="ltr" className={`${inputCls} ${focusCls}`} />
          </div>

          {fulfillmentType === 'delivery' && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{he.address}</label>
              <input name="address" value={form.address} onChange={handleChange}
                required placeholder="רחוב, מספר, עיר" className={`${inputCls} ${focusCls}`} />
              {addressPrefilled && (
                <p className="text-xs mt-1 font-medium" style={{ color: '#22c55e' }}>✓ מולאה מהזמנה קודמת</p>
              )}
            </div>
          )}
        </div>

        {/* ══ STEP 3 — Notes ══════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl p-5 space-y-4" style={{ border: '1px solid #f0f0f0' }}>
          <div className="flex items-center gap-3">
            <StepNum n={3} />
            <span className="font-black text-dark">הערות (אופציונלי)</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{he.kitchen_notes}</label>
            <textarea name="kitchenNotes" value={form.kitchenNotes} onChange={handleChange}
              rows={2} placeholder="ללא גלוטן, לא חריף..."
              className={`${inputCls} ${focusCls} resize-none`} />
          </div>

          {fulfillmentType === 'delivery' && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{he.driver_notes}</label>
              <textarea name="driverNotes" value={form.driverNotes} onChange={handleChange}
                rows={2} placeholder="קומה 3, אינטרקום 12..."
                className={`${inputCls} ${focusCls} resize-none`} />
            </div>
          )}
        </div>

        {/* ══ STEP 4 — Payment ════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #f0f0f0' }}>
          <div className="flex items-center gap-3 mb-4">
            <StepNum n={4} />
            <span className="font-black text-dark">אופן תשלום</span>
          </div>
          <div className="flex gap-3">
            <BigOption active={form.paymentMethod === 'cash'}
              onClick={() => setForm(f => ({ ...f, paymentMethod: 'cash' }))}
              emoji="💵" title={fulfillmentType === 'pickup' ? 'מזומן בעסק' : 'מזומן לשליח'} />
            <BigOption active={form.paymentMethod === 'credit'}
              onClick={() => setForm(f => ({ ...f, paymentMethod: 'credit' }))}
              emoji="💳" title="כרטיס אשראי" />
          </div>
          {form.paymentMethod === 'cash' && (
            <p className="text-center text-xs text-gray-400 mt-2">
              התשלום בעת {fulfillmentType === 'pickup' ? 'האיסוף' : 'קבלת ההזמנה'} · ללא Stripe ✓
            </p>
          )}
        </div>

        {/* ══ Promo code ══════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #f0f0f0' }}>
          <button type="button"
            className="w-full flex items-center justify-between font-bold text-dark text-sm"
            onClick={() => setShowPromo(s => !s)}
          >
            <span>🏷️ {he.promo_code}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
              <polyline points={showPromo ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}/>
            </svg>
          </button>

          {showPromo && (
            <div className="mt-3">
              {appliedPromo ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
                  <span className="text-green-700 text-sm font-bold flex-1">
                    ✓ {appliedPromo.label} ({appliedPromo.code})
                  </span>
                  <button type="button" onClick={removePromo}
                    className="text-xs text-gray-400 hover:text-red-500">הסר</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input value={promoInput} dir="ltr"
                    onChange={e => { setPromoInput(e.target.value); setPromoError(''); }}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyPromo())}
                    placeholder="PIZZA10 / FREESHIP"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-dark bg-gray-50 text-sm uppercase transition"
                  />
                  <button type="button" onClick={applyPromo}
                    className="font-black text-white px-4 rounded-xl text-sm transition active:scale-95"
                    style={{ background: RED }}>
                    החל
                  </button>
                </div>
              )}
              {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
            </div>
          )}
        </div>

        {/* ══ Price Summary ═══════════════════════════════════════════════════ */}
        <div className="bg-dark rounded-2xl p-5 space-y-2.5">
          <div className="flex justify-between text-sm text-white/60">
            <span>🍕 פריטים</span><span>{cartTotal}₪</span>
          </div>
          {fulfillmentType === 'delivery' && (
            <div className="flex justify-between text-sm text-white/60">
              <span>🛵 משלוח</span>
              <span>
                {isFreeShip
                  ? <><span className="line-through opacity-40">{DELIVERY_FEE}₪ </span><span className="text-green-400 font-bold">חינם</span></>
                  : `${DELIVERY_FEE}₪`
                }
              </span>
            </div>
          )}
          {discountAmt > 0 && (
            <div className="flex justify-between text-sm font-semibold" style={{ color: '#FFC107' }}>
              <span>🏷️ הנחה ({appliedPromo.code})</span><span>-{discountAmt}₪</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-white font-black text-lg">סה"כ לתשלום</span>
            <span className="font-black text-2xl text-white">{finalTotal}₪</span>
          </div>
        </div>

        {/* ── Terms checkbox ── */}
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={e => { setAgreeTerms(e.target.checked); setError(''); }}
            className="mt-0.5 w-5 h-5 rounded accent-red-600 flex-shrink-0 cursor-pointer"
          />
          <span className="text-xs text-gray-500 leading-relaxed">
            קראתי ואני מאשר/ת את{' '}
            <Link
              to="/terms"
              className="font-bold underline"
              style={{ color: RED }}
              onClick={e => e.stopPropagation()}
            >
              תקנון האתר
            </Link>
          </span>
        </label>

        {/* ── Error message ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-700 text-sm font-semibold text-center">
            ⚠️ {error}
          </div>
        )}

        {/* ══ Submit ══════════════════════════════════════════════════════════ */}
        <button
          type="submit"
          disabled={loading}
          className="w-full font-black text-white py-5 rounded-full shadow-sm transition active:scale-95 disabled:opacity-50"
          style={{ background: loading ? '#9ca3af' : RED, fontSize: 18 }}
        >
          {loading
            ? '⏳ שולח הזמנה...'
            : `בצע הזמנה · ${finalTotal}₪`
          }
        </button>

        {loading && (
          <p className="text-center text-xs text-gray-400">
            השרת עשוי לקחת עד 30 שניות להתחיל...
          </p>
        )}
      </div>
    </form>
  );
}
