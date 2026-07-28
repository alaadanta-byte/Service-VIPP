/* ============================================
   Service VIP - Main Application JavaScript (API Connected)
   ============================================ */

// ========== App State ==========
const AppState = {
  theme: localStorage.getItem('svip-theme') || 'dark',
  lang: localStorage.getItem('svip-lang') || 'ar',
  currentTestimonial: 0,
  searchOpen: false,
  chatOpen: false,
  mobileMenuOpen: false,
  services: [],
  testimonials: []
};

// ========== Translations ==========
const translations = {
  ar: {
    home: 'الرئيسية',
    offers: 'العروض والخصومات',
    services: 'الخدمات',
    contact: 'تواصل معنا',
    complaint: 'تقديم شكوى',
    login: 'تسجيل الدخول',
    heroTitle: 'خدمات VIP بأعلى جودة وأفضل الأسعار',
    heroSubtitle: 'اشتراكات رقمية وخدمات احترافية بأسعار مميزة وضمان كامل.',
    browseOffers: 'تصفح العروض',
    contactUs: 'تواصل معنا',
    servicesTitle: 'أدوات تصنع الفرق',
    servicesDesc: 'نقدم لكم مجموعة متنوعة من الخدمات الرقمية الاحترافية بأسعار تنافسية',
    offersTitle: 'العروض والخصومات',
    offersDesc: 'استفد من أقوى العروض والخصومات الحصرية لفترة محدودة',
    testimonialsTitle: 'آراء عملائنا',
    testimonialsDesc: 'ما يقوله عملاؤنا الكرام عن خدماتنا',
    contactTitle: 'تواصل معنا',
    contactDesc: 'نحن هنا لمساعدتك. تواصل معنا بأي طريقة تناسبك',
    complaintTitle: 'تقديم شكوى',
    complaintDesc: 'نهتم بملاحظاتكم ونسعى دائماً لتحسين خدماتنا',
    loginTitle: 'تسجيل الدخول',
    loginSubtitle: 'مرحباً بعودتك! سجل دخولك للوصول إلى لوحة التحكم',
    buyNow: 'اشتري الآن',
    name: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    orderNumber: 'رقم الطلب',
    subject: 'موضوع الشكوى',
    message: 'تفاصيل الشكوى',
    attachment: 'المرفقات',
    send: 'إرسال',
    submit: 'إرسال الشكوى',
    password: 'كلمة المرور',
    username: 'اسم المستخدم',
    signIn: 'تسجيل الدخول',
    days: 'يوم',
    hours: 'ساعة',
    minutes: 'دقيقة',
    seconds: 'ثانية',
    clients: 'عميل سعيد',
    servicesCount: 'خدمة متاحة',
    guarantee: 'ضمان شامل',
    support: 'دعم متواصل',
    quickLinks: 'روابط سريعة',
    ourServices: 'خدماتنا',
    contactInfo: 'معلومات التواصل',
    allRightsReserved: 'جميع الحقوق محفوظة',
    searchPlaceholder: 'ابحث عن خدمة...',
    chatWelcome: 'مرحباً! كيف يمكنني مساعدتك؟',
    chatPlaceholder: 'اكتب رسالتك...',
    chatTitle: 'الدعم المباشر',
    chatOnline: 'متصل الآن',
    notifSuccess: 'تم بنجاح',
    notifError: 'حدث خطأ',
    formSuccess: 'تم إرسال رسالتك بنجاح!',
    loginError: 'بيانات الدخول غير صحيحة',
    complaintSuccess: 'تم إرسال شكواك بنجاح. سنتواصل معك قريباً.',
    dragDrop: 'اسحب الملف هنا أو انقر للاختيار',
    fileHint: 'يمكنك رفع صور أو ملفات PDF بحد أقصى 5MB',
    footerDesc: 'نقدم أفضل الخدمات الرقمية والاشتراكات بأسعار تنافسية مع ضمان كامل ودعم فني متواصل.',
    featuredOffer: 'عرض مميز',
    limitedOffer: 'عرض لفترة محدودة!',
    offerBannerTitle: 'خصومات تصل إلى 70% على جميع الخدمات',
    offerBannerDesc: 'لا تفوت فرصة الحصول على أفضل الخدمات الرقمية بأسعار لا تُقاوم. العرض ساري لفترة محدودة!',
    whatsapp: 'واتساب',
    telegram: 'تيليجرام',
    facebook: 'فيسبوك',
    emailContact: 'البريد الإلكتروني',
    address: 'العنوان',
    addressText: 'المملكة العربية السعودية - الرياض',
    phoneContact: 'الهاتف',
    phoneText: '+966 50 000 0000',
    emailText: 'info@servicevip.com',
    workHours: 'ساعات العمل',
    workHoursText: '24/7 - على مدار الساعة',
    yourMessage: 'رسالتك',
    messagePlaceholder: 'اكتب رسالتك هنا...',
    mapTitle: 'موقعنا على الخريطة',
    viewAll: 'عرض جميع الخدمات',
    whyChooseUs: 'لماذا تختارنا؟',
    whyChooseUsDesc: 'نتميز عن الآخرين بتقديم أفضل الخدمات بأعلى معايير الجودة',
    featureInstant: 'تفعيل فوري',
    featureInstantDesc: 'يتم تفعيل خدمتك خلال دقائق معدودة من إتمام الطلب',
    featureGuarantee: 'ضمان كامل',
    featureGuaranteeDesc: 'نضمن لك جودة الخدمة طوال فترة الاشتراك بالكامل',
    featureSupport: 'دعم فني 24/7',
    featureSupportDesc: 'فريق الدعم الفني متاح على مدار الساعة لحل أي مشكلة',
    featurePrices: 'أفضل الأسعار',
    featurePricesDesc: 'أسعار تنافسية لا تُقارن مع خصومات حصرية دائمة',
    howItWorksTitle: 'كيف تحصل على خدمتك؟',
    howItWorksDesc: 'خطوات بسيطة وسريعة للحصول على اشتراكك في دقائق معدودة',
    step1Title: 'اختر الخدمة',
    step1Desc: 'تصفح قائمة الخدمات والاشتراكات المتاحة واختر ما يناسب احتياجك',
    step2Title: 'أكد الطلب',
    step2Desc: 'أدخل بياناتك الأساسية واضغط على طلب الاشتراك بسهولة',
    step3Title: 'تفعيل فوري وضمان',
    step3Desc: 'يتواصل معك فريق الدعم لتفعيل حسابك فوراً مع ضمان كامل طوال الفترة',
  },
  en: {
    home: 'Home',
    offers: 'Offers & Discounts',
    services: 'Services',
    contact: 'Contact Us',
    complaint: 'Submit Complaint',
    login: 'Login',
    heroTitle: 'VIP Services with Top Quality & Best Prices',
    heroSubtitle: 'Digital subscriptions and professional services at special prices with full guarantee.',
    browseOffers: 'Browse Offers',
    contactUs: 'Contact Us',
    servicesTitle: 'Our Premium Services',
    servicesDesc: 'We offer a diverse range of professional digital services at competitive prices',
    offersTitle: 'Offers & Discounts',
    offersDesc: 'Take advantage of the best exclusive offers and discounts for a limited time',
    testimonialsTitle: 'Customer Reviews',
    testimonialsDesc: 'What our valued customers say about our services',
    contactTitle: 'Contact Us',
    contactDesc: 'We are here to help. Contact us in any way that suits you',
    complaintTitle: 'Submit Complaint',
    complaintDesc: 'We care about your feedback and always strive to improve our services',
    loginTitle: 'Sign In',
    loginSubtitle: 'Welcome back! Sign in to access the dashboard',
    buyNow: 'Buy Now',
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    orderNumber: 'Order Number',
    subject: 'Complaint Subject',
    message: 'Complaint Details',
    attachment: 'Attachments',
    send: 'Send',
    submit: 'Submit Complaint',
    password: 'Password',
    username: 'Username',
    signIn: 'Sign In',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    clients: 'Happy Clients',
    servicesCount: 'Services',
    guarantee: 'Full Guarantee',
    support: '24/7 Support',
    quickLinks: 'Quick Links',
    ourServices: 'Our Services',
    contactInfo: 'Contact Info',
    allRightsReserved: 'All Rights Reserved',
    searchPlaceholder: 'Search for a service...',
    chatWelcome: 'Hello! How can I help you?',
    chatPlaceholder: 'Type your message...',
    chatTitle: 'Live Support',
    chatOnline: 'Online Now',
    notifSuccess: 'Success',
    notifError: 'Error',
    formSuccess: 'Your message has been sent successfully!',
    loginError: 'Invalid login credentials',
    complaintSuccess: 'Your complaint has been submitted. We will contact you soon.',
    dragDrop: 'Drag file here or click to browse',
    fileHint: 'Upload images or PDF files up to 5MB',
    footerDesc: 'We provide the best digital services and subscriptions at competitive prices with full guarantee and continuous technical support.',
    featuredOffer: 'Featured Offer',
    limitedOffer: 'Limited Time Offer!',
    offerBannerTitle: 'Up to 70% Off on All Services',
    offerBannerDesc: 'Don\'t miss the chance to get the best digital services at unbeatable prices. Offer valid for a limited time!',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    facebook: 'Facebook',
    emailContact: 'Email',
    address: 'Address',
    addressText: 'Saudi Arabia - Riyadh',
    phoneContact: 'Phone',
    phoneText: '+966 50 000 0000',
    emailText: 'info@servicevip.com',
    workHours: 'Working Hours',
    workHoursText: '24/7 - Around the Clock',
    yourMessage: 'Your Message',
    messagePlaceholder: 'Type your message here...',
    mapTitle: 'Our Location on Map',
    viewAll: 'View All Services',
    whyChooseUs: 'Why Choose Us?',
    whyChooseUsDesc: 'We stand out by providing the best services with the highest quality standards',
    featureInstant: 'Instant Activation',
    featureInstantDesc: 'Your service is activated within minutes of completing the order',
    featureGuarantee: 'Full Guarantee',
    featureGuaranteeDesc: 'We guarantee service quality throughout your entire subscription period',
    featureSupport: '24/7 Support',
    featureSupportDesc: 'Our support team is available around the clock to solve any issue',
    featurePrices: 'Best Prices',
    featurePricesDesc: 'Unbeatable competitive prices with exclusive permanent discounts',
    howItWorksTitle: 'How to Get Your Service?',
    howItWorksDesc: 'Simple & fast steps to get your subscription within minutes',
    step1Title: 'Select Service',
    step1Desc: 'Browse the list of available services and subscriptions and choose your fit',
    step2Title: 'Confirm Order',
    step2Desc: 'Enter your essential contact details and place your order easily',
    step3Title: 'Instant Activation & Guarantee',
    step3Desc: 'Support team reaches out to activate your account instantly with full warranty',
  }
};

