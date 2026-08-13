import React from 'react';
import { useBackend } from '../context/BackendContext';

export default function OffersPage() {
  const { offers, lang } = useBackend();

  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="section-title">
            {lang === 'ar' ? 'العروض والخصومات الحصرية' : 'Exclusive Offers & Discounts'}
          </h1>
          <p className="section-subtitle">
            {lang === 'ar' ? 'وفر أكثر مع أقوى حزم الخصومات المتاحة حالياً' : 'Save more with our active bundle deals and discounts'}
          </p>
        </div>

        <div className="grid-3">
          {offers.map(offer => (
            <div key={offer.id} className="glass-panel" style={{
              borderRadius: '20px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {offer.image && (
                <div style={{ marginBottom: '1.2rem', overflow: 'hidden', borderRadius: '12px' }}>
                  <img src={offer.image} alt={offer.titleAr} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                </div>
              )}

              <div>
                <span className="badge badge-discount" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                  {lang === 'ar' ? offer.badgeAr : offer.badgeEn}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.8rem' }}>
                  {lang === 'ar' ? offer.titleAr : offer.titleEn}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                  {lang === 'ar' ? offer.descAr : offer.descEn}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1.2rem',
                borderTop: '1px solid var(--border-color)'
              }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-light)' }}>
                  -{offer.discount}%
                </span>
                <button className="btn btn-accent">
                  {lang === 'ar' ? 'استفد من العرض' : 'Claim Offer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
