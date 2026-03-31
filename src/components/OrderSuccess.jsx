import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GOLD = '#FFC107';
const RED  = '#E31837';
const DARK = '#1A1A1A';
const GREEN = '#22c55e';

// ── Prize table ───────────────────────────────────────────────────────────────
// Each prize has a coupon code (pre-created in DB via admin panel) and a label.
// The game shows only the label; the code is revealed on win.
const PRIZES = [
  { label: '10% הנחה',        code: 'WIN10',    emoji: '🎟️' },
  { label: 'משלוח חינם',      code: 'WINSHIP',  emoji: '🛵' },
  { label: '15% הנחה',        code: 'WIN15',    emoji: '💥' },
  { label: 'תוספת חינם',      code: 'WINADD',   emoji: '🧀' },
];

// Pick a random prize deterministically per session
function pickPrize() {
  return PRIZES[Math.floor(Math.random() * PRIZES.length)];
}

// ── Coin flip animation ───────────────────────────────────────────────────────
function Coin({ flipping, result }) {
  // result: 'win' | 'lose' | null
  const faceStyle = {
    position: 'absolute', inset: 0, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 44, backfaceVisibility: 'hidden',
  };
  return (
    <div style={{ perspective: 800, width: 110, height: 110, margin: '0 auto' }}>
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        transition: flipping ? 'transform 1.2s cubic-bezier(0.4,0,0.2,1)' : 'none',
        transform: flipping
          ? (result === 'win' ? 'rotateY(720deg)' : 'rotateY(900deg)')
          : 'rotateY(0deg)',
      }}>
        {/* Heads */}
        <div style={{ ...faceStyle, background: GOLD, boxShadow: '0 4px 20px #FFC10760' }}>
          🍕
        </div>
        {/* Tails */}
        <div style={{ ...faceStyle, background: '#d1d5db', transform: 'rotateY(180deg)' }}>
          💀
        </div>
      </div>
    </div>
  );
}

// ── Game states ───────────────────────────────────────────────────────────────
// idle → flipping → won | lost → (if won) double_prompt → flipping2 → won2 | lost2 → done
// 'done' just means show final screen