// ========== Initialize App ==========
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  await loadSiteConfig();
  await fetchInitialData();
  
  // Apply language after site config is loaded
  applyLanguage(AppState.lang);
  renderFooterServices();
  
  // Init UI elements
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initBackToTop();
  initChatWidget();
  initCountdown();
  initTestimonialsSlider();
  initSearch();
  
  // Init page-specific controllers
  const page = detectPage();
  if (page === 'home') initHomePage();
  if (page === 'services') initServicesPage();
  if (page === 'offers') initOffersPage();
  if (page === 'contact') initContactPage();
  if (page === 'complaints') initComplaintPage();
  if (page === 'login') initLoginPage();
  
  // Loading screen hide
  setTimeout(() => {
    const loader = document.querySelector('.loading-screen');
    if (loader) loader.classList.add('hidden');
  }, 400);
}

// ========== Dynamic Config Loading ==========
async function loadSiteConfig() {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const config = await res.json();
      
      // Override Theme primary/secondary colors
      if (config.primaryColor) {
        document.documentElement.style.setProperty('--primary', config.primaryColor);
      }
      if (config.secondaryColor) {
        document.documentElement.style.setProperty('--secondary', config.secondaryColor);
      }

      // Update Nav Brand name & custom image logo dynamically
      if (config.siteName) {
        const brandNames = document.querySelectorAll('.nav-brand-text, .footer-brand-name, .loading-logo');
        brandNames.forEach(el => el.textContent = config.siteName);
      }
      if (config.siteLogo) {
        document.querySelectorAll('.nav-brand-icon').forEach(iconEl => {
          iconEl.innerHTML = `<img src="${config.siteLogo}" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md);">`;
          iconEl.style.padding = '0';
          iconEl.style.overflow = 'hidden';
        });
      }

      // Override Hero Section values in translations & DOM
      if (config.heroTitle) {
        translations.ar.heroTitle = config.heroTitle;
        translations.en.heroTitle = config.heroTitle;
        document.querySelectorAll('[data-translate="heroTitle"], .hero-title').forEach(el => el.textContent = config.heroTitle);
      }
      if (config.heroSubtitle) {
        translations.ar.heroSubtitle = config.heroSubtitle;
        translations.en.heroSubtitle = config.heroSubtitle;
        document.querySelectorAll('[data-translate="heroSubtitle"], .hero-subtitle').forEach(el => el.textContent = config.heroSubtitle);
      }

      // Dynamic Contact info
      if (config.phone) {
        translations.ar.phoneText = config.phone;
        translations.en.phoneText = config.phone;
        document.querySelectorAll('a[href^="tel:"]').forEach(el => {
          el.href = `tel:${config.phone.replace(/\s+/g, '')}`;
        });
      }
      if (config.email) {
        translations.ar.emailText = config.email;
        translations.en.emailText = config.email;
        document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
          el.href = `mailto:${config.email}`;
        });
      }
      if (config.whatsapp) {
        const waNum = config.whatsapp.replace(/[^0-9]/g, '');
        document.querySelectorAll('a[href*="wa.me/"], a.social-btn.whatsapp').forEach(el => {
          el.href = `https://wa.me/${waNum}`;
        });
      }
      if (config.telegram) {
        document.querySelectorAll('a.social-btn.telegram, a[href*="t.me"]').forEach(el => {
          el.href = config.telegram.startsWith('http') ? config.telegram : `https://t.me/${config.telegram.replace('@', '')}`;
        });
      }
      if (config.facebook) {
        document.querySelectorAll('a.social-btn.facebook, a[href*="facebook.com"]').forEach(el => {
          el.href = config.facebook;
        });
      }
      if (config.instagram) {
        document.querySelectorAll('a[href*="instagram.com"]').forEach(el => {
          el.href = config.instagram;
        });
      }
      if (config.twitter) {
        document.querySelectorAll('a[href*="twitter.com"], a[href*="x.com"]').forEach(el => {
          el.href = config.twitter;
        });
      }
      if (config.address) {
        translations.ar.addressText = config.address;
        translations.en.addressText = config.address;
      }

      // Set Currency and contacts in state
      AppState.currency = config.currency || 'ج.م';
      AppState.phone = config.phone || '+201000000000';
      AppState.email = config.email || 'info@servicevip.com';
      AppState.whatsapp = config.whatsapp || '201000000000';
      AppState.address = config.address || 'المملكة العربية السعودية - الرياض';
    }
  } catch (err) {
    console.error("Failed to load settings from DB", err);
  }
}

