import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#0f111a',
      color: '#cbd5e1',
      paddingTop: '60px',
      paddingBottom: '30px',
      marginTop: 'auto',
      borderTop: '1px solid #1e2438',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '50px',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #ff6b00, #ff8533)',
                color: '#fff',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <UtensilsCrossed size={20} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                Quick<span style={{ color: '#ff6b00' }}>Bite</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '20px' }}>
              Delivering sizzling gourmet happiness right to your doorstep in 30 minutes. Fresh ingredients, royal taste, and unmatched quality.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['🍕', '🍔', '🍛', '🍜', '🍰'].map((emoji, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#181b2a',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px' }}>
              Popular Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li><Link to="/menu?category=Pizza" style={{ color: '#94a3b8' }}>Artisan Pizzas</Link></li>
              <li><Link to="/menu?category=Burger" style={{ color: '#94a3b8' }}>Gourmet Burgers</Link></li>
              <li><Link to="/menu?category=Biryani" style={{ color: '#94a3b8' }}>Royal Dum Biryani</Link></li>
              <li><Link to="/menu?category=Chinese" style={{ color: '#94a3b8' }}>Sizzling Wok Chinese</Link></li>
              <li><Link to="/menu?category=Desserts" style={{ color: '#94a3b8' }}>Desserts & Cakes</Link></li>
              <li><Link to="/menu?category=Beverages" style={{ color: '#94a3b8' }}>Cold Brews & Shakes</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li><Link to="/menu" style={{ color: '#94a3b8' }}>Full Menu</Link></li>
              <li><Link to="/cart" style={{ color: '#94a3b8' }}>Shopping Cart</Link></li>
              <li><Link to="/my-orders" style={{ color: '#94a3b8' }}>Track My Order</Link></li>
              <li><a href="http://localhost:5174" target="_blank" rel="noopener noreferrer" style={{ color: '#ff6b00', fontWeight: 600 }}>Admin Portal ↗</a></li>
              <li><span style={{ color: '#94a3b8' }}>Terms of Service</span></li>
              <li><span style={{ color: '#94a3b8' }}>Privacy Policy</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px' }}>
              Contact & Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#ff6b00" />
                <span>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#ff6b00" />
                <span>support@quickbite.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} color="#ff6b00" />
                <span>Open 10:00 AM – 11:30 PM Everyday</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="#ff6b00" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>QuickBite Food Park, Cyber Hub, New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1e2438',
          paddingTop: '25px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.85rem',
          color: '#64748b',
        }}>
          <p>© {new Date().getFullYear()} QuickBite Technologies Inc. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built with <Heart size={14} color="#ff6b00" fill="#ff6b00" /> for food lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

