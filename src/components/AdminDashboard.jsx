import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import he from '../i18n/he.json';
import { MENU_ITEMS } from '../menu';

const API = process.env.REACT_APP_API_URL || 'https://pizza-story-backend-u6n0.onrender.com';
const RED  = '#E31837';

const FILTERS = [
  { key: 'today', label: 'היום' },
  { key: 'week',  label: 'השבוע' },
  { key: 'month', label: 'החודש' },
  { key: 'all',   label: 'הכל' },
];

const STATUS_OPTIONS = [
  { value: 'pending',        label: '📋 ממתין' },
  { value: 'preparing',      label: '👨‍🍳 בהכנה' },
  { value: 'outForDelivery', label: '🛵 יצא למשלוח' },
  { value: 'completed',      label: '✅ הושלם' },
];

const STATUS_BADGE = {
  pending:        'bg-yellow-100 text-yellow-700',
  preparing:      'bg-blue-100 text-blue-700',
  outForDelivery: 'bg-purple-100 text-purple-700',
  completed:      'bg-green-100 text-green-700',
};

const COUPON_TYPE_LABEL = { percent: 'אחוז הנחה', fixed: 'סכום קבוע', free_delivery: 'משלוח חינם' };

function isToday(d)     { return new Date(d).toDateString() === new Date().toDateString(); }
function isThisWeek(d)  { const s = new Date(); s.setDate(s.getDate() - s.getDay()); s.setHours(0,0,0,0); return new Date(d) >= s; }
function isThisMonth(d) { const n = new Date(), p = new Date(d); return p.getMonth() === n.getMonth() && p.getFullYear() === n.getFullYear(); }