export default function OrderSuccess() {
  const navigate = useNavigate();

  // Success page entrance
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  // Game state
  const [gameState,   setGameState]   = useState('idle');    // see above
  const [result,      setResult]      = useState(null);      // 'win' | 'lose'
  const [result2,     setResult2]     = useState(null);
  const [flipping,    setFlipping]    = useState(false);
  const [prize,       setPrize]       = useState(null);      // { label, code, emoji }
  const [doubled,     setDoubled]     = useState(false);     // did they try to double?
  const [showCode,    setShowCode]    = useState(false);
  const flipTimeout = useRef(null);

  // ── Flip logic ────────────────────────────────────────────────────────────
  const doFlip = (isDouble = false) => {
    const outcome = Math.random() < 0.5 ? 'win' : 'lose';
    setFlipping(true);
    setGameState(isDouble ? 'flipping2' : 'flipping');

    flipTimeout.current = setTimeout(() => {
      setFlipping(false);
      if (isDouble) {
        setResult2(outcome);
        setDoubled(true);
        setGameState(outcome === 'win' ? 'won2' : 'lost2');
      } else {
        setResult(outcome);
        if (outcome === 'win') {
          setPrize(pickPrize());
          setGameState('won');
        } else {
          setGameState('lost');
        }
      }
    }, 1400);
  };

  useEffect(() => () => clearTimeout(flipTimeout.current), []);

  // ── Render helpers ────────────────────────────────────────────────────────
  const currentResult  = gameState.startsWith('flipping2') || gameState === 'won2' || gameState === 'lost2'
    ? result2 : result;
  const isFlipping     = gameState === 'flipping' || gameState === 'flipping2';

  // ── IDLE: show the game teaser ─────────────────────────────────────────────
  const renderIdle = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 text-center"
        style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2d2d2d 100%)' }}>
        <div className="text-4xl mb-2">🎰</div>
        <h3 className="font-black text-white text-xl">Double or Nothing!</h3>
        <p className="text-white/60 text-xs mt-1">זרקו מטבע — זכו בפרס להזמנה הבאה</p>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex justify-center gap-6 text-center">
          {[{ e: '✅', t: 'זכייה', s: 'פרס מיידי' }, { e: '❌', t: 'הפסד', s: 'לנסות שוב' }].map(r => (
            <div key={r.t} className="flex flex-col items-center gap-1">
              <span className="text-3xl">{r.e}</span>
              <span className="font-black text-sm" style={{ color: DARK }}>{r.t}</span>
              <span className="text-xs text-gray-400">{r.s}</span>
            </div>
          ))}
        </div>
        <button onClick={() => doFlip(false)}
          className="w-full font-black text-white py-4 rounded-full transition active:scale-95 shadow-sm text-lg"
          style={{ background: RED }}>
          🪙 זרוק מטבע!
        </button>
        <button onClick={() => setGameState('done')}
          className="w-full text-gray-400 text-sm py-1">
          דלג
        </button>
      </div>
    </div>
  );

  // ── FLIPPING ───────────────────────────────────────────────────────────────
  const renderFlipping = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-4">
      <p className="font-black text-xl" style={{ color: DARK }}>
        {gameState === 'flipping2' ? 'מכפילים...' : 'זורקים...'}
      </p>
      <Coin flipping={true} result={currentResult} />
      <p className="text-gray-400 text-sm animate-pulse">המטבע באוויר ✨</p>
    </div>
  );

  // ── WON (first flip) ────────────────────────────────────────────────────────
  const renderWon = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
        <div className="text-5xl mb-2 animate-bounce">{prize?.emoji}</div>
        <h3 className="font-black text-white text-2xl">זכית! 🎉</h3>
        <p className="text-white/80 text-sm mt-1">קיבלת: <strong>{prize?.label}</strong></p>
      </div>
      <div className="p-5 space-y-3">
        {/* Double or nothing prompt */}
        <div className="rounded-xl p-4 text-center"
          style={{ background: '#FFC10715', border: '2px dashed #FFC107' }}>
          <p className="font-black text-base" style={{ color: DARK }}>רוצים להכפיל?</p>
          <p className="text-xs text-gray-500 mt-0.5">
            זרקו שוב — זכו ב-<strong>פרס גדול יותר</strong>, או תפסידו הכל
          </p>
        </div>
        <button onClick={() => doFlip(true)}
          className="w-full font-black text-white py-4 rounded-full transition active:scale-95"
          style={{ background: GOLD, color: DARK }}>
          🪙 הכפל או כלום!
        </button>
        <button onClick={() => setShowCode(true)}
          className="w-full py-3 rounded-full border-2 font-bold text-sm transition active:scale-95"
          style={{ borderColor: GREEN, color: GREEN }}>
          קח את הפרס שלך ✓
        </button>
      </div>
    </div>
  );

  // ── WON2 (doubled!) ────────────────────────────────────────────────────────
  const renderWon2 = () => {
    // Upgrade the prize to the next tier or just show "doubled"
    const doubledPrize = { ...prize, label: `${prize?.label} × 2 🔥`, emoji: '💎' };
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}>
          <div className="text-5xl mb-2">💎</div>
          <h3 className="font-black text-white text-2xl">הכפלתם! 🚀</h3>
          <p className="text-white/80 text-sm mt-1">קיבלתם: <strong>{doubledPrize.label}</strong></p>
        </div>
        <div className="p-5">
          <button onClick={() => { setPrize(doubledPrize); setShowCode(true); }}
            className="w-full font-black text-white py-4 rounded-full transition active:scale-95"
            style={{ background: '#7C3AED' }}>
            גלה את הקוד שלך 🎁
          </button>
        </div>
      </div>
    );
  };

  // ── LOST ───────────────────────────────────────────────────────────────────
  const renderLost = (wasDouble = false) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, #374151, #1f2937)' }}>
        <div className="text-5xl mb-2">😅</div>
        <h3 className="font-black text-white text-2xl">
          {wasDouble ? 'איבדתם הכל...' : 'לא הפעם!'}
        </h3>
        <p className="text-white/60 text-sm mt-1">
          {wasDouble ? 'אבל היה שווה לנסות 😄' : 'ההזמנה הבאה — אולי תזל 🍀'}
        </p>
      </div>
      <div className="p-5">
        <button onClick={() => setGameState('done')}
          className="w-full py-3 rounded-full border-2 font-bold text-sm text-gray-500 border-gray-200 transition active:scale-95">
          המשך
        </button>
      </div>
    </div>
  );

  // ── SHOW CODE ──────────────────────────────────────────────────────────────
  const renderCode = () => (
    <div className="bg-white rounded-2xl border-2 shadow-md overflow-hidden"
      style={{ borderColor: GREEN }}>
      <div className="p-5 text-center" style={{ background: `${GREEN}15` }}>
        <div className="text-4xl mb-2">{prize?.emoji}</div>
        <h3 className="font-black text-xl" style={{ color: GREEN }}>הפרס שלך מוכן! 🎁</h3>
        <p className="text-gray-500 text-sm mt-1">{prize?.label}</p>
      </div>
      <div className="p-5 space-y-3">
        <div className="text-center rounded-xl py-4 px-3"
          style={{ background: '#f9fafb', border: '2px dashed #d1d5db' }}>
          <p className="text-xs text-gray-400 mb-1">קוד קופון</p>
          <p className="font-black text-2xl tracking-widest" style={{ color: DARK, letterSpacing: 6 }}>
            {prize?.code}
          </p>
        </div>
        <p className="text-xs text-gray-400 text-center">
          הזינו את הקוד בשדה הקופון בהזמנה הבאה
        </p>
        <button onClick={() => { navigator.clipboard?.writeText(prize?.code || ''); }}
          className="w-full py-3 rounded-full border-2 font-bold text-sm transition active:scale-95"
          style={{ borderColor: GREEN, color: GREEN }}>
          העתק קוד 📋
        </button>
        <button onClick={() => setGameState('done')}
          className="w-full text-gray-400 text-sm py-1">המשך</button>
      </div>
    </div>
  );

  // ── GAME SECTION ───────────────────────────────────────────────────────────
  const renderGame = () => {
    if (showCode)                                      return renderCode();
    if (gameState === 'idle')                          return renderIdle();
    if (gameState === 'flipping' || gameState === 'flipping2') return renderFlipping();
    if (gameState === 'won')                           return renderWon();
    if (gameState === 'won2')                          return renderWon2();
    if (gameState === 'lost')                          return renderLost(false);
    if (gameState === 'lost2')                         return renderLost(true);
    return null;
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 text-center">
        <span className="font-black text-xl tracking-widest" style={{ color: DARK }}>PIZZA STORY</span>
      </div>

      {/* Gold hero */}
      <div className="px-5 pt-12 pb-20 text-center flex-shrink-0"
        style={{ background: 'linear-gradient(180deg, #FFC107 0%, #FFD54F 100%)' }}>
        <div className="text-8xl mb-4 transition-all duration-500"
          style={{ transform: visible ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-20deg)', opacity: visible ? 1 : 0 }}>
          🎉
        </div>
        <h1 className="font-black text-dark text-3xl mb-2">ההזמנה נשלחה!</h1>
        <p className="text-dark/60 text-sm">המטבח שלנו כבר עובד על הפיצה שלך</p>
      </div>

      {/* Cards */}
      <div className="px-4 -mt-6 space-y-3 pb-10">

        {/* ── Double or Nothing game ── */}
        {gameState !== 'done' && renderGame()}

        {/* ── Track CTA ── */}
        {gameState === 'done' && (
          <button onClick={() => navigate('/tracker')}
            className="w-full rounded-2xl overflow-hidden shadow-md flex items-center gap-4 px-5 py-5 text-right transition active:scale-95"
            style={{ background: DARK }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: GOLD }}>
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
        )}

        {/* ── Info / navigation ── */}
        {gameState === 'done' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            {[
              { icon: '⏱️', title: 'זמן אספקה', sub: '20–40 דקות' },
              { icon: '🔔', title: 'עדכונים', sub: 'הטראקר מתעדכן אוטומטית' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 ${i > 0 ? 'pt-4 border-t border-gray-50' : ''}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: '#FFC10715' }}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: DARK }}>{item.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => navigate('/')}
          className="w-full py-4 rounded-full border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition active:scale-95 text-sm">
          חזרה לתפריט
        </button>
      </div>
    </div>
  );
}
