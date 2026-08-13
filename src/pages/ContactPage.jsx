import React from 'react';
import { useBackend } from '../context/BackendContext';

export default function ContactPage() {
  const { lang } = useBackend();

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="section-title">
            {lang === 'ar' ? 'تواصل معنا' : 'Contact Support'}
          </h1>
          <p className="section-subtitle">
            {lang === 'ar' ? 'فريق الخدمة والدعم متواجد دائماً لمساعدتك' : 'We are here to answer your questions and assist you'}
          </p>
        </div>

        <div className="grid-3" style={{ textAlign: 'center' }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>واتساب</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>+201000000000</p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>البريد الإلكتروني</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>support@servicevip.com</p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏰</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>ساعات العمل</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>24 ساعة / 7 أيام</p>
          </div>
        </div>
      </div>
    </div>
  );
}
