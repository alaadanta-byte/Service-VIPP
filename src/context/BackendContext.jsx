import React, { createContext, useContext, useState, useEffect } from 'react';
import initialSiteData from '../data/siteData.json';
import { syncDataToGitHub, getDefaultGitHubToken } from '../services/githubSync';

const BackendContext = createContext();

const getActiveGitHubToken = () => {
  const saved = localStorage.getItem('svip-github-token');
  if (saved && saved.trim() && saved.trim() !== 'undefined' && saved.trim() !== 'null') {
    return saved.trim();
  }
  return getDefaultGitHubToken();
};

const defaultSiteSettings = {
  ...initialSiteData.siteSettings,
  githubToken: getActiveGitHubToken(),
  autoSyncGitHub: true
};

const defaultAdminCreds = {
  username: 'owner@servicevip',
  password: 'Service2030@',
  name: 'مدير النظام الرئيسي'
};

export function BackendProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState(() => {
    const local = localStorage.getItem('svip-site-settings');
    const token = getActiveGitHubToken();
    let parsedLocal = {};
    if (local) {
      try { parsedLocal = JSON.parse(local); } catch (e) {}
    }
    return {
      ...defaultSiteSettings,
      ...parsedLocal,
      githubToken: (parsedLocal.githubToken && parsedLocal.githubToken.trim()) ? parsedLocal.githubToken.trim() : token
    };
  });

  const [adminCreds, setAdminCreds] = useState(() => {
    const local = localStorage.getItem('svip-admin-creds');
    return local ? JSON.parse(local) : defaultAdminCreds;
  });

  // Services State - Force reset if user wants all products cleared
  const [services, setServices] = useState(() => {
    const local = localStorage.getItem('svip-services');
    if (!local) return [];
    try {
      const parsed = JSON.parse(local);
      // Check if it contains old default sample items
      const isOldSample = parsed.some(s => s.nameAr && (s.nameAr.includes('نتفليكس') || s.nameAr.includes('سبوتيفاي')));
      if (isOldSample) {
        localStorage.removeItem('svip-services');
        return [];
      }
      return parsed;
    } catch (e) {
      return [];
    }
  });

  const [offers, setOffers] = useState(() => {
    const local = localStorage.getItem('svip-offers');
    if (!local) return [];
    try {
      const parsed = JSON.parse(local);
      const isOldSample = parsed.some(o => o.titleAr && o.titleAr.includes('حزمة الترفيه'));
      if (isOldSample) {
        localStorage.removeItem('svip-offers');
        return [];
      }
      return parsed;
    } catch (e) {
      return [];
    }
  });

  const [complaints, setComplaints] = useState(() => {
    const local = localStorage.getItem('svip-complaints');
    return local ? JSON.parse(local) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const local = localStorage.getItem('svip-auth-session');
    return local ? JSON.parse(local) : null;
  });

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('svip-lang') || 'ar';
  });

  const [syncStatus, setSyncStatus] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    if (siteSettings.githubToken) {
      localStorage.setItem('svip-github-token', siteSettings.githubToken);
    }
    localStorage.setItem('svip-site-settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('svip-admin-creds', JSON.stringify(adminCreds));
  }, [adminCreds]);

  useEffect(() => {
    localStorage.setItem('svip-services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('svip-offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('svip-complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('svip-auth-session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('svip-auth-session');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('svip-lang', lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // GitHub Auto Sync Helper
  const triggerGitHubSync = async (updatedSettings, updatedServices, updatedOffers) => {
    const curSettings = updatedSettings || siteSettings;
    const curServices = updatedServices || services;
    const curOffers = updatedOffers || offers;
    const activeToken = (curSettings.githubToken && curSettings.githubToken.trim()) 
      ? curSettings.githubToken.trim() 
      : getActiveGitHubToken();

    if (!curSettings.autoSyncGitHub) return;

    setSyncStatus({ status: 'syncing', message: '⚡ جاري رفع التعديلات فوراً وتحديث GitHub تلقائياً...' });

    const payload = {
      siteSettings: curSettings,
      services: curServices,
      offers: curOffers
    };

    const res = await syncDataToGitHub(payload, activeToken);

    if (res.success) {
      setSyncStatus({ status: 'success', message: '✅ تم التعديل والرفع على GitHub بنجاح! موقع Vercel يعيد البناء الآن 🚀' });
    } else {
      setSyncStatus({ status: 'error', message: `⚠️ ${res.message}` });
    }

    setTimeout(() => {
      setSyncStatus({ status: 'idle', message: '' });
    }, 6000);
  };

  const updateSiteSettings = (newSettings) => {
    const validToken = (newSettings.githubToken && newSettings.githubToken.trim())
      ? newSettings.githubToken.trim()
      : getActiveGitHubToken();

    const updated = { ...siteSettings, ...newSettings, githubToken: validToken };
    localStorage.setItem('svip-github-token', validToken);
    setSiteSettings(updated);
    triggerGitHubSync(updated, services, offers);
  };

  const login = (username, password) => {
    if (username === adminCreds.username && password === adminCreds.password) {
      const user = { username: adminCreds.username, name: adminCreds.name, role: 'owner' };
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: lang === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials' };
  };

  const changeAdminPassword = (currentPass, newPass) => {
    if (currentPass !== adminCreds.password) {
      return { success: false, message: lang === 'ar' ? 'كلمة المرور الحالية غير صحيحة' : 'Current password is wrong' };
    }
    setAdminCreds(prev => ({ ...prev, password: newPass }));
    return { success: true, message: lang === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addComplaint = (complaintData) => {
    const newComplaint = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      status: 'pending',
      ...complaintData
    };
    setComplaints(prev => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateComplaintStatus = (id, status) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const deleteComplaint = (id) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  const addService = (serviceData) => {
    const newService = {
      id: Date.now(),
      rating: 5.0,
      featured: true,
      ...serviceData
    };
    const updated = [newService, ...services];
    setServices(updated);
    triggerGitHubSync(siteSettings, updated, offers);
  };

  const updateService = (id, serviceData) => {
    const updated = services.map(s => s.id === id ? { ...s, ...serviceData } : s);
    setServices(updated);
    triggerGitHubSync(siteSettings, updated, offers);
  };

  const deleteService = (id) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    triggerGitHubSync(siteSettings, updated, offers);
  };

  const addOffer = (offerData) => {
    const newOffer = {
      id: Date.now(),
      ...offerData
    };
    const updated = [newOffer, ...offers];
    setOffers(updated);
    triggerGitHubSync(siteSettings, services, updated);
  };

  const deleteOffer = (id) => {
    const updated = offers.filter(o => o.id !== id);
    setOffers(updated);
    triggerGitHubSync(siteSettings, services, updated);
  };

  return (
    <BackendContext.Provider value={{
      siteSettings,
      updateSiteSettings,
      adminCreds,
      changeAdminPassword,
      services,
      offers,
      complaints,
      currentUser,
      lang,
      setLang,
      login,
      logout,
      syncStatus,
      triggerGitHubSync,
      addComplaint,
      updateComplaintStatus,
      deleteComplaint,
      addService,
      updateService,
      deleteService,
      addOffer,
      deleteOffer
    }}>
      {children}
    </BackendContext.Provider>
  );
}

export function useBackend() {
  return useContext(BackendContext);
}
