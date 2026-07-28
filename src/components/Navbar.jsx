import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBackend } from '../context/BackendContext';

export default function Navbar() {
  const { lang, setLang, currentUser, logout } = useBackend();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const navLinks = [
    { path: '/', labelAr: 'الرئيسية', labelEn: 'Home' },
    { path: '/services', labelAr: 'الخدمات والمنتجات', labelEn: 'Services' },
    { path: '/offers', labelAr: 'العروض والخصومات', labelEn: 'Offers' },
    { path: '/complaints', labelAr: 'تقديم شكوى', labelEn: 'Complaints' },
    { path: '/contact', labelAr: 'اتصل بنا', labelEn: 'Contact' }
  ];

  return (
    <nav style={{
      height: 'var(--nav-height)',
      background: 'rgba(10, 10, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-glass)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.4rem',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)'
          }}>V</div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.5px' }}>
            Service <span style={{ color: 'var(--primary-light)' }}>VIP</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontWeight: 600,
                fontSize: '0.95rem',
                color: location.pathname === link.path ? 'var(--primary-light)' : 'var(--text-secondary)',
                transition: 'all 0.2s',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                background: location.pathname === link.path ? 'rgba(139, 92, 246, 0.1)' : 'transparent'
              }}
            >
              {lang === 'ar' ? link.labelAr : link.labelEn}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={toggleLanguage} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            🌐 {lang === 'ar' ? 'EN' : 'العربية'}
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Link to="/admin" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem' }}>
                ⚙️ {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
              </Link>
              <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 0.8rem' }}>
                🚪
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.4rem' }}>
              🔐 {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}
