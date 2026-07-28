/* ============================================
   Service VIP - Admin Dashboard (Rebuilt Clean)
   ============================================ */

// ========== State ==========
const AdminState = {
  currentSection: 'overview',
  lang: localStorage.getItem('svip-lang') || 'ar',
  categories: [],
  currentUser: null,
  currency: 'ج.م'
};

// ========== Translations ==========
const T = {
  ar: {
    dashboard:'لوحة التحكم', overview:'نظرة عامة', websiteManagement:'إدارة الموقع',
    servicesManagement:'إدارة المنتجات', offersManagement:'إدارة الخصومات والعروض', couponsManagement:'كوبونات الخصم',
    usersManagement:'إدارة المستخدمين', complaintsManagement:'إدارة الشكاوى',
    ordersManagement:'إدارة الطلبات', settings:'الإعدادات',
    adminsManagement:'إدارة المشرفين والصلاحيات', logout:'تسجيل الخروج',
    totalSales:'إجمالي المبيعات', totalOrders:'إجمالي الطلبات',
    totalUsers:'إجمالي المستخدمين', totalComplaints:'إجمالي الشكاوى',
    revenueStats:'إحصائيات الإيرادات', recentOrders:'الطلبات الأخيرة',
    search:'بحث...', addService:'إضافة منتج', addOffer:'تطبيق خصم جديد',
    edit:'تعديل', delete:'حذف', save:'حفظ', cancel:'إلغاء',
    serviceName:'اسم المنتج', servicePrice:'السعر', serviceDesc:'وصف المنتج',
    category:'الفئة', status:'الحالة', actions:'الإجراءات',
    active:'نشط', pending:'معلق', suspended:'موقوف', resolved:'تم الحل',
    completed:'مكتمل', cancelled:'ملغي',
    reply:'الرد', viewAll:'عرض الكل', websiteName:'اسم الموقع',
    primaryColor:'اللون الأساسي', secondaryColor:'اللون الثانوي',
    homeContent:'محتوى الصفحة الرئيسية', general:'عام',
    welcomeBack:'مرحباً بعودتك', dashboardDesc:'إليك نظرة سريعة على أداء موقعك',
    thisMonth:'هذا الشهر', lastMonth:'الشهر الماضي',
    id:'المعرف', customerName:'اسم العميل', date:'التاريخ',
    noData:'لا توجد بيانات', error:'حدث خطأ', retry:'إعادة المحاولة',
    changePassword:'تغيير كلمة المرور', backupRestore:'النسخ الاحتياطي',
    duration:'المدة', image:'الصورة', discount:'نسبة الخصم %',
    original:'السعر الأصلي', discounted:'السعر بعد الخصم'
  },
  en: {
    dashboard:'Dashboard', overview:'Overview', websiteManagement:'Website Management',
    servicesManagement:'Products Management', offersManagement:'Discounts & Offers', couponsManagement:'Discount Coupons',
    usersManagement:'Users Management', complaintsManagement:'Complaints',
    ordersManagement:'Orders', settings:'Settings',
    adminsManagement:'Admins & Permissions', logout:'Logout',
    totalSales:'Total Sales', totalOrders:'Total Orders',
    totalUsers:'Total Users', totalComplaints:'Total Complaints',
    revenueStats:'Revenue Statistics', recentOrders:'Recent Orders',
    search:'Search...', addService:'Add Product', addOffer:'Apply Discount',
    edit:'Edit', delete:'Delete', save:'Save', cancel:'Cancel',
    serviceName:'Product Name', servicePrice:'Price', serviceDesc:'Description',
    category:'Category', status:'Status', actions:'Actions',
    active:'Active', pending:'Pending', suspended:'Suspended', resolved:'Resolved',
    completed:'Completed', cancelled:'Cancelled',
    reply:'Reply', viewAll:'View All', websiteName:'Website Name',
    primaryColor:'Primary Color', secondaryColor:'Secondary Color',
    homeContent:'Homepage Content', general:'General',
    welcomeBack:'Welcome Back', dashboardDesc:'Quick overview of your site performance',
    thisMonth:'This Month', lastMonth:'Last Month',
    id:'ID', customerName:'Customer', date:'Date',
    noData:'No data available', error:'Error occurred', retry:'Retry',
    changePassword:'Change Password', backupRestore:'Backup & Restore',
    duration:'Duration', image:'Image', discount:'Discount %',
    original:'Original Price', discounted:'Discounted Price'
  }
};
function t(k){ return T[AdminState.lang]?.[k] || k; }
function fmtNum(n){ return Number(n).toLocaleString(); }
function fmtDuration(m) {
  if (!m) return '';
  if (m === 1) return AdminState.lang==='ar' ? 'شهر واحد' : '1 Month';
  if (m === 12) return AdminState.lang==='ar' ? 'سنة' : '1 Year';
  if (m === 24) return AdminState.lang==='ar' ? 'سنتان' : '2 Years';
  if (m < 12) return AdminState.lang==='ar' ? m+' أشهر' : m+' Months';
  return AdminState.lang==='ar' ? m+' شهر' : m+' Months';
}

// ========== Boot ==========
document.addEventListener('DOMContentLoaded', boot);
async function boot() {
  try {
    // 1. Auth
    const sRes = await fetch('/api/auth/session');
    const sData = await sRes.json();
    if (!sData.authenticated) { location.href='../login.html'; return; }
    AdminState.currentUser = sData.user;
    document.querySelector('.admin-user-name').textContent = sData.user.name || sData.user.username;

    // 2. Config
    const cRes = await fetch('/api/settings');
    if (cRes.ok) {
      const cfg = await cRes.json();
      AdminState.currency = cfg.currency || 'ج.م';
      if (cfg.siteName) document.querySelectorAll('.admin-sidebar-title').forEach(e=>e.textContent=cfg.siteName);
    }

    // 3. Categories
    const catRes = await fetch('/api/categories');
    if (catRes.ok) AdminState.categories = await catRes.json();

    // 4. Apply lang & theme
    applyLang(AdminState.lang);
    document.documentElement.setAttribute('data-theme','dark');

    // 5. Wire sidebar & topbar
    wireSidebar();
    wireTopbar();

    // 6. Permissions
    if (AdminState.currentUser.role !== 'owner') {
      const p = AdminState.currentUser.permissions || {};
      document.querySelectorAll('.admin-nav-link[data-section]').forEach(link => {
        const sec = link.dataset.section;
        if (sec !== 'overview' && p[sec] === false) link.style.display = 'none';
      });
    }

    // 7. Load overview
    await loadSection('overview');

    // 8. Modal close
    document.getElementById('admin-modal-overlay')?.addEventListener('click', closeModal);

  } catch(e) {
    console.error('Admin boot error:', e);
  }
}

// ========== Language ==========
function applyLang(lang) {
  AdminState.lang = lang;
  localStorage.setItem('svip-lang', lang);
  document.documentElement.setAttribute('dir', lang==='ar'?'rtl':'ltr');
  document.documentElement.setAttribute('lang', lang);
  document.querySelectorAll('[data-translate-admin]').forEach(el => {
    const k = el.getAttribute('data-translate-admin');
    if (T[lang]?.[k]) el.textContent = T[lang][k];
  });
  document.querySelectorAll('[data-translate-admin-placeholder]').forEach(el => {
    const k = el.getAttribute('data-translate-admin-placeholder');
    if (T[lang]?.[k]) el.placeholder = T[lang][k];
  });
}
function toggleAdminLang() {
  applyLang(AdminState.lang==='ar'?'en':'ar');
  loadSection(AdminState.currentSection);
}

// ========== Sidebar & Topbar ==========
function wireSidebar() {
  document.querySelectorAll('.admin-nav-link[data-section]').forEach(link => {
    link.addEventListener('click', async e => {
      e.preventDefault();
      document.querySelectorAll('.admin-nav-link[data-section]').forEach(l=>l.classList.remove('active'));
      link.classList.add('active');
      await loadSection(link.dataset.section);
      if (window.innerWidth<=1200) toggleSidebar();
    });
  });
}
function wireTopbar() {
  document.querySelector('.admin-sidebar-toggle')?.addEventListener('click', toggleSidebar);
  document.querySelector('.admin-sidebar-close')?.addEventListener('click', toggleSidebar);
}
function toggleSidebar() {
  document.querySelector('.admin-sidebar')?.classList.toggle('open');
}

// ========== Section Router ==========
async function loadSection(section) {
  AdminState.currentSection = section;
  const c = document.querySelector('.admin-content');
  if (!c) return;
  c.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;min-height:300px;"><i class="fas fa-circle-notch fa-spin" style="font-size:2rem;color:var(--primary);"></i></div>`;
  try {
    switch(section) {
      case 'overview': await renderOverview(c); break;
      case 'website': await renderWebsite(c); break;
      case 'services': await renderServices(c); break;
      case 'offers': await renderOffers(c); break;
      case 'coupons': await renderCoupons(c); break;
      case 'users': await renderUsers(c); break;
      case 'complaints': await renderComplaints(c); break;
      case 'orders': await renderOrders(c); break;
      case 'settings': await renderSettings(c); break;
      case 'admins': await renderAdmins(c); break;
      default: await renderOverview(c);
    }
  } catch(e) {
    console.error('Section error:', e);
    c.innerHTML = `<div class="glass-card" style="padding:2rem;text-align:center;max-width:500px;margin:2rem auto;">
      <i class="fas fa-exclamation-triangle" style="font-size:2.5rem;color:#ef4444;display:block;margin-bottom:1rem;"></i>
      <p style="color:var(--text-muted);margin-bottom:1rem;">${e.message}</p>
      <button class="btn btn-primary" onclick="loadSection('${section}')"><i class="fas fa-redo"></i> ${t('retry')}</button>
    </div>`;
  }
}