// ========== Database Fetcher ==========
async function fetchInitialData() {
  try {
    const [servicesRes, reviewsRes] = await Promise.all([
      fetch('/api/services'),
      fetch('/api/reviews')
    ]);

    if (servicesRes.ok) {
      AppState.services = await servicesRes.json();
      renderFooterServices();
      renderNavDropdowns();
    }
    if (reviewsRes.ok) {
      AppState.testimonials = await reviewsRes.json();
    }
  } catch (err) {
    console.error("Error loading services/reviews", err);
  }
}

function renderNavDropdowns() {
  const lang = AppState ? AppState.lang : 'ar';
  const services = AppState.services || [];
  const offers = services.filter(s => (s.discount || 0) > 0);
  const currencySymbol = AppState.currency || 'ج.م';

  // 1. Services Dropdown Menu
  const servicesMenu = document.getElementById('nav-services-menu');
  if (servicesMenu) {
    if (services.length > 0) {
      const itemsHtml = services.map(s => {
        const name = lang === 'ar' ? s.nameAr : s.nameEn;
        const basePrice = s.originalPrice || s.price;
        return `
          <a href="javascript:void(0)" class="dropdown-item" onclick="buyService(${s.id})">
            <img src="${s.image}" style="width:26px;height:26px;border-radius:6px;object-fit:cover;flex-shrink:0;" onerror="this.style.display='none'">
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${name}</span>
            <span style="font-size:0.8rem;font-weight:700;color:var(--primary-light);">${basePrice} ${currencySymbol}</span>
          </a>
        `;
      }).join('');

      servicesMenu.innerHTML = `
        <a href="services.html" class="dropdown-item" style="font-weight:700;color:var(--primary-light);background:rgba(139,92,246,0.08);margin-bottom:4px;">
          <i class="fas fa-th-large"></i>
          <span>${lang === 'ar' ? 'جميع الخدمات الرقمية' : 'All Digital Services'}</span>
        </a>
        <div class="dropdown-divider"></div>
        <div style="max-height:260px;overflow-y:auto;" class="custom-scroll">
          ${itemsHtml}
        </div>
      `;
    } else {
      servicesMenu.innerHTML = `
        <div style="padding:0.75rem 1rem;text-align:center;color:var(--text-muted);font-size:0.85rem;">
          ${lang === 'ar' ? 'لا توجد خدمات متاحة حالياً' : 'No services currently available'}
        </div>
      `;
    }
  }

  // 2. Offers Dropdown Menu
  const offersMenu = document.getElementById('nav-offers-menu');
  if (offersMenu) {
    if (offers.length > 0) {
      const offerItemsHtml = offers.map(s => {
        const name = lang === 'ar' ? s.nameAr : s.nameEn;
        return `
          <a href="javascript:void(0)" class="dropdown-item" onclick="buyService(${s.id})">
            <span style="background:rgba(239,68,68,0.18);color:#ef4444;font-weight:800;font-size:0.75rem;padding:2px 6px;border-radius:99px;flex-shrink:0;">-${s.discount}%</span>
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${name}</span>
            <span style="font-size:0.8rem;font-weight:700;color:var(--accent);">${s.price} ${currencySymbol}</span>
          </a>
        `;
      }).join('');

      offersMenu.innerHTML = `
        <a href="offers.html" class="dropdown-item" style="font-weight:700;color:#ef4444;background:rgba(239,68,68,0.08);margin-bottom:4px;">
          <i class="fas fa-fire"></i>
          <span>${lang === 'ar' ? 'جميع العروض والخصومات' : 'All Deals & Offers'}</span>
        </a>
        <div class="dropdown-divider"></div>
        <div style="max-height:260px;overflow-y:auto;" class="custom-scroll">
          ${offerItemsHtml}
        </div>
      `;
    } else {
      offersMenu.innerHTML = `
        <div style="padding:0.75rem 1rem;text-align:center;color:var(--text-muted);font-size:0.85rem;">
          ${lang === 'ar' ? 'لا توجد عروض حصرية حالياً' : 'No active offers right now'}
        </div>
      `;
    }
  }
}

function renderFooterServices() {
  const lang = AppState ? AppState.lang : 'ar';
  const products = AppState.services || [];
  
  const headings = document.querySelectorAll('.footer-heading[data-translate="ourServices"]');
  headings.forEach(heading => {
    const parent = heading.parentElement;
    if (parent) {
      if (products.length > 0) {
        const linksHtml = products.slice(0, 6).map(p => `
          <a href="services.html" class="footer-link">
            <i class="fas fa-chevron-left"></i> ${lang === 'ar' ? p.nameAr : p.nameEn}
          </a>
        `).join('');
        
        parent.innerHTML = `
          <h4 class="footer-heading" data-translate="ourServices">${lang === 'ar' ? 'خدماتنا' : 'Our Services'}</h4>
          ${linksHtml}
        `;
      } else {
        parent.innerHTML = `
          <h4 class="footer-heading" data-translate="ourServices">${lang === 'ar' ? 'خدماتنا' : 'Our Services'}</h4>
          <span style="font-size:0.85rem;color:var(--text-muted);">${lang === 'ar' ? 'لا توجد خدمات حالياً' : 'No services currently'}</span>
        `;
      }
    }
  });
}

// ========== Page Detection ==========
function detectPage() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('offers')) return 'offers';
  if (path.includes('services')) return 'services';
  if (path.includes('contact')) return 'contact';
  if (path.includes('complaint')) return 'complaints';
  if (path.includes('login')) return 'login';
  if (path.includes('dashboard') || path.includes('admin')) return 'admin';
  return 'home';
}

// ========== Theme Management ==========
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', 'dark');
  AppState.theme = 'dark';
  localStorage.setItem('svip-theme', 'dark');
}

function toggleTheme() {
  applyTheme('dark');
}

// ========== Language Management ==========
function applyLanguage(lang) {
  AppState.lang = lang;
  localStorage.setItem('svip-lang', lang);
  
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
  
  // Translation iteration
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
    const key = el.getAttribute('data-translate-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });
  
  const langToggles = document.querySelectorAll('.lang-toggle');
  langToggles.forEach(btn => {
    btn.textContent = lang === 'ar' ? 'EN' : 'ع';
  });
}

function toggleLanguage() {
  const newLang = AppState.lang === 'ar' ? 'en' : 'ar';
  applyLanguage(newLang);
  
  // Refresh content dynamically
  renderNavDropdowns();
  const page = detectPage();
  if (page === 'home') renderServices(AppState.services.filter(s => s.featured).slice(0, 6));
  if (page === 'services') renderServices(AppState.services);
  if (page === 'offers') renderOfferServices();
  renderTestimonials();
}

// ========== Navbar & Mobile Menu ==========
function initNavbar() {
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });
}

function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu-overlay');
  
  if (!hamburger) return;
  
  hamburger.addEventListener('click', () => {
    AppState.mobileMenuOpen = !AppState.mobileMenuOpen;
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = AppState.mobileMenuOpen ? 'hidden' : '';
  });
  
  if (overlay) {
    overlay.addEventListener('click', closeMobileMenu);
  }
  
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

