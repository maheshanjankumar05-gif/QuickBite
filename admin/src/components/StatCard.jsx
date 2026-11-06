import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = '#ff6b00', bgLight = '#fff4eb', subtitle }) => {
  return (
    <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: bgLight,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={28} />
      </div>

      <div>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', display: 'block' }}>
          {title}
        </span>
        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
          {value}
        </span>
        {subtitle && (
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, display: 'block', marginTop: '4px' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;