// ========== Modal ==========
function openModal(title, bodyHTML) {
  document.getElementById('admin-modal-title').textContent = title;
  document.getElementById('admin-modal-body').innerHTML = bodyHTML;
  document.getElementById('admin-modal').classList.add('active');
  document.getElementById('admin-modal-overlay').classList.add('active');
}
function closeModal() {
  document.getElementById('admin-modal').classList.remove('active');
  document.getElementById('admin-modal-overlay').classList.remove('active');
}

// ========== Notification ==========
function notify(type, msg) {
  const c = document.querySelector('.notifications-container');
  const n = document.createElement('div');
  n.className = `notification ${type}`;
  n.innerHTML = `<div class="notification-content"><i class="fas fa-${type==='success'?'check-circle':'exclamation-circle'}"></i><span>${msg}</span></div><button class="notification-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
  c.appendChild(n);
  setTimeout(()=>n.classList.add('show'), 10);
  setTimeout(()=>{n.classList.remove('show'); setTimeout(()=>n.remove(), 300);}, 3000);
}

// ===================================================================
//  1. OVERVIEW
// ===================================================================
async function renderOverview(c) {
  const res = await fetch('/api/stats');
  const s = res.ok ? await res.json() : {};
  const sales = s.totalSales||0, orders = s.totalOrders||0, users = s.totalUsers||0, comps = s.totalComplaints||0;
  const chart = Array.isArray(s.chartData)?s.chartData:[65,45,78,52,90,68,85,72,95,88,76,92];
  const mx = Math.max(...chart)||1;
  const mo = AdminState.lang==='ar'?['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const recent = Array.isArray(s.recentOrders)?s.recentOrders:[];
  const user = AdminState.currentUser?.name || AdminState.currentUser?.username || 'Admin';

  c.innerHTML = `
    <h1 class="admin-page-title">${t('welcomeBack')}, ${user} 👋</h1>
    <p class="admin-page-subtitle">${t('dashboardDesc')}</p>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-card-icon sales"><i class="fas fa-dollar-sign"></i></div><div class="stat-card-trend up"><i class="fas fa-arrow-up"></i> 12.5%</div></div><div class="stat-card-value">${fmtNum(sales.toFixed(2))} ${AdminState.currency}</div><div class="stat-card-label">${t('totalSales')}</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-card-icon orders"><i class="fas fa-shopping-bag"></i></div><div class="stat-card-trend up"><i class="fas fa-arrow-up"></i> 8.2%</div></div><div class="stat-card-value">${fmtNum(orders)}</div><div class="stat-card-label">${t('totalOrders')}</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-card-icon users"><i class="fas fa-users"></i></div><div class="stat-card-trend up"><i class="fas fa-arrow-up"></i> 15.3%</div></div><div class="stat-card-value">${fmtNum(users)}</div><div class="stat-card-label">${t('totalUsers')}</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-card-icon complaints"><i class="fas fa-exclamation-circle"></i></div><div class="stat-card-trend down"><i class="fas fa-arrow-down"></i> 3.1%</div></div><div class="stat-card-value">${fmtNum(comps)}</div><div class="stat-card-label">${t('totalComplaints')}</div></div>
    </div>
    <div class="admin-grid-2">
      <div class="chart-container">
        <div class="chart-header"><h3 class="chart-title"><i class="fas fa-chart-bar" style="color:var(--primary);margin-inline-end:.5rem"></i>${t('revenueStats')}</h3></div>
        <div class="chart-bars">${chart.map((v,i)=>`<div class="chart-bar" style="height:${(v/mx)*100}%"><span class="chart-bar-value">$${v*100}</span><span class="chart-bar-label">${mo[i]}</span></div>`).join('')}</div>
      </div>
      <div class="chart-container">
        <div class="chart-header"><h3 class="chart-title"><i class="fas fa-clock" style="color:var(--primary);margin-inline-end:.5rem"></i>${t('recentOrders')}</h3></div>
        <div style="overflow-x:auto"><table class="admin-table"><thead><tr><th>${t('id')}</th><th>${t('customerName')}</th><th>${t('serviceName')}</th><th>${t('status')}</th></tr></thead><tbody>
        ${recent.length?recent.map(o=>`<tr><td>#${o.id}</td><td>${AdminState.lang==='ar'?o.userNameAr:o.userNameEn}</td><td>${AdminState.lang==='ar'?o.serviceNameAr:o.serviceNameEn}</td><td><span class="status-badge ${o.status}">${t(o.status)}</span></td></tr>`).join(''):`<tr><td colspan="4" style="text-align:center;padding:1.5rem;color:var(--text-muted)">${t('noData')}</td></tr>`}
        </tbody></table></div>
      </div>
    </div>`;
}

// ===================================================================
//  2. WEBSITE MANAGEMENT
// ===================================================================
async function renderWebsite(c) {
  const res = await fetch('/api/settings');
  const cfg = await res.json();

  c.innerHTML = `
    <h1 class="admin-page-title">${t('websiteManagement')}</h1>
    <p class="admin-page-subtitle">${AdminState.lang==='ar'?'تخصيص مظهر وإعدادات الموقع':'Customize website settings'}</p>
    <div class="admin-tabs">
      <button class="admin-tab active" onclick="switchTab(this,'tab-general')">${t('general')}</button>
      <button class="admin-tab" onclick="switchTab(this,'tab-colors')">${AdminState.lang==='ar'?'الألوان':'Colors'}</button>
      <button class="admin-tab" onclick="switchTab(this,'tab-content')">${t('homeContent')}</button>
    </div>

    <!-- GENERAL TAB -->
    <div id="tab-general" class="admin-tab-content active"><div class="glass-card">
      <form id="frm-general" onsubmit="saveGeneral(event)">
        <div class="form-group"><label class="form-label">${t('websiteName')}</label>
          <input type="text" class="form-input" name="siteName" value="${cfg.siteName||'Service VIP'}" required></div>

        <div class="form-group" style="margin-top:1rem"><label class="form-label" style="font-weight:700">${AdminState.lang==='ar'?'شعار الموقع (رفع صورة)':'Site Logo (Upload)'}</label>
          <div style="padding:1rem;border:2px dashed var(--primary);border-radius:var(--radius-lg);background:rgba(139,92,246,.06);position:relative;cursor:pointer">
            <input type="file" accept="image/*" onchange="handleLogoUpload(this)" style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;z-index:2">
            <div style="display:flex;align-items:center;gap:1rem;pointer-events:none">
              <div style="width:44px;height:44px;border-radius:var(--radius-md);background:var(--primary-gradient);display:flex;align-items:center;justify-content:center;overflow:hidden">
                <img id="logo-preview" src="${cfg.siteLogo||''}" style="width:100%;height:100%;object-fit:cover;${cfg.siteLogo?'':'display:none'}">
                <span id="logo-fallback" style="font-size:1.3rem;font-weight:900;color:#fff;${cfg.siteLogo?'display:none':''}">V</span>
              </div>
              <div><div style="font-weight:700;color:var(--primary-light)"><i class="fas fa-cloud-upload-alt"></i> ${AdminState.lang==='ar'?'انقر لرفع صورة الشعار':'Click to upload logo'}</div>
              <div style="font-size:.8rem;color:var(--text-muted)">PNG, JPG, WEBP, SVG</div></div>
            </div>
          </div>
          <input type="hidden" name="siteLogo" id="logo-value" value="${cfg.siteLogo||''}">
        </div>

        <div class="form-group" style="margin-top:1rem"><label class="form-label">${AdminState.lang==='ar'?'وصف الموقع':'Site Description'}</label>
          <textarea class="form-textarea" name="siteDesc" rows="3">${cfg.siteDesc||''}</textarea></div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:1rem">
          <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'رقم الواتساب':'WhatsApp'}</label>
            <input type="text" class="form-input" name="whatsapp" value="${cfg.whatsapp||''}"></div>
          <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'رقم الهاتف':'Phone'}</label>
            <input type="text" class="form-input" name="phone" value="${cfg.phone||''}"></div>
        </div>

        <div class="form-group" style="margin-top:1rem"><label class="form-label">${AdminState.lang==='ar'?'البلد / العنوان':'Country / Address'}</label>
          <input type="text" class="form-input" name="address" value="${cfg.address||''}"></div>

        <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border-color)">
          <h4 style="font-size:1rem;font-weight:700;color:var(--primary-light);margin-bottom:1rem"><i class="fas fa-link"></i> ${AdminState.lang==='ar'?'روابط التواصل':'Social Links'}</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="form-group"><label class="form-label"><i class="fab fa-telegram-plane" style="color:#0088cc"></i> ${AdminState.lang==='ar'?'تيليجرام':'Telegram'}</label>
              <input type="text" class="form-input" name="telegram" value="${cfg.telegram||''}"></div>
            <div class="form-group"><label class="form-label"><i class="fab fa-facebook-f" style="color:#1877f2"></i> ${AdminState.lang==='ar'?'فيسبوك':'Facebook'}</label>
              <input type="text" class="form-input" name="facebook" value="${cfg.facebook||''}"></div>
            <div class="form-group"><label class="form-label"><i class="fab fa-instagram" style="color:#e4405f"></i> ${AdminState.lang==='ar'?'انستجرام':'Instagram'}</label>
              <input type="text" class="form-input" name="instagram" value="${cfg.instagram||''}"></div>
            <div class="form-group"><label class="form-label"><i class="fab fa-twitter" style="color:#1da1f2"></i> ${AdminState.lang==='ar'?'تويتر / X':'Twitter / X'}</label>
              <input type="text" class="form-input" name="twitter" value="${cfg.twitter||''}"></div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:1rem">
          <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'البريد الإلكتروني':'Support Email'}</label>
            <input type="email" class="form-input" name="email" value="${cfg.email||''}"></div>
          <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'رمز العملة':'Currency'}</label>
            <input type="text" class="form-input" name="currency" value="${cfg.currency||'ج.م'}"></div>
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top:1.5rem"><i class="fas fa-save"></i> ${t('save')}</button>
      </form>
    </div></div>

    <!-- COLORS TAB -->
    <div id="tab-colors" class="admin-tab-content"><div class="glass-card">
      <form onsubmit="saveColors(event)">
        <div class="form-group"><label class="form-label">${t('primaryColor')}</label>
          <div class="color-picker-group"><input type="color" class="color-picker" name="primaryColor" value="${cfg.primaryColor||'#8b5cf6'}" oninput="this.nextElementSibling.value=this.value">
          <input type="text" class="form-input" value="${cfg.primaryColor||'#8b5cf6'}" style="max-width:150px" oninput="this.previousElementSibling.value=this.value"></div></div>
        <div class="form-group"><label class="form-label">${t('secondaryColor')}</label>
          <div class="color-picker-group"><input type="color" class="color-picker" name="secondaryColor" value="${cfg.secondaryColor||'#1a1a2e'}" oninput="this.nextElementSibling.value=this.value">
          <input type="text" class="form-input" value="${cfg.secondaryColor||'#1a1a2e'}" style="max-width:150px" oninput="this.previousElementSibling.value=this.value"></div></div>
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${t('save')}</button>
      </form>
    </div></div>

    <!-- CONTENT TAB -->
    <div id="tab-content" class="admin-tab-content"><div class="glass-card">
      <form onsubmit="saveContent(event)">
        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'عنوان البطل':'Hero Title'}</label>
          <input type="text" class="form-input" name="heroTitle" value="${cfg.heroTitle||''}"></div>
        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'وصف البطل':'Hero Subtitle'}</label>
          <textarea class="form-textarea" name="heroSubtitle" rows="3">${cfg.heroSubtitle||''}</textarea></div>
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${t('save')}</button>
      </form>
    </div></div>
  `;
}

function switchTab(btn, tabId) {
  document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId)?.classList.add('active');
}

function handleLogoUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('logo-preview').src = e.target.result;
    document.getElementById('logo-preview').style.display = 'block';
    document.getElementById('logo-fallback').style.display = 'none';
    document.getElementById('logo-value').value = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function saveGeneral(e) {
  e.preventDefault();
  const f = e.target;
  await fetch('/api/settings', { method:'PUT', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      siteName:f.siteName.value, siteDesc:f.siteDesc.value, siteLogo:f.siteLogo.value,
      whatsapp:f.whatsapp.value, phone:f.phone.value, email:f.email.value, address:f.address.value,
      telegram:f.telegram.value, facebook:f.facebook.value, instagram:f.instagram.value,
      twitter:f.twitter.value, currency:f.currency.value
    })
  });
  notify('success', AdminState.lang==='ar'?'تم حفظ الإعدادات بنجاح':'Settings saved');
}

async function saveColors(e) {
  e.preventDefault();
  const f = e.target;
  await fetch('/api/settings', { method:'PUT', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ primaryColor:f.primaryColor.value, secondaryColor:f.secondaryColor.value })
  });
  document.documentElement.style.setProperty('--primary', f.primaryColor.value);
  document.documentElement.style.setProperty('--secondary', f.secondaryColor.value);
  notify('success', AdminState.lang==='ar'?'تم حفظ الألوان':'Colors saved');
}

async function saveContent(e) {
  e.preventDefault();
  const f = e.target;
  await fetch('/api/settings', { method:'PUT', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ heroTitle:f.heroTitle.value, heroSubtitle:f.heroSubtitle.value })
  });
  notify('success', AdminState.lang==='ar'?'تم حفظ المحتوى':'Content saved');
}

// ===================================================================
//  3. SERVICES (PRODUCTS) MANAGEMENT
// ===================================================================
async function renderServices(c) {
  const res = await fetch('/api/services');
  const services = res.ok ? await res.json() : [];

  c.innerHTML = `
    <h1 class="admin-page-title">${t('servicesManagement')}</h1>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem">
      <input type="text" class="form-input" placeholder="${t('search')}" oninput="filterTable(this.value)" style="max-width:300px">
      <button class="btn btn-primary" onclick="openServiceModal()"><i class="fas fa-plus"></i> ${t('addService')}</button>
    </div>
    <div class="glass-card" style="overflow-x:auto"><table class="admin-table" id="services-table"><thead><tr>
      <th>${t('id')}</th>
      <th>${t('image')}</th>
      <th>${t('serviceName')}</th>
      <th>${t('servicePrice')}</th>
      <th>${t('duration')}</th>
      <th>${AdminState.lang==='ar'?'التوفر':'Stock'}</th>
      <th>${AdminState.lang==='ar'?'الظهور بالموقع':'Visibility'}</th>
      <th>${t('actions')}</th>
    </tr></thead><tbody>
      ${services.map(s=>{
        const isStock = s.inStock !== false;
        const isHidden = s.hidden === true;

        return `<tr>
          <td>${s.id}</td>
          <td><img src="${s.image||'https://via.placeholder.com/40'}" style="width:40px;height:40px;border-radius:var(--radius-md);object-fit:cover"></td>
          <td>${AdminState.lang==='ar'?s.nameAr:s.nameEn}</td>
          <td>${fmtNum(s.originalPrice||s.price)} ${AdminState.currency}</td>
          <td>${fmtDuration(s.durationMonths)}</td>
          <td>
            <span class="status-badge ${isStock ? 'active' : 'suspended'}" onclick="toggleServiceStock(${s.id}, ${!isStock})" style="cursor:pointer;" title="${AdminState.lang==='ar'?'انقر لتغيير التوفر':'Click to toggle stock'}">
              <i class="fas ${isStock ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${isStock ? (AdminState.lang==='ar'?'متوفر':'In Stock') : (AdminState.lang==='ar'?'غير متوفر':'Out of Stock')}
            </span>
          </td>
          <td>
            <button class="btn btn-sm ${isHidden ? 'btn-danger' : 'btn-glass'}" onclick="toggleServiceVisibility(${s.id}, ${!isHidden})" style="${isHidden ? 'background:rgba(239,68,68,0.18);color:#ef4444;' : 'color:#22c55e;'}" title="${isHidden ? (AdminState.lang==='ar'?'مخفي (انقر للإظهار)':'Hidden (Click to show)') : (AdminState.lang==='ar'?'ظاهر بالموقع (انقر للإخفاء)':'Visible (Click to hide)')}">
              <i class="fas ${isHidden ? 'fa-eye-slash' : 'fa-eye'}"></i> ${isHidden ? (AdminState.lang==='ar'?'مخفي':'Hidden') : (AdminState.lang==='ar'?'ظاهر':'Visible')}
            </button>
          </td>
          <td>
            <button class="btn btn-sm btn-glass" onclick="editService(${s.id})" title="${t('edit')}"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-glass" style="color:#ef4444" onclick="deleteService(${s.id})" title="${t('delete')}"><i class="fas fa-trash"></i></button>
          </td>
        </tr>`;
      }).join('')}
    </tbody></table></div>`;
}

function filterTable(q) {
  document.querySelectorAll('.admin-table tbody tr').forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}

function openServiceModal(svc=null) {
  const isEdit = !!svc;
  const durOpts = [1,2,3,6,9,12,18,24].map(m=>`<option value="${m}" ${svc&&svc.durationMonths===m?'selected':''}>${fmtDuration(m)}</option>`).join('');
  const svcPrice = svc ? (svc.originalPrice || svc.price) : '';

  openModal(isEdit?t('edit'):t('addService'), `
    <form onsubmit="saveService(event, ${isEdit?svc.id:'null'})">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'الاسم بالعربية':'Name (AR)'}</label>
          <input type="text" class="form-input" name="nameAr" value="${svc?svc.nameAr:''}" required></div>
        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'الاسم بالانجليزية':'Name (EN)'}</label>
          <input type="text" class="form-input" name="nameEn" value="${svc?svc.nameEn:''}" required></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'الوصف بالعربية':'Description (AR)'}</label>
          <textarea class="form-textarea" name="descAr" rows="3">${svc?svc.descAr:''}</textarea></div>
        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'الوصف بالانجليزية':'Description (EN)'}</label>
          <textarea class="form-textarea" name="descEn" rows="3">${svc?svc.descEn:''}</textarea></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div class="form-group"><label class="form-label">${t('servicePrice')}</label>
          <input type="number" class="form-input" name="price" value="${svcPrice}" step="0.01" required></div>
        <div class="form-group"><label class="form-label">${t('duration')}</label>
          <select class="form-select" name="durationMonths">${durOpts}</select></div>
      </div>
      <div class="form-group" style="margin-top:.5rem">
        <label class="form-label">${t('image')}</label>
        <input type="file" accept="image/*" class="form-input" onchange="previewServiceImg(this)">
        <img id="svc-img-preview" src="${svc?svc.image:''}" style="margin-top:.5rem;max-height:80px;border-radius:var(--radius-md);${svc&&svc.image?'':'display:none'}">
        <input type="hidden" name="image" id="svc-img-val" value="${svc?svc.image:''}">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-top:.75rem;padding:0.75rem;background:rgba(139,92,246,0.06);border-radius:var(--radius-md);">
        <label style="display:flex;align-items:center;gap:.5rem;cursor:pointer;font-weight:600;color:var(--primary-light)">
          <input type="checkbox" name="featured" ${svc&&svc.featured?'checked':''} style="width:18px;height:18px;accent-color:var(--primary)">
          <i class="fas fa-star" style="color:#f59e0b"></i> ${AdminState.lang==='ar'?'منتج مميز':'Featured'}
        </label>
        <label style="display:flex;align-items:center;gap:.5rem;cursor:pointer;font-weight:600;color:#22c55e">
          <input type="checkbox" name="inStock" ${!svc || svc.inStock !== false ? 'checked' : ''} style="width:18px;height:18px;accent-color:#22c55e">
          <i class="fas fa-box" style="color:#22c55e"></i> ${AdminState.lang==='ar'?'متوفر حالياً':'In Stock'}
        </label>
        <label style="display:flex;align-items:center;gap:.5rem;cursor:pointer;font-weight:600;color:#ef4444">
          <input type="checkbox" name="hidden" ${svc && svc.hidden ? 'checked' : ''} style="width:18px;height:18px;accent-color:#ef4444">
          <i class="fas fa-eye-slash" style="color:#ef4444"></i> ${AdminState.lang==='ar'?'إخفاء من الموقع':'Hide from Site'}
        </label>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1.5rem">
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${t('save')}</button>
        <button type="button" class="btn btn-glass" onclick="closeModal()">${t('cancel')}</button>
      </div>
    </form>
  `);
}

function previewServiceImg(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('svc-img-preview').src = e.target.result;
    document.getElementById('svc-img-preview').style.display = 'block';
    document.getElementById('svc-img-val').value = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function saveService(e, editId) {
  e.preventDefault();
  const f = e.target;
  const price = parseFloat(f.price.value);
  const data = {
    nameAr: f.nameAr.value,
    nameEn: f.nameEn.value,
    descAr: f.descAr.value,
    descEn: f.descEn.value,
    originalPrice: price,
    price: price,
    durationMonths: parseInt(f.durationMonths.value),
    image: f.image.value,
    featured: f.featured.checked,
    inStock: f.inStock.checked,
    hidden: f.hidden.checked
  };
  if (editId) {
    await fetch(`/api/services/${editId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  } else {
    await fetch('/api/services', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  }
  closeModal();
  notify('success', AdminState.lang==='ar'?'تم الحفظ بنجاح':'Saved');
  loadSection('services');
}

