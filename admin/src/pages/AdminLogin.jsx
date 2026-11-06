import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { toast } from 'react-toastify';
import { ShieldCheck, Mail, Lock, ArrowRight, ExternalLink } from 'lucide-react';

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(formData.email, formData.password);
      toast.success('Admin authentication verified. Welcome!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setFormData({
      email: 'admin@quickbite.com',
      password: 'admin123',
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f111a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: '#171a26',
        borderRadius: '24px',
        padding: '40px',
        border: '1px solid #282d42',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ff6b00, #ff8533)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(255, 107, 0, 0.4)',
          }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff' }}>
            QuickBite Admin Portal
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '6px' }}>
            Restricted management console for authorized staff
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Admin Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="admin@quickbite.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                style={{
                  paddingLeft: '40px',
                  backgroundColor: '#0f111a',
                  borderColor: '#2d334d',
                  color: '#ffffff',
                }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748b' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ color: '#cbd5e1' }}>Admin Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
                style={{
                  paddingLeft: '40px',
                  backgroundColor: '#0f111a',
                  borderColor: '#2d334d',
                  color: '#ffffff',
                }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#64748b' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', borderRadius: '12px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Authenticating...' : 'Sign In as Admin'}
          </button>
        </form>

        {/* Quick Fill Button */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              background: '#202436',
              color: '#ff8533',
              border: '1px solid #2d334d',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            🛡️ Click to Fill Default Admin Credentials
          </button>
        </div>

        {/* Return to customer site */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a
            href="http://localhost:5173"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              color: '#94a3b8',
            }}
          >
            <span>Back to Customer Front-end</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

