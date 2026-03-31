import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API  = process.env.REACT_APP_API_URL || 'https://pizza-story-backend-u6n0.onrender.com';
const GOLD = '#FFC107';
const DARK = '#1A1A1A';

const STEPS = [
  { key: 'pending',        label: 'התקבלה', desc: 'ממתין לאישור המטבח',     icon: <StepIconOrder /> },
  { key: 'preparing',      label: 'בהכנה',   desc: 'הפיצה שלך בתנור עכשיו', icon: <StepIconChef /> },
  { key: 'outForDelivery', label: 'בדרך',    desc: 'השליח בדרך אליך',       icon: <StepIconBike /> },
  { key: 'completed',      label: 'הגיעה',   desc: 'תיאבון!',               icon: <StepIconCheck /> },
];

function StepIconOrder() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
    </svg>
  );
}
function StepIconChef() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 0114 0A4 4 0 0118 13.87V21H6z"/>
      <line x1="6" y1="17" x2="18" y2="17"/>
    </svg>
  );
}
function StepIconBike() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
      <path d="M15 6h1l3 3.5-4.5 4.5H9.5L7 17.5"/>
      <path d="M12 17.5L9.5 14 11 6"/>
    </svg>
  );
}
function StepIconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function stepIndex(status) {
  const idx = STEPS.findIndex(s => s.key === status);
  return idx === -1 ? 0 : idx;
}

export default function OrderTracker() {
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem('pizzaAuth') || '{}');

  const fetchOrder = () => {
    if (!auth.phone) return;
    axios.get(`${API}/api/orders/current/${auth.phone}`)
      .then(res => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!auth.phone) { navigate('/login'); return; }
    fetchOrder();
    const id = setInterval(fetchOrder, 30000);
    return () => clearInterval(id);
  }, []);

  const currentStep = stepIndex(order?.status || 'pending');

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white pb-20">
        <div className="bg-white border-b border-gray-100 px-5 py-4 text-center">
          <span className="font-black text-xl tracking-widest text-dark">PIZZA STORY</span>
        </div>
        <div className="flex flex-col items-center justify-center py-28">
          <div className="text-5xl mb-4 animate-pulse">🍕</div>
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
        <p className="text-gray-400 text-xs mt-0.5">מעקב הזמנה</p>
      </div>

      {!order ? (
        <div className="px-4 pt-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl"
              style={{ background: '#FFC10715' }}
            >🍕</div>
            <p className="font-black text-dark text-xl mb-2">אין הזמנה פעילה</p>
            <p className="text-gray-400 text-sm mb-8">
              לאחר ביצוע הזמנה תוכלו לעקוב אחריה כאן
            </p>
            <button
              onClick={() => navigate('/')}
              className="font-black text-dark px-10 py-4 rounded-full shadow-sm transition active:scale-95"
              style={{ background: GOLD }}
            >
              הזמן עכשיו
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 pt-5 space-y-4">

          {/* ── Order Summary ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  הזמנה #{order.id?.slice(-6)?.toUpperCase()}
                </p>
                <p className="font-black text-dark text-3xl mt-0.5">{order.total}₪</p>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </p>
                <p className="text-xs text-gray-500 mt-1 max-w-[130px] truncate">
                  {order.toppings?.join(', ') || 'ללא תוספות'}
                </p>
              </div>
            </div>
          </div>

          {/* ── THE TRACKER ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Gold top stripe */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ background: GOLD }}
            >
              <span className="font-black text-dark text-sm tracking-wide">PIZZA TRACKER™</span>
              <span className="text-dark text-xs font-bold opacity-60">
                מתעדכן אוטומטית
              </span>
            </div>

            <div className="px-5 py-7">
              {/* ── Progress Line + Circles ── */}
              <div className="relative">
                {/* Track background */}
                <div
                  className="absolute top-5 left-0 right-0 h-0.5"
                  style={{ background: '#e5e7eb' }}
                />
                {/* Filled track */}
                <div
                  className="absolute top-5 left-0 h-0.5 transition-all duration-700"
                  style={{
                    background: GOLD,
                    width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
                  }}
                />

                {/* Step circles */}
                <div className="relative flex justify-between">
                  {STEPS.map((step, idx) => {
                    const done    = idx <= currentStep;
                    const current = idx === currentStep;
                    return (
                      <div key={step.key} className="flex flex-col items-center" style={{ width: 60 }}>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10 relative"
                          style={done
                            ? {
                                background: current ? DARK : GOLD,
                                color: current ? GOLD : DARK,
                                boxShadow: current ? `0 0 0 4px ${GOLD}30` : 'none',
                              }
                            : { background: '#f3f4f6', color: '#d1d5db' }
                          }
                        >
                          {step.icon}
                        </div>
                        <span
                          className="text-xs mt-2 font-bold text-center leading-tight"
                          style={{ color: done ? DARK : '#d1d5db' }}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Status Message ── */}
              <div
                className="mt-6 rounded-xl px-4 py-4 text-center"
                style={{ background: '#FFC10712', border: `1px solid ${GOLD}30` }}
              >
                <p className="font-black text-dark text-base">
                  {order.status === 'pending'        && '📋 ההזמנה שלך התקבלה!'}
                  {order.status === 'preparing'      && '🍕 הפיצה שלך בתנור!'}
                  {order.status === 'outForDelivery' && '🛵 הפיצה בדרך אליך!'}
                  {order.status === 'completed'      && '🎉 הגיעה! תיאבון!'}
                  {!order.status                     && '📋 ממתין לעדכון...'}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {STEPS[currentStep]?.desc}
                </p>
                {order.status === 'outForDelivery' && (
                  <p className="text-xs text-gray-400 mt-1">זמן משוער: 15–25 דקות</p>
                )}
              </div>
            </div>
          </div>

          {order.status === 'completed' && (
            <button
              onClick={() => navigate('/')}
              className="w-full font-black text-dark py-4 rounded-full shadow-sm transition active:scale-95"
              style={{ background: GOLD }}
            >
              🍕 הזמן שוב
            </button>
          )}
        </div>
      )}
    </div>
  );
}