async function editService(id) {
  const res = await fetch(`/api/services/${id}`);
  if (res.ok) { const svc = await res.json(); openServiceModal(svc); }
}

async function deleteService(id) {
  if (!confirm(AdminState.lang==='ar'?'هل أنت متأكد من حذف هذا المنتج؟':'Delete this product?')) return;
  await fetch(`/api/services/${id}`, { method:'DELETE' });
  notify('success', AdminState.lang==='ar'?'تم الحذف':'Deleted');
  loadSection('services');
}

// ===================================================================
//  4. OFFERS / DISCOUNTS MANAGEMENT
// ===================================================================
async function renderOffers(c) {
  const [svcRes, cfgRes] = await Promise.all([fetch('/api/services'), fetch('/api/settings')]);
  const services = svcRes.ok ? await svcRes.json() : [];
  window.adminServicesData = services;
  const cfg = cfgRes.ok ? await cfgRes.json() : {};

  // Count active discounts
  const activeDiscounts = services.filter(s => (s.discount||0) > 0).length;

  c.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem">
      <div>
        <h1 class="admin-page-title" style="margin-bottom:0.25rem">${t('offersManagement')}</h1>
        <p class="admin-page-subtitle" style="margin-bottom:0">${AdminState.lang==='ar'?`إجمالي المنتجات: ${services.length} | عروض نشطة: ${activeDiscounts}`:`Total Products: ${services.length} | Active Offers: ${activeDiscounts}`}</p>
      </div>
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="openCreateOfferModal(window.adminServicesData)"><i class="fas fa-plus"></i> ${AdminState.lang==='ar'?'إنشاء عرض جديد':'Create New Offer'}</button>
        ${activeDiscounts > 0 ? `<button class="btn btn-glass" style="color:#ef4444;border-color:rgba(239,68,68,0.3)" onclick="removeAllOffers()"><i class="fas fa-trash-alt"></i> ${AdminState.lang==='ar'?'إزالة جميع العروض':'Remove All Offers'}</button>` : ''}
      </div>
    </div>

    <div class="admin-tabs">
      <button class="admin-tab active" onclick="switchTab(this,'tab-discounts')">${AdminState.lang==='ar'?'العروض والخصومات':'Discounts & Offers'}</button>
      <button class="admin-tab" onclick="switchTab(this,'tab-banner')">${AdminState.lang==='ar'?'البنر والعداد التنازلي':'Banner & Countdown'}</button>
    </div>

    <div id="tab-discounts" class="admin-tab-content active">
      <div class="glass-card" style="overflow-x:auto"><table class="admin-table"><thead><tr>
        <th>${t('image')}</th>
        <th>${t('serviceName')}</th>
        <th>${t('original')}</th>
        <th>${t('discount')}</th>
        <th>${t('discounted')}</th>
        <th>${AdminState.lang==='ar'?'الحالة':'Status'}</th>
        <th>${t('actions')}</th>
      </tr></thead><tbody>
        ${services.map(s=>{
          const disc = s.discount||0;
          const origPrice = s.originalPrice||s.price;
          const finalP = disc>0 ? (origPrice*(1-disc/100)).toFixed(2) : origPrice;
          const isOfferActive = disc > 0;

          return `<tr>
            <td><img src="${s.image||'https://via.placeholder.com/40'}" style="width:40px;height:40px;border-radius:var(--radius-md);object-fit:cover"></td>
            <td><strong>${AdminState.lang==='ar'?s.nameAr:s.nameEn}</strong></td>
            <td>${fmtNum(origPrice)} ${AdminState.currency}</td>
            <td>${disc>0?`<span style="background:rgba(239,68,68,.18);color:#ef4444;padding:.25rem .75rem;border-radius:999px;font-weight:700;font-size:.9em">-${disc}%</span>`:'<span style="color:var(--text-muted)">—</span>'}</td>
            <td>${disc>0?`<span style="color:var(--accent);font-weight:700">${fmtNum(finalP)} ${AdminState.currency}</span>`:'<span style="color:var(--text-muted)">—</span>'}</td>
            <td>
              <span class="status-badge ${isOfferActive ? 'active' : 'suspended'}">
                ${isOfferActive ? (AdminState.lang==='ar'?'عرض نشط':'Active Offer') : (AdminState.lang==='ar'?'بدون خصم':'No Discount')}
              </span>
            </td>
            <td style="display:flex;gap:.5rem;align-items:center">
              <button class="btn btn-sm btn-primary" onclick="openDiscountModal(${s.id},${origPrice},${disc})" title="${AdminState.lang==='ar'?'تعديل العرض':'Edit Offer'}"><i class="fas fa-percent"></i> ${AdminState.lang==='ar'?'تعديل':'Edit'}</button>
              ${disc>0?`<button class="btn btn-sm btn-glass" style="color:#ef4444" onclick="removeDiscount(${s.id})" title="${AdminState.lang==='ar'?'إزالة العرض':'Remove Offer'}"><i class="fas fa-trash"></i> ${AdminState.lang==='ar'?'إزالة':'Remove'}</button>`:''}
            </td>
          </tr>`;
        }).join('')}
      </tbody></table></div>
    </div>

    <div id="tab-banner" class="admin-tab-content"><div class="glass-card">
      <form onsubmit="saveBanner(event)">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:1rem;margin-bottom:1.25rem;background:rgba(139,92,246,0.08);border-radius:var(--radius-md);border:1px solid rgba(139,92,246,0.15)">
          <div>
            <h4 style="margin:0 0 0.25rem 0;font-size:1.05rem;font-weight:700;">${AdminState.lang==='ar'?'حالة العداد التنازلي':'Countdown Status'}</h4>
            <p style="margin:0;font-size:0.85rem;color:var(--text-muted);">${AdminState.lang==='ar'?'تشغيل أو إيقاف العداد التنازلي المباشر في الواجهة':'Start or pause live countdown timer on website'}</p>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-weight:700;font-size:0.95rem;">
              <input type="checkbox" name="offerCountdownActive" ${cfg.offerCountdownActive !== false ? 'checked' : ''} style="width:20px;height:20px;accent-color:#22c55e">
              <span style="color:${cfg.offerCountdownActive !== false ? '#22c55e' : '#ef4444'}">${cfg.offerCountdownActive !== false ? (AdminState.lang==='ar'?'🟢 العداد يعمل (نشط)':'🟢 Running') : (AdminState.lang==='ar'?'🔴 العداد متوقف':'🔴 Paused')}</span>
            </label>
          </div>
        </div>

        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'شارة العرض':'Offer Badge'}</label>
          <input type="text" class="form-input" name="offerBadge" value="${cfg.offerBadge||''}"></div>
        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'عنوان العرض':'Offer Title'}</label>
          <input type="text" class="form-input" name="offerTitle" value="${cfg.offerTitle||''}"></div>
        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'وصف العرض':'Offer Description'}</label>
          <textarea class="form-textarea" name="offerDesc" rows="3">${cfg.offerDesc||''}</textarea></div>

        <div style="margin-top:1.25rem;padding:1.25rem;background:rgba(139,92,246,0.04);border-radius:var(--radius-md);border:1px solid rgba(139,92,246,0.12)">
          <h4 style="margin:0 0 1rem 0;font-size:1rem;font-weight:700;color:var(--primary-light)"><i class="fas fa-stopwatch"></i> ${AdminState.lang==='ar'?'تحديد مدة العداد التنازلي':'Set Countdown Duration'}</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem">
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">${AdminState.lang==='ar'?'عدد الأيام':'Days'}</label>
              <input type="number" class="form-input" name="offerDays" min="0" max="365" value="${cfg.offerDays !== undefined ? cfg.offerDays : 7}" required>
            </div>
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">${AdminState.lang==='ar'?'عدد الساعات':'Hours'}</label>
              <input type="number" class="form-input" name="offerHours" min="0" max="23" value="${cfg.offerHours !== undefined ? cfg.offerHours : 0}" required>
            </div>
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">${AdminState.lang==='ar'?'عدد الدقائق':'Minutes'}</label>
              <input type="number" class="form-input" name="offerMinutes" min="0" max="59" value="${cfg.offerMinutes !== undefined ? cfg.offerMinutes : 0}" required>
            </div>
          </div>
        </div>

        <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border-glass);display:flex;justify-content:flex-end;align-items:center;">
          <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${t('save')} وتحديث العداد</button>
        </div>
      </form>
    </div></div>
  `;
}

function openCreateOfferModal(services) {
  if (!services || services.length === 0) {
    notify('error', AdminState.lang === 'ar' ? 'لا توجد منتجات متاحة لإضافة عرض عليها' : 'No products available');
    return;
  }

  const optionsHtml = services.map(s => `
    <option value="${s.id}" data-price="${s.originalPrice || s.price}">${AdminState.lang === 'ar' ? s.nameAr : s.nameEn} (${fmtNum(s.originalPrice || s.price)} ${AdminState.currency})</option>
  `).join('');

  const firstOrig = services[0].originalPrice || services[0].price;

  openModal(AdminState.lang === 'ar' ? 'إنشاء عرض جديد' : 'Create New Offer', `
    <form onsubmit="saveNewOffer(event)">
      <div class="form-group">
        <label class="form-label">${AdminState.lang === 'ar' ? 'اختر المنتج' : 'Select Product'}</label>
        <select class="form-select" name="serviceId" id="offer-svc-select" onchange="recalcCreateOffer()">
          ${optionsHtml}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">${AdminState.lang === 'ar' ? 'نسبة الخصم (%)' : 'Discount (%)'}</label>
        <input type="number" class="form-input" name="discount" id="offer-disc-input" min="1" max="99" value="20" required oninput="recalcCreateOffer()">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0;padding:1rem;border-radius:var(--radius-md);background:rgba(139,92,246,.06)">
        <div style="text-align:center">
          <div style="font-size:.85em;color:var(--text-muted);margin-bottom:.25rem">${AdminState.lang === 'ar' ? 'السعر بعد الخصم' : 'Discounted Price'}</div>
          <div style="font-size:1.3em;font-weight:700;color:var(--accent)"><span id="create-disc-price">${(firstOrig * 0.8).toFixed(2)}</span> ${AdminState.currency}</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:.85em;color:var(--text-muted);margin-bottom:.25rem">${AdminState.lang === 'ar' ? 'مبلغ التوفير' : 'You Save'}</div>
          <div style="font-size:1.3em;font-weight:700;color:#22c55e"><span id="create-disc-save">${(firstOrig * 0.2).toFixed(2)}</span> ${AdminState.currency}</div>
        </div>
      </div>
      <div style="display:flex;gap:1rem">
        <button type="submit" class="btn btn-primary"><i class="fas fa-plus-circle"></i> ${AdminState.lang === 'ar' ? 'إضافة العرض' : 'Add Offer'}</button>
        <button type="button" class="btn btn-glass" onclick="closeModal()">${t('cancel')}</button>
      </div>
    </form>
  `);
}

function recalcCreateOffer() {
  const sel = document.getElementById('offer-svc-select');
  const input = document.getElementById('offer-disc-input');
  if (!sel || !input) return;
  const opt = sel.options[sel.selectedIndex];
  const orig = parseFloat(opt.getAttribute('data-price') || 0);
  const disc = parseFloat(input.value || 0);
  const finalP = orig * (1 - disc / 100);
  const saveAmt = orig * (disc / 100);
  document.getElementById('create-disc-price').textContent = finalP.toFixed(2);
  document.getElementById('create-disc-save').textContent = saveAmt.toFixed(2);
}

async function saveNewOffer(e) {
  e.preventDefault();
  const svcId = parseInt(e.target.serviceId.value);
  const disc = parseInt(e.target.discount.value);
  await fetch(`/api/services/${svcId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ discount: disc })
  });
  closeModal();
  notify('success', AdminState.lang === 'ar' ? 'تم إنشاء وإضافة العرض بنجاح' : 'Offer created successfully');
  loadSection('offers');
}

