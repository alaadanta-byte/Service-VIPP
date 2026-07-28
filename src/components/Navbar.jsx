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
      zIndex: 100,
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
          )}
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.5px' }}>
            {siteSettings.siteName}
          </span>
        </Link>

        {/* Desktop Links (Hidden on Mobile via CSS class desktop-only) */}
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontWeight: 600,
                fontSize: '0.95rem',
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
        <div className="nav-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          style={{
            display: 'none',
            fontSize: '1.8rem',
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-primary)',
            padding: '0.4rem 0.8rem',
            borderRadius: '10px',
            border: '1px solid var(--border-glass)'
          }}
        >
          {mobileMenuOpen ? '✖' : '☰'}
        </button>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="nav-mobile-drawer" style={{
          position: 'fixed',
          top: 'var(--nav-height)',
          left: 0,
          right: 0,
          background: 'rgba(8, 8, 16, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-glass)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          zIndex: 99,
          boxShadow: 'var(--shadow-xl)'
        }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: location.pathname === link.path ? 'var(--primary-light)' : 'var(--text-primary)',
                padding: '0.8rem 1.2rem',
                borderRadius: '12px',
                background: location.pathname === link.path ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                display: 'block'
              }}
            >
              {lang === 'ar' ? link.labelAr : link.labelEn}
            </Link>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }} className="btn btn-secondary" style={{ width: '100%', padding: '0.8rem' }}>
              🌐 {lang === 'ar' ? 'English Language' : 'اللغة العربية'}
            </button>

            {currentUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                  ⚙️ {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="btn btn-secondary" style={{ width: '100%', padding: '0.8rem' }}>
                  🚪 تسجيل الخروج
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                🔐 {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </Link>
            )}
          </div>
        </div>
      )}

    </nav>
  );
}
