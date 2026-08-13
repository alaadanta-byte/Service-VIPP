import React from 'react';
import { useBackend } from '../context/BackendContext';

export default function Footer() {
  const { siteSettings, lang } = useBackend();

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-glass)',
      padding: '4rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              {siteSettings.siteLogo ? (
                <img src={siteSettings.siteLogo} alt="Logo" style={{ height: '36px', borderRadius: '8px' }} />
              ) : (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  color: '#fff'
                }}>V</div>
              )}
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{siteSettings.siteName}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.8' }}>
              {lang === 'ar' ? siteSettings.siteDescAr : siteSettings.siteDescEn}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', color: 'var(--primary-light)' }}>
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <li><a href="/">{lang === 'ar' ? 'الرئيسية' : 'Home'}</a></li>
              <li><a href="/services">{lang === 'ar' ? 'المنتجات والخدمات' : 'Services'}</a></li>
              <li><a href="/offers">{lang === 'ar' ? 'الخصومات والعروض' : 'Offers'}</a></li>
              <li><a href="/complaints">{lang === 'ar' ? 'تقديم شكوى' : 'Complaints'}</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', color: 'var(--primary-light)' }}>
              {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              📧 {siteSettings.email}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              💬 واتساب: {siteSettings.whatsapp}
            </p>

            {/* Social Media Links */}
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.8rem' }}>
              {siteSettings.telegram && (
                <a href={siteSettings.telegram} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  ✈️ تليجرام
                </a>
              )}
              {siteSettings.instagram && (
                <a href={siteSettings.instagram} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  📷 انستجرام
                </a>
              )}
              {siteSettings.facebook && (
                <a href={siteSettings.facebook} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  📘 فيسبوك
                </a>
              )}
            </div>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          paddingTop: '2rem',
          marginTop: '2rem',
          borderTop: '1px solid var(--border-color)',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          © {new Date().getFullYear()} {siteSettings.siteName}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
