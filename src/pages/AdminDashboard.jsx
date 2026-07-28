import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackend } from '../context/BackendContext';

export default function AdminDashboard() {
  const { currentUser, logout, services, complaints, addService, deleteService, lang } = useBackend();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'services' | 'complaints'
  const [newService, setNewService] = useState({ nameAr: '', nameEn: '', price: '', originalPrice: '', descAr: '', image: '' });
  const [showModal, setShowModal] = useState(false);

  // Auth Guard
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleAddServiceSubmit = (e) => {
    e.preventDefault();
    const priceNum = parseFloat(newService.price) || 0;
    const origPriceNum = parseFloat(newService.originalPrice) || priceNum;
    const discountCalc = origPriceNum > 0 ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : 0;

    addService({
      nameAr: newService.nameAr,
      nameEn: newService.nameEn || newService.nameAr,
      descAr: newService.descAr,
      descEn: newService.descAr,
      price: priceNum,
      originalPrice: origPriceNum,
      discount: discountCalc > 0 ? discountCalc : 0,
      image: newService.image || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop',
      categoryId: 1
    });

    setNewService({ nameAr: '', nameEn: '', price: '', originalPrice: '', descAr: '', image: '' });
    setShowModal(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--nav-height))' }}>
      
      {/* Admin Sidebar */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-glass)',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem'
      }}>
        <div style={{ padding: '0 0.8rem 1.5rem 0.8rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>⚙️ لوحة الإدارة VIP</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>مرحباً، {currentUser.name}</p>
        </div>

        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            textAlign: 'right',
            fontWeight: 600,
            background: activeTab === 'overview' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            color: activeTab === 'overview' ? 'var(--primary-light)' : 'var(--text-secondary)'
          }}
        >
          📊 نظرة عامة
        </button>

        <button
          onClick={() => setActiveTab('services')}
          style={{
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            textAlign: 'right',
            fontWeight: 600,
            background: activeTab === 'services' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            color: activeTab === 'services' ? 'var(--primary-light)' : 'var(--text-secondary)'
          }}
        >
          📦 إدارة المنتجات ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          style={{
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            textAlign: 'right',
            fontWeight: 600,
            background: activeTab === 'complaints' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            color: activeTab === 'complaints' ? 'var(--primary-light)' : 'var(--text-secondary)'
          }}
        >
          📩 الشكاوى والاقتراحات ({complaints.length})
        </button>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{
              width: '100%',
              padding: '0.8rem',
              borderRadius: '10px',
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

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2.5rem' }}>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>نظرة عامة على الأداء</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div className="glass-panel" style={{ padding: '1.8rem', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>إجمالي المنتجات والخدمات</span>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '0.5rem', color: 'var(--primary-light)' }}>{services.length}</h3>
              </div>

              <div className="glass-panel" style={{ padding: '1.8rem', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>عدد الشكاوى والاقتراحات</span>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '0.5rem', color: 'var(--accent-light)' }}>{complaints.length}</h3>
              </div>

              <div className="glass-panel" style={{ padding: '1.8rem', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>حالة النظام والتسليم</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem', color: '#4edf8f' }}>🟢 نشط 100%</h3>
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>إدارة المنتجات والخدمات</h2>
              <button onClick={() => setShowModal(true)} className="btn btn-primary">
                ➕ إضافة منتج جديد
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {services.map(service => (
                <div key={service.id} className="glass-panel" style={{
                  padding: '1.2rem 1.5rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <img src={service.image} alt={service.nameAr} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{service.nameAr}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>السعر: ${service.price} | الخصم: {service.discount}%</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteService(service.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      background: 'rgba(233, 69, 96, 0.2)',
                      color: 'var(--accent-light)',
                      fontWeight: 600
                    }}
                  >
                    🗑️ حذف
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complaints Tab */}
        {activeTab === 'complaints' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>إدارة الشكاوى والرسائل</h2>

            {complaints.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', borderRadius: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                لا توجد شكاوى جديدة حالياً.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {complaints.map(item => (
                  <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.subject}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.date}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>{item.message}</p>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary-light)' }}>
                      من: {item.name} ({item.email})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Add Service Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>إضافة منتج جديد</h3>

            <form onSubmit={handleAddServiceSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>اسم المنتج</label>
                <input
                  type="text"
                  required
                  value={newService.nameAr}
                  onChange={(e) => setNewService({...newService, nameAr: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>السعر الحفاظي ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newService.price}
                    onChange={(e) => setNewService({...newService, price: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>السعر الأصلي ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newService.originalPrice}
                    onChange={(e) => setNewService({...newService, originalPrice: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>وصف الخدمة</label>
                <textarea
                  rows="3"
                  required
                  value={newService.descAr}
                  onChange={(e) => setNewService({...newService, descAr: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                ></textarea>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>رابط صورة الخدمة (Unsplash/URL)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newService.image}
                  onChange={(e) => setNewService({...newService, image: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">إلغاء</button>
                <button type="submit" className="btn btn-primary">حفظ وإضافة</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
