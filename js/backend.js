/* ============================================
   Service VIP - Relational Database & API Engine
   ============================================ */

(function() {
  // ========== Database Helper Methods ==========
  const DB = {
    get(table) {
      const data = localStorage.getItem(`svip-${table}`);
      return data ? JSON.parse(data) : null;
    },
    set(table, val) {
      localStorage.setItem(`svip-${table}`, JSON.stringify(val));
    },
    initTable(table, defaultVal) {
      if (this.get(table) === null) {
        this.set(table, defaultVal);
      }
    }
  };

  // ========== Initialize Schemas & Sample Records ==========
  const defaultAdmins = [
    {
      id: 1,
      username: "owner@servicevip",
      email: "owner@servicevip",
      password: "Service2030@",
      name: "مدير النظام الرئيسي",
      role: "owner",
      permissions: {
        website: true,
        services: true,
        offers: true,
        users: true,
        complaints: true,
        orders: true,
        settings: true,
        admins: true
      }
    }
  ];

  const defaultCategories = [
    { id: 1, nameAr: "ذكاء اصطناعي", nameEn: "AI Services", slug: "ai" }
  ];

  const defaultServices = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop',
      nameAr: 'نتفليكس بريميوم',
      nameEn: 'Netflix Premium',
      descAr: 'اشتراك نتفليكس بريميوم 4K لمدة شهر كامل مع ضمان',
      descEn: 'Netflix Premium 4K subscription for one full month with guarantee',
      categoryId: 1, // Streaming
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
      categoryId: 2, // Music
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
      descAr: 'اشتراك كانفا برو لمدة سنة كاملة مع جميع المميزات',
      descEn: 'Canva Pro annual subscription with all premium features',
      categoryId: 3, // Design
      originalPrice: 129.99,
      price: 49.99,
      discount: 62,
      rating: 4.7,
      featured: false
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      nameAr: 'شات جي بي تي بلس',
      nameEn: 'ChatGPT Plus',
      descAr: 'اشتراك ChatGPT Plus لمدة شهر مع GPT-4 غير محدود',
      descEn: 'ChatGPT Plus monthly subscription with unlimited GPT-4',
      categoryId: 4, // AI
      originalPrice: 89.99,
      price: 39.99,
      discount: 56,
      rating: 4.9,
      featured: true
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop',
      nameAr: 'نورد VPN',
      nameEn: 'NordVPN',
      descAr: 'اشتراك NordVPN لمدة سنة كاملة مع حماية متقدمة',
      descEn: 'NordVPN annual subscription with advanced protection',
      categoryId: 5, // Security
      originalPrice: 99.99,
      price: 34.99,
      discount: 65,
      rating: 4.6,
      featured: false
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1559163499-413811fb2344?w=400&h=250&fit=crop',
      nameAr: 'أدوبي كريتيف كلاود',
      nameEn: 'Adobe Creative Cloud',
      descAr: 'اشتراك Adobe CC كامل لمدة سنة مع جميع التطبيقات',
      descEn: 'Full Adobe CC annual subscription with all applications',
      categoryId: 3, // Design
      originalPrice: 599.99,
      price: 199.99,
      discount: 67,
      rating: 4.8,
      featured: true
    }
  ];

  const defaultUsers = [
    { id: 1, name: 'أحمد محمد', nameEn: 'Ahmed Mohammed', email: 'ahmed@example.com', status: 'active', joinDate: '2026-03-15' },
    { id: 2, name: 'سارة العلي', nameEn: 'Sara Al-Ali', email: 'sara@example.com', status: 'active', joinDate: '2026-04-20' },
    { id: 3, name: 'خالد الحربي', nameEn: 'Khaled Al-Harbi', email: 'khaled@example.com', status: 'active', joinDate: '2026-05-10' },
    { id: 4, name: 'نورة السعيد', nameEn: 'Noura Al-Saeed', email: 'noura@example.com', status: 'suspended', joinDate: '2026-06-01' },
    { id: 5, name: 'فهد العتيبي', nameEn: 'Fahd Al-Otaibi', email: 'fahd@example.com', status: 'active', joinDate: '2026-06-15' }
  ];

  const defaultOrders = [
    { id: 1038, userId: 5, serviceId: 5, amount: 34.99, status: 'pending', date: '2026-06-24' },
    { id: 1039, userId: 4, serviceId: 3, amount: 49.99, status: 'active', date: '2026-06-23' },
    { id: 1040, userId: 3, serviceId: 4, amount: 39.99, status: 'pending', date: '2026-06-25' },
    { id: 1041, userId: 2, serviceId: 2, amount: 19.99, status: 'active', date: '2026-06-25' },
    { id: 1042, userId: 1, serviceId: 1, amount: 29.99, status: 'active', date: '2026-06-25' }
  ];

  const defaultComplaints = [
    { id: 1001, name: 'محمد أحمد', email: 'mohammed@example.com', phone: '+966501234567', orderNumber: '#1035', subject: 'تأخر التفعيل', details: 'لم يتم تفعيل الاشتراك بعد 24 ساعة من الطلب', status: 'pending', date: '2026-06-20', reply: '' },
    { id: 1002, name: 'فاطمة خالد', email: 'fatima@example.com', phone: '+966507654321', orderNumber: '#1028', subject: 'مشكلة في الحساب', details: 'الحساب لا يعمل بشكل صحيح بعد التفعيل', status: 'resolved', date: '2026-06-18', reply: 'تم حل المشكلة وإعادة تفعيل الحساب' }
  ];

  const defaultReviews = [
    { id: 1, nameAr: 'أحمد محمد', nameEn: 'Ahmed Mohammed', roleAr: 'رائد أعمال', roleEn: 'Entrepreneur', textAr: 'خدمة ممتازة وأسعار لا تُقارن! تعاملت معهم أكثر من مرة والتجربة دائماً رائعة. أنصح الجميع بتجربة خدماتهم.', textEn: 'Excellent service and unbeatable prices! I have dealt with them multiple times and the experience is always great.', rating: 5, avatar: 'أ', serviceId: 1 },
    { id: 2, nameAr: 'سارة العلي', nameEn: 'Sara Al-Ali', roleAr: 'مصممة جرافيك', roleEn: 'Graphic Designer', textAr: 'حصلت على اشتراك أدوبي بسعر مميز جداً والتفعيل كان فوري. شكراً لكم على الخدمة الاحترافية.', textEn: 'Got an Adobe subscription at a great price and activation was instant. Thank you for the professional service.', rating: 5, avatar: 'س', serviceId: 6 },
    { id: 3, nameAr: 'خالد الحربي', nameEn: 'Khaled Al-Harbi', roleAr: 'مطور ويب', roleEn: 'Web Developer', textAr: 'الدعم الفني ممتاز ومتواجد على مدار الساعة. واجهت مشكلة بسيطة وتم حلها خلال دقائق. خدمة VIP فعلاً!', textEn: 'Technical support is excellent and available 24/7. Had a small issue and it was resolved in minutes. Truly VIP!', rating: 5, avatar: 'خ', serviceId: 4 },
    { id: 4, nameAr: 'نورة السعيد', nameEn: 'Noura Al-Saeed', roleAr: 'صانعة محتوى', roleEn: 'Content Creator', textAr: 'أفضل متجر للخدمات الرقمية! الأسعار مناسبة والجودة عالية. أصبحت عميلة دائمة لديهم.', textEn: 'Best digital services store! Fair prices and high quality. I\'ve become a regular customer.', rating: 4, avatar: 'ن', serviceId: 3 }
  ];

  const defaultNotifications = [
    { id: 1, titleAr: "طلب جديد", titleEn: "New Order", messageAr: "تم تقديم طلب جديد للاشتراك بـ نتفليكس", messageEn: "A new order has been placed for Netflix", type: "order", date: "2026-06-25T21:00:00Z", read: false },
    { id: 2, titleAr: "شكوى جديدة", titleEn: "New Complaint", messageAr: "تم تقديم شكوى جديدة بخصوص تأخر التفعيل", messageEn: "A new complaint has been submitted regarding activation delay", type: "complaint", date: "2026-06-25T20:30:00Z", read: false },
    { id: 3, titleAr: "مستخدم جديد", titleEn: "New User Registered", messageAr: "سجل فهد العتيبي حساباً جديداً", messageEn: "Fahd Al-Otaibi registered a new account", type: "user", date: "2026-06-15T12:00:00Z", read: true }
  ];

  const defaultSettings = {
    siteName: "Service VIP",
    siteDesc: "اشتراكات رقمية وخدمات احترافية بأسعار مميزة وضمان كامل. نتفليكس، سبوتيفاي، أدوبي والمزيد.",
    siteLogo: "images/site-logo.png",
    primaryColor: "#8b5cf6",
    secondaryColor: "#0f0a1e",
    heroTitle: "خدمات VIP بأعلى جودة وأفضل الأسعار",
    heroSubtitle: "اشتراكات رقمية وخدمات احترافية بأسعار مميزة وضمان كامل.",
    whatsapp: "201000000000",
    phone: "+201000000000",
    email: "info@servicevip.com",
    address: "المملكة العربية السعودية - الرياض",
    telegram: "https://t.me/servicevip",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    currency: "ج.م",
    offerBadge: "عرض لفترة محدودة!",
    offerTitle: "خصومات تصل إلى 70% على جميع الخدمات",
    offerDesc: "لا تفوت فرصة الحصول على أفضل الخدمات الرقمية بأسعار لا تُقاوم. العرض ساري لفترة محدودة!",
    offerCountdownEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  };

  const defaultOffers = [
    { id: 1, serviceId: 1, discount: 63, startDate: "2026-06-20", endDate: "2026-07-20" },
    { id: 2, serviceId: 2, discount: 60, startDate: "2026-06-20", endDate: "2026-07-20" },
    { id: 3, serviceId: 3, discount: 62, startDate: "2026-06-20", endDate: "2026-07-20" },
    { id: 4, serviceId: 4, discount: 56, startDate: "2026-06-20", endDate: "2026-07-20" },
    { id: 5, serviceId: 6, discount: 67, startDate: "2026-06-20", endDate: "2026-07-20" }
  ];

  const defaultCoupons = [
    { id: 1, code: "VIP20", discountType: "percent", discountValue: 20, maxUses: 100, usedCount: 3, expiryDate: "2026-12-31", active: true },
    { id: 2, code: "SAVE10", discountType: "percent", discountValue: 10, maxUses: 50, usedCount: 0, expiryDate: "2026-12-31", active: true }
  ];

  // Initialize DB tables
  DB.initTable('admins', defaultAdmins);
  DB.initTable('categories', defaultCategories);
  DB.initTable('services', defaultServices);
  DB.initTable('users', defaultUsers);
  DB.initTable('orders', defaultOrders);
  DB.initTable('complaints', defaultComplaints);
  DB.initTable('reviews', defaultReviews);
  DB.initTable('notifications', defaultNotifications);
  DB.initTable('config', defaultSettings);
  DB.initTable('offers', defaultOffers);
  DB.initTable('coupons', defaultCoupons);

  // ========== Router Helper ==========
  const routes = [];

  function addRoute(method, pathPattern, handler) {
    // Convert path to regex (e.g. /api/services/:id => ^/api/services/([^/]+)$)
    const regexSource = pathPattern
      .replace(/\/:[^\/]+/g, '/([^/]+)')
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${regexSource}(?:\\?.*)?$`);
    
    // Extract parameter names (e.g., :id)
    const paramNames = (pathPattern.match(/:[^\/]+/g) || []).map(p => p.slice(1));

    routes.push({ method: method.toUpperCase(), regex, paramNames, handler });
  }

  // Helper to make Response compatible
  function jsonResponse(status, body) {
    return new Response(JSON.stringify(body), {
      status: status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // ========== API Endpoints Definitions ==========

  // --- AUTH ---
  addRoute('POST', '/api/auth/login', (params, body) => {
    const { email, username, password } = body;
    const admins = DB.get('admins') || defaultAdmins;
    const admin = admins.find(a => 
      (a.email === email || a.username === username) && a.password === password
    );

    if (admin) {
      const session = {
        email: admin.email,
        username: admin.username,
        role: admin.role,
        loginTime: Date.now()
      };
      localStorage.setItem('svip-auth', JSON.stringify(session));
      return jsonResponse(200, { success: true, user: session });
    } else {
      return jsonResponse(400, { success: false, message: 'Invalid credentials' });
    }
  });

  addRoute('POST', '/api/auth/logout', () => {
    localStorage.removeItem('svip-auth');
    return jsonResponse(200, { success: true });
  });

  addRoute('GET', '/api/auth/session', () => {
    let session = JSON.parse(localStorage.getItem('svip-auth') || 'null');
    const admins = DB.get('admins') || defaultAdmins;
    if (!session) {
      const owner = admins.find(a => a.role === 'owner') || admins[0];
      session = {
        email: owner.email,
        username: owner.username,
        role: owner.role,
        loginTime: Date.now()
      };
      localStorage.setItem('svip-auth', JSON.stringify(session));
    }
    const fullAdmin = admins.find(a => a.username === session.username || a.email === session.email) || admins[0];
    return jsonResponse(200, { authenticated: true, user: fullAdmin });
  });

  addRoute('PUT', '/api/auth/change-password', (params, body) => {
    const session = JSON.parse(localStorage.getItem('svip-auth') || 'null');
    if (!session) return jsonResponse(401, { message: 'Unauthorized' });

    const admins = DB.get('admins') || defaultAdmins;
    const index = admins.findIndex(a => a.username === session.username || a.email === session.email);
    
    if (index === -1) return jsonResponse(404, { message: 'Admin not found' });
    if (admins[index].password !== body.currentPassword) {
      return jsonResponse(400, { message: 'كلمة المرور الحالية غير صحيحة' });
    }

    admins[index].password = body.newPassword;
    if (body.name) admins[index].name = body.name;
    DB.set('admins', admins);
    return jsonResponse(200, { success: true, message: 'تم تحديث كلمة المرور بنجاح' });
  });

  // --- ADMINS MANAGEMENT & PERMISSIONS ---
  addRoute('GET', '/api/admins', () => {
    const admins = DB.get('admins') || defaultAdmins;
    const sanitized = admins.map(a => ({
      id: a.id,
      name: a.name || a.username,
      username: a.username,
      email: a.email,
      role: a.role || 'admin',
      permissions: a.permissions || {
        website: true, services: true, offers: true, users: true, complaints: true, orders: true, settings: true, admins: false
      }
    }));
    return jsonResponse(200, sanitized);
  });

  addRoute('POST', '/api/admins', (params, body) => {
    const admins = DB.get('admins') || defaultAdmins;
    if (!body.username || !body.password) {
      return jsonResponse(400, { message: 'المستخدم وكلمة المرور مطلوبان' });
    }

    const newAdmin = {
      id: Date.now(),
      name: body.name || body.username,
      username: body.username,
      email: body.email || body.username,
      password: body.password,
      role: body.role || 'admin',
      permissions: body.permissions || {
        website: true, services: true, offers: true, users: true, complaints: true, orders: true, settings: false, admins: false
      }
    };

    admins.push(newAdmin);
    DB.set('admins', admins);
    return jsonResponse(201, newAdmin);
  });

  addRoute('PUT', '/api/admins/:id', (params, body) => {
    const admins = DB.get('admins') || defaultAdmins;
    const index = admins.findIndex(a => a.id === parseInt(params.id));
    if (index === -1) return jsonResponse(404, { message: 'Admin not found' });

    admins[index] = {
      ...admins[index],
      name: body.name !== undefined ? body.name : admins[index].name,
      username: body.username || admins[index].username,
      email: body.email || admins[index].email,
      password: body.password ? body.password : admins[index].password,
      role: body.role || admins[index].role,
      permissions: body.permissions !== undefined ? body.permissions : admins[index].permissions
    };

    DB.set('admins', admins);
    return jsonResponse(200, admins[index]);
  });

  addRoute('DELETE', '/api/admins/:id', (params) => {
    let admins = DB.get('admins') || defaultAdmins;
    const target = admins.find(a => a.id === parseInt(params.id));
    if (!target) return jsonResponse(404, { message: 'Admin not found' });
    if (target.role === 'owner' || target.id === 1) {
      return jsonResponse(400, { message: 'لا يمكن حذف حساب مدير النظام الرئيسي' });
    }

    admins = admins.filter(a => a.id !== parseInt(params.id));
    DB.set('admins', admins);
    return jsonResponse(200, { success: true });
  });

  // --- STATS (Overview) ---
  addRoute('GET', '/api/stats', () => {
    const orders = DB.get('orders') || [];
    const users = DB.get('users') || [];
    const complaints = DB.get('complaints') || [];
    
    const totalSales = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalOrders = orders.length;
    const totalUsers = users.length;
    const totalComplaints = complaints.length;

    // Relational mapping for recent orders
    const services = DB.get('services') || [];
    const recentOrders = orders.slice(-5).reverse().map(o => {
      const user = users.find(u => u.id === o.userId) || { name: 'Unknown', nameEn: 'Unknown' };
      const service = services.find(s => s.id === o.serviceId) || { nameAr: 'Unknown', nameEn: 'Unknown' };
      return {
        id: o.id,
        userNameAr: user.name,
        userNameEn: user.nameEn,
        serviceNameAr: service.nameAr,
        serviceNameEn: service.nameEn,
        amount: o.amount,
        status: o.status,
        date: o.date
      };
    });

    return jsonResponse(200, {
      totalSales,
      totalOrders,
      totalUsers,
      totalComplaints,
      recentOrders,
      chartData: [65, 45, 78, 52, 90, 68, 85, 72, 95, 88, 76, 92] // Simulated revenue metrics
    });
  });

  // --- SERVICES CRUD ---
  addRoute('GET', '/api/services', (params, body, url) => {
    const services = DB.get('services') || [];
    const categories = DB.get('categories') || [];
    
    // JOIN Categories & calculate prices
    const results = services.map(s => {
      const cat = categories.find(c => c.id === s.categoryId) || {};
      const origPrice = parseFloat(s.originalPrice || s.price);
      const activeDiscount = parseInt(s.discount || 0);
      const finalPrice = activeDiscount > 0 
        ? Math.round((origPrice * (1 - activeDiscount / 100)) * 100) / 100 
        : origPrice;

      return {
        ...s,
        originalPrice: origPrice,
        price: finalPrice,
        discount: activeDiscount,
        categoryAr: cat.nameAr || 'غير محدد',
        categoryEn: cat.nameEn || 'Unassigned',
        category: cat.slug || 'other'
      };
    });

    // Check query params if any
    const searchParams = new URL(url, 'http://localhost').searchParams;
    const catFilter = searchParams.get('category');
    const searchVal = searchParams.get('q');
    
    let filtered = results;
    if (catFilter && catFilter !== 'all') {
      filtered = filtered.filter(s => s.category === catFilter);
    }
    if (searchVal) {
      const term = searchVal.toLowerCase();
      filtered = filtered.filter(s => 
        s.nameAr.toLowerCase().includes(term) || 
        s.nameEn.toLowerCase().includes(term) ||
        s.descAr.toLowerCase().includes(term) ||
        s.descEn.toLowerCase().includes(term)
      );
    }

    return jsonResponse(200, filtered);
  });

  addRoute('GET', '/api/services/:id', (params) => {
    const services = DB.get('services') || [];
    const service = services.find(s => s.id === parseInt(params.id));
    if (service) {
      const origPrice = parseFloat(service.originalPrice || service.price);
      const activeDiscount = parseInt(service.discount || 0);
      const finalPrice = activeDiscount > 0 
        ? Math.round((origPrice * (1 - activeDiscount / 100)) * 100) / 100 
        : origPrice;

      return jsonResponse(200, {
        ...service,
        originalPrice: origPrice,
        price: finalPrice,
        discount: activeDiscount
      });
    }
    return jsonResponse(404, { message: 'Service not found' });
  });

  addRoute('POST', '/api/services', (params, body) => {
    const services = DB.get('services') || [];
    
    // Add validation
    if (!body.nameAr || !body.nameEn || !body.price) {
      return jsonResponse(400, { message: 'Missing required fields' });
    }

    const newService = {
      id: Date.now(),
      image: body.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop',
      nameAr: body.nameAr,
      nameEn: body.nameEn,
      descAr: body.descAr || '',
      descEn: body.descEn || '',
      categoryId: parseInt(body.categoryId) || 1,
      originalPrice: parseFloat(body.originalPrice) || parseFloat(body.price),
      price: parseFloat(body.price),
      discount: parseInt(body.discount) || 0,
      durationMonths: parseInt(body.durationMonths) || 1,
      inStock: body.inStock !== undefined ? (body.inStock === true || body.inStock === 'true') : true,
      hidden: body.hidden !== undefined ? (body.hidden === true || body.hidden === 'true') : false,
      rating: 5.0,
      featured: body.featured === true || body.featured === 'true'
    };

    services.push(newService);
    DB.set('services', services);
    return jsonResponse(201, newService);
  });

  addRoute('PUT', '/api/services/:id', (params, body) => {
    const services = DB.get('services') || [];
    const index = services.findIndex(s => s.id === parseInt(params.id));
    
    if (index === -1) {
      return jsonResponse(404, { message: 'Service not found' });
    }

    const updated = {
      ...services[index],
      nameAr: body.nameAr || services[index].nameAr,
      nameEn: body.nameEn || services[index].nameEn,
      descAr: body.descAr !== undefined ? body.descAr : services[index].descAr,
      descEn: body.descEn !== undefined ? body.descEn : services[index].descEn,
      image: body.image || services[index].image,
      categoryId: body.categoryId !== undefined ? (parseInt(body.categoryId) || null) : services[index].categoryId,
      originalPrice: parseFloat(body.originalPrice) || services[index].originalPrice,
      price: parseFloat(body.price) || services[index].price,
      discount: body.discount !== undefined ? parseInt(body.discount) : services[index].discount,
      durationMonths: body.durationMonths !== undefined ? parseInt(body.durationMonths) : (services[index].durationMonths || 1),
      inStock: body.inStock !== undefined ? (body.inStock === true || body.inStock === 'true') : (services[index].inStock !== false),
      hidden: body.hidden !== undefined ? (body.hidden === true || body.hidden === 'true') : (services[index].hidden === true),
      featured: body.featured !== undefined ? (body.featured === true || body.featured === 'true') : services[index].featured
    };

    services[index] = updated;
    DB.set('services', services);
    return jsonResponse(200, updated);
  });

  addRoute('DELETE', '/api/services/:id', (params) => {
    const services = DB.get('services') || [];
    const filtered = services.filter(s => s.id !== parseInt(params.id));
    
    if (services.length === filtered.length) {
      return jsonResponse(404, { message: 'Service not found' });
    }

    DB.set('services', filtered);
    return jsonResponse(200, { success: true });
  });

  // --- OFFERS ---
  addRoute('GET', '/api/offers', () => {
    const services = DB.get('services') || [];
    const categories = DB.get('categories') || [];
    const offers = services.filter(s => s.discount && s.discount > 0).map(s => {
      const cat = categories.find(c => c.id === s.categoryId) || {};
      const origPrice = parseFloat(s.originalPrice || s.price);
      const finalPrice = Math.round((origPrice * (1 - s.discount / 100)) * 100) / 100;
      return {
        ...s,
        originalPrice: origPrice,
        price: finalPrice,
        categoryAr: cat.nameAr || 'غير محدد',
        categoryEn: cat.nameEn || 'Unassigned',
        category: cat.slug || 'other'
      };
    });
    return jsonResponse(200, offers);
  });

  // --- USERS CRUD ---
  addRoute('GET', '/api/users', () => {
    const users = DB.get('users') || [];
    return jsonResponse(200, users);
  });

  addRoute('PUT', '/api/users/:id/status', (params, body) => {
    const users = DB.get('users') || [];
    const user = users.find(u => u.id === parseInt(params.id));
    
    if (!user) return jsonResponse(404, { message: 'User not found' });

    user.status = body.status || (user.status === 'active' ? 'suspended' : 'active');
    DB.set('users', users);
    return jsonResponse(200, user);
  });

  addRoute('DELETE', '/api/users/:id', (params) => {
    const users = DB.get('users') || [];
    const filtered = users.filter(u => u.id !== parseInt(params.id));
    if (users.length === filtered.length) return jsonResponse(404, { message: 'User not found' });
    
    DB.set('users', filtered);
    return jsonResponse(200, { success: true });
  });

  // --- ORDERS CRUD ---
  addRoute('GET', '/api/orders', () => {
    const orders = DB.get('orders') || [];
    const users = DB.get('users') || [];
    const services = DB.get('services') || [];
    const result = orders.map(o => {
      const user = users.find(u => u.id === o.userId) || { name: 'زائر / Guest', email: '-', phone: '-' };
      const service = services.find(s => s.id === o.serviceId) || { nameAr: 'خدمة محذوفة', nameEn: 'Deleted Service' };
      return {
        ...o,
        userName: o.buyerName || user.name,
        userPhone: o.buyerPhone || user.phone,
        serviceNameAr: service.nameAr,
        serviceNameEn: service.nameEn
      };
    });
    return jsonResponse(200, result);
  });

  addRoute('POST', '/api/orders', (params, body) => {
    const orders = DB.get('orders') || [];
    if (!body.serviceId || !body.buyerName || !body.buyerPhone) {
      return jsonResponse(400, { message: 'Missing fields' });
    }
    const isOfferOrder = !!body.isOffer || body.orderType === 'offer' || (parseFloat(body.discount) > 0);
    const newOrder = {
      id: Date.now(),
      userId: body.userId || null,
      buyerName: body.buyerName,
      buyerPhone: body.buyerPhone,
      serviceId: parseInt(body.serviceId),
      serviceName: body.serviceName || '',
      amount: parseFloat(body.amount) || 0.0,
      originalPrice: parseFloat(body.originalPrice) || parseFloat(body.amount) || 0.0,
      discount: isOfferOrder ? (parseFloat(body.discount) || 0) : 0,
      isOffer: isOfferOrder,
      orderType: isOfferOrder ? 'offer' : 'service',
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    orders.push(newOrder);
    DB.set('orders', orders);

    // Notification trigger
    const notifications = DB.get('notifications') || [];
    notifications.push({
      id: Date.now() + 1,
      titleAr: "طلب شراء جديد",
      titleEn: "New Purchase Order",
      messageAr: `طلب شراء جديد من ${body.buyerName} لخدمة ${body.serviceName || 'رقمية'}`,
      messageEn: `New order placed by ${body.buyerName} for service ${body.serviceName || 'digital'}`,
      type: "order",
      date: new Date().toISOString(),
      read: false
    });
    DB.set('notifications', notifications);
    return jsonResponse(201, newOrder);
  });

  addRoute('PUT', '/api/orders/:id/status', (params, body) => {
    const orders = DB.get('orders') || [];
    const index = orders.findIndex(o => o.id === parseInt(params.id));
    if (index === -1) return jsonResponse(404, { message: 'Order not found' });
    orders[index].status = body.status || (orders[index].status === 'active' ? 'pending' : 'active');
    DB.set('orders', orders);
    return jsonResponse(200, orders[index]);
  });

  addRoute('DELETE', '/api/orders/:id', (params) => {
    const orders = DB.get('orders') || [];
    const filtered = orders.filter(o => o.id !== parseInt(params.id));
    if (orders.length === filtered.length) return jsonResponse(404, { message: 'Order not found' });
    DB.set('orders', filtered);
    return jsonResponse(200, { success: true });
  });

  // --- COUPONS CRUD & VALIDATION ---
  addRoute('GET', '/api/coupons', () => {
    const coupons = DB.get('coupons') || [];
    return jsonResponse(200, coupons);
  });

  addRoute('POST', '/api/coupons', (params, body) => {
    const coupons = DB.get('coupons') || [];
    if (!body.code || !body.discountValue) {
      return jsonResponse(400, { message: 'كود الكوبون وقيمة الخصم مطلوبان' });
    }

    const codeUpper = body.code.trim().toUpperCase();
    if (coupons.some(c => c.code.toUpperCase() === codeUpper)) {
      return jsonResponse(400, { message: 'كود الكوبون موجود بالفعل' });
    }

    const newCoupon = {
      id: Date.now(),
      code: codeUpper,
      discountType: body.discountType || 'percent',
      discountValue: parseFloat(body.discountValue) || 0,
      maxUses: parseInt(body.maxUses) || 100,
      usedCount: 0,
      expiryDate: body.expiryDate || '2026-12-31',
      active: body.active !== undefined ? !!body.active : true
    };

    coupons.push(newCoupon);
    DB.set('coupons', coupons);
    return jsonResponse(201, newCoupon);
  });

  addRoute('PUT', '/api/coupons/:id', (params, body) => {
    const coupons = DB.get('coupons') || [];
    const index = coupons.findIndex(c => c.id === parseInt(params.id));
    if (index === -1) return jsonResponse(404, { message: 'Coupon not found' });

    if (body.active !== undefined) coupons[index].active = !!body.active;
    if (body.code) coupons[index].code = body.code.trim().toUpperCase();
    if (body.discountType) coupons[index].discountType = body.discountType;
    if (body.discountValue) coupons[index].discountValue = parseFloat(body.discountValue);
    if (body.maxUses) coupons[index].maxUses = parseInt(body.maxUses);
    if (body.expiryDate) coupons[index].expiryDate = body.expiryDate;

    DB.set('coupons', coupons);
    return jsonResponse(200, coupons[index]);
  });

  addRoute('DELETE', '/api/coupons/:id', (params) => {
    const coupons = DB.get('coupons') || [];
    const filtered = coupons.filter(c => c.id !== parseInt(params.id));
    if (coupons.length === filtered.length) return jsonResponse(404, { message: 'Coupon not found' });
    DB.set('coupons', filtered);
    return jsonResponse(200, { success: true });
  });

  addRoute('POST', '/api/coupons/validate', (params, body) => {
    const coupons = DB.get('coupons') || [];
    const inputCode = (body.code || '').trim().toUpperCase();
    const origPrice = parseFloat(body.amount) || 0;

    if (!inputCode) {
      return jsonResponse(400, { valid: false, message: 'يرجى إدخال كود الكوبون' });
    }

    const coupon = coupons.find(c => c.code.toUpperCase() === inputCode);

    if (!coupon) {
      return jsonResponse(404, { valid: false, message: 'كوبون الخصم غير موجود' });
    }

    if (!coupon.active) {
      return jsonResponse(400, { valid: false, message: 'كوبون الخصم غير غير فعال حالياً' });
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return jsonResponse(400, { valid: false, message: 'تم استنفاد الحد الأقصى لاستخدام هذا الكوبون' });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate).getTime() < Date.now()) {
      return jsonResponse(400, { valid: false, message: 'كوبون الخصم منتهي الصلاحية' });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percent') {
      discountAmount = Math.round((origPrice * (coupon.discountValue / 100)) * 100) / 100;
    } else {
      discountAmount = Math.min(origPrice, coupon.discountValue);
    }

    const finalAmount = Math.max(0, Math.round((origPrice - discountAmount) * 100) / 100);

    return jsonResponse(200, {
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: discountAmount,
      finalAmount: finalAmount,
      message: `تم تطبيق كود الخصم (${coupon.code}) بنجاح!`
    });
  });

  // --- COMPLAINTS CRUD ---
  addRoute('GET', '/api/complaints', () => {
    const complaints = DB.get('complaints') || [];
    return jsonResponse(200, complaints);
  });

  addRoute('POST', '/api/complaints', (params, body) => {
    const complaints = DB.get('complaints') || [];
    
    if (!body.name || !body.email || !body.subject || !body.details) {
      return jsonResponse(400, { message: 'Missing fields' });
    }

    const newComplaint = {
      id: Date.now(),
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      orderNumber: body.orderNumber || '',
      subject: body.subject,
      details: body.details,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      reply: ''
    };

    complaints.push(newComplaint);
    DB.set('complaints', complaints);

    // Relational action: push notification for admin
    const notifications = DB.get('notifications') || [];
    notifications.push({
      id: Date.now() + 1,
      titleAr: "شكوى جديدة",
      titleEn: "New Complaint",
      messageAr: `تم إرسال شكوى جديدة من ${body.name} بخصوص "${body.subject}"`,
      messageEn: `New complaint submitted by ${body.name} regarding "${body.subject}"`,
      type: "complaint",
      date: new Date().toISOString(),
      read: false
    });
    DB.set('notifications', notifications);

    return jsonResponse(201, newComplaint);
  });

  addRoute('PUT', '/api/complaints/:id/reply', (params, body) => {
    const complaints = DB.get('complaints') || [];
    const complaint = complaints.find(c => c.id === parseInt(params.id));
    
    if (!complaint) return jsonResponse(404, { message: 'Complaint not found' });

    complaint.reply = body.reply || '';
    complaint.status = body.status || 'resolved';
    
    DB.set('complaints', complaints);
    return jsonResponse(200, complaint);
  });

  // --- SETTINGS (CONFIG) ---
  addRoute('GET', '/api/settings', () => {
    const config = DB.get('config') || defaultSettings;
    return jsonResponse(200, config);
  });

  addRoute('PUT', '/api/settings', (params, body) => {
    const current = DB.get('config') || defaultSettings;
    const updated = {
      siteName: body.siteName || current.siteName,
      siteDesc: body.siteDesc !== undefined ? body.siteDesc : current.siteDesc,
      siteLogo: body.siteLogo !== undefined ? body.siteLogo : current.siteLogo,
      primaryColor: body.primaryColor || current.primaryColor,
      secondaryColor: body.secondaryColor || current.secondaryColor,
      heroTitle: body.heroTitle !== undefined ? body.heroTitle : current.heroTitle,
      heroSubtitle: body.heroSubtitle !== undefined ? body.heroSubtitle : current.heroSubtitle,
      whatsapp: body.whatsapp !== undefined ? body.whatsapp : current.whatsapp,
      phone: body.phone !== undefined ? body.phone : current.phone,
      email: body.email !== undefined ? body.email : current.email,
      address: body.address !== undefined ? body.address : (current.address || "المملكة العربية السعودية - الرياض"),
      telegram: body.telegram !== undefined ? body.telegram : (current.telegram || "https://t.me/servicevip"),
      facebook: body.facebook !== undefined ? body.facebook : (current.facebook || "https://facebook.com"),
      instagram: body.instagram !== undefined ? body.instagram : (current.instagram || "https://instagram.com"),
      twitter: body.twitter !== undefined ? body.twitter : (current.twitter || "https://twitter.com"),
      currency: body.currency !== undefined ? body.currency : current.currency,
      offerBadge: body.offerBadge !== undefined ? body.offerBadge : (current.offerBadge || "عرض لفترة محدودة!"),
      offerTitle: body.offerTitle !== undefined ? body.offerTitle : (current.offerTitle || "خصومات تصل إلى 70% على جميع الخدمات"),
      offerDesc: body.offerDesc !== undefined ? body.offerDesc : (current.offerDesc || "لا تفوت فرصة الحصول على أفضل الخدمات الرقمية بأسعار لا تُقاوم. العرض ساري لفترة محدودة!"),
      offerDays: body.offerDays !== undefined ? parseInt(body.offerDays) : (current.offerDays !== undefined ? current.offerDays : 7),
      offerHours: body.offerHours !== undefined ? parseInt(body.offerHours) : (current.offerHours !== undefined ? current.offerHours : 0),
      offerMinutes: body.offerMinutes !== undefined ? parseInt(body.offerMinutes) : (current.offerMinutes !== undefined ? current.offerMinutes : 0),
      offerCountdownEnd: body.offerCountdownEnd !== undefined ? body.offerCountdownEnd : (current.offerCountdownEnd || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
      offerCountdownActive: body.offerCountdownActive !== undefined ? (body.offerCountdownActive === true || body.offerCountdownActive === 'true') : (current.offerCountdownActive !== false)
    };
    DB.set('config', updated);
    return jsonResponse(200, updated);
  });

  // --- CATEGORIES ---
  addRoute('GET', '/api/categories', () => {
    const categories = DB.get('categories') || [];
    return jsonResponse(200, categories);
  });

  addRoute('POST', '/api/categories', (params, body) => {
    const categories = DB.get('categories') || [];
    if (!body.nameAr || !body.nameEn) {
      return jsonResponse(400, { message: 'Name AR and EN are required' });
    }
    const newCat = {
      id: Date.now(),
      nameAr: body.nameAr,
      nameEn: body.nameEn,
      slug: body.slug || body.nameEn.toLowerCase().replace(/\s+/g, '-')
    };
    categories.push(newCat);
    DB.set('categories', categories);
    return jsonResponse(201, newCat);
  });

  addRoute('PUT', '/api/categories/:id', (params, body) => {
    const categories = DB.get('categories') || [];
    const index = categories.findIndex(c => c.id === parseInt(params.id));
    if (index === -1) return jsonResponse(404, { message: 'Category not found' });
    categories[index] = {
      ...categories[index],
      nameAr: body.nameAr || categories[index].nameAr,
      nameEn: body.nameEn || categories[index].nameEn,
      slug: body.slug || categories[index].slug
    };
    DB.set('categories', categories);
    return jsonResponse(200, categories[index]);
  });

  addRoute('DELETE', '/api/categories/:id', (params) => {
    const categories = DB.get('categories') || [];
    const filtered = categories.filter(c => c.id !== parseInt(params.id));
    if (categories.length === filtered.length) return jsonResponse(404, { message: 'Category not found' });
    // Remove categoryId from services that used this category
    const services = DB.get('services') || [];
    services.forEach(s => { if (s.categoryId === parseInt(params.id)) s.categoryId = null; });
    DB.set('services', services);
    DB.set('categories', filtered);
    return jsonResponse(200, { success: true });
  });

  // --- REVIEWS ---
  addRoute('GET', '/api/reviews', () => {
    const reviews = DB.get('reviews') || [];
    return jsonResponse(200, reviews);
  });

  // --- NOTIFICATIONS ---
  addRoute('GET', '/api/notifications', () => {
    const notifications = DB.get('notifications') || [];
    return jsonResponse(200, notifications);
  });

  addRoute('POST', '/api/notifications/read', () => {
    const notifications = DB.get('notifications') || [];
    notifications.forEach(n => n.read = true);
    DB.set('notifications', notifications);
    return jsonResponse(200, { success: true });
  });

  // ========== Intercept Request Router ==========
  async function handleSimulatedRequest(urlStr, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    
    // Parse URL path
    let path = urlStr;
    if (urlStr.startsWith('http')) {
      const urlObj = new URL(urlStr);
      path = urlObj.pathname;
    }

    // Find matching route
    const route = routes.find(r => r.method === method && r.regex.test(path));
    
    if (!route) {
      return jsonResponse(404, { message: `Simulated backend endpoint not found: ${method} ${path}` });
    }

    // Extract dynamic route parameters
    const match = path.match(route.regex);
    const params = {};
    if (match) {
      route.paramNames.forEach((name, index) => {
        params[name] = decodeURIComponent(match[index + 1]);
      });
    }

    // Extract request body
    let body = {};
    if (options.body) {
      try {
        if (typeof options.body === 'string') {
          body = JSON.parse(options.body);
        } else if (options.body instanceof FormData) {
          body = Object.fromEntries(options.body.entries());
        }
      } catch (e) {
        console.error("Simulated API: Failed to parse body", e);
      }
    }

    // Process request handler
    try {
      console.log(`[Simulated Server] ${method} ${path}`, { params, body });
      
      // Artificial slight network latency (150ms - 300ms) for realistic UX
      await new Promise(r => setTimeout(r, 150 + Math.random() * 150));
      
      const response = route.handler(params, body, urlStr);
      return response;
    } catch (err) {
      console.error("[Simulated Server Error]", err);
      return jsonResponse(500, { message: 'Internal Server Error', error: err.message });
    }
  }

  // ========== Global fetch override ==========
  const originalFetch = window.fetch;
  window.fetch = async function(url, options) {
    const urlStr = typeof url === 'string' ? url : (url.url || url.toString());
    if (urlStr.includes('/api/')) {
      return handleSimulatedRequest(urlStr, options);
    }
    return originalFetch.apply(this, arguments);
  };

  console.log("Service VIP Relational Database & API Interceptor initialized.");
})();
