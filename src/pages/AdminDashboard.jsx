import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackend } from '../context/BackendContext';

export default function AdminDashboard() {
  const {
    currentUser,
    logout,
    siteSettings,
    updateSiteSettings,
    services,
    offers,
    complaints,
    addService,
    updateService,
    deleteService,
    addOffer,
    deleteOffer,
    updateComplaintStatus,
    deleteComplaint,
    lang
  } = useBackend();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'settings' | 'services' | 'offers' | 'complaints'
  
  // Site Settings Form
  const [settingsForm, setSettingsForm] = useState(siteSettings);
  const [savedSettingsMsg, setSavedSettingsMsg] = useState(false);

  // New Service Modal / Form
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState({ nameAr: '', nameEn: '', price: '', originalPrice: '', descAr: '', image: '' });

  // New Offer Form
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerForm, setOfferForm] = useState({ titleAr: '', titleEn: '', descAr: '', discount: '', badgeAr: 'عرض خاص' });

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Handle Site Settings Save
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSiteSettings(settingsForm);
    setSavedSettingsMsg(true);
    setTimeout(() => setSavedSettingsMsg(false), 3000);
  };

  // Handle Add/Edit Service
  const handleServiceSubmit = (e) => {
    e.preventDefault();
    const priceNum = parseFloat(serviceForm.price) || 0;
    const origPriceNum = parseFloat(serviceForm.originalPrice) || priceNum;
    const discountCalc = origPriceNum > 0 ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : 0;

    const dataPayload = {
      nameAr: serviceForm.nameAr,
      nameEn: serviceForm.nameEn || serviceForm.nameAr,
      descAr: serviceForm.descAr,
      descEn: serviceForm.descAr,
      price: priceNum,
      originalPrice: origPriceNum,
      discount: discountCalc > 0 ? discountCalc : 0,
      image: serviceForm.image || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop'
    };

    if (editingServiceId) {
      updateService(editingServiceId, dataPayload);
    } else {
      addService(dataPayload);
    }

    setServiceForm({ nameAr: '', nameEn: '', price: '', originalPrice: '', descAr: '', image: '' });
    setEditingServiceId(null);
    setShowServiceModal(false);
  };

  const startEditService = (service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      nameAr: service.nameAr,
      nameEn: service.nameEn || service.nameAr,
      price: service.price,
      originalPrice: service.originalPrice,
      descAr: service.descAr,
      image: service.image
    });
    setShowServiceModal(true);
  };

  // Handle Add Offer
  const handleOfferSubmit = (e) => {
    e.preventDefault();
    addOffer({
      titleAr: offerForm.titleAr,
      titleEn: offerForm.titleAr,
      descAr: offerForm.descAr,
      descEn: offerForm.descAr,
      discount: parseInt(offerForm.discount) || 10,
      badgeAr: offerForm.badgeAr || 'عرض خاص',
      badgeEn: 'Special Offer'
    });
    setOfferForm({ titleAr: '', titleEn: '', descAr: '', discount: '', badgeAr: 'عرض خاص' });
    setShowOfferModal(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--nav-height))' }}>
      
      {/* Admin Sidebar */}
      <aside style={{
        width: '280px',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-glass)',
        padding: '2rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem'
      }}>
        <div style={{ padding: '0 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>V</div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>لوحة الإدارة الشاملة</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentUser.name}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.85rem 1.2rem',
            borderRadius: '12px',
            textAlign: 'right',
            fontWeight: 700,
            fontSize: '0.95rem',
            background: activeTab === 'overview' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            color: activeTab === 'overview' ? 'var(--primary-light)' : 'var(--text-secondary)'
          }}
        >
          📊 نظرة عامة
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '0.85rem 1.2rem',
            borderRadius: '12px',
            textAlign: 'right',
            fontWeight: 700,
            fontSize: '0.95rem',
            background: activeTab === 'settings' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            color: activeTab === 'settings' ? 'var(--primary-light)' : 'var(--text-secondary)'
          }}
        >
          🌐 إعدادات ومحتوى الموقع
        </button>

        <button
          onClick={() => setActiveTab('services')}
          style={{
            padding: '0.85rem 1.2rem',
            borderRadius: '12px',
            textAlign: 'right',
            fontWeight: 700,
            fontSize: '0.95rem',
            background: activeTab === 'services' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            color: activeTab === 'services' ? 'var(--primary-light)' : 'var(--text-secondary)'
          }}
        >
          📦 المنتجات والخدمات ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          style={{
            padding: '0.85rem 1.2rem',
            borderRadius: '12px',
            textAlign: 'right',
            fontWeight: 700,
            fontSize: '0.95rem',
            background: activeTab === 'offers' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            color: activeTab === 'offers' ? 'var(--primary-light)' : 'var(--text-secondary)'
          }}
        >
          🔥 العروض والخصومات ({offers.length})
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          style={{
            padding: '0.85rem 1.2rem',
            borderRadius: '12px',
            textAlign: 'right',
            fontWeight: 700,
            fontSize: '0.95rem',
            background: activeTab === 'complaints' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            color: activeTab === 'complaints' ? 'var(--primary-light)' : 'var(--text-secondary)'
          }}
        >
          📩 الشكاوى والرسائل ({complaints.length})
        </button>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '12px',
              background: 'rgba(233, 69, 96, 0.15)',
              color: 'var(--accent-light)',
              fontWeight: 700,
              textAlign: 'center'
            }}
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Content Body */}
      <main style={{ flex: 1, padding: '3rem 2.5rem' }}>
        
        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>نظرة عامة وإحصائيات الموقع</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div className="glass-panel" style={{ padding: '1.8rem', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>إجمالي الخدمات والمنتجات</span>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '0.5rem', color: 'var(--primary-light)' }}>{services.length}</h3>
              </div>

              <div className="glass-panel" style={{ padding: '1.8rem', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>العروض والخصومات الفعالة</span>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '0.5rem', color: 'var(--accent-light)' }}>{offers.length}</h3>
              </div>

              <div className="glass-panel" style={{ padding: '1.8rem', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>الشكاوى والرسائل الواردة</span>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '0.5rem', color: '#ffb703' }}>{complaints.length}</h3>
              </div>
            </div>
          </div>
        )}

        {/* 2. SITE SETTINGS */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>تعديل محتوى وإعدادات الموقع</h2>

            {savedSettingsMsg && (
              <div style={{ background: 'rgba(78, 223, 143, 0.15)', border: '1px solid rgba(78, 223, 143, 0.4)', color: '#4edf8f', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 700 }}>
                ✅ تم حفظ إعدادات الموقع فورياً وتطبيقها على جميع الصفحات!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>اسم الموقع (Site Name)</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.siteName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>العملة الرئيسية (Currency Symbol)</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.currency}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>رقم الواتساب الدعم</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>البريد الإلكتروني للدعم</label>
                  <input
                    type="email"
                    required
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.8rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>الوصف العام للموقع (بالعربية)</label>
                <textarea
                  rows="3"
                  required
                  value={settingsForm.siteDescAr}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteDescAr: e.target.value })}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                💾 حفظ التعديلات
              </button>
            </form>
          </div>
        )}

        {/* 3. SERVICES */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>إدارة المنتجات والخدمات</h2>
              <button onClick={() => { setEditingServiceId(null); setServiceForm({ nameAr: '', nameEn: '', price: '', originalPrice: '', descAr: '', image: '' }); setShowServiceModal(true); }} className="btn btn-primary">
                ➕ إضافة منتج جديد
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {services.map(service => (
                <div key={service.id} className="glass-panel" style={{
                  padding: '1.2rem 1.8rem',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <img src={service.image} alt={service.nameAr} style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{service.nameAr}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        السعر بعد الخصم: {siteSettings.currency}{service.price} | السعر الأصلي: {siteSettings.currency}{service.originalPrice} | الخصم: {service.discount}%
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <button onClick={() => startEditService(service)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                      ✏️ تعديل
                    </button>
                    <button onClick={() => deleteService(service.id)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(233, 69, 96, 0.2)', color: 'var(--accent-light)', fontWeight: 600 }}>
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. OFFERS */}
        {activeTab === 'offers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>إدارة العروض والخصومات</h2>
              <button onClick={() => setShowOfferModal(true)} className="btn btn-accent">
                🔥 إضافة عرض جديد
              </button>
            </div>

            <div className="grid-3">
              {offers.map(offer => (
                <div key={offer.id} className="glass-panel" style={{ padding: '1.8rem', borderRadius: '16px', position: 'relative' }}>
                  <span className="badge badge-discount" style={{ marginBottom: '0.8rem', display: 'inline-block' }}>{offer.badgeAr}</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{offer.titleAr}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>{offer.descAr}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-light)' }}>-{offer.discount}%</span>
                    <button onClick={() => deleteOffer(offer.id)} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(233, 69, 96, 0.2)', color: 'var(--accent-light)', fontSize: '0.85rem' }}>
                      🗑️ حذف العرض
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. COMPLAINTS */}
        {activeTab === 'complaints' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>إدارة الشكاوى والرسائل</h2>

            {complaints.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', borderRadius: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                لا توجد شكاوى أو رسائل جديدة حالياً.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {complaints.map(item => (
                  <div key={item.id} className="glass-panel" style={{ padding: '1.8rem', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-light)' }}>{item.subject}</h4>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.date}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.2rem', lineHeight: 1.7 }}>{item.message}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>من: {item.name} | {item.email}</span>
                      <button onClick={() => deleteComplaint(item.id)} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(233, 69, 96, 0.2)', color: 'var(--accent-light)', fontSize: '0.85rem' }}>
                        🗑️ حذف الشكوى
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Add / Edit Service Modal */}
      {showServiceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              {editingServiceId ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
            </h3>

            <form onSubmit={handleServiceSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>اسم المنتج</label>
                <input
                  type="text"
                  required
                  value={serviceForm.nameAr}
                  onChange={(e) => setServiceForm({ ...serviceForm, nameAr: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>السعر بعد الخصم</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>السعر الأصلي</label>
                  <input
                    type="number"
                    step="0.01"
                    value={serviceForm.originalPrice}
                    onChange={(e) => setServiceForm({ ...serviceForm, originalPrice: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>وصف المنتج</label>
                <textarea
                  rows="3"
                  required
                  value={serviceForm.descAr}
                  onChange={(e) => setServiceForm({ ...serviceForm, descAr: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                ></textarea>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>رابط صورة المنتج (URL)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={serviceForm.image}
                  onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowServiceModal(false)} className="btn btn-secondary">إلغاء</button>
                <button type="submit" className="btn btn-primary">{editingServiceId ? 'حفظ التعديلات' : 'إضافة الآن'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Offer Modal */}
      {showOfferModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>إضافة عرض خصم جديد</h3>

            <form onSubmit={handleOfferSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>عنوان العرض</label>
                <input
                  type="text"
                  required
                  value={offerForm.titleAr}
                  onChange={(e) => setOfferForm({ ...offerForm, titleAr: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>نسبة الخصم (%)</label>
                  <input
                    type="number"
                    required
                    value={offerForm.discount}
                    onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>شارة العرض (Badge)</label>
                  <input
                    type="text"
                    value={offerForm.badgeAr}
                    onChange={(e) => setOfferForm({ ...offerForm, badgeAr: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>تفاصيل العرض</label>
                <textarea
                  rows="3"
                  required
                  value={offerForm.descAr}
                  onChange={(e) => setOfferForm({ ...offerForm, descAr: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowOfferModal(false)} className="btn btn-secondary">إلغاء</button>
                <button type="submit" className="btn btn-accent">إضافة العرض</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
