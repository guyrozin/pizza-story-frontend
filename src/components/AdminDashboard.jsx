import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import he from '../i18n/he.json';

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

function isToday(dateStr) {
  const d = new Date(dateStr), now = new Date();
  return d.toDateString() === now.toDateString();
}
function isThisWeek(dateStr) {
  const d = new Date(dateStr), now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return d >= startOfWeek;
}
function isThisMonth(dateStr) {
  const d = new Date(dateStr), now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function playDing() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880,  ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 1.2);
  } catch (_) {}
}

// ── Login Screen ──────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post(`${API}/api/admin/login`, { email, password });
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'שגיאת התחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f5f5' }}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="font-black text-2xl tracking-widest" style={{ color: '#1A1A1A' }}>
            PIZZA STORY
          </span>
          <p className="text-gray-500 text-sm mt-1">כניסת מנהל</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
            dir="ltr"
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
            dir="ltr"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-3 rounded-xl transition"
            style={{ background: RED, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'מתחבר...' : 'כניסה'}
          </button>
        </form>
      </div>
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
  const prevCountRef = useRef(null);

  const authHeaders = { Authorization: `Bearer ${token}` };

  const handleLogin = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
    setAuthErr(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setOrders([]);
  };

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API}/api/orders`, { headers: authHeaders });
      const incoming = res.data;
      if (prevCountRef.current !== null && incoming.length > prevCountRef.current) {
        playDing();
      }
      prevCountRef.current = incoming.length;
      setOrders(incoming);
      setAuthErr(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setAuthErr(true);
        localStorage.removeItem('adminToken');
        setToken('');
      }
    }
    setLoading(false);
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleDone = async (id) => {
    await axios.delete(`${API}/api/orders/${id}`, { headers: authHeaders });
    fetchOrders();
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`${API}/api/orders/${id}/status`, { status }, { headers: authHeaders });
      fetchOrders();
    } catch (_) {}
  };

  if (!token || authErr) return <AdminLogin onLogin={handleLogin} />;

  const customerHistory = {};
  orders.forEach(order => {
    const p = order.phone;
    if (!customerHistory[p]) customerHistory[p] = { count: 0, total: 0 };
    customerHistory[p].count += 1;
    customerHistory[p].total += order.total || 0;
  });

  const filteredOrders = orders.filter(order => {
    if (!order.createdAt) return filter === 'all';
    if (filter === 'today') return isToday(order.createdAt);
    if (filter === 'week')  return isThisWeek(order.createdAt);
    if (filter === 'month') return isThisMonth(order.createdAt);
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto mt-6 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold" style={{ color: RED }}>{he.admin_dashboard}</h2>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-red-500 transition"
        >
          התנתק
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full font-bold text-sm transition ${
              filter === f.key
                ? 'bg-tomato text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="mr-auto text-sm text-gray-400 self-center">
          {filteredOrders.length} הזמנות
        </span>
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
                <th className="px-3 py-3 text-right font-semibold">תוספות / הערות</th>
                <th className="px-3 py-3 text-right font-semibold">תשלום</th>
                <th className="px-3 py-3 text-right font-semibold">סה"כ</th>
                <th className="px-3 py-3 text-right font-semibold">שעה</th>
                <th className="px-3 py-3 text-right font-semibold">סטטוס</th>
                <th className="px-3 py-3 text-right font-semibold">פעולה</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const hist        = customerHistory[order.phone] || { count: 0, total: 0 };
                const timeStr     = order.createdAt
                  ? new Date(order.createdAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
                  : '—';
                const payLabel    = order.paymentMethod === 'credit' ? he.credit
                                  : order.paymentMethod === 'cash'   ? he.cash : '—';
                const currentStatus = order.status || 'pending';
                const badgeClass    = STATUS_BADGE[currentStatus] || 'bg-gray-100 text-gray-600';
                const isPickup      = order.fulfillmentType === 'pickup';

                return (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-orange-50 transition">
                    <td className="px-3 py-3 font-bold text-base whitespace-nowrap" style={{ color: RED }}>
                      {order.phone}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-semibold">{order.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {hist.count} הזמנות | {hist.total}₪ שולם
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-700">
                      {isPickup ? (
                        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">
                          🏪 איסוף עצמי
                        </span>
                      ) : (
                        order.address || '—'
                      )}
                    </td>
                    <td className="px-3 py-3 text-gray-600 max-w-xs">
                      <div>{order.toppings?.length > 0 ? order.toppings.join(', ') : '—'}</div>
                      {order.kitchenNotes && (
                        <div className="text-xs text-orange-600 mt-0.5">🍳 {order.kitchenNotes}</div>
                      )}
                      {order.driverNotes && (
                        <div className="text-xs text-blue-500 mt-0.5">🛵 {order.driverNotes}</div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                      <div>{payLabel}</div>
                      {order.paymentStatus === 'pending_cash' && (
                        <div className="text-xs text-orange-500">ממתין לתשלום</div>
                      )}
                      {order.couponCode && (
                        <div className="text-xs text-green-600">🏷️ {order.couponCode}</div>
                      )}
                    </td>
                    <td className="px-3 py-3 font-bold text-gray-800 whitespace-nowrap">{order.total}₪</td>
                    <td className="px-3 py-3 text-gray-400 whitespace-nowrap">{timeStr}</td>
                    <td className="px-3 py-3">
                      <select
                        value={currentStatus}
                        onChange={e => handleStatusUpdate(order.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none ${badgeClass}`}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => handleDone(order.id)}
                        className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition whitespace-nowrap"
                      >
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
    </div>
  );
}