async function removeAllOffers() {
  if (!confirm(AdminState.lang === 'ar' ? 'هل أنت متأكد من إزالة كافة العروض والخصومات؟' : 'Are you sure you want to remove all active offers?')) return;
  const res = await fetch('/api/services');
  if (res.ok) {
    const services = await res.json();
    for (const s of services) {
      if (s.discount && s.discount > 0) {
        await fetch(`/api/services/${s.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ discount: 0 })
        });
      }
    }
    notify('success', AdminState.lang === 'ar' ? 'تمت إزالة كافة العروض بنجاح' : 'All offers removed successfully');
    loadSection('offers');
  }
}

async function resetCountdown7Days() {
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
  await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ offerCountdownEnd: nextWeek })
  });
  notify('success', AdminState.lang === 'ar' ? 'تم تجديد العداد التنازلي لمدة 7 أيام جديدة' : 'Countdown renewed for 7 days');
  loadSection('offers');
}

function openDiscountModal(svcId, origPrice, current) {
  openModal(AdminState.lang==='ar'?'تعديل نسبة الخصم':'Edit Discount', `
    <form onsubmit="saveDiscount(event, ${svcId})">
      <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'السعر الأصلي':'Original Price'}</label>
        <input type="text" class="form-input" value="${fmtNum(origPrice)} ${AdminState.currency}" readonly style="background:rgba(139,92,246,.08);font-weight:600"></div>
      <div class="form-group"><label class="form-label">${t('discount')} (%)</label>
        <input type="number" class="form-input" name="discount" min="0" max="99" value="${current||0}" required
          oninput="document.getElementById('disc-preview').textContent=(${origPrice}*(1-this.value/100)).toFixed(2);document.getElementById('disc-save-amount').textContent=(${origPrice}*this.value/100).toFixed(2)"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0;padding:1rem;border-radius:var(--radius-md);background:rgba(139,92,246,.06)">
        <div style="text-align:center">
          <div style="font-size:.85em;color:var(--text-muted);margin-bottom:.25rem">${AdminState.lang==='ar'?'السعر بعد الخصم':'Discounted Price'}</div>
          <div style="font-size:1.3em;font-weight:700;color:var(--accent)"><span id="disc-preview">${(origPrice*(1-(current||0)/100)).toFixed(2)}</span> ${AdminState.currency}</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:.85em;color:var(--text-muted);margin-bottom:.25rem">${AdminState.lang==='ar'?'مبلغ التوفير':'You Save'}</div>
          <div style="font-size:1.3em;font-weight:700;color:#22c55e"><span id="disc-save-amount">${(origPrice*(current||0)/100).toFixed(2)}</span> ${AdminState.currency}</div>
        </div>
      </div>
      <div style="display:flex;gap:1rem">
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${t('save')}</button>
        <button type="button" class="btn btn-glass" onclick="closeModal()">${t('cancel')}</button>
      </div>
    </form>
  `);
}

async function saveDiscount(e, svcId) {
  e.preventDefault();
  const disc = parseInt(e.target.discount.value);
  await fetch(`/api/services/${svcId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ discount:disc }) });
  closeModal();
  notify('success', AdminState.lang==='ar'?'تم تطبيق الخصم':'Discount applied');
  loadSection('offers');
}

