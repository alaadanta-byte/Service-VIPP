import React, { useState } from 'react';
import { useBackend } from '../context/BackendContext';

export default function ComplaintsPage() {
  const { addComplaint, lang } = useBackend();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addComplaint(form);
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '700px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="section-title">
            {lang === 'ar' ? 'تقديم شكوى أو اقتراح' : 'Submit a Complaint or Suggestion'}
          </h1>
          <p className="section-subtitle">
            {lang === 'ar' ? 'يهمنا رأيك ويسعدنا مساعدتك في أي مشكلة تفضل بتقديم تفاصيلها' : 'Your satisfaction is our priority. Let us know how we can help.'}
          </p>
        </div>

        {submitted ? (
          <div className="glass-panel" style={{ padding: '3rem', borderRadius: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.8rem' }}>
              {lang === 'ar' ? 'تم استلام طلبك بنجاح!' : 'Submission Received!'}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'سيقوم فريق الدعم بمراجعة شكواك والتواصل معك في أقرب وقت.' : 'Our support team will review your complaint and contact you shortly.'}
            </p>
            <button onClick={() => setSubmitted(false)} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              {lang === 'ar' ? 'تقديم شكوى أخرى' : 'Submit Another'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'عنوان الموضوع / رقم الطلب' : 'Subject / Order ID'}
              </label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({...form, subject: e.target.value})}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div style={{ marginBottom: '1.8rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {lang === 'ar' ? 'تفاصيل الشكوى' : 'Complaint Details'}
              </label>
              <textarea
                rows="5"
                required
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-color)' }}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
              📩 {lang === 'ar' ? 'إرسال الشكوى' : 'Submit Complaint'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
