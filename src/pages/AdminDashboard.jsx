import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackend } from '../context/BackendContext';

export default function AdminDashboard() {
  const {
    currentUser,
    logout,
    siteSettings,
    updateSiteSettings,
    changeAdminPassword,
    services,
    offers,
    complaints,
    addService,
    updateService,
    deleteService,
    addOffer,
    deleteOffer,
    deleteComplaint,
    syncStatus,
    triggerGitHubSync,
    lang
  } = useBackend();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'settings' | 'services' | 'offers' | 'complaints'
  const [settingsSubTab, setSettingsSubTab] = useState('site'); // 'site' | 'security'
  
  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState(siteSettings);
  const [savedSettingsMsg, setSavedSettingsMsg] = useState(false);

  // Password Security Form State
  const [passwordForm, setPasswordForm] = useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [passwordFeedback, setPasswordFeedback] = useState({ type: '', msg: '' });

  // Service Modal State (Single Basic Price & Direct File Upload)
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState({ nameAr: '', nameEn: '', price: '', descAr: '', image: '' });

  // Offer Modal State with Product Selection
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [offerForm, setOfferForm] = useState({ titleAr: '', titleEn: '', descAr: '', discount: '20', badgeAr: 'عرض خاص' });

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Handle Image Upload from Local Computer
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setServiceForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Logo Upload from Local Computer
  const handleLogoFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsForm(prev => ({ ...prev, siteLogo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Product Selection in Offer Modal
  const handleProductSelect = (serviceId) => {
    setSelectedServiceId(serviceId);
    if (!serviceId) return;

    const foundService = services.find(s => s.id === parseInt(serviceId));
    if (foundService) {
      setOfferForm(prev => ({
        ...prev,
        titleAr: `عرض خاص - ${foundService.nameAr}`,
        titleEn: `Special Offer - ${foundService.nameEn || foundService.nameAr}`,
        descAr: foundService.descAr,
        discount: foundService.discount || '20'
      }));
    }
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSiteSettings(settingsForm);
    setSavedSettingsMsg(true);
    setTimeout(() => setSavedSettingsMsg(false), 3000);
  };

  // Change Password
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordFeedback({ type: '', msg: '' });

    if (passwordForm.newPass.length < 6) {
      setPasswordFeedback({ type: 'error', msg: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف أو أكثر' });
      return;
    }

    if (passwordForm.newPass !== passwordForm.confirmPass) {
      setPasswordFeedback({ type: 'error', msg: 'كلمة المرور الجديدة وتأكيدها غير متطابقين' });
      return;
    }

    const res = changeAdminPassword(passwordForm.currentPass, passwordForm.newPass);
    if (res.success) {
      setPasswordFeedback({ type: 'success', msg: res.message });
      setPasswordForm({ currentPass: '', newPass: '', confirmPass: '' });
    } else {
      setPasswordFeedback({ type: 'error', msg: res.message });
    }
  };

  // Service Form Handlers
  const handleServiceSubmit = (e) => {
    e.preventDefault();
    const priceNum = parseFloat(serviceForm.price) || 0;

    const dataPayload = {
      nameAr: serviceForm.nameAr,
      nameEn: serviceForm.nameEn || serviceForm.nameAr,
      descAr: serviceForm.descAr,
      descEn: serviceForm.descAr,
      price: priceNum,
      originalPrice: priceNum,
      discount: 0,
      image: serviceForm.image || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop'
    };

    if (editingServiceId) {
      updateService(editingServiceId, dataPayload);
    } else {
      addService(dataPayload);
    }

    setServiceForm({ nameAr: '', nameEn: '', price: '', descAr: '', image: '' });
    setEditingServiceId(null);
    setShowServiceModal(false);
  };

  const startEditService = (service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      nameAr: service.nameAr,
      nameEn: service.nameEn || service.nameAr,
      price: service.price,
      descAr: service.descAr,
      image: service.image
    });
    setShowServiceModal(true);
  };

  // Offer Form Handlers
  const handleOfferSubmit = (e) => {
    e.preventDefault();
    const selectedService = services.find(s => s.id === parseInt(selectedServiceId));

    addOffer({
      titleAr: offerForm.titleAr,
      titleEn: offerForm.titleAr,
      descAr: offerForm.descAr,
      descEn: offerForm.descAr,
      discount: parseInt(offerForm.discount) || 10,
      badgeAr: offerForm.badgeAr || 'عرض خاص',
      badgeEn: 'Special Offer',
      serviceId: selectedService ? selectedService.id : null,
      image: selectedService ? selectedService.image : null
    });

    setOfferForm({ titleAr: '', titleEn: '', descAr: '', discount: '20', badgeAr: 'عرض خاص' });
    setSelectedServiceId('');
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
            {siteSettings.siteLogo ? (
              <img src={siteSettings.siteLogo} alt="Logo" style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>V</div>
            )}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{siteSettings.siteName}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>لوحة التحكم الشاملة</p>
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
          ⚙️ الإعدادات والمزامنة
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

      {/* Main Panel Body */}
      <main style={{ flex: 1, padding: '3rem 2.5rem' }}>
        
        {/* GitHub Auto Sync Floating Notification */}
        {syncStatus.message && (
          <div style={{
            position: 'fixed',
            top: '90px',
            left: '30px',
            zIndex: 1000,
            padding: '1rem 1.5rem',
            borderRadius: '14px',
            background: syncStatus.status === 'syncing' 
              ? 'rgba(139, 92, 246, 0.95)' 
              : (syncStatus.status === 'success' ? 'rgba(78, 223, 143, 0.95)' : 'rgba(233, 69, 96, 0.95)'),
            color: '#fff',
            fontWeight: 700,
            boxShadow: 'var(--shadow-xl)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            {syncStatus.message}
          </div>
        )}

        {/* 1. OVERVIEW PAGE */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>نظرة عامة على الموقع</h2>

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
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>الشكاوى والرسائل</span>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '0.5rem', color: '#ffb703' }}>{complaints.length}</h3>
              </div>
            </div>

            {/* Manual Sync Trigger Button */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-light)' }}>🐙 حالة الربط والمزامنة التلقائية مع GitHub</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                  المستودع المتصل: <strong>alaadanta-byte/Service-VIPP</strong> (أحدث التغييرات تترفع تلقائياً وبشكل فوري).
                </p>
              </div>
              <button onClick={() => triggerGitHubSync()} className="btn btn-primary" style={{ padding: '0.8rem 1.6rem' }}>
                ⚡ مزامنة فورية مع GitHub الآن
              </button>
            </div>
          </div>
        )}

        {/* 2. SETTINGS PAGE */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '850px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>⚙️ قسم الإعدادات والمزامنة</h2>

            {/* Sub-Tab Navigation Bar */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              padding: '0.4rem',
              background: 'var(--bg-glass-strong)',
              border: '1px solid var(--border-glass)',
              borderRadius: '14px',
              marginBottom: '2rem'
            }}>
              <button
                onClick={() => setSettingsSubTab('site')}
                style={{
                  flex: 1,
                  padding: '0.8rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  background: settingsSubTab === 'site' ? 'var(--primary-gradient)' : 'transparent',
                  color: settingsSubTab === 'site' ? '#fff' : 'var(--text-secondary)',
                  boxShadow: settingsSubTab === 'site' ? 'var(--shadow-glow)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                🌐 إعدادات الموقع والصور والربط
              </button>

              <button
                onClick={() => setSettingsSubTab('security')}
                style={{
                  flex: 1,
                  padding: '0.8rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  background: settingsSubTab === 'security' ? 'var(--primary-gradient)' : 'transparent',
                  color: settingsSubTab === 'security' ? '#fff' : 'var(--text-secondary)',
                  boxShadow: settingsSubTab === 'security' ? 'var(--shadow-glow)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                🔐 إعدادات الأمان وكلمة المرور
              </button>
            </div>

            {/* SUB-TAB 1: SITE SETTINGS & GITHUB SYNC TOKEN */}
            {settingsSubTab === 'site' && (
              <div>
                {savedSettingsMsg && (
                  <div style={{ background: 'rgba(78, 223, 143, 0.15)', border: '1px solid rgba(78, 223, 143, 0.4)', color: '#4edf8f', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 700 }}>
                    ✅ تم حفظ وتحديث الإعدادات والمزامنة التلقائية مع GitHub!
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '20px' }}>
                  
                  {/* GitHub Token Config */}
                  <div style={{ padding: '1.5rem', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.08)', border: '1px solid var(--border-glass)', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-light)' }}>🐙 ربط التعديلات التلقائي بـ GitHub</h4>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
                        <input
                          type="checkbox"
                          checked={settingsForm.autoSyncGitHub}
                          onChange={(e) => setSettingsForm({ ...settingsForm, autoSyncGitHub: e.target.checked })}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        تفعيل الرفع التلقائي لـ GitHub
                      </label>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>رمز الوصول GitHub Access Token</label>
                      <input
                        type="password"
                        placeholder="ghp_..."
                        value={settingsForm.githubToken}
                        onChange={(e) => setSettingsForm({ ...settingsForm, githubToken: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                      />
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                        مربوط بمستودع: <strong>https://github.com/alaadanta-byte/Service-VIPP</strong>
                      </p>
                    </div>
                  </div>

                  {/* Site Name & Logo Image */}
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
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>📁 رفع صورة اللوجو من الجهاز</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        style={{
                          width: '100%',
                          padding: '0.65rem',
                          borderRadius: '10px',
                          background: 'rgba(139, 92, 246, 0.1)',
                          color: '#fff',
                          border: '1px dashed var(--primary-light)',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  </div>

                  {/* Logo Preview */}
                  {settingsForm.siteLogo && (
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>معاينة الشعار:</span>
                      <img src={settingsForm.siteLogo} alt="Logo Preview" style={{ height: '40px', borderRadius: '8px', objectFit: 'contain' }} />
                    </div>
                  )}

                  {/* Contact Info (WhatsApp & Email) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>💬 رقم الواتساب (WhatsApp)</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.whatsapp}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>📧 البريد الإلكتروني للدعم</label>
                      <input
                        type="email"
                        required
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                      />
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '1.5rem 0 1rem 0', color: 'var(--primary-light)' }}>🔗 روابط وسائل التواصل الاجتماعي</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>تليجرام (Telegram)</label>
                      <input
                        type="text"
                        placeholder="https://t.me/..."
                        value={settingsForm.telegram}
                        onChange={(e) => setSettingsForm({ ...settingsForm, telegram: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>انستجرام (Instagram)</label>
                      <input
                        type="text"
                        placeholder="https://instagram.com/..."
                        value={settingsForm.instagram}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>فيسبوك (Facebook)</label>
                      <input
                        type="text"
                        placeholder="https://facebook.com/..."
                        value={settingsForm.facebook}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                      />
                    </div>
                  </div>

                  {/* Site Description */}
                  <div style={{ marginBottom: '1.8rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>وصف الموقع (بالعربية)</label>
                    <textarea
                      rows="3"
                      required
                      value={settingsForm.siteDescAr}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteDescAr: e.target.value })}
                      style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}>
                    💾 حفظ الحقول والرفع المباشر لـ GitHub
                  </button>
                </form>
              </div>
            )}

            {/* SUB-TAB 2: SECURITY SETTINGS */}
            {settingsSubTab === 'security' && (
              <div style={{ maxWidth: '600px' }}>
                {passwordFeedback.msg && (
                  <div style={{
                    background: passwordFeedback.type === 'success' ? 'rgba(78, 223, 143, 0.15)' : 'rgba(233, 69, 96, 0.15)',
                    border: passwordFeedback.type === 'success' ? '1px solid rgba(78, 223, 143, 0.4)' : '1px solid rgba(233, 69, 96, 0.4)',
                    color: passwordFeedback.type === 'success' ? '#4edf8f' : 'var(--accent-light)',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    fontWeight: 700
                  }}>
                    {passwordFeedback.type === 'success' ? '✅ ' : '⚠️ '} {passwordFeedback.msg}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '20px' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>كلمة المرور الحالية</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPass}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPass: e.target.value })}
                      style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPass}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                      style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.8rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>تأكيد كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPass}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPass: e.target.value })}
                      style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
                    🔐 تحديث كلمة المرور الآن
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

        {/* 3. SERVICES PAGE */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>إدارة المنتجات والخدمات</h2>
              <button onClick={() => { setEditingServiceId(null); setServiceForm({ nameAr: '', nameEn: '', price: '', descAr: '', image: '' }); setShowServiceModal(true); }} className="btn btn-primary">
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
                      <p style={{ fontSize: '0.9rem', color: 'var(--primary-light)', marginTop: '0.2rem', fontWeight: 700 }}>
                        السعر الأساسي: {siteSettings.currency}{service.price}
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

        {/* 4. OFFERS PAGE */}
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

        {/* 5. COMPLAINTS PAGE */}
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

              {/* Single Basic Price Only */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--primary-light)', fontWeight: 700 }}>
                  💰 السعر الأساسي ({siteSettings.currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                />
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

              {/* Direct File Upload & URL Option */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--primary-light)', fontWeight: 700 }}>
                  📁 رفع صورة المنتج من الكمبيوتر
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: '#fff',
                    border: '1px dashed var(--primary-light)',
                    cursor: 'pointer',
                    marginBottom: '0.8rem'
                  }}
                />

                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>أو ضع رابط الصورة (URL):</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={serviceForm.image}
                  onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                />

                {serviceForm.image && (
                  <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>معاينة الصورة:</span>
                    <img src={serviceForm.image} alt="Preview" style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowServiceModal(false)} className="btn btn-secondary">إلغاء</button>
                <button type="submit" className="btn btn-primary">{editingServiceId ? 'حفظ التعديلات' : 'إضافة المنتج'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Offer Modal */}
      {showOfferModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>إضافة عرض خصم جديد</h3>

            <form onSubmit={handleOfferSubmit}>
              
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--primary-light)', fontWeight: 700 }}>
                  📦 اختيار منتج لتطبيق العرض عليه (اختياري)
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    border: '1px solid var(--border-glass)',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="" style={{ background: '#111', color: '#fff' }}>-- اختر منتج من القائمة (أو اكتب يدوي) --</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id} style={{ background: '#111', color: '#fff' }}>
                      {service.nameAr} - (سعر: {siteSettings.currency}{service.price})
                    </option>
                  ))}
                </select>
              </div>

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