async function removeDiscount(svcId) {
  await fetch(`/api/services/${svcId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ discount:0 }) });
  notify('success', AdminState.lang==='ar'?'تم إزالة الخصم':'Discount removed');
  loadSection('offers');
}

async function saveBanner(e) {
  e.preventDefault();
  const f = e.target;
  const days = parseInt(f.offerDays.value) || 0;
  const hours = parseInt(f.offerHours.value) || 0;
  const minutes = parseInt(f.offerMinutes.value) || 0;
  const isActive = f.offerCountdownActive ? f.offerCountdownActive.checked : true;

  const targetTime = Date.now() + (days * 86400 + hours * 3600 + minutes * 60) * 1000;
  const countdownEndIso = new Date(targetTime).toISOString();

  await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      offerBadge: f.offerBadge.value,
      offerTitle: f.offerTitle.value,
      offerDesc: f.offerDesc.value,
      offerDays: days,
      offerHours: hours,
      offerMinutes: minutes,
      offerCountdownEnd: countdownEndIso,
      offerCountdownActive: isActive
    })
  });
  notify('success', AdminState.lang === 'ar' ? 'تم حفظ إعدادات البنر وتحديث العداد التنازلي' : 'Banner and countdown settings saved');
  loadSection('offers');
}

// ===================================================================
//  5. COUPONS MANAGEMENT
// ===================================================================
async function renderCoupons(c) {
  const res = await fetch('/api/coupons');
  const coupons = res.ok ? await res.json() : [];
  const isAr = AdminState.lang === 'ar';

  c.innerHTML = `
    <h1 class="admin-page-title">${isAr ? 'إدارة كوبونات الخصم' : 'Coupons Management'}</h1>
    <div style="display:flex;justify-space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem">
      <input type="text" class="form-input" placeholder="${t('search')}" oninput="filterTable(this.value)" style="max-width:300px">
      <button class="btn btn-primary" onclick="openCouponModal()"><i class="fas fa-plus"></i> ${isAr ? 'إضافة كوبون جديد' : 'Add New Coupon'}</button>
    </div>
    <div class="glass-card" style="overflow-x:auto">
      <table class="admin-table">
        <thead>
          <tr>
            <th>${t('id')}</th>
            <th>${isAr ? 'كود الكوبون' : 'Coupon Code'}</th>
            <th>${isAr ? 'قيمة الخصم' : 'Discount Value'}</th>
            <th>${isAr ? 'الاستخدامات' : 'Usage'}</th>
            <th>${isAr ? 'تاريخ الانتهاء' : 'Expiry Date'}</th>
            <th>${t('status')}</th>
            <th>${t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${coupons.length === 0 ? `
            <tr>
              <td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted);">
                <i class="fas fa-ticket-alt" style="font-size:2.5rem;margin-bottom:0.5rem;display:block;"></i>
                ${isAr ? 'لا توجد كوبونات خصم مضافة بعد' : 'No coupons added yet'}
              </td>
            </tr>
          ` : coupons.map(cp => {
            const isPercent = cp.discountType === 'percent';
            const discText = isPercent ? `${cp.discountValue}%` : `${cp.discountValue} ${AdminState.currency}`;
            const isActive = cp.active !== false;

            return `
              <tr>
                <td>#${cp.id}</td>
                <td>
                  <span style="background:rgba(139,92,246,0.15);color:#a78bfa;font-family:monospace;font-weight:700;padding:4px 10px;border-radius:6px;font-size:0.95rem;letter-spacing:1px;">
                    <i class="fas fa-tag" style="font-size:0.75rem;margin-inline-end:4px;"></i>${cp.code}
                  </span>
                </td>
                <td><strong style="color:#22c55e;">${discText}</strong></td>
                <td>${cp.usedCount || 0} / ${cp.maxUses || '∞'}</td>
                <td>${cp.expiryDate || 'غير محدد'}</td>
                <td>
                  <span class="status-badge ${isActive ? 'active' : 'suspended'}" onclick="toggleCouponStatus(${cp.id}, ${!isActive})" style="cursor:pointer;">
                    ${isActive ? (isAr ? 'مفعل' : 'Active') : (isAr ? 'معطل' : 'Inactive')}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-glass" onclick="openCouponModal(${cp.id})" title="${t('edit')}"><i class="fas fa-edit"></i></button>
                  <button class="btn btn-sm btn-glass" style="color:#ef4444" onclick="deleteCoupon(${cp.id})" title="${t('delete')}"><i class="fas fa-trash"></i></button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function openCouponModal(couponId = null) {
  let cp = null;
  if (couponId) {
    const res = await fetch('/api/coupons');
    const items = res.ok ? await res.json() : [];
    cp = items.find(x => x.id === couponId);
  }

  const isEdit = !!cp;
  const isAr = AdminState.lang === 'ar';

  openModal(isEdit ? (isAr ? 'تعديل كوبون الخصم' : 'Edit Coupon') : (isAr ? 'إضافة كوبون خصم جديد' : 'Add New Coupon'), `
    <form onsubmit="saveCoupon(event, ${isEdit ? cp.id : 'null'})">
      <div class="form-group">
        <label class="form-label">${isAr ? 'كود الكوبون' : 'Coupon Code'}</label>
        <input type="text" class="form-input" name="code" value="${cp ? cp.code : ''}" placeholder="مثال: SAVE20" required style="text-transform:uppercase;font-weight:700;">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">${isAr ? 'نوع الخصم' : 'Discount Type'}</label>
          <select class="form-select" name="discountType">
            <option value="percent" ${cp && cp.discountType === 'percent' ? 'selected' : ''}>${isAr ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
            <option value="fixed" ${cp && cp.discountType === 'fixed' ? 'selected' : ''}>${isAr ? 'مبلغ ثابت (' + AdminState.currency + ')' : 'Fixed Amount'}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">${isAr ? 'قيمة الخصم' : 'Discount Value'}</label>
          <input type="number" step="0.01" min="1" class="form-input" name="discountValue" value="${cp ? cp.discountValue : ''}" placeholder="مثال: 20" required>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">${isAr ? 'الحد الأقصى للاستخدام' : 'Max Uses'}</label>
          <input type="number" min="1" class="form-input" name="maxUses" value="${cp ? cp.maxUses : 100}" required>
        </div>
        <div class="form-group">
          <label class="form-label">${isAr ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
          <input type="date" class="form-input" name="expiryDate" value="${cp ? cp.expiryDate : '2026-12-31'}" required>
        </div>
      </div>
      <div class="form-group" style="margin-top:0.5rem;">
        <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-weight:600;">
          <input type="checkbox" name="active" ${!cp || cp.active ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--primary);">
          ${isAr ? 'تفعيل الكوبون الآن' : 'Enable Coupon Now'}
        </label>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1.5rem;">
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${t('save')}</button>
        <button type="button" class="btn btn-glass" onclick="closeModal()">${t('cancel')}</button>
      </div>
    </form>
  `);
}

async function saveCoupon(e, editId) {
  e.preventDefault();
  const f = e.target;
  const data = {
    code: f.code.value.trim(),
    discountType: f.discountType.value,
    discountValue: parseFloat(f.discountValue.value),
    maxUses: parseInt(f.maxUses.value),
    expiryDate: f.expiryDate.value,
    active: f.active.checked
  };

  const url = editId ? `/api/coupons/${editId}` : '/api/coupons';
  const method = editId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    closeModal();
    notify('success', AdminState.lang === 'ar' ? 'تم حفظ الكوبون بنجاح' : 'Coupon saved successfully');
    loadSection('coupons');
  } else {
    const err = await res.json();
    alert(err.message || (AdminState.lang === 'ar' ? 'حدث خطأ' : 'Error'));
  }
}

async function toggleCouponStatus(id, newStatus) {
  await fetch(`/api/coupons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active: newStatus })
  });
  notify('success', AdminState.lang === 'ar' ? 'تم تحديث حالة الكوبون' : 'Coupon status updated');
  loadSection('coupons');
}

async function deleteCoupon(id) {
  if (!confirm(AdminState.lang === 'ar' ? 'هل أنت تأكد من حذف هذا الكوبون؟' : 'Delete this coupon?')) return;
  await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
  notify('success', AdminState.lang === 'ar' ? 'تم حذف الكوبون' : 'Coupon deleted');
  loadSection('coupons');
}

// ===================================================================
//  5. USERS
// ===================================================================
async function renderUsers(c) {
  const res = await fetch('/api/users');
  const users = res.ok ? await res.json() : [];
  c.innerHTML = `
    <h1 class="admin-page-title">${t('usersManagement')}</h1>
    <div class="glass-card" style="overflow-x:auto"><table class="admin-table"><thead><tr>
      <th>${t('id')}</th><th>${t('customerName')}</th><th>Email</th><th>${t('status')}</th><th>${t('actions')}</th>
    </tr></thead><tbody>
      ${users.map(u=>`<tr>
        <td>${u.id}</td><td>${u.name||u.nameEn||''}</td><td>${u.email||''}</td>
        <td><span class="status-badge ${u.status||'active'}">${t(u.status||'active')}</span></td>
        <td>
          <button class="btn btn-sm btn-glass" onclick="toggleUserStatus(${u.id})"><i class="fas fa-${u.status==='suspended'?'check':'ban'}"></i></button>
          <button class="btn btn-sm btn-glass" style="color:#ef4444" onclick="deleteUser(${u.id})"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`).join('')}
    </tbody></table></div>`;
}

async function toggleUserStatus(id) {
  const res = await fetch('/api/users');
  const users = res.ok ? await res.json() : [];
  const u = users.find(x=>x.id===id);
  if (u) {
    await fetch(`/api/users/${id}/status`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ status:u.status==='suspended'?'active':'suspended' }) });
    loadSection('users');
  }
}

