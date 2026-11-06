import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck, Flame, Star } from 'lucide-react';

const HeroBanner = () => {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #0f111a 0%, #1a1e2f 100%)',
      color: '#ffffff',
      padding: '70px 0 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative Glows */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255, 107, 0, 0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'center',
        gap: '48px',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Left Column: Text & CTAs */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 107, 0, 0.15)',
            border: '1px solid rgba(255, 107, 0, 0.3)',
            padding: '8px 16px',
            borderRadius: '9999px',
            color: '#ff8533',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '20px',
          }}>
            <Flame size={16} color="#ff6b00" />
            <span>Fastest Food Delivery In Your City</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-1px',
            marginBottom: '20px',
          }}>
            Delicious Food Delivered <span style={{
              background: 'linear-gradient(135deg, #ff6b00, #ffaa00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Hot & Fresh</span> In 30 Mins.
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: '#94a3b8',
            lineHeight: 1.6,
            marginBottom: '32px',
            maxWidth: '520px',
          }}>
            Satisfy your cravings with stone-baked pizzas, juicy gourmet burgers, fragrant dum biryanis, and decadent desserts. Prepared fresh, delivered fast.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
            <Link to="/menu" className="btn btn-primary btn-lg" style={{ gap: '10px' }}>
              Order Now <ArrowRight size={20} />
            </Link>
            <a href="#offers" className="btn btn-outline btn-lg" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
              Special Offers 🏷️
            </a>
          </div>

          {/* Features Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(255, 107, 0, 0.2)',
                padding: '8px',
                borderRadius: '50%',
                color: '#ff6b00',
              }}>
                <Clock size={18} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>30 Min</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Superfast Delivery</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '8px',
                borderRadius: '50%',
                color: '#10b981',
              }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>100% Fresh</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Hygienic Kitchens</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(245, 158, 11, 0.2)',
                padding: '8px',
                borderRadius: '50%',
                color: '#f59e0b',
              }}>
                <Star size={18} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>4.8 ★ Rating</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>15,000+ Happy Foodies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Graphic */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '440px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
          }}>
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
              alt="Delightful gourmet dishes"
              style={{
                width: '100%',
                height: '420px',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Floating Top Badge */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(15, 17, 26, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '10px 18px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <span style={{ fontSize: '1.2rem' }}>🔥</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Trending Today: Artisan Pizza</span>
            </div>

            {/* Floating Bottom Card */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '14px 18px',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                background: '#ff6b00',
                color: '#fff',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}>
                50%
              </div>
              <div>
                <p style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.9rem' }}>Use Code: QUICK50</p>
                <p style={{ color: '#64748b', fontSize: '0.75rem' }}>Up to ₹100 OFF on 1st Order</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