function closeMobileMenu() {
  AppState.mobileMenuOpen = false;
  document.querySelector('.hamburger')?.classList.remove('active');
  document.querySelector('.mobile-menu')?.classList.remove('active');
  document.querySelector('.mobile-menu-overlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

// ========== Scroll Animations ==========
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
}

// ========== Back To Top ==========
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========== Search Engine ==========
function initSearch() {
  const searchBtn = document.querySelector('.search-toggle');
  const searchContainer = document.querySelector('.nav-search');
  const searchInput = document.querySelector('.nav-search-input');
  
  if (!searchBtn) return;
  
  searchBtn.addEventListener('click', () => {
    AppState.searchOpen = !AppState.searchOpen;
    searchContainer.classList.toggle('active');
    if (AppState.searchOpen && searchInput) {
      searchInput.focus();
    }
  });
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
    
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        AppState.searchOpen = false;
        searchContainer.classList.remove('active');
      }
    });
  }
}

async function performSearch(query) {
  const grid = document.querySelector('.services-grid');
  if (!grid) return;

  if (!query.trim()) {
    const page = detectPage();
    if (page === 'home') renderServices(AppState.services.filter(s => s.featured).slice(0, 6));
    if (page === 'services') renderServices(AppState.services);
    return;
  }
  
  try {
    const res = await fetch(`/api/services?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const filtered = await res.json();
      renderServices(filtered);
    }
  } catch (err) {
    console.error("Search API Error", err);
  }
}

// ========== Notifications UI ==========
function showNotification(type, title, message) {
  const container = document.querySelector('.notifications-container');
  if (!container) return;
  
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-times-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-icon"><i class="${icons[type]}"></i></div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-text">${message}</div>
    </div>
    <button class="notification-close" onclick="this.closest('.notification').remove()">
      <i class="fas fa-times"></i>
    </button>
    <div class="notification-progress"></div>
  `;
  
  container.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ========== Chat Widget ==========
function initChatWidget() {
  const toggle = document.querySelector('.chat-toggle');
  const chatBox = document.querySelector('.chat-box');
  const closeBtn = document.querySelector('.chat-close');
  const sendBtn = document.querySelector('.chat-send');
  const chatInput = document.querySelector('.chat-input');
  
  if (!toggle) return;
  
  toggle.addEventListener('click', () => {
    AppState.chatOpen = !AppState.chatOpen;
    chatBox.classList.toggle('active');
  });
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      AppState.chatOpen = false;
      chatBox.classList.remove('active');
    });
  }
  
  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', () => sendChatMessage(chatInput));
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage(chatInput);
    });
  }
}

function sendChatMessage(input) {
  const msg = input.value.trim();
  if (!msg) return;
  
  const messages = document.querySelector('.chat-messages');
  if (!messages) return;
  
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message sent';
  userMsg.textContent = msg;
  messages.appendChild(userMsg);
  
  input.value = '';
  messages.scrollTop = messages.scrollHeight;
  
  setTimeout(() => {
    const reply = generateAIResponse(msg);
    
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-message received';
    botMsg.innerHTML = reply;
    messages.appendChild(botMsg);
    messages.scrollTop = messages.scrollHeight;
  }, 1000);
}

function generateAIResponse(msg) {
  const query = msg.toLowerCase().trim();
  const lang = AppState.lang;
  const services = AppState.services || [];
  const whatsappNum = (AppState.whatsapp || '201000000000').replace(/[^0-9]/g, '');
  const supportPhone = AppState.phone || '+201000000000';
  const currencySymbol = AppState.currency || 'ج.م';

  // Keywords definitions
  const supportKeywordsAr = ['دعم', 'فني', 'مشكلة', 'مشكله', 'مساعدة', 'مساعده', 'واتس', 'رقم', 'تواصل', 'شات', 'حل', 'تفعيل', 'مش اشتغل', 'مش شغال', 'تعطل', 'شكوى', 'شكوي'];
  const supportKeywordsEn = ['support', 'tech', 'help', 'problem', 'whatsapp', 'number', 'contact', 'issue', 'error', 'broken', 'activate', 'not working', 'down', 'complaint'];

  const priceKeywordsAr = ['سعر', 'أسعار', 'اسعار', 'بكام', 'كم سعر', 'تكلفة', 'تكلفه'];
  const priceKeywordsEn = ['price', 'prices', 'cost', 'how much', 'costing', 'pricing'];

  const offersKeywordsAr = ['عروض', 'عرض', 'خصم', 'خصومات', 'تخفيض'];
  const offersKeywordsEn = ['offer', 'offers', 'discount', 'discounts', 'sale'];

  const greetingKeywordsAr = ['مرحبا', 'مرحباً', 'اهلا', 'أهلاً', 'السلام', 'سلام', 'صباح', 'مساء'];
  const greetingKeywordsEn = ['hi', 'hello', 'hey', 'greetings', 'morning', 'evening'];

  // Check support first
  const isSupport = supportKeywordsAr.some(k => query.includes(k)) || supportKeywordsEn.some(k => query.includes(k));
  if (isSupport) {
    if (lang === 'ar') {
      return `أهلاً بك! للحصول على دعم فني مباشر وسريع وحل مشكلتك فوراً، يرجى مراسلتنا مباشرة عبر الواتساب: <a href='https://wa.me/${whatsappNum}' target='_blank' style='color:var(--primary);text-decoration:underline;font-weight:700;display:inline-flex;align-items:center;gap:4px;'><i class='fab fa-whatsapp'></i> رابط الواتساب المباشر</a> أو الاتصال على الرقم: ${supportPhone}.`;
    } else {
      return `Hello! For fast and direct technical support to resolve your issue immediately, please chat with us on WhatsApp: <a href='https://wa.me/${whatsappNum}' target='_blank' style='color:var(--primary);text-decoration:underline;font-weight:700;display:inline-flex;align-items:center;gap:4px;'><i class='fab fa-whatsapp'></i> Direct WhatsApp Link</a> or call: ${supportPhone}.`;
    }
  }

  // Check specific service matches
  for (const service of services) {
    const nameAr = service.nameAr.toLowerCase();
    const nameEn = service.nameEn.toLowerCase();
    if (query.includes(nameAr) || query.includes(nameEn)) {
      if (lang === 'ar') {
        return `نعم بالتأكيد! متوفر لدينا اشتراك <strong>${service.nameAr}</strong>: ${service.descAr}. السعر هو <strong style='color:var(--primary);'>${service.price} ${currencySymbol}</strong> بدلاً من ${service.originalPrice} ${currencySymbol} (خصم -${service.discount}%). هل تود طلب الاشتراك الآن؟`;
      } else {
        return `Yes, absolutely! We offer <strong>${service.nameEn}</strong>: ${service.descEn}. The price is <strong style='color:var(--primary);'>${service.price} ${currencySymbol}</strong> instead of ${service.originalPrice} ${currencySymbol} (-${service.discount}% off). Would you like to order it now?`;
      }
    }
  }

  // Check price query
  const isPrice = priceKeywordsAr.some(k => query.includes(k)) || priceKeywordsEn.some(k => query.includes(k));
  if (isPrice) {
    if (services.length > 0) {
      const list = services.slice(0, 4).map(s => {
        const name = lang === 'ar' ? s.nameAr : s.nameEn;
        return `<li><strong>${name}</strong>: ${s.price} ${currencySymbol}</li>`;
      }).join('');
      
      if (lang === 'ar') {
        return `إليك أسعار أبرز خدماتنا الرقمية المتوفرة حالياً في قاعدة البيانات:<br><ul style='margin-inline-start:1.5rem;margin-top:0.5rem;'>${list}</ul><br>يمكنك الانتقال لصفحة الخدمات لمشاهدة القائمة بالكامل مع الضمان!`;
      } else {
        return `Here are the prices of our top available digital services:<br><ul style='margin-inline-start:1.5rem;margin-top:0.5rem;'>${list}</ul><br>You can go to our Services page to view the full list with full guarantee!`;
      }
    }
  }

  // Check offers query
  const isOffer = offersKeywordsAr.some(k => query.includes(k)) || offersKeywordsEn.some(k => query.includes(k));
  if (isOffer) {
    const bestOffers = [...services].sort((a, b) => b.discount - a.discount).slice(0, 3);
    if (bestOffers.length > 0) {
      const list = bestOffers.map(s => {
        const name = lang === 'ar' ? s.nameAr : s.nameEn;
        return `<li><strong>${name}</strong> بخصم رائع <strong>-${s.discount}%</strong> (السعر: ${s.price} ${currencySymbol})</li>`;
      }).join('');

      if (lang === 'ar') {
        return `لدينا أقوى العروض الحصرية حالياً بخصومات تصل إلى 70%:<br><ul style='margin-inline-start:1.5rem;margin-top:0.5rem;'>${list}</ul><br>تصفح صفحة العروض للحصول على جميع التفاصيل!`;
      } else {
        return `Here are our best active discounts and limited-time offers:<br><ul style='margin-inline-start:1.5rem;margin-top:0.5rem;'>${list}</ul><br>Browse our Offers page to see all details!`;
      }
    }
  }

  // Check greetings
  const isGreeting = greetingKeywordsAr.some(k => query.includes(k)) || greetingKeywordsEn.some(k => query.includes(k));
  if (isGreeting) {
    if (lang === 'ar') {
      return "أهلاً بك في الدعم الذكي لـ <strong>Service VIP</strong>! 👋 أنا المساعد الذكي لموقعنا. كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن أسعار الاشتراكات، العروض الحالية، أو طلب الدعم الفني.";
    } else {
      return "Welcome to <strong>Service VIP</strong> Smart Support! 👋 I am your AI assistant. How can I help you today? You can ask about subscription prices, active offers, or request technical support.";
    }
  }

  // Default fallback
  if (lang === 'ar') {
    return `شكراً لرسالتك! أنا المساعد الذكي لموقع Service VIP. بخصوص استفسارك، هل تواجه مشكلة فنية وتود التواصل مع الدعم الفني؟ يمكنك مراسلتنا فوراً عبر الواتساب: <a href='https://wa.me/${whatsappNum}' target='_blank' style='color:var(--primary);text-decoration:underline;font-weight:700;'>رابط الواتساب المباشر</a> للحصول على رد فوري، أو أخبرني بتفاصيل أكثر.`;
  } else {
    return `Thank you for your message! I am the Service VIP AI Assistant. Regarding your inquiry, are you facing an issue and need technical support? You can message us on WhatsApp for instant assistance: <a href='https://wa.me/${whatsappNum}' target='_blank' style='color:var(--primary);text-decoration:underline;font-weight:700;'>Direct WhatsApp Link</a>, or tell me more details.`;
  }
}

