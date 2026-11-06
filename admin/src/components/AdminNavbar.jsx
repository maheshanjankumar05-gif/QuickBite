import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ShieldCheck, Calendar } from 'lucide-react';

const AdminNavbar = ({ title = 'Dashboard Overview' }) => {
  const { adminUser } = useAdminAuth();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header style={{
      height: '70px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
    }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
          {title}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#64748b',
          fontSize: '0.85rem',
          fontWeight: 600,
          backgroundColor: '#f8fafc',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}>
          <Calendar size={15} />
          <span>{today}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '8px',
          color: '#065f46',
          fontSize: '0.82rem',
          fontWeight: 700,
        }}>
          <ShieldCheck size={16} />
          <span>Authenticated Administrator</span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;