function playDing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 1.2);
  } catch (_) {}
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-green-500' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
        checked ? 'translate-x-5' : 'translate-x-0.5'
      }`} />
    </button>
  );
}

// ── Admin Login ───────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await axios.post(`${API}/api/admin/login`, { email, password });
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'שגיאת התחברות');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f5f5' }}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="font-black text-2xl tracking-widest" style={{ color: '#1A1A1A' }}>PIZZA STORY</span>
          <p className="text-gray-500 text-sm mt-1">כניסת מנהל</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="אימייל" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" dir="ltr" />
          <input type="password" placeholder="סיסמה" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400" dir="ltr" />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full text-white font-bold py-3 rounded-xl transition"
            style={{ background: RED, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'מתחבר...' : 'כניסה'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Menu Tab ──────────────────────────────────────────────────────────────────
function MenuTab({ authHeaders }) {
  const [availability, setAvailability] = useState({});
  const [loading, setLoading]           = useState(true);
  const [toggling, setToggling]         = useState({});

  useEffect(() => {
    axios.get(`${API}/api/menu-items`)
      .then(r => setAvailability(r.data))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (itemId, current) => {
    setToggling(t => ({ ...t, [itemId]: true }));
    try {
      await axios.patch(`${API}/api/menu-items/${itemId}/availability`,
        { isAvailable: !current }, { headers: authHeaders });
      setAvailability(a => ({ ...a, [itemId]: !current }));
    } catch (_) {}
    setToggling(t => ({ ...t, [itemId]: false }));
  };

  if (loading) return <div className="text-gray-400 py-8 text-center">טוען פריטים...</div>;

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-3">כבה פריט כדי להסתיר אותו מהתפריט. כברירת מחדל — כל הפריטים פעילים.</p>
      {MENU_ITEMS.map(item => {
        const isAvailable = availability[item.id] !== false; // default true if not in DB
        return (
          <div key={item.id} className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm"
            style={{ border: '1px solid #f0f0f0', opacity: isAvailable ? 1 : 0.55 }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs text-gray-400">{item.price}₪</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${isAvailable ? 'text-green-600' : 'text-red-400'}`}>
                {isAvailable ? 'זמין' : 'אזל'}
              </span>
              <Toggle
                checked={isAvailable}
                disabled={!!toggling[item.id]}
                onChange={() => handleToggle(item.id, isAvailable)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Coupons Tab ───────────────────────────────────────────────────────────────
function CouponsTab({ authHeaders }) {
  const [coupons, setCoupons]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({
    code: '', type: 'percent', value: 10, minOrder: 0, maxUses: '', expiresAt: '', isActive: true,
  });
  const [saving, setSaving]     = useState(false);
  const [formErr, setFormErr]   = useState('');

  const fetchCoupons = () => {
    axios.get(`${API}/api/admin/coupons`, { headers: authHeaders })
      .then(r => setCoupons(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCoupons, []); // eslint-disable-line

  const handleToggleActive = async (coupon) => {
    await axios.patch(`${API}/api/admin/coupons/${coupon._id}`,
      { isActive: !coupon.isActive }, { headers: authHeaders });
    fetchCoupons();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('למחוק קופון זה?')) return;
    await axios.delete(`${API}/api/admin/coupons/${id}`, { headers: authHeaders });
    fetchCoupons();
  };

  const handleCreate = async (e) => {
    e.preventDefault(); setFormErr(''); setSaving(true);
    try {
      await axios.post(`${API}/api/admin/coupons`, {
        code:      form.code,
        type:      form.type,
        value:     Number(form.value),
        minOrder:  Number(form.minOrder) || 0,
        maxUses:   form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
        isActive:  form.isActive,
      }, { headers: authHeaders });
      setShowForm(false);
      setForm({ code: '', type: 'percent', value: 10, minOrder: 0, maxUses: '', expiresAt: '', isActive: true });
      fetchCoupons();
    } catch (err) {
      setFormErr(err.response?.data?.error || 'שגיאה ביצירת קופון');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="text-gray-400 py-8 text-center">טוען קופונים...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">{coupons.length} קופונים</span>
        <button onClick={() => setShowForm(s => !s)}
          className="text-white text-sm font-bold px-4 py-2 rounded-xl"
          style={{ background: RED }}>
          {showForm ? 'ביטול' : '+ צור קופון'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl p-4 mb-4 shadow-sm space-y-3"
          style={{ border: '1px solid #f0f0f0' }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">קוד קופון</label>
              <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="PIZZA10" required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" dir="ltr" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">סוג</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="percent">אחוז הנחה</option>
                <option value="fixed">סכום קבוע (₪)</option>
                <option value="free_delivery">משלוח חינם</option>
              </select>
            </div>
            {form.type !== 'free_delivery' && (
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  {form.type === 'percent' ? 'אחוז (%)' : 'סכום (₪)'}
                </label>
                <input type="number" min="0" value={form.value}
                  onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
              </div>
            )}
            <div>
              <label className="text-xs text-gray-500 block mb-1">מינימום הזמנה (₪)</label>
              <input type="number" min="0" value={form.minOrder}
                onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">מקסימום שימושים</label>
              <input type="number" min="1" value={form.maxUses} placeholder="ללא הגבלה"
                onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">תפוגה</label>
              <input type="date" value={form.expiresAt}
                onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" dir="ltr" />
            </div>
          </div>
          {formErr && <p className="text-red-500 text-xs">{formErr}</p>}
          <button type="submit" disabled={saving}
            className="w-full text-white font-bold py-2 rounded-xl text-sm"
            style={{ background: RED, opacity: saving ? 0.7 : 1 }}>
            {saving ? 'שומר...' : 'צור קופון'}
          </button>
        </form>
      )}

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <div className="text-gray-400 text-center py-10">אין קופונים עדיין</div>
      ) : (
        <div className="space-y-2">
          {coupons.map(c => (
            <div key={c._id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
              style={{ border: '1px solid #f0f0f0', opacity: c.isActive ? 1 : 0.55 }}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm" style={{ color: RED }}>{c.code}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {COUPON_TYPE_LABEL[c.type]}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {c.type !== 'free_delivery' && `${c.value}${c.type === 'percent' ? '%' : '₪'} הנחה`}
                  {c.minOrder > 0 && ` · מינ' ${c.minOrder}₪`}
                  {c.maxUses && ` · ${c.usedCount}/${c.maxUses} שימושים`}
                  {!c.maxUses && ` · ${c.usedCount} שימושים`}
                  {c.expiresAt && ` · פג ${new Date(c.expiresAt).toLocaleDateString('he-IL')}`}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Toggle checked={c.isActive} onChange={() => handleToggleActive(c)} />
                <button onClick={() => handleDelete(c._id)}
                  className="text-gray-300 hover:text-red-400 transition text-lg font-bold">×</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [token,   setToken]   = useState(() => localStorage.getItem('adminToken') || '');
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('today');
  const [authErr, setAuthErr] = useState(false);
  const [tab,     setTab]     = useState('orders'); // 'orders' | 'menu' | 'coupons'
  const prevCountRef = useRef(null);

  const authHeaders = { Authorization: `Bearer ${token}` };

  const handleLogin  = (t) => { localStorage.setItem('adminToken', t); setToken(t); setAuthErr(false); };
  const handleLogout = ()  => { localStorage.removeItem('adminToken'); setToken(''); setOrders([]); };

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API}/api/orders`, { headers: authHeaders });
      const incoming = res.data;
      if (prevCountRef.current !== null && incoming.length > prevCountRef.current) playDing();
      prevCountRef.current = incoming.length;
      setOrders(incoming);
      setAuthErr(false);
    } catch (err) {
      if (err.response?.status === 401) { setAuthErr(true); localStorage.removeItem('adminToken'); setToken(''); }
    }
    setLoading(false);
  }, [token]); // eslint-disable-line

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleDone         = async (id) => { await axios.delete(`${API}/api/orders/${id}`, { headers: authHeaders }); fetchOrders(); };
  const handleStatusUpdate = async (id, status) => { try { await axios.patch(`${API}/api/orders/${id}/status`, { status }, { headers: authHeaders }); fetchOrders(); } catch (_) {} };

  if (!token || authErr) return <AdminLogin onLogin={handleLogin} />;

  const customerHistory = {};
  orders.forEach(o => {
    const p = o.phone;
    if (!customerHistory[p]) customerHistory[p] = { count: 0, total: 0 };
    customerHistory[p].count += 1;
    customerHistory[p].total += o.total || 0;
  });

  const filteredOrders = orders.filter(o => {
    if (!o.createdAt) return filter === 'all';
    if (filter === 'today') return isToday(o.createdAt);
    if (filter === 'week')  return isThisWeek(o.createdAt);
    if (filter === 'month') return isThisMonth(o.createdAt);
    return true;
  });

  const TABS = [
    { key: 'orders',  label: '📋 הזמנות' },
    { key: 'menu',    label: '🍕 תפריט' },
    { key: 'coupons', label: '🏷️ קופונים' },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold" style={{ color: RED }}>{he.admin_dashboard}</h2>
        <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500 transition">התנתק</button>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 mb-5 border-b border-gray-200 pb-0">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 font-bold text-sm transition border-b-2 -mb-px ${
              tab === t.key ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Orders Tab ── */}
      {tab === 'orders' && (
        <>
          <div className="flex gap-2 mb-5">
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full font-bold text-sm transition ${
                  filter === f.key ? 'text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={filter === f.key ? { background: RED } : {}}>
                {f.label}
              </button>
            ))}
            <span className="mr-auto text-sm text-gray-400 self-center">{filteredOrders.length} הזמנות</span>
          </div>

          {loading ? (
            <div className="text-gray-500">טוען הזמנות...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-gray-400 text-center py-12">{he.no_orders}</div>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow">
              <table className="w-full bg-white text-sm" dir="rtl">
                <thead style={{ background: RED }} className="text-white">
                  <tr>
                    <th className="px-3 py-3 text-right font-semibold">טלפון</th>
                    <th className="px-3 py-3 text-right font-semibold">שם לקוח</th>
                    <th className="px-3 py-3 text-right font-semibold">כתובת / איסוף</th>
                    <th className="px-3 py-3 text-right font-semibold">פריטים / הערות</th>
                    <th className="px-3 py-3 text-right font-semibold">תשלום</th>
                    <th className="px-3 py-3 text-right font-semibold">סה"כ</th>
                    <th className="px-3 py-3 text-right font-semibold">שעה</th>
                    <th className="px-3 py-3 text-right font-semibold">סטטוס</th>
                    <th className="px-3 py-3 text-right font-semibold">פעולה</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const hist          = customerHistory[order.phone] || { count: 0, total: 0 };
                    const timeStr       = order.createdAt ? new Date(order.createdAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : '—';
                    const payLabel      = order.paymentMethod === 'credit' ? he.credit : order.paymentMethod === 'cash' ? he.cash : '—';
                    const currentStatus = order.status || 'pending';
                    const badgeClass    = STATUS_BADGE[currentStatus] || 'bg-gray-100 text-gray-600';
                    const isPickup      = order.fulfillmentType === 'pickup';

                    // Build readable items list
                    const itemsSummary = order.items?.length > 0
                      ? order.items.map(i => `${i.name}${i.toppings?.length ? ` (${i.toppings.join(', ')})` : ''}`).join(' | ')
                      : order.toppings?.length > 0 ? order.toppings.join(', ') : '—';

                    return (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-orange-50 transition">
                        <td className="px-3 py-3 font-bold text-base whitespace-nowrap" style={{ color: RED }}>{order.phone}</td>
                        <td className="px-3 py-3">
                          <div className="font-semibold">{order.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{hist.count} הזמנות | {hist.total}₪</div>
                        </td>
                        <td className="px-3 py-3 text-gray-700">
                          {isPickup ? <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">🏪 איסוף עצמי</span> : order.address || '—'}
                        </td>
                        <td className="px-3 py-3 text-gray-600 max-w-xs">
                          <div className="text-xs leading-relaxed">{itemsSummary}</div>
                          {order.kitchenNotes && <div className="text-xs text-orange-600 mt-0.5">🍳 {order.kitchenNotes}</div>}
                          {order.driverNotes  && <div className="text-xs text-blue-500 mt-0.5">🛵 {order.driverNotes}</div>}
                        </td>
                        <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                          <div>{payLabel}</div>
                          {order.paymentStatus === 'pending_cash' && <div className="text-xs text-orange-500">ממתין לתשלום</div>}
                          {order.couponCode && <div className="text-xs text-green-600">🏷️ {order.couponCode}</div>}
                        </td>
                        <td className="px-3 py-3 font-bold text-gray-800 whitespace-nowrap">{order.total}₪</td>
                        <td className="px-3 py-3 text-gray-400 whitespace-nowrap">{timeStr}</td>
                        <td className="px-3 py-3">
                          <select value={currentStatus} onChange={e => handleStatusUpdate(order.id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none ${badgeClass}`}>
                            {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-3">
                          <button onClick={() => handleDone(order.id)}
                            className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition whitespace-nowrap">
                            {he.mark_done}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── Menu Tab ── */}
      {tab === 'menu' && <MenuTab authHeaders={authHeaders} />}

      {/* ── Coupons Tab ── */}
      {tab === 'coupons' && <CouponsTab authHeaders={authHeaders} />}
    </div>
  );
}
