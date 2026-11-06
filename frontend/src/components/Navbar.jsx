import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Menu as MenuIcon,
  X,
  LogOut,
  UtensilsCrossed,
  ShieldCheck,
  Package,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdown, setProfileDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileDropdown(false);
    navigate('/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #f1f3f7',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
        gap: '24px',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ff6b00, #ff8533)',
            color: '#fff',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(255, 107, 0, 0.35)',
          }}>
            <UtensilsCrossed size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
              Quick<span style={{ color: '#ff6b00' }}>Bite</span>
            </span>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px', marginTop: '-3px' }}>
              CRAVE • ORDER • ENJOY
            </span>
          </div>
        </Link>

        {/* Global Search Bar (Desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: '1',
            maxWidth: '380px',
            position: 'relative',
            display: 'none',
          }}
          className="desktop-search"
        >
          <input
            type="text"
            placeholder="Search pizza, burger, biryani..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 42px',
              borderRadius: '9999px',
              border: '1.5px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              fontSize: '0.9rem',
              transition: 'var(--transition)',
            }}
          />
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }}
          />
        </form>

        {/* Nav Links (Desktop) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: location.pathname === '/' ? '#ff6b00' : '#475569',
              transition: 'var(--transition)',
            }}
          >
            Home
          </Link>
          <Link
            to="/menu"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: location.pathname.startsWith('/menu') ? '#ff6b00' : '#475569',
              transition: 'var(--transition)',
            }}
          >
            Menu
          </Link>
          <Link
            to="/my-orders"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: location.pathname === '/my-orders' ? '#ff6b00' : '#475569',
              transition: 'var(--transition)',
            }}
          >
            My Orders
          </Link>

          {/* Admin link */}
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0f172a',
              backgroundColor: '#f1f5f9',
              padding: '6px 12px',
              borderRadius: '8px',
            }}
          >
            <ShieldCheck size={16} color="#ff6b00" />
            Admin
          </a>
        </nav>

        {/* Action Controls: Cart + Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Cart Icon */}
          <Link
            to="/cart"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#fff4eb',
              color: '#ff6b00',
              transition: 'var(--transition)',
            }}
            aria-label="View Shopping Cart"
          >
            <ShoppingBag size={22} />
            {totalItemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#ff6b00',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(255, 107, 0, 0.4)',
                }}
              >
                {totalItemCount}
              </span>
            )}
          </Link>

          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  color: '#1e293b',
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#ff6b00',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: '0.9rem' }}>{user?.name?.split(' ')[0]}</span>
              </button>

              {/* Dropdown Menu */}
              {profileDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 10px)',
                    width: '210px',
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid #f1f5f9',
                    padding: '8px',
                    zIndex: 200,
                    animation: 'fadeIn 0.2s ease-out',
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdown(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#334155',
                      borderRadius: '8px',
                    }}
                  >
                    <UserIcon size={16} />
                    My Profile
                  </Link>

                  <Link
                    to="/my-orders"
                    onClick={() => setProfileDropdown(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#334155',
                      borderRadius: '8px',
                    }}
                  >
                    <Package size={16} />
                    My Orders
                  </Link>

                  {isAdmin && (
                    <a
                      href="http://localhost:5174"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#ff6b00',
                        borderRadius: '8px',
                      }}
                    >
                      <ShieldCheck size={16} />
                      Admin Dashboard
                    </a>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#ef4444',
                      borderRadius: '8px',
                      background: 'none',
                      textAlign: 'left',
                    }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ fontWeight: 700 }}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              padding: '6px',
              color: '#334155',
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <MenuIcon size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #f1f5f9',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }} />
          </form>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, padding: '8px 0' }}
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, padding: '8px 0' }}
          >
            All Menu
          </Link>
          <Link
            to="/my-orders"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, padding: '8px 0' }}
          >
            Track Orders
          </Link>
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 600, color: '#ff6b00', padding: '8px 0' }}
          >
            Admin Dashboard ↗
          </a>
        </div>
      )}

      <style>{`
        @media (min-width: 820px) {
          .desktop-search { display: block !important; }
        }
        @media (max-width: 820px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

