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
  currency: 'ج.م',
  primaryColor: '#8b5cf6'
};

const defaultAdminCreds = {
  username: 'owner@servicevip',
  password: 'Service2030@',
  name: 'مدير النظام الرئيسي'
};

// New Requested Products List
const newDefaultServices = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&h=250&fit=crop',
    nameAr: 'شات جي بي تي بلس (ChatGPT Plus)',
    nameEn: 'ChatGPT Plus',
    descAr: 'اشتراك ChatGPT Plus شغال 100% مع الوصول الكامل لموديلات GPT-4o وDALL-E 3 وأسرع أداء.',
    descEn: 'ChatGPT Plus subscription with unlimited access to GPT-4o and DALL-E 3.',
    categoryId: 1,
    originalPrice: 500,
    price: 500,
    discount: 0,
    rating: 5.0,
    featured: true
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop',
    nameAr: 'جميناي برو (Gemini Pro)',
    nameEn: 'Gemini Pro',
    descAr: 'اشتراك جميناي برو المتطور من جوجل مع أحدث نماذج الذكاء الاصطناعي وسعة تحليلية فائقة.',
    descEn: 'Google Gemini Pro advanced subscription for professional AI tasks.',
    categoryId: 1,
    originalPrice: 450,
    price: 450,
    discount: 0,
    rating: 4.9,
    featured: true
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=250&fit=crop',
    nameAr: 'أدوبي كريتيف كلاود (Adobe)',
    nameEn: 'Adobe Creative Cloud',
    descAr: 'اشتراك أدوبي الشامل لجميع البرامج والتطبيقات (Photoshop, Premiere, Illustrator) بضمان كامل.',
    descEn: 'Adobe Creative Cloud full suite access for all creative applications.',
    categoryId: 2,
    originalPrice: 550,
    price: 550,
    discount: 0,
    rating: 5.0,
    featured: true
  }
];

const defaultOffers = [
  {
    id: 1,
    titleAr: 'عرض خاص - حزمة الذكاء الاصطناعي',
    titleEn: 'Special Offer - AI Bundle',
    descAr: 'احصل على اشتراك ChatGPT Plus + Gemini Pro بخصم مميز',
    descEn: 'Get ChatGPT Plus + Gemini Pro with special discount',
    discount: 15,
    badgeAr: 'عرض لفترة محدودة',
    badgeEn: 'Limited Time',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&h=250&fit=crop'
  }
];

export function BackendProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState(() => {
    const local = localStorage.getItem('svip-site-settings');
    return local ? { ...defaultSiteSettings, ...JSON.parse(local), currency: 'ج.م' } : defaultSiteSettings;
  });

  const [adminCreds, setAdminCreds] = useState(() => {
    const local = localStorage.getItem('svip-admin-creds');
    return local ? JSON.parse(local) : defaultAdminCreds;
  });

  // Reset & Use New Products List
  const [services, setServices] = useState(() => {
    return newDefaultServices;
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
