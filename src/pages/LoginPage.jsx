import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBackend } from '../context/BackendContext';

export default function LoginPage() {
  const { login, lang } = useBackend();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('owner@servicevip');
  const [password, setPassword] = useState('Service2030@');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(username, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-xl)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'var(--primary-gradient)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.8rem',
            color: '#fff',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-glow)'
          }}>V</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            {lang === 'ar' ? 'أدخل بيانات الحساب للوصول إلى لوحة التحكم' : 'Enter admin credentials to access dashboard'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(233, 69, 96, 0.15)',
            border: '1px solid rgba(233, 69, 96, 0.4)',
            color: 'var(--accent-light)',
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'اسم المستخدم / البريد' : 'Username / Email'}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1.1rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1.1rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
            🔑 {lang === 'ar' ? 'دخول لوحة التحكم' : 'Login to Admin'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.8rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border-color)' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            ← {lang === 'ar' ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
          </Link>
        </div>

      </div>
    </div>
  );
}
