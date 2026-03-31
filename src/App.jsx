import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import PizzaMenu from './components/PizzaMenu';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import OrderSuccess from './components/OrderSuccess';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import VerificationScreen from './components/VerificationScreen';
import OrderHistory from './components/OrderHistory';
import OrderTracker from './components/OrderTracker';
import LegalTerms from './components/LegalTerms';
import AboutContact from './components/AboutContact';
import { getCart } from './menu';

const RED   = '#E31837';
const DARK  = '#1A1A1A';
const MUTED = '#9ca3af';

// ── SVG icon set ──────────────────────────────────────────────────────────────
function IconHome({ active }) {
  const c = active ? RED : MUTED;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function IconOrders({ active }) {
  const c = active ? RED : MUTED;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="12" y2="16"/>
    </svg>
  );
}

function IconCart({ active, count }) {
  const c = active ? RED : MUTED;
  return (
    <div className="relative">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center font-black text-white"
          style={{ background: RED, fontSize: 9 }}
        >{count}</span>
      )}
    </div>
  );
}

function IconProfile({ active }) {
  const c = active ? RED : MUTED;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="w-full flex justify-center gap-6 py-3 pb-20 text-xs font-semibold"
      style={{ background: '#f5f5f5', borderTop: '1px solid #e5e7eb', color: '#9ca3af' }}
    >
      <Link to="/terms" style={{ color: '#6b7280' }} className="hover:underline">תקנון האתר</Link>
      <Link to="/about" style={{ color: '#6b7280' }} className="hover:underline">אודות וצור קשר</Link>
    </footer>
  );
}

// ── Bottom Navigation ─────────────────────────────────────────────────────────
const SHOW_NAV_PATHS = ['/', '/history', '/cart', '/tracker', '/login'];

function BottomNav() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const cartCount    = getCart().items.length;

  if (!SHOW_NAV_PATHS.includes(pathname)) return null;

  const tabs = [
    { path: '/',        label: 'בית',    Icon: ({ active }) => <IconHome active={active} /> },
    { path: '/history', label: 'הזמנות', Icon: ({ active }) => <IconOrders active={active} /> },
    { path: '/cart',    label: 'עגלה',   Icon: ({ active }) => <IconCart active={active} count={cartCount} /> },
    { path: '/login',   label: 'פרופיל', Icon: ({ active }) => <IconProfile active={active} /> },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white flex z-50"
      style={{
        height: 64,
        borderTop: '1px solid #f0f0f0',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.07)',
      }}
    >
      {tabs.map(({ path, label, Icon }) => {
        const active = pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center justify-center gap-1 transition-all relative"
            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
          >
            <Icon active={active} />
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                color: active ? RED : MUTED,
                letterSpacing: '0.01em',
              }}
            >
              {label}
            </span>
            {active && (
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: 24,
                  height: 2,
                  background: RED,
                  borderRadius: '2px 2px 0 0',
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────
function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/"        element={<PizzaMenu />} />
        <Route path="/cart"    element={<Cart />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/success" element={<OrderSuccess />} />
        <Route path="/admin"   element={<AdminDashboard />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/verify"  element={<VerificationScreen />} />
        <Route path="/history" element={<OrderHistory />} />
        <Route path="/tracker" element={<OrderTracker />} />
        <Route path="/terms"   element={<LegalTerms />} />
        <Route path="/about"   element={<AboutContact />} />
      </Routes>
      <Footer />
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