// ========== Countdown Timer & Offers Banner ==========
async function initCountdown() {
  const countdownEl = document.querySelector('.countdown');
  if (!countdownEl) return;
  
  let targetDate = null;
  let isActive = true;

  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const config = await res.json();
      
      const badgeEl = document.querySelector('.offers-banner [data-translate="limitedOffer"]');
      const titleEl = document.querySelector('.offers-banner-title');
      const descEl = document.querySelector('.offers-banner-desc');
      
      if (badgeEl && config.offerBadge) badgeEl.textContent = config.offerBadge;
      if (titleEl && config.offerTitle) titleEl.textContent = config.offerTitle;
      if (descEl && config.offerDesc) descEl.textContent = config.offerDesc;
      
      if (config.offerCountdownActive === false) {
        isActive = false;
      }

      if (config.offerCountdownEnd) {
        targetDate = new Date(config.offerCountdownEnd);
      }
    }
  } catch (err) {
    console.error('Failed to load offers banner settings', err);
  }

  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  if (!isActive) {
    if (daysEl) daysEl.textContent = '00';
    if (hoursEl) hoursEl.textContent = '00';
    if (minutesEl) minutesEl.textContent = '00';
    if (secondsEl) secondsEl.textContent = '00';
    return;
  }
  
  if (!targetDate || isNaN(targetDate.getTime()) || targetDate <= new Date()) {
    targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
  }

  // Ensure offers banner is visible
  document.querySelectorAll('.offers-banner').forEach(banner => {
    const section = banner.closest('.section') || banner;
    if (section) section.style.display = '';
  });
  
  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ========== Testimonials Slider ==========
function initTestimonialsSlider() {
  renderTestimonials();
  
  const prevBtn = document.querySelector('.testimonials-prev');
  const nextBtn = document.querySelector('.testimonials-next');
  
  if (prevBtn) prevBtn.addEventListener('click', () => slideTestimonial(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => slideTestimonial(1));
  
  setInterval(() => slideTestimonial(1), 5000);
}

function renderTestimonials() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;
  
  const lang = AppState.lang;
  track.innerHTML = AppState.testimonials.map((t, i) => `
    <div class="testimonial-card">
      <div class="testimonial-inner">
        <div class="testimonial-quote">❝</div>
        <div class="testimonial-avatar">
          <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--primary-gradient);color:var(--secondary);font-size:1.5rem;font-weight:800;">
            ${lang === 'ar' ? t.avatar : t.nameEn.charAt(0)}
          </div>
        </div>
        <div class="testimonial-name">${lang === 'ar' ? t.nameAr : t.nameEn}</div>
        <div class="testimonial-role">${lang === 'ar' ? t.roleAr : t.roleEn}</div>
        <div class="testimonial-stars">
          ${'<i class="fas fa-star"></i>'.repeat(t.rating)}${'<i class="far fa-star"></i>'.repeat(5 - t.rating)}
        </div>
        <div class="testimonial-text">${lang === 'ar' ? t.textAr : t.textEn}</div>
      </div>
    </div>
  `).join('');
  
  updateTestimonialDots();
}

function slideTestimonial(direction) {
  if (AppState.testimonials.length === 0) return;
  AppState.currentTestimonial += direction;
  if (AppState.currentTestimonial >= AppState.testimonials.length) AppState.currentTestimonial = 0;
  if (AppState.currentTestimonial < 0) AppState.currentTestimonial = AppState.testimonials.length - 1;
  
  const track = document.querySelector('.testimonials-track');
  if (track) {
    track.style.transform = `translateX(${AppState.lang === 'ar' ? '' : '-'}${AppState.currentTestimonial * 100}%)`;
  }
  
  updateTestimonialDots();
}

function updateTestimonialDots() {
  const dotsContainer = document.querySelector('.testimonials-dots');
  if (!dotsContainer) return;
  
  dotsContainer.innerHTML = AppState.testimonials.map((_, i) => `
    <div class="testimonials-dot ${i === AppState.currentTestimonial ? 'active' : ''}" 
         onclick="goToTestimonial(${i})"></div>
  `).join('');
}

function goToTestimonial(index) {
  AppState.currentTestimonial = index;
  const track = document.querySelector('.testimonials-track');
  if (track) {
    track.style.transform = `translateX(${AppState.lang === 'ar' ? '' : '-'}${index * 100}%)`;
  }
  updateTestimonialDots();
}

function formatDuration(m) {
  const months = parseInt(m) || 1;
  const lang = (typeof AppState !== 'undefined' ? AppState.lang : 'ar');
  
  if (lang === 'ar') {
    if (months === 1) return 'شهر واحد';
    if (months === 2) return 'شهرين';
    if (months >= 3 && months <= 10) return `${months} أشهر`;
    if (months === 12) return 'سنة (12 شهر)';
    if (months === 18) return 'سنة ونصف (18 شهر)';
    if (months === 24) return 'سنتين (24 شهر)';
    return `${months} شهر`;
  } else {
    if (months === 1) return '1 Month';
    if (months === 12) return '1 Year';
    if (months === 24) return '2 Years';
    return `${months} Months`;
  }
}

