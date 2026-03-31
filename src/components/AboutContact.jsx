import React from 'react';
import { useNavigate } from 'react-router-dom';

const RED  = '#E31837';
const DARK = '#1A1A1A';

export default function AboutContact() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto min-h-screen" style={{ background: '#f5f5f5' }}>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center relative">
        <button type="button" onClick={() => navigate(-1)} className="absolute right-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke={DARK} strokeWidth="1.8" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex-1 text-center">
          <span className="font-black text-xl tracking-widest" style={{ color: DARK }}>PIZZA STORY</span>
        </div>
      </div>

      <div className="px-4 pt-4 pb-24 space-y-4">

        {/* ── About ── */}
        <div className="bg-white rounded-2xl p-5 space-y-3" style={{ border: '1px solid #f0f0f0' }}>
          <div className="flex flex-col items-center gap-2 pb-2">
            <span className="text-5xl">🍕</span>
            <h1 className="font-black text-2xl" style={{ color: DARK }}>Pizza Story</h1>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              פיצה אמיתית · טעם של בית
            </p>
          </div>

          <h2 className="font-black text-base" style={{ color: RED }}>אודותינו</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Pizza Story נוסדה מתוך אהבה אמיתית לפיצה. אנחנו מאמינים שפיצה טובה מתחילה
            בבצק טרי שנלוש מדי יום, רוטב עגבניות ביתי ומרכיבים איכותיים שנבחרים בקפידה.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            כל פיצה מוכנה לפי הזמנה — בדיוק כפי שאתם רוצים. בין אם זו פיצה קלאסית
            עם גבינה מנטפת ובין אם זו יצירה מיוחדת עם התוספות האהובות עליכם,
            אנחנו כאן כדי לספק את הפיצה המושלמת שלכם, ישירות אליכם הביתה.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>הבטחה שלנו:</strong> פיצה חמה, טרייה ועשירה — תוך עד 60 דקות.
          </p>
        </div>

        {/* ── Contact ── */}
        <div className="bg-white rounded-2xl p-5 space-y-4" style={{ border: '1px solid #f0f0f0' }}>
          <h2 className="font-black text-base" style={{ color: RED }}>צור קשר</h2>

          {/* Phone */}
          <a
            href="tel:052-4722485"
            className="flex items-center gap-4 rounded-xl p-3 transition active:scale-95"
            style={{ background: `${RED}0D` }}
          >
            <span className="text-2xl">📞</span>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">טלפון</p>
              <p className="font-black text-lg" style={{ color: DARK }} dir="ltr">052-4722485</p>
            </div>
          </a>

          {/* Address */}
          <a
            href="https://maps.google.com/?q=התמר+5+יוקנעם"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl p-3 transition active:scale-95"
            style={{ background: `${RED}0D` }}
          >
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">כתובת</p>
              <p className="font-black text-base" style={{ color: DARK }}>התמר 5 יוקנעם</p>
              <p className="text-xs text-gray-500">מדינת ישראל</p>
            </div>
          </a>

          {/* Hours */}
          <div className="flex items-center gap-4 rounded-xl p-3" style={{ background: '#f9fafb' }}>
            <span className="text-2xl">🕐</span>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">שעות פעילות</p>
              <p className="text-sm font-semibold" style={{ color: DARK }}>ראשון–חמישי: 12:00–23:00</p>
              <p className="text-sm font-semibold" style={{ color: DARK }}>שישי: 12:00–14:30</p>
              <p className="text-sm font-semibold" style={{ color: DARK }}>שבת: 20:00–23:00</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
