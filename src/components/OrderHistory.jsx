import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API           = process.env.REACT_APP_API_URL || 'https://pizza-story-backend-u6n0.onrender.com';
const LOYALTY_TARGET = 5;
const GOLD          = '#FFC107';
const DARK          = '#1A1A1A';

const STATUS_MAP = {
  pending:        { label: 'ממתין',   bg: '#fef3c7', text: '#92400e' },
  preparing:      { label: 'בהכנה',   bg: '#dbeafe', text: '#1e40af' },
  outForDelivery: { label: 'במשלוח',  bg: '#ede9fe', text: '#5b21b6' },
  completed:      { label: 'הושלם',   bg: '#dcfce7', text: '#166534' },
};

export default function OrderHistory() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem('pizzaAuth') || '{}');

  useEffect(() => {
    if (!auth.phone) { navigate('/login'); return; }
    axios.get(`${API}/api/orders/history/${auth.phone}`)
      .then(res =>
        setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleReorder = order => {
    localStorage.setItem('cart', JSON.stringify({ toppings: order.toppings || [], total: order.total || 30 }));
    navigate('/cart');
  };

  const loyaltyCount    = orders.length;
  const loyaltyProgress = loyaltyCount % LOYALTY_TARGET;
  const ordersUntilNext = loyaltyProgress === 0 && loyaltyCount > 0 ? 0 : LOYALTY_TARGET - loyaltyProgress;
  const freePizzasEarned = Math.floor(loyaltyCount / LOYALTY_TARGET);
  const totalSpent       = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const isReady          = ordersUntilNext === 0 && loyaltyCount > 0;
  const activeDots       = isReady ? LOYALTY_TARGET : loyaltyProgress;

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white pb-20">
        <div className="bg-white border-b border-gray-100 px-5 py-4 text-center">
          <span className="font-black text-xl tracking-widest text-dark">PIZZA STORY</span>
        </div>
        <div className="flex flex-col items-center justify-center py-28">
          <div className="text-5xl mb-4 animate-bounce">🍕</div>
          <p className="text-gray-400">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white pb-20">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 text-center">
        <span className="font-black text-xl tracking-widest text-dark">PIZZA STORY</span>
        <p className="text-gray-400 text-xs mt-0.5">הזמנות · {totalSpent}₪ סה"כ</p>
      </div>

      <div className="px-4 pt-5 space-y-4">

        {/* ── Loyalty Card ── */}
        <div
          className="rounded-2xl overflow-hidden border"
          style={{ borderColor: `${GOLD}50` }}
        >
          {/* Gold header strip */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ background: GOLD }}
          >
            <div>
              <p className="font-black text-dark text-base">כרטיס נאמנות</p>
              <p className="text-dark/60 text-xs">כל 5 הזמנות = פיצה חינם 🎁</p>
            </div>
            {freePizzasEarned > 0 && (
              <div
                className="text-xs font-black text-dark px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.15)' }}
              >
                🍕 ×{freePizzasEarned} נוצלו
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="bg-white px-5 py-4">
            {isReady ? (
              <div
                className="rounded-xl p-3 text-center mb-3"
                style={{ background: '#FFC10720', border: `1px solid ${GOLD}40` }}
              >
                <p className="font-black text-dark">🎉 מגיעה לך פיצה חינם!</p>
                <p className="text-gray-500 text-xs mt-0.5">פנה אלינו לממש את הפרס</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-3">
                עוד{' '}
                <span className="font-black text-dark text-lg">{ordersUntilNext}</span>
                {' '}הזמנות לפיצה חינם
              </p>
            )}

            {/* Gold pizza icons progress */}
            <div className="flex items-center gap-2.5">
              {Array.from({ length: LOYALTY_TARGET }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span
                    style={{
                      fontSize: 22,
                      filter: i < activeDots ? 'none' : 'grayscale(1) opacity(0.25)',
                      transition: 'all 0.3s',
                    }}
                  >
                    🍕
                  </span>
                  <div
                    className="w-full h-1 rounded-full"
                    style={{ background: i < activeDots ? GOLD : '#e5e7eb' }}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              {loyaltyProgress}/{LOYALTY_TARGET} הזמנות
            </p>
          </div>
        </div>

        {/* ── Orders List ── */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl"
              style={{ background: '#FFC10715' }}
            >🍕</div>
            <p className="font-black text-dark text-lg mb-2">אין הזמנות עדיין</p>
            <p className="text-gray-400 text-sm mb-6">הזמנה ראשונה תופיע כאן</p>
            <button
              onClick={() => navigate('/')}
              className="font-black text-dark px-8 py-3.5 rounded-full shadow-sm transition active:scale-95"
              style={{ background: GOLD }}
            >
              הזמן עכשיו
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, idx) => {
              const s = STATUS_MAP[order.status] || { label: order.status || '', bg: '#f3f4f6', text: '#6b7280' };
              return (
                <div
                  key={order.id || idx}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-dark text-xl">{order.total}₪</span>
                      {order.status && (
                        <span
                          className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                          style={{ background: s.bg, color: s.text }}
                        >
                          {s.label}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('he-IL') : ''}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-1">
                    🍕 {order.toppings?.length > 0 ? order.toppings.join(', ') : 'ללא תוספות'}
                  </p>

                  {(order.address || order.deliveryAddress) && (
                    <p className="text-xs text-gray-400 mb-2">
                      📍 {order.address || order.deliveryAddress}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400">
                      {order.paymentMethod === 'cash' ? '💵 מזומן' : '💳 אשראי'}
                    </span>
                    <button
                      onClick={() => handleReorder(order)}
                      className="text-xs font-black text-dark px-4 py-2 rounded-full transition active:scale-95"
                      style={{ background: GOLD }}
                    >
                      הזמן שוב
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