async function deleteUser(id) {
  if (!confirm(AdminState.lang==='ar'?'حذف هذا المستخدم؟':'Delete user?')) return;
  await fetch(`/api/users/${id}`, { method:'DELETE' });
  loadSection('users');
}

// ===================================================================
//  6. COMPLAINTS
// ===================================================================
async function renderComplaints(c) {
  const res = await fetch('/api/complaints');
  const items = res.ok ? await res.json() : [];
  c.innerHTML = `
    <h1 class="admin-page-title">${t('complaintsManagement')}</h1>
    <div class="glass-card" style="overflow-x:auto"><table class="admin-table"><thead><tr>
      <th>${t('id')}</th><th>${t('customerName')}</th><th>${AdminState.lang==='ar'?'الموضوع':'Subject'}</th><th>${t('status')}</th><th>${t('actions')}</th>
    </tr></thead><tbody>
      ${items.map(x=>`<tr>
        <td>#${x.id}</td><td>${x.name||''}</td><td>${x.subject||''}</td>
        <td><span class="status-badge ${x.status||'pending'}">${t(x.status||'pending')}</span></td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="viewComplaint(${x.id})"><i class="fas fa-eye"></i></button>
          <button class="btn btn-sm btn-glass" onclick="replyComplaint(${x.id})"><i class="fas fa-reply"></i></button>
        </td>
      </tr>`).join('')}
    </tbody></table></div>`;
}

