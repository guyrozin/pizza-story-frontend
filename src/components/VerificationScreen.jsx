import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const GOLD = '#FFC107';
const DARK = '#1A1A1A';

export default function VerificationScreen() {
  const [code, setCode]           = useState(['', '', '', '']);
  const [timer, setTimer]         = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError]         = useState('');
  const inputs = useRef([]);
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem('pizzaAuth') || '{}');

  useEffect(() => {
    if (!auth.phone) navigate('/login');
  }, []);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[idx] = val;
    setCode(next);
    if (val && idx < 3) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0)
      inputs.current[idx - 1]?.focus();
  };

  const handleVerify = () => {
    if (code.join('').length < 4) { setError('הכנס 4 ספרות'); return; }
    localStorage.setItem('pizzaAuth', JSON.stringify({ ...auth, verified: true }));
    navigate('/');
  };

  const handleResend = () => {
    setTimer(60); setCanResend(false);
    setCode(['', '', '', '']); setError('');
    inputs.current[0]?.focus();
  };

  const filled = code.filter(Boolean).length;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center relative">
        <button onClick={() => navigate('/login')} className="absolute right-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke={DARK} strokeWidth="1.8" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex-1 text-center">
          <span className="font-black text-xl tracking-widest text-dark">PIZZA STORY</span>
        </div>
      </div>

      {/* Gold hero */}
      <div
        className="px-5 pt-10 pb-14 text-center"
        style={{ background: 'linear-gradient(180deg, #FFC107 0%, #FFD54F 100%)' }}
      >
        <div className="text-6xl mb-3">📱</div>
        <h1 className="font-black text-dark text-2xl mb-1">אימות מספר</h1>
        <p className="text-dark/60 text-sm">נשלח קוד בן 4 ספרות לטלפון</p>
        {auth.phone && (
          <p className="font-black text-dark text-lg mt-2" dir="ltr">{auth.phone}</p>
        )}
      </div>

      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
          <p className="text-center text-gray-400 text-sm mb-6">
            הכנס את הקוד שקיבלת ב-SMS
          </p>

          {/* Digit inputs */}
          <div className="flex gap-3 justify-center mb-3" dir="ltr">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={el => (inputs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                className="w-16 h-16 text-center text-3xl font-black rounded-2xl border-2 focus:outline-none transition"
                style={digit
                  ? { borderColor: GOLD, background: '#FFC10712', color: DARK }
                  : { borderColor: '#e5e7eb', background: '#f9fafb', color: DARK }
                }
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-red-500 text-sm mb-3 font-bold">{error}</p>
          )}

          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {code.map((d, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-200"
                style={{ background: d ? GOLD : '#e5e7eb', transform: d ? 'scale(1.25)' : 'scale(1)' }}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={filled < 4}
            className="w-full font-black text-dark py-4 rounded-full shadow-sm transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed mb-4"
            style={{ background: filled < 4 ? '#e5e7eb' : GOLD }}
          >
            אמת קוד
          </button>

          <p className="text-center text-sm text-gray-400">
            {canResend ? (
              <button
                onClick={handleResend}
                className="font-black underline"
                style={{ color: DARK }}
              >
                שלח קוד מחדש
              </button>
            ) : (
              <>שלח שוב בעוד{' '}
                <span className="font-black" style={{ color: DARK }}>{timer}</span>{' '}
                שניות</>
            )}
          </p>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="mt-4 w-full text-center text-sm text-gray-400 py-3 hover:text-gray-600 transition"
        >
          ← שנה מספר טלפון
        </button>
      </div>
    </div>
  );
}
