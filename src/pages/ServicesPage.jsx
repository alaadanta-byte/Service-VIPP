import React, { useState } from 'react';
import { useBackend } from '../context/BackendContext';

export default function ServicesPage() {
  const { services, siteSettings, lang } = useBackend();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter(service => {
    const name = lang === 'ar' ? service.nameAr : service.nameEn;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="section-title">
            {lang === 'ar' ? 'جميع الخدمات والمنتجات' : 'All Products & Services'}
          </h1>
          <p className="section-subtitle">
            {lang === 'ar' ? 'تصفح قائمة اشتراكاتنا المميزة واختر ما يناسبك' : 'Browse our premium digital subscription catalog'}
          </p>

          {/* Search Input */}
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder={lang === 'ar' ? 'ابحث عن خدمة...' : 'Search service...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1.4rem',
                borderRadius: '50px',
                background: 'var(--bg-glass-strong)',
                border: '1px solid var(--border-glass)',
                color: '#fff',
                fontSize: '1rem',
                boxShadow: 'var(--shadow-md)'
              }}
            />
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3.5rem', borderRadius: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {lang === 'ar' ? 'لا توجد منتجات مضافة حالياً' : 'No products available currently'}
            </h3>
            <p style={{ fontSize: '0.95rem' }}>
              {lang === 'ar' ? 'قم بإضافة المنتجات والخدمات الجديدة من لوحة التحكم.' : 'Add new products from the admin dashboard.'}
            </p>
          </div>
        ) : (
          <div className="grid-4">
            {filteredServices.map(service => (
              <div key={service.id} className="product-card">
                <img src={service.image} alt={service.nameAr} className="product-card-img" />
                <div className="product-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 className="product-card-title">{lang === 'ar' ? service.nameAr : service.nameEn}</h3>
                  </div>
                  <p className="product-card-desc">{lang === 'ar' ? service.descAr : service.descEn}</p>
                  <div className="product-card-footer">
                    <div className="price-tag">
                      <span className="price-current">{siteSettings.currency}{service.price}</span>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      {lang === 'ar' ? 'طلب الآن' : 'Order Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
