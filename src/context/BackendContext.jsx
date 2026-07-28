import React, { createContext, useContext, useState, useEffect } from 'react';

const BackendContext = createContext();

const defaultSiteSettings = {
  siteName: 'Service VIP',
  siteLogo: '',
  siteDescAr: 'منصتك الموثوقة للحصول على الاشتراكات الرقمية والخدمات VIP بأفضل الأسعار وأعلى جودة.',
  siteDescEn: 'Your trusted platform for VIP digital subscriptions and premium services.',
  whatsapp: '+201000000000',
  telegram: 'https://t.me/servicevip',
  instagram: 'https://instagram.com/servicevip',
  facebook: 'https://facebook.com/servicevip',
  email: 'support@servicevip.com',
  currency: '$',
  primaryColor: '#8b5cf6'
};

const defaultAdminCreds = {
  username: 'owner@servicevip',
  password: 'Service2030@',
  name: 'مدير النظام الرئيسي'
};

const defaultServices = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop',
    nameAr: 'نتفليكس بريميوم',
    nameEn: 'Netflix Premium',
    descAr: 'اشتراك نتفليكس بريميوم 4K لمدة شهر كامل مع ضمان',
    descEn: 'Netflix Premium 4K subscription for one full month',
    categoryId: 1,
    originalPrice: 79.99,
    price: 29.99,
    discount: 63,
    rating: 4.9,
    featured: true
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=250&fit=crop',
    nameAr: 'سبوتيفاي بريميوم',
    nameEn: 'Spotify Premium',
    descAr: 'اشتراك سبوتيفاي بريميوم لمدة 3 أشهر بدون إعلانات',
    descEn: 'Spotify Premium subscription for 3 months ad-free',
    categoryId: 1,
    originalPrice: 49.99,
    price: 19.99,
    discount: 60,
    rating: 4.8,
    featured: true
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&h=250&fit=crop',
    nameAr: 'كانفا برو',
    nameEn: 'Canva Pro',
    descAr: 'اشتراك كانفا برو لمدة سنة كاملة مع جميع المميزات المدفوعة',
    descEn: 'Canva Pro annual subscription with all premium features',
    categoryId: 2,
    originalPrice: 129.99,
    price: 49.99,
    discount: 62,
    rating: 4.7,
    featured: true
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
    nameAr: 'شات جي بي تي بلس',
    nameEn: 'ChatGPT Plus',
    descAr: 'اشتراك ChatGPT Plus لمدة شهر مع GPT-4 غير محدود',
    descEn: 'ChatGPT Plus monthly subscription with unlimited GPT-4',
    categoryId: 3,
    originalPrice: 89.99,
    price: 39.99,
    discount: 55,
    rating: 5.0,
    featured: true
  }
];

const defaultOffers = [
  {
    id: 1,
    titleAr: 'عرض خاص - حزمة الترفيه',
    titleEn: 'Special Offer - Entertainment Bundle',
    descAr: 'احصل على نتفليكس + سبوتيفاي خصم إضافي 20%',
    descEn: 'Get Netflix + Spotify with extra 20% discount',
    discount: 20,
    badgeAr: 'عرض لفترة محدودة',
    badgeEn: 'Limited Time'
  }
];

export function BackendProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState(() => {
    const local = localStorage.getItem('svip-site-settings');
    return local ? JSON.parse(local) : defaultSiteSettings;
  });

  const [adminCreds, setAdminCreds] = useState(() => {
    const local = localStorage.getItem('svip-admin-creds');
    return local ? JSON.parse(local) : defaultAdminCreds;
  });

  const [services, setServices] = useState(() => {
    const local = localStorage.getItem('svip-services');
    return local ? JSON.parse(local) : defaultServices;
  });

  const [offers, setOffers] = useState(() => {
    const local = localStorage.getItem('svip-offers');
    return local ? JSON.parse(local) : defaultOffers;
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

  useEffect(() => {
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

  const updateSiteSettings = (newSettings) => {
    setSiteSettings(prev => ({ ...prev, ...newSettings }));
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
    setServices(prev => [newService, ...prev]);
  };

  const updateService = (id, serviceData) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...serviceData } : s));
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addOffer = (offerData) => {
    const newOffer = {
      id: Date.now(),
      ...offerData
    };
    setOffers(prev => [newOffer, ...prev]);
  };

  const deleteOffer = (id) => {
    setOffers(prev => prev.filter(o => o.id !== id));
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
