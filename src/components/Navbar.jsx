import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBackend } from '../context/BackendContext';

export default function Navbar() {
  const { siteSettings, lang, setLang, currentUser, logout } = useBackend();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      background: 'rgba(10, 10, 18, 0.95)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid var(--border-glass)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        
        {/* Brand Logo & Dynamic Site Name */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {siteSettings.siteLogo ? (
            <img src={siteSettings.siteLogo} alt="Logo" style={{ height: '38px', borderRadius: '8px', objectFit: 'contain' }} />
          ) : (
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.3rem',
              color: '#fff',
              boxShadow: 'var(--shadow-glow)'
            }}>V</div>
          )}
          <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.5px' }}>
            {siteSettings.siteName}
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontWeight: 600,
                fontSize: '0.92rem',
                color: location.pathname === link.path ? 'var(--primary-light)' : 'var(--text-secondary)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                background: location.pathname === link.path ? 'rgba(139, 92, 246, 0.1)' : 'transparent'
              }}
            >
              {lang === 'ar' ? link.labelAr : link.labelEn}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="nav-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button onClick={toggleLanguage} className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
            🌐 {lang === 'ar' ? 'EN' : 'العربية'}
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/admin" className="btn btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}>
                ⚙️ {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
              </Link>
              <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.45rem 0.7rem' }}>
                🚪
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.45rem 1.2rem', fontSize: '0.85rem' }}>
              🔐 {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          style={{
            display: 'none',
            fontSize: '1.6rem',
            background: 'rgba(139, 92, 246, 0.15)',
            color: 'var(--primary-light)',
            padding: '0.4rem 0.8rem',
            borderRadius: '10px',
            border: '1px solid var(--border-glass)',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? '✖' : '☰'}
        </button>

      </div>

      {/* Fullscreen Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="nav-mobile-drawer" style={{
          position: 'fixed',
          top: 'var(--nav-height)',
          left: 0,
          right: 0,
          width: '100vw',
          height: 'calc(100vh - var(--nav-height))',
          background: 'rgba(5, 5, 10, 0.98)',
          backdropFilter: 'blur(25px)',
          padding: '1.8rem 1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          zIndex: 9999,
          overflowY: 'auto'
        }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontWeight: 700,
                fontSize: '1.15rem',
                color: location.pathname === link.path ? 'var(--primary-light)' : 'var(--text-primary)',
                padding: '1rem 1.4rem',
                borderRadius: '14px',
                background: location.pathname === link.path ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                border: location.pathname === link.path ? '1px solid var(--primary-light)' : '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <span>{lang === 'ar' ? link.labelAr : link.labelEn}</span>
              <span style={{ fontSize: '1.2rem', opacity: 0.5 }}>←</span>
            </Link>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <button onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }} className="btn btn-secondary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
              🌐 {lang === 'ar' ? 'English Language' : 'اللغة العربية'}
            </button>

            {currentUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
                  ⚙️ {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="btn btn-secondary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
                  🚪 تسجيل الخروج
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
                🔐 {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </Link>
            )}
          </div>
        </div>
      )}

    </nav>
  );
}