async function viewComplaint(id) {
  const res = await fetch('/api/complaints');
  const items = res.ok ? await res.json() : [];
  const x = items.find(c=>c.id===id);
  if (!x) return;
  openModal(AdminState.lang==='ar'?'تفاصيل الشكوى':'Complaint Details', `
    <div style="margin-bottom:1rem"><strong>${AdminState.lang==='ar'?'الاسم':'Name'}:</strong> ${x.name}</div>
    <div style="margin-bottom:1rem"><strong>${AdminState.lang==='ar'?'البريد':'Email'}:</strong> ${x.email}</div>
    <div style="margin-bottom:1rem"><strong>${AdminState.lang==='ar'?'الموضوع':'Subject'}:</strong> ${x.subject}</div>
    <div style="margin-bottom:1rem"><strong>${AdminState.lang==='ar'?'التفاصيل':'Details'}:</strong><p style="margin-top:.5rem;color:var(--text-secondary)">${x.message||x.details||''}</p></div>
    ${x.reply?`<div style="padding:1rem;background:rgba(139,92,246,.1);border-radius:var(--radius-md);margin-top:1rem"><strong>${AdminState.lang==='ar'?'الرد':'Reply'}:</strong><p style="margin-top:.5rem">${x.reply}</p></div>`:''}
  `);
}

function replyComplaint(id) {
  openModal(AdminState.lang==='ar'?'الرد على الشكوى':'Reply to Complaint', `
    <form onsubmit="submitReply(event, ${id})">
      <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'رسالة الرد':'Reply Message'}</label>
        <textarea class="form-textarea" name="reply" rows="4" required></textarea></div>
      <button type="submit" class="btn btn-primary"><i class="fas fa-paper-plane"></i> ${AdminState.lang==='ar'?'إرسال':'Send'}</button>
    </form>
  `);
}

async function submitReply(e, id) {
  e.preventDefault();
  await fetch(`/api/complaints/${id}/reply`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ reply:e.target.reply.value }) });
  closeModal();
  notify('success', AdminState.lang==='ar'?'تم إرسال الرد':'Reply sent');
  loadSection('complaints');
}

// ===================================================================
//  7. ORDERS
// ===================================================================
let adminOrderFilter = 'all';

async function renderOrders(c, filterType = null) {
  if (filterType !== null) adminOrderFilter = filterType;
  const res = await fetch('/api/orders');
  const allOrders = res.ok ? await res.json() : [];
  
  let orders = allOrders;
  if (adminOrderFilter === 'services') {
    orders = allOrders.filter(o => !o.isOffer && o.orderType !== 'offer' && !(o.discount > 0));
  } else if (adminOrderFilter === 'offers') {
    orders = allOrders.filter(o => o.isOffer || o.orderType === 'offer' || (o.discount > 0));
  }

  const isAr = AdminState.lang === 'ar';
  
  const offersCount = allOrders.filter(o => o.isOffer || o.orderType === 'offer' || (o.discount > 0)).length;
  const servicesCount = allOrders.length - offersCount;

  c.innerHTML = `
    <h1 class="admin-page-title">${t('ordersManagement')}</h1>

    <div style="display:flex;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap;align-items:center;">
      <button class="btn btn-sm ${adminOrderFilter === 'all' ? 'btn-primary' : 'btn-glass'}" onclick="renderOrders(document.getElementById('admin-content'), 'all')">
        <i class="fas fa-list"></i> ${isAr ? 'جميع الطلبات' : 'All Orders'} (${allOrders.length})
      </button>
      <button class="btn btn-sm ${adminOrderFilter === 'services' ? 'btn-primary' : 'btn-glass'}" onclick="renderOrders(document.getElementById('admin-content'), 'services')">
        <i class="fas fa-box-open"></i> ${isAr ? 'طلبات الخدمات الأساسية' : 'Service Orders'} (${servicesCount})
      </button>
      <button class="btn btn-sm ${adminOrderFilter === 'offers' ? 'btn-primary' : 'btn-glass'}" style="${adminOrderFilter === 'offers' ? 'background:#ef4444;border-color:#ef4444;' : ''}" onclick="renderOrders(document.getElementById('admin-content'), 'offers')">
        <i class="fas fa-tags"></i> ${isAr ? 'طلبات العروض والخصومات' : 'Offer Orders'} (${offersCount})
      </button>
    </div>

    <div class="glass-card" style="overflow-x:auto">
      <table class="admin-table">
        <thead>
          <tr>
            <th>${t('id')}</th>
            <th>${isAr ? 'نوع الطلب' : 'Order Type'}</th>
            <th>${t('customerName')}</th>
            <th>${t('serviceName')}</th>
            <th>${isAr ? 'المبلغ المطلوبة (السعر)' : 'Amount'}</th>
            <th>${t('status')}</th>
            <th>${t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${orders.length === 0 ? `
            <tr>
              <td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted);">
                <i class="fas fa-inbox" style="font-size:2rem;margin-bottom:0.5rem;display:block;"></i>
                ${isAr ? 'لا توجد طلبات في هذا القسم' : 'No orders found in this tab'}
              </td>
            </tr>
          ` : orders.map(o => {
            const isOfferItem = !!o.isOffer || o.orderType === 'offer' || (o.discount > 0);
            const origPrice = o.originalPrice || o.amount || 0;
            const finalPrice = o.amount || 0;
            const discountPct = o.discount || 0;

            const orderTypeBadge = isOfferItem
              ? `<span style="background:rgba(239,68,68,0.15);color:#ef4444;font-weight:700;padding:4px 10px;border-radius:99px;font-size:0.78rem;display:inline-flex;align-items:center;gap:4px;"><i class="fas fa-tags"></i> ${isAr ? 'طلب عرض' : 'Offer'} ${discountPct > 0 ? `(-${discountPct}%)` : ''}</span>`
              : `<span style="background:rgba(139,92,246,0.15);color:#a78bfa;font-weight:700;padding:4px 10px;border-radius:99px;font-size:0.78rem;display:inline-flex;align-items:center;gap:4px;"><i class="fas fa-box-open"></i> ${isAr ? 'طلب خدمة' : 'Service'}</span>`;

            const priceDisplay = isOfferItem && discountPct > 0 ? `
              <div>
                <span style="color:#22c55e;font-weight:800;font-size:0.95rem;">${fmtNum(finalPrice)} ${AdminState.currency}</span>
                <span style="text-decoration:line-through;color:var(--text-muted);font-size:0.8rem;margin-inline-start:4px;">${fmtNum(origPrice)}</span>
                <div style="font-size:0.75rem;color:#ef4444;font-weight:600;">${isAr ? 'السعر بعد الخصم' : 'Discounted Price'}</div>
              </div>
            ` : `
              <div>
                <span style="color:var(--text-primary);font-weight:800;font-size:0.95rem;">${fmtNum(finalPrice)} ${AdminState.currency}</span>
                <div style="font-size:0.75rem;color:var(--text-muted);">${isAr ? 'السعر الأساسي' : 'Base Price'}</div>
              </div>
            `;

            const phoneVal = o.buyerPhone || o.phone || '';
            const buyerVal = o.buyerName || o.userName || o.name || '';

            return `
              <tr>
                <td>#${o.id}</td>
                <td>${orderTypeBadge}</td>
                <td>
                  <div style="font-weight:600;color:var(--text-primary);">${buyerVal}</div>
                  ${phoneVal ? `<a href="https://wa.me/${phoneVal.replace(/[^0-9]/g,'')}" target="_blank" style="font-size:0.8rem;color:#38bdf8;display:inline-flex;align-items:center;gap:4px;"><i class="fab fa-whatsapp"></i> ${phoneVal}</a>` : ''}
                </td>
                <td>${o.serviceName || ''}</td>
                <td>${priceDisplay}</td>
                <td><span class="status-badge ${o.status || 'pending'}">${t(o.status || 'pending')}</span></td>
                <td>
                  <button class="btn btn-sm btn-glass" onclick="toggleOrderStatus(${o.id})" title="${t('changeStatus')}"><i class="fas fa-sync"></i></button>
                  <button class="btn btn-sm btn-glass" style="color:#ef4444" onclick="deleteOrder(${o.id})" title="${t('delete')}"><i class="fas fa-trash"></i></button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function toggleOrderStatus(id) {
  const statuses = ['pending','completed','cancelled'];
  const res = await fetch('/api/orders');
  const orders = res.ok ? await res.json() : [];
  const o = orders.find(x=>x.id===id);
  if (o) {
    const idx = statuses.indexOf(o.status);
    const next = statuses[(idx+1)%statuses.length];
    await fetch(`/api/orders/${id}/status`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status:next}) });
    loadSection('orders');
  }
}

async function deleteOrder(id) {
  if (!confirm(AdminState.lang==='ar'?'حذف هذا الطلب؟':'Delete order?')) return;
  await fetch(`/api/orders/${id}`, { method:'DELETE' });
  loadSection('orders');
}

