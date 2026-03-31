import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GOLD = '#FFC107';
const DARK = '#1A1A1A';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 text-center">
        <span className="font-black text-xl tracking-widest text-dark">PIZZA STORY</span>
      </div>

      {/* Gold hero */}
      <div
        className="px-5 pt-12 pb-20 text-center flex-shrink-0"
        style={{ background: 'linear-gradient(180deg, #FFC107 0%, #FFD54F 100%)' }}
      >
        <div
          className="text-8xl mb-4 transition-all duration-500"
          style={{ transform: visible ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-20deg)', opacity: visible ? 1 : 0 }}
        >
          🎉
        </div>
        <h1 className="font-black text-dark text-3xl mb-2">ההזמנה נשלחה!</h1>
        <p className="text-dark/60 text-sm">המטבח שלנו כבר עובד על הפיצה שלך</p>
      </div>

      {/* Cards */}
      <div className="px-4 -mt-6 space-y-3 pb-10">

        {/* Track CTA */}
        <button
          onClick={() => navigate('/tracker')}
          className="w-full rounded-2xl overflow-hidden shadow-md flex items-center gap-4 px-5 py-5 text-right transition active:scale-95"
          style={{ background: DARK }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: GOLD }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke={DARK} strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-black text-white text-base">עקוב אחרי ההזמנה</p>
            <p className="text-white/50 text-xs mt-0.5">PIZZA TRACKER™ · בזמן אמת</p>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#ffffff50" strokeWidth="2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          {[
            { icon: '⏱️', title: 'זמן אספקה', sub: '20–40 דקות' },
            { icon: '🔔', title: 'עדכונים', sub: 'הטראקר מתעדכן אוטומטית' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-4 ${i > 0 ? 'pt-4 border-t border-gray-50' : ''}`}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: '#FFC10715' }}
              >
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-dark text-sm">{item.title}</p>
                <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-full border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition active:scale-95 text-sm"
        >
          חזרה לתפריט
        </button>
      </div>
    </div>
  );
}