function renderModernDiscountBadge(discountPercent) {
  return `
    <div class="discount-badge-circle">
      <span class="dbc-get">GET</span>
      <span class="dbc-percent">${discountPercent}%</span>
      <div class="dbc-off-banner">
        <span class="dbc-off-text">OFF</span>
      </div>
    </div>
  `;
}

// ========== Services Grid Renderer ==========
function renderServices(services, containerId) {
  const container = document.querySelector(containerId || '.services-grid');
  if (!container) return;
  
  const lang = AppState.lang;
  const isOffersPage = containerId === '#offers-grid' || detectPage() === 'offers';

  // Filter out hidden items for public view
  const visibleServices = services.filter(s => s.hidden !== true);
  
  if (visibleServices.length === 0) {
    if (isOffersPage) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:4rem 2rem;background:var(--bg-card);border:1px solid var(--border-glass);border-radius:var(--radius-xl);box-shadow:var(--shadow-md);">
          <i class="fas fa-clock" style="font-size:3.5rem;margin-bottom:1rem;display:block;color:var(--primary);"></i>
          <h3 style="font-size:1.4rem;font-weight:800;color:var(--text-primary);margin-bottom:0.5rem;">${lang === 'ar' ? 'انتهت فترة العروض والخصومات المؤقتة' : 'Limited-Time Offers Have Ended'}</h3>
          <p style="color:var(--text-muted);max-width:500px;margin:0 auto 1.5rem;line-height:1.6;">${lang === 'ar' ? 'انتهى العداد التنازلي للخصومات الحالية واختفت العروض المؤقتة. انتظرنا في خصومات وعروض حصرية قريباً!' : 'The countdown timer has ended and temporary discounts are closed. Stay tuned for upcoming exclusive deals!'}</p>
          <a href="services.html" class="btn btn-primary"><i class="fas fa-box-open"></i> ${lang === 'ar' ? 'تصفح جميع المنتجات' : 'Browse All Products'}</a>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">
          <i class="fas fa-search" style="font-size:3rem;margin-bottom:1rem;display:block;"></i>
          <p>${lang === 'ar' ? 'لا توجد خدمات متاحة' : 'No services available'}</p>
        </div>
      `;
    }
    return;
  }
  
  container.innerHTML = visibleServices.map((s, i) => {
    const isOffer = isOffersPage && s.discount && s.discount > 0;
    const basePrice = s.originalPrice || s.price;
    const finalPrice = isOffer ? s.price : basePrice;
    const isStock = s.inStock !== false;

    return `
      <div class="service-card scroll-animate delay-${(i % 4) + 1}" data-id="${s.id}">
        ${!isStock ? `<div class="discount-badge" style="background:#ef4444;">${lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}</div>` : (isOffer ? renderModernDiscountBadge(s.discount) : '')}
        <div class="service-card-image">
          <img src="${s.image}" alt="${lang === 'ar' ? s.nameAr : s.nameEn}" loading="lazy" 
               onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22250%22><rect fill=%22%231a1a2e%22 width=%22400%22 height=%22250%22/><text fill=%22%238b5cf6%22 x=%22200%22 y=%22125%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-size=%2224%22>Service VIP</text></svg>'">
        </div>
        <div class="service-card-body">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin-bottom:0.4rem;">
            <div class="service-card-category" style="margin-bottom:0;">${lang === 'ar' ? '🤖 ذكاء اصطناعي' : '🤖 AI Service'}</div>
            <div style="font-size:0.8rem;color:#38bdf8;font-weight:700;background:rgba(56,189,248,0.12);padding:0.2rem 0.6rem;border-radius:var(--radius-full);display:inline-flex;align-items:center;gap:0.35rem;">
              <i class="fas fa-clock" style="font-size:0.75rem;"></i> ${formatDuration(s.durationMonths)}
            </div>
          </div>
          <div class="service-card-title">${lang === 'ar' ? s.nameAr : s.nameEn}</div>
          <div class="service-card-desc">${lang === 'ar' ? s.descAr : s.descEn}</div>
          <div class="service-card-pricing">
            ${isOffer && s.originalPrice && s.originalPrice !== s.price ? `<span class="service-card-price-original">${s.originalPrice} ${AppState.currency || 'ج.م'}</span>` : ''}
            <span class="service-card-price">${finalPrice} ${AppState.currency || 'ج.م'}</span>
          </div>
          <div class="service-card-footer">
            <div class="service-card-rating">
              <i class="fas fa-star"></i>
              <span>${s.rating}</span>
            </div>
            ${isStock ? `
              <button class="btn btn-primary btn-sm" onclick="buyService(${s.id}, ${isOffer ? 'true' : 'false'})">
                <i class="fas fa-shopping-cart"></i>
                <span data-translate="buyNow">${lang === 'ar' ? 'اشتري الآن' : 'Buy Now'}</span>
              </button>
            ` : `
              <button class="btn btn-glass btn-sm" disabled style="opacity:0.65;cursor:not-allowed;color:#ef4444;border-color:rgba(239,68,68,0.3);">
                <i class="fas fa-ban"></i>
                <span>${lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  initScrollAnimations();
}

function buyService(id, isOffer = false) {
  const service = AppState.services.find(s => s.id === id);
  if (!service) return;
  const isOfferContext = isOffer || (detectPage() === 'offers');
  showPurchaseModal(service, isOfferContext);
}

function showPurchaseModal(service, isOfferContext = false) {
  const lang = AppState.lang;
  const currencySymbol = AppState.currency || 'ج.م';
  const whatsappNum = (AppState.whatsapp || '201000000000').replace(/[^0-9]/g, '');
  const serviceName = lang === 'ar' ? service.nameAr : service.nameEn;
  const serviceImage = service.image;

  const isOffer = isOfferContext || (detectPage() === 'offers');
  const basePrice = service.originalPrice || service.price;
  const discountPct = isOffer ? (service.discount || 0) : 0;
  const finalPrice = isOffer && discountPct > 0 ? service.price : basePrice;

  let appliedCoupon = null;
  let currentPayAmount = finalPrice;

  // Remove existing modal if any
  document.querySelector('.purchase-modal-overlay')?.remove();
  document.querySelector('.purchase-modal')?.remove();

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'purchase-modal-overlay';
  document.body.appendChild(overlay);

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'purchase-modal';
  document.body.appendChild(modal);

  const titleText = isOffer ? (lang === 'ar' ? 'طلب شراء العرض' : 'Purchase Offer') : (lang === 'ar' ? 'طلب شراء الخدمة' : 'Purchase Service');
  const closeBtnText = '<i class="fas fa-times"></i>';
  const nameLabel = lang === 'ar' ? 'اسم المشتري' : 'Buyer Name';
  const namePlaceholder = lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name';
  const phoneLabel = lang === 'ar' ? 'رقم الهاتف (الواتساب)' : 'Phone Number (WhatsApp)';
  const phonePlaceholder = lang === 'ar' ? 'مثال: 201000000000' : 'e.g. 201000000000';
  const sendLabel = lang === 'ar' ? 'إرسال الطلب وإتمام عبر واتساب' : 'Submit & Complete on WhatsApp';
  const cancelText = lang === 'ar' ? 'إلغاء' : 'Cancel';
  const whatsappLabelText = lang === 'ar' 
    ? `سيتم تحويلك إلى الواتساب على الرقم: <strong>+${whatsappNum}</strong>` 
    : `You will be redirected to WhatsApp on: <strong>+${whatsappNum}</strong>`;

  modal.innerHTML = `
    <div class="purchase-modal-header">
      <h3 class="purchase-modal-title">${titleText}</h3>
      <button class="purchase-modal-close" aria-label="Close modal">${closeBtnText}</button>
    </div>
    <div class="purchase-product-preview">
      <img src="${serviceImage}" alt="${serviceName}" class="purchase-product-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><rect fill=%22%231a1a2e%22 width=%2260%22 height=%2260%22/><text fill=%22%238b5cf6%22 x=%2230%22 y=%2235%22 text-anchor=%22middle%22 font-size=%2210%22>Img</text></svg>'">
      <div class="purchase-product-info">
        <div class="purchase-product-name">${serviceName}</div>
        <div class="purchase-product-price">
          ${isOffer && discountPct > 0 ? `
            <span style="text-decoration:line-through;color:var(--text-muted);font-size:0.85rem;margin-inline-end:8px;">${basePrice} ${currencySymbol}</span>
            <span style="color:#22c55e;font-weight:800;font-size:1.1rem;">${finalPrice} ${currencySymbol}</span>
          ` : `
            <span style="color:var(--primary-light);font-weight:800;font-size:1.1rem;">${basePrice} ${currencySymbol}</span>
          `}
        </div>
      </div>
    </div>
    <div class="purchase-whatsapp-info">
      <i class="fab fa-whatsapp"></i>
      <span>${whatsappLabelText}</span>
    </div>

    <!-- Coupon Code Input Box (Services Only) -->
    ${!isOffer ? `
    <div class="purchase-coupon-box" style="margin: 0.75rem 0;padding: 0.85rem;background: rgba(139, 92, 246, 0.06);border: 1px dashed rgba(139, 92, 246, 0.3);border-radius: var(--radius-md);">
      <label style="font-weight:600;font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:0.5rem;">
        <i class="fas fa-ticket-alt" style="color:#a78bfa;margin-inline-end:4px;"></i>
        ${lang === 'ar' ? 'هل لديك كوبون خصم؟' : 'Have a Discount Coupon?'}
      </label>
      <div style="display:flex;gap:0.5rem;">
        <input type="text" id="purchase-coupon-code" placeholder="${lang === 'ar' ? 'أدخل كود الكوبون' : 'Enter Coupon Code'}" style="flex:1;padding:0.55rem 0.85rem;border-radius:var(--radius-sm);background:var(--bg-tertiary);border:1px solid var(--border-color);color:var(--text-primary);font-size:0.9rem;text-transform:uppercase;">
        <button type="button" id="apply-coupon-btn" class="btn btn-sm btn-glass" style="white-space:nowrap;padding:0.55rem 1rem;font-size:0.85rem;background:rgba(139,92,246,0.2);">
          ${lang === 'ar' ? 'تطبيق' : 'Apply'}
        </button>
      </div>
      <div id="coupon-feedback-msg" style="font-size:0.8rem;margin-top:0.4rem;display:none;"></div>
    </div>
    ` : ''}

    <form id="purchase-form" style="display:flex;flex-direction:column;gap:1.25rem;">
      <div class="form-group" style="display:flex;flex-direction:column;gap:0.5rem;">
        <label class="form-label" style="font-weight:600;font-size:0.9rem;color:var(--text-primary);">${nameLabel}</label>
        <input type="text" class="form-input" id="purchase-buyer-name" required placeholder="${namePlaceholder}" style="padding:0.8rem 1rem;border-radius:var(--radius-md);background:var(--bg-tertiary);border:1px solid var(--border-color);color:var(--text-primary);width:100%;">
      </div>
      <div class="form-group" style="display:flex;flex-direction:column;gap:0.5rem;">
        <label class="form-label" style="font-weight:600;font-size:0.9rem;color:var(--text-primary);">${phoneLabel}</label>
        <input type="tel" class="form-input" id="purchase-buyer-phone" required placeholder="${phonePlaceholder}" style="padding:0.8rem 1rem;border-radius:var(--radius-md);background:var(--bg-tertiary);border:1px solid var(--border-color);color:var(--text-primary);width:100%;">
      </div>
      <div style="display:flex;gap:0.75rem;justify-content:flex-end;margin-top:0.5rem;">
        <button type="button" class="btn btn-glass closeModalBtn" style="padding:0.8rem 1.5rem;border-radius:var(--radius-md);">${cancelText}</button>
        <button type="submit" class="btn btn-primary" style="padding:0.8rem 1.5rem;border-radius:var(--radius-md);display:flex;align-items:center;gap:0.5rem;">
          <i class="fab fa-whatsapp"></i>
          <span>${sendLabel}</span>
        </button>
      </div>
    </form>
  `;

  const closeModal = () => {
    overlay.classList.remove('active');
    modal.classList.remove('active');
    setTimeout(() => {
      overlay.remove();
      modal.remove();
    }, 300);
  };

  overlay.addEventListener('click', closeModal);
  modal.querySelector('.purchase-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.closeModalBtn').addEventListener('click', closeModal);

  // Handle Coupon Apply button
  modal.querySelector('#apply-coupon-btn')?.addEventListener('click', async () => {
    const codeInput = modal.querySelector('#purchase-coupon-code');
    const feedbackMsg = modal.querySelector('#coupon-feedback-msg');
    const codeVal = (codeInput?.value || '').trim();

    if (!codeVal) {
      if (feedbackMsg) {
        feedbackMsg.style.color = '#ef4444';
        feedbackMsg.style.display = 'block';
        feedbackMsg.textContent = lang === 'ar' ? 'يرجى كتابة كود الكوبون أولاً' : 'Please enter coupon code';
      }
      return;
    }

    try {
      const cRes = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeVal, amount: basePrice })
      });
      const cData = await cRes.json();

      if (cRes.ok && cData.valid) {
        appliedCoupon = cData;
        currentPayAmount = cData.finalAmount;

        if (feedbackMsg) {
          feedbackMsg.style.color = '#22c55e';
          feedbackMsg.style.display = 'block';
          feedbackMsg.textContent = `✓ ${cData.message}`;
        }

        const priceEl = modal.querySelector('.purchase-product-price');
        if (priceEl) {
          priceEl.innerHTML = `
            <span style="text-decoration:line-through;color:var(--text-muted);font-size:0.85rem;margin-inline-end:8px;">${basePrice} ${currencySymbol}</span>
            <span style="color:#22c55e;font-weight:800;font-size:1.1rem;">${cData.finalAmount} ${currencySymbol}</span>
            <span style="background:rgba(34,197,94,0.15);color:#22c55e;font-size:0.75rem;padding:2px 8px;border-radius:99px;font-weight:700;margin-inline-start:6px;">خصم كوبون (${cData.code})</span>
          `;
        }
      } else {
        appliedCoupon = null;
        currentPayAmount = finalPrice;
        if (feedbackMsg) {
          feedbackMsg.style.color = '#ef4444';
          feedbackMsg.style.display = 'block';
          feedbackMsg.textContent = cData.message || (lang === 'ar' ? 'كوبون الخصم غير صالح' : 'Invalid coupon');
        }
      }
    } catch(err) {
      console.error('Coupon validation error:', err);
    }
  });

  modal.querySelector('#purchase-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const buyerName = document.getElementById('purchase-buyer-name').value.trim();
    const buyerPhone = document.getElementById('purchase-buyer-phone').value.trim();

    if (!buyerName || !buyerPhone) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          serviceName: serviceName,
          buyerName: buyerName,
          buyerPhone: buyerPhone,
          amount: currentPayAmount,
          originalPrice: basePrice,
          discount: discountPct,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          couponDiscount: appliedCoupon ? appliedCoupon.discountAmount : 0,
          isOffer: isOffer,
          orderType: isOffer ? 'offer' : 'service'
        })
      });

      if (res.ok) {
        showNotification('success',
          lang === 'ar' ? 'تم تقديم الطلب!' : 'Order Placed!',
          lang === 'ar' ? 'تم تسجيل طلبك بنجاح. سيتم تحويلك الآن لتأكيد الطلب عبر الواتساب.' : 'Order recorded successfully. Redirecting you to confirm via WhatsApp.'
        );

        let messageText = '';
        if (lang === 'ar') {
          if (isOffer) {
            const discVal = discountPct > 0 ? `%${discountPct}` : '%0';
            messageText = `طلب عرض جديد\n\nأرغب في الاستفادة من أحد عروضكم المميزة على خدمات الذكاء الاصطناعي.\n\nالخدمة المطلوبة: ${serviceName}\n\nالسعر بعد الخصم: ${currentPayAmount} ${currencySymbol}\nنسبة الخصم: ${discVal}\n\n━━━━━━━━━━━━━━\n\nاسم العميل: ${buyerName}\nرقم الهاتف: ${buyerPhone}\n\n━━━━━━━━━━━━━━\n\nبرجاء التواصل معي لاستكمال الطلب وتفعيل الخدمة.\n\nService VIP | Your AI, Your Advantage`;
          } else {
            const couponLine = appliedCoupon ? `\nكود الخصم : ${appliedCoupon.code}` : '';

            messageText = `طلب اشتراك جديد\n\nأرغب في الاشتراك في إحدى خدماتكم المميزة في مجال الذكاء الاصطناعي.\n\nالخدمة المطلوبة: ${serviceName}\nالسعر : ${currentPayAmount} ${currencySymbol}${couponLine}\n\n\n━━━━━━━━━━━━━━\n\nاسم العميل: ${buyerName}\nرقم الهاتف: ${buyerPhone}\n\n━━━━━━━━━━━━━━\n\nبرجاء التواصل معي لاستكمال عملية الاشتراك وتفعيل الخدمة.\n\nService VIP | Your AI, Your Advantage`;
          }
        } else {
          if (isOffer) {
            const discVal = discountPct > 0 ? `${discountPct}%` : '0%';
            messageText = `New Offer Request\n\nI would like to take advantage of one of your special offers on AI services.\n\nService Requested: ${serviceName}\n\nDiscounted Price: ${currentPayAmount} ${currencySymbol}\nDiscount Percentage: ${discVal}\n\n━━━━━━━━━━━━━━\n\nCustomer Name: ${buyerName}\nPhone Number: ${buyerPhone}\n\n━━━━━━━━━━━━━━\n\nPlease contact me to complete the order and activate the service.\n\nService VIP | Your AI, Your Advantage`;
          } else {
            const couponLine = appliedCoupon ? `\nCoupon Code: ${appliedCoupon.code}` : '';

            messageText = `New Subscription Request\n\nI would like to subscribe to one of your premium AI services.\n\nService Requested: ${serviceName}\nPrice: ${currentPayAmount} ${currencySymbol}${couponLine}\n\n\n━━━━━━━━━━━━━━\n\nCustomer Name: ${buyerName}\nPhone Number: ${buyerPhone}\n\n━━━━━━━━━━━━━━\n\nPlease contact me to complete subscription and activate the service.\n\nService VIP | Your AI, Your Advantage`;
          }
        }

        const waUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(messageText)}`;
        
        closeModal();

        setTimeout(() => {
          window.open(waUrl, '_blank');
        }, 1200);
      } else {
        showNotification('error', lang === 'ar' ? 'حدث خطأ' : 'Error', lang === 'ar' ? 'فشل إرسال طلب الشراء. يرجى المحاولة لاحقاً.' : 'Failed to submit purchase order. Please try again.');
      }
    } catch (err) {
      console.error("Order submission failed:", err);
      showNotification('error', lang === 'ar' ? 'حدث خطأ' : 'Error', lang === 'ar' ? 'فشل الاتصال بالخادم.' : 'Server connection failed.');
    }
  });

  setTimeout(() => {
    overlay.classList.add('active');
    modal.classList.add('active');
  }, 10);
}