// ===================================================================
//  8. SETTINGS
// ===================================================================
async function renderSettings(c) {
  c.innerHTML = `
    <h1 class="admin-page-title">${t('settings')}</h1>
    <div class="admin-tabs">
      <button class="admin-tab active" onclick="switchTab(this,'tab-pwd')">${t('changePassword')}</button>
      <button class="admin-tab" onclick="switchTab(this,'tab-backup')">${t('backupRestore')}</button>
    </div>
    <div id="tab-pwd" class="admin-tab-content active"><div class="glass-card">
      <form onsubmit="changePassword(event)">
        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'كلمة المرور الحالية':'Current Password'}</label>
          <input type="password" class="form-input" name="currentPassword" required></div>
        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'كلمة المرور الجديدة':'New Password'}</label>
          <input type="password" class="form-input" name="newPassword" required></div>
        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'تأكيد كلمة المرور':'Confirm Password'}</label>
          <input type="password" class="form-input" name="confirmPassword" required></div>
        <button type="submit" class="btn btn-primary"><i class="fas fa-key"></i> ${t('save')}</button>
      </form>
    </div></div>
    <div id="tab-backup" class="admin-tab-content"><div class="glass-card">
      <p style="color:var(--text-muted);margin-bottom:1.5rem">${AdminState.lang==='ar'?'تصدير أو استعادة بيانات الموقع بالكامل':'Export or restore all site data'}</p>
      <div style="display:flex;gap:1rem">
        <button class="btn btn-primary" onclick="createBackup()"><i class="fas fa-download"></i> ${AdminState.lang==='ar'?'تصدير نسخة احتياطية':'Create Backup'}</button>
        <label class="btn btn-glass" style="cursor:pointer"><i class="fas fa-upload"></i> ${AdminState.lang==='ar'?'استعادة نسخة':'Restore'}
          <input type="file" accept=".json" onchange="restoreBackup(this)" style="display:none"></label>
      </div>
    </div></div>
  `;
}

async function changePassword(e) {
  e.preventDefault();
  const f = e.target;
  if (f.newPassword.value !== f.confirmPassword.value) {
    notify('error', AdminState.lang==='ar'?'كلمة المرور غير متطابقة':'Passwords do not match');
    return;
  }
  const res = await fetch('/api/auth/change-password', { method:'PUT', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ currentPassword:f.currentPassword.value, newPassword:f.newPassword.value })
  });
  if (res.ok) { notify('success', AdminState.lang==='ar'?'تم تحديث كلمة المرور':'Password updated'); f.reset(); }
  else { const d = await res.json(); notify('error', d.message||'Error'); }
}

function createBackup() {
  const data = {};
  ['admins','categories','services','users','orders','complaints','reviews','notifications','config','offers'].forEach(k => {
    const v = localStorage.getItem(`svip-${k}`);
    if (v) data[k] = JSON.parse(v);
  });
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `svip-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  notify('success', AdminState.lang==='ar'?'تم تصدير النسخة الاحتياطية':'Backup created');
}

function restoreBackup(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      Object.keys(data).forEach(k => localStorage.setItem(`svip-${k}`, JSON.stringify(data[k])));
      notify('success', AdminState.lang==='ar'?'تم استعادة النسخة الاحتياطية. أعد تحميل الصفحة.':'Backup restored. Please reload.');
      setTimeout(()=>location.reload(), 1500);
    } catch(err) { notify('error', 'Invalid backup file'); }
  };
  reader.readAsText(file);
}

// ===================================================================
//  9. ADMINS & PERMISSIONS
// ===================================================================
async function renderAdmins(c) {
  const res = await fetch('/api/admins');
  const admins = res.ok ? await res.json() : [];
  const permLabels = {
    website: AdminState.lang==='ar'?'الموقع':'Website',
    services: AdminState.lang==='ar'?'المنتجات':'Products',
    offers: AdminState.lang==='ar'?'العروض':'Offers',
    users: AdminState.lang==='ar'?'المستخدمين':'Users',
    complaints: AdminState.lang==='ar'?'الشكاوى':'Complaints',
    orders: AdminState.lang==='ar'?'الطلبات':'Orders',
    settings: AdminState.lang==='ar'?'الإعدادات':'Settings',
    admins: AdminState.lang==='ar'?'المشرفين':'Admins'
  };

  c.innerHTML = `
    <h1 class="admin-page-title">${t('adminsManagement')}</h1>
    <div style="display:flex;justify-content:flex-end;margin-bottom:1.5rem">
      <button class="btn btn-primary" onclick="openAdminModal()"><i class="fas fa-plus"></i> ${AdminState.lang==='ar'?'إضافة مشرف':'Add Admin'}</button>
    </div>
    <div class="glass-card" style="overflow-x:auto"><table class="admin-table"><thead><tr>
      <th>${t('id')}</th><th>${AdminState.lang==='ar'?'الاسم':'Name'}</th><th>${AdminState.lang==='ar'?'البريد':'Email'}</th><th>${AdminState.lang==='ar'?'الدور':'Role'}</th><th>${AdminState.lang==='ar'?'الصلاحيات':'Permissions'}</th><th>${t('actions')}</th>
    </tr></thead><tbody>
      ${admins.map(a=>`<tr>
        <td>${a.id}</td><td>${a.name||a.username}</td><td>${a.email}</td>
        <td><span class="status-badge active">${a.role==='owner'?(AdminState.lang==='ar'?'مالك':'Owner'):(AdminState.lang==='ar'?'مشرف':'Admin')}</span></td>
        <td style="max-width:200px">${a.role==='owner'?(AdminState.lang==='ar'?'كل الصلاحيات':'Full Access'):Object.entries(a.permissions||{}).filter(([,v])=>v).map(([k])=>permLabels[k]||k).join(', ')||'—'}</td>
        <td>${a.role!=='owner'?`
          <button class="btn btn-sm btn-glass" onclick="editAdmin(${a.id})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-glass" style="color:#ef4444" onclick="deleteAdmin(${a.id})"><i class="fas fa-trash"></i></button>
        `:'—'}</td>
      </tr>`).join('')}
    </tbody></table></div>`;
}

function openAdminModal(admin=null) {
  const isEdit = !!admin;
  const perms = ['website','services','offers','users','complaints','orders','settings','admins'];
  const permLabels = {website:'الموقع',services:'المنتجات',offers:'العروض',users:'المستخدمين',complaints:'الشكاوى',orders:'الطلبات',settings:'الإعدادات',admins:'المشرفين'};

  openModal(isEdit?(AdminState.lang==='ar'?'تعديل مشرف':'Edit Admin'):(AdminState.lang==='ar'?'إضافة مشرف':'Add Admin'), `
    <form onsubmit="saveAdmin(event, ${isEdit?admin.id:'null'})">
      <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'الاسم':'Name'}</label>
        <input type="text" class="form-input" name="name" value="${admin?admin.name:''}" required></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'اسم المستخدم':'Username'}</label>
          <input type="text" class="form-input" name="username" value="${admin?admin.username:''}" required></div>
        <div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'البريد':'Email'}</label>
          <input type="email" class="form-input" name="email" value="${admin?admin.email:''}" required></div>
      </div>
      ${!isEdit?`<div class="form-group"><label class="form-label">${AdminState.lang==='ar'?'كلمة المرور':'Password'}</label>
        <input type="password" class="form-input" name="password" required></div>`:''}
      <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border-color)">
        <h4 style="margin-bottom:1rem;color:var(--primary-light)">${AdminState.lang==='ar'?'الصلاحيات':'Permissions'}</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
          ${perms.map(p=>`<label style="display:flex;align-items:center;gap:.5rem;cursor:pointer">
            <input type="checkbox" name="perm_${p}" ${admin?.permissions?.[p]!==false?'checked':''} style="width:18px;height:18px;accent-color:var(--primary)">
            <span>${permLabels[p]||p}</span>
          </label>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1.5rem">
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${t('save')}</button>
        <button type="button" class="btn btn-glass" onclick="closeModal()">${t('cancel')}</button>
      </div>
    </form>
  `);
}

async function saveAdmin(e, editId) {
  e.preventDefault();
  const f = e.target;
  const perms = {};
  ['website','services','offers','users','complaints','orders','settings','admins'].forEach(p => {
    perms[p] = f[`perm_${p}`].checked;
  });
  const data = { name:f.name.value, username:f.username.value, email:f.email.value, permissions:perms };
  if (!editId && f.password) data.password = f.password.value;

  if (editId) {
    await fetch(`/api/admins/${editId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  } else {
    await fetch('/api/admins', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  }
  closeModal();
  notify('success', AdminState.lang==='ar'?'تم الحفظ':'Saved');
  loadSection('admins');
}

async function editAdmin(id) {
  const res = await fetch('/api/admins');
  const admins = res.ok ? await res.json() : [];
  const admin = admins.find(a=>a.id===id);
  if (admin) openAdminModal(admin);
}

async function deleteAdmin(id) {
  if (!confirm(AdminState.lang==='ar'?'حذف هذا المشرف؟':'Delete admin?')) return;
  const res = await fetch(`/api/admins/${id}`, { method:'DELETE' });
  if (res.ok) { notify('success', AdminState.lang==='ar'?'تم الحذف':'Deleted'); loadSection('admins'); }
  else { const d = await res.json(); notify('error', d.message||'Error'); }
}

// ========== Logout ==========
async function adminLogout() {
  await fetch('/api/auth/logout', { method:'POST' });
  localStorage.removeItem('svip-auth');
  location.href = '../login.html';
}
