import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  FolderTree,
  Users,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const AdminSidebar = () => {
  const { adminUser, logout } = useAdminAuth();

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/foods', label: 'Food Items', icon: UtensilsCrossed },
    { to: '/orders', label: 'Customer Orders', icon: ShoppingBag },
    { to: '/categories', label: 'Food Categories', icon: FolderTree },
    { to: '/users', label: 'Registered Users', icon: Users },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#0f111a',
      color: '#cbd5e1',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #1e2438',
      flexShrink: 0,
      minHeight: '100vh',
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid #1e2438',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #ff6b00, #ff8533)',
          color: '#fff',
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(255, 107, 0, 0.4)',
        }}>
          <ShieldCheck size={22} />
        </div>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
            Quick<span style={{ color: '#ff6b00' }}>Bite</span>
          </span>
          <span style={{ display: 'block', fontSize: '0.68rem', color: '#ff8533', fontWeight: 700, letterSpacing: '1px' }}>
            ADMIN PORTAL
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', padding: '0 12px 8px' }}>
          Menu Management
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? '#ff6b00' : 'transparent',
                transition: 'var(--transition)',
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div style={{ margin: '16px 0', borderTop: '1px solid #1e2438' }} />

        {/* External Customer Website Link */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#cbd5e1',
            backgroundColor: '#171a26',
            transition: 'var(--transition)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ExternalLink size={16} color="#ff6b00" />
            <span>Customer Website</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>5173 ↗</span>
        </a>
      </nav>

      {/* User Info & Logout Footer */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #1e2438',
        backgroundColor: '#141724',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#ff6b00',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.88rem',
            flexShrink: 0,
          }}>
            {adminUser?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {adminUser?.name || 'Administrator'}
            </p>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Admin Role</p>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign Out"
          style={{
            background: 'none',
            color: '#ef4444',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
          }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