// ========== Offers Section ==========
function renderOfferServices() {
  const offers = AppState.services.filter(s => s.discount && s.discount > 0);
  renderServices(offers, '#offers-grid', true);
}

// ========== Initializers by Page ==========
function initHomePage() {
  const homeGrid = document.querySelector('#home-services-grid');
  if (homeGrid) {
    renderServices(AppState.services.filter(s => s.featured).slice(0, 6), '#home-services-grid');
  }
}

function initServicesPage() {
  renderServices(AppState.services);
  initServiceFilters();
}

function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.dataset.category;
      if (category === 'all') {
        renderServices(AppState.services);
      } else {
        renderServices(AppState.services.filter(s => s.category === category));
      }
    });
  });
}

function initOffersPage() {
  renderOfferServices();
}

function initContactPage() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          details: data.message,
          orderNumber: 'Contact Form Message'
        })
      });

      const lang = AppState.lang;
      if (res.ok) {
        showNotification('success',
          translations[lang].notifSuccess,
          translations[lang].formSuccess
        );
        form.reset();
      } else {
        showNotification('error', translations[lang].notifError, 'Failed to submit form');
      }
    } catch (err) {
      console.error("Submit Message API Error", err);
    }
  });
}

function initComplaintPage() {
  const form = document.getElementById('complaint-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          orderNumber: data.orderNumber,
          subject: data.subject,
          details: data.details
        })
      });

      const lang = AppState.lang;
      if (res.ok) {
        showNotification('success',
          translations[lang].notifSuccess,
          translations[lang].complaintSuccess
        );
        form.reset();
      } else {
        showNotification('error', translations[lang].notifError, 'Failed to submit complaint');
      }
    } catch (err) {
      console.error("Submit Complaint API Error", err);
    }
  });
  
  const fileUpload = document.querySelector('.file-upload');
  const fileInput = fileUpload?.querySelector('input[type="file"]');
  const fileText = fileUpload?.querySelector('.file-upload-text');
  
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        fileText.textContent = fileInput.files[0].name;
      }
    });
  }
}

function initLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = form.querySelector('[name="email"]');
    const userInput = form.querySelector('[name="username"]');
    const username = userInput ? userInput.value : (emailInput ? emailInput.value : '');
    const email = emailInput ? emailInput.value : username;
    const password = form.querySelector('[name="password"]').value;
    
    const errorMsg = document.querySelector('.login-error-msg');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });

      const data = await res.json();
      const lang = AppState.lang;

      if (res.ok && data.success) {
        showNotification('success',
          lang === 'ar' ? 'مرحباً!' : 'Welcome!',
          lang === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login successful'
        );
        
        setTimeout(() => {
          window.location.href = 'admin/dashboard.html';
        }, 1000);
      } else {
        if (errorMsg) {
          errorMsg.classList.add('show');
          errorMsg.querySelector('span').textContent = translations[lang].loginError;
        }
        
        showNotification('error',
          translations[lang].notifError,
          translations[lang].loginError
        );
      }
    } catch (err) {
      console.error("Login API Error", err);
    }
  });
}

// ========== Helper Functions ==========
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(AppState.lang === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  }).format(date);
}

// ========== Particles Generator ==========
function createParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (10 + Math.random() * 20) + 's';
    particle.style.width = (2 + Math.random() * 4) + 'px';
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}

document.addEventListener('DOMContentLoaded', createParticles);
