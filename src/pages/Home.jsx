import React from 'react';
import { Link } from 'react-router-dom';
import { useBackend } from '../context/BackendContext';

export default function Home() {
  const { services, offers, lang } = useBackend();
  const featuredServices = services.filter(s => s.featured).slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '6rem 0 8rem 0',
        background: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15) 0%, rgba(5, 5, 8, 1) 70%)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.5rem 1.2rem',
            borderRadius: '50px',
            background: 'rgba(139, 92, 246, 0.12)',
            border: '1px solid var(--border-glass)',
            color: 'var(--primary-light)',
            fontSize: '0.9rem',
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}>
            ⚡ {lang === 'ar' ? 'أفضل منصة للاشتراكات الرقمية VIP' : 'Best Platform for Premium Digital Subscriptions'}
          </div>

          <h1 style={{
            fontSize: '3.4rem',
            fontWeight: 900,
            lineHeight: 1.2,
            marginBottom: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto 1.5rem auto'
          }}>
            {lang === 'ar' ? (
              <>استمتع باشتراكاتك الرقمية المفضلة <br/><span style={{
                background: 'var(--primary-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>بأقل السعار وأعلى أمان</span></>
            ) : (
              <>Enjoy Premium Subscriptions <br/><span style={{
                background: 'var(--primary-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>At Unbeatable Prices</span></>
            )}
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.8
          }}>
            {lang === 'ar' 
              ? 'نوفر لك خدمات ترفيهية، أدوات الذكاء الاصطناعي، والاشتراكات التعليمية بضمان كامل وتسليم فوري.'
              : 'Providing entertainment, AI tools, and educational subscriptions with full warranty and instant delivery.'}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/services" className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
              🛍️ {lang === 'ar' ? 'تصفح الخدمات' : 'Browse Services'}
            </Link>
            <Link to="/offers" className="btn btn-secondary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
              🔥 {lang === 'ar' ? 'العروض والخصومات' : 'Special Offers'}
            </Link>
          </div>

        </div>
      </section>

      {/* Featured Services */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">
              {lang === 'ar' ? 'الخدمات المميزة' : 'Featured Services'}
            </h2>
            <p className="section-subtitle">
              {lang === 'ar' ? 'اختر من بين أشهر الخدمات والاشتراكات الرقمية' : 'Choose from our top-rated digital subscriptions'}
            </p>
          </div>

          <div className="grid-4">
            {featuredServices.map(service => (
              <div key={service.id} className="product-card">
                <img src={service.image} alt={service.nameAr} className="product-card-img" />
                <div className="product-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 className="product-card-title">{lang === 'ar' ? service.nameAr : service.nameEn}</h3>
                    <span className="badge badge-discount">-{service.discount}%</span>
                  </div>
                  <p className="product-card-desc">{lang === 'ar' ? service.descAr : service.descEn}</p>
                  <div className="product-card-footer">
                    <div className="price-tag">
                      <span className="price-original">${service.originalPrice}</span>
                      <span className="price-current">${service.price}</span>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      {lang === 'ar' ? 'طلب الخدمة' : 'Order Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-glass)' }}>
        <div className="container">
          <div className="grid-3" style={{ textAlign: 'center' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                {lang === 'ar' ? 'تسليم فوري' : 'Instant Delivery'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {lang === 'ar' ? 'تستلم اشتراكك فور إتمام الطلب مباشرة بدون أي تأخير.' : 'Receive your credentials right after payment.'}
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                {lang === 'ar' ? 'ضمان رسمي 100%' : '100% Full Warranty'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {lang === 'ar' ? 'جميع الاشتراكات رسمية ومغطاة بضمان طوال مدة الاشتراك.' : 'All accounts are official and protected by our warranty.'}
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>💬</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                {lang === 'ar' ? 'دعم فني 24/7' : '24/7 Live Support'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {lang === 'ar' ? 'فريق الدعم متواجد على مدار الساعة لمساعدتك والإجابة عن استفساراتك.' : 'Our customer team is available anytime to assist you.'}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
