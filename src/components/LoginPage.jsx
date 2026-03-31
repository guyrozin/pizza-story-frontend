import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GOLD = '#FFC107';
const DARK = '#1A1A1A';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem('pizzaAuth') || '{}');

  const handleSubmit = e => {
    e.preventDefault();
    if (!phone.trim()) return;
    localStorage.setItem('pizzaAuth', JSON.stringify({ phone: phone.trim(), verified: false }));
    navigate('/verify');
  };

  const handleLogout = () => {
    localStorage.removeItem('pizzaAuth');
    window.location.reload();
  };

  // ── Profile View (authenticated) ──────────────────────────────────────────
  if (auth.verified) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-5 py-4 text-center">
          <span className="font-black text-xl tracking-widest text-dark">PIZZA STORY</span>
        </div>

        {/* Gold avatar strip */}
        <div
          className="px-5 pt-8 pb-12 flex flex-col items-center"
          style={{ background: 'linear-gradient(180deg, #FFC107 0%, #FFD54F 100%)' }}
        >
          <div
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md mb-3"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke={DARK} strokeWidth="1.8" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <p className="font-black text-dark text-xl">{auth.name || 'שלום!'}</p>
          <p className="text-dark/60 text-sm mt-0.5" dir="ltr">{auth.phone}</p>
        </div>

        <div className="px-4 -mt-6 space-y-3">
          {/* Menu items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke={DARK} strokeWidth="1.8" strokeLinecap="round">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                    <rect x="9" y="3" width="6" height="4" rx="1"/>
                    <line x1="9" y1="12" x2="15" y2="12"/>
                  </svg>
                ),
                label: 'ההזמנות שלי',
                sub: 'היסטוריה ותוכנית נאמנות',
                path: '/history',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke={DARK} strokeWidth="1.8" strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                ),
                label: 'מעקב הזמנה',
                sub: 'עקוב אחרי הזמנה פעילה',
                path: '/tracker',
              },
            ].map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 text-right hover:bg-gray-50 transition"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#FFC10715' }}
                >
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-dark text-sm">{item.label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            ))}
          </div>

          {/* Verified badge */}
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-3 border"
            style={{ background: '#FFC10710', borderColor: `${GOLD}30` }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={GOLD} strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p className="text-sm font-bold text-dark">מספר מאומת</p>
            <p className="text-xs text-gray-400 mr-auto" dir="ltr">{auth.phone}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-4 rounded-full border-2 border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition active:scale-95 text-sm"
          >
            התנתק
          </button>
        </div>
      </div>
    );
  }

  // ── Login View (unauthenticated) ───────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 text-center">
        <span className="font-black text-xl tracking-widest text-dark">PIZZA STORY</span>
      </div>

      {/* Hero */}
      <div
        className="px-5 pt-10 pb-16 text-center"
        style={{ background: 'linear-gradient(180deg, #FFC107 0%, #FFD54F 100%)' }}
      >
        <div className="text-7xl mb-4">🍕</div>
        <h1 className="font-black text-dark text-2xl mb-1">ברוכים הבאים</h1>
        <p className="text-dark/60 text-sm">הכנסו לחשבון כדי לעקוב ולצבור נקודות</p>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
          <h2 className="font-black text-dark text-xl mb-1">כניסה לחשבון</h2>
          <p className="text-gray-400 text-sm mb-5">הכנס מספר טלפון לקבלת קוד</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                מספר טלפון
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                placeholder="050-0000000"
                className="w-full border border-gray-200 rounded-xl px-4 py-4 text-xl text-center text-dark focus:border-dark focus:outline-none transition bg-gray-50"
                dir="ltr"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full font-black text-dark py-4 rounded-full shadow-sm transition active:scale-95"
              style={{ background: GOLD }}
            >
              שלח קוד אימות →
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="mt-3 w-full py-3.5 rounded-full border-2 border-gray-200 font-bold text-gray-500 text-sm hover:bg-gray-50 transition"
          >
            חזרה לתפריט
          </button>
        </div>

        {/* Benefits */}
        <div className="space-y-2">
          {[
            { icon: '📋', text: 'עקוב אחרי ההזמנות שלך בזמן אמת' },
            { icon: '🏆', text: 'צבור נקודות לפיצה חינם' },
            { icon: '⚡', text: 'כתובת אוטומטית בהזמנה הבאה' },
          ].map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl"
            >
              <span className="text-xl">{b.icon}</span>
              <span className="text-sm text-gray-600 font-medium">{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
