import React from 'react';
import { Tag, Sparkles, Check, Copy } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const offers = [
  {
    code: 'QUICK50',
    title: '50% OFF up to ₹100',
    desc: 'Valid on your orders. Perfect bite for a quick lunch or dinner.',
    bg: 'linear-gradient(135deg, #ff6b00 0%, #ff8c33 100%)',
    textColor: '#ffffff',
  },
  {
    code: 'FREEDEL',
    title: 'Free Express Delivery',
    desc: 'No delivery fee on any order today. Hot food straight to you!',
    bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    textColor: '#ffffff',
  },
  {
    code: 'TASTY20',
    title: 'Flat 20% Discount',
    desc: 'Enjoy royal party feasts with an instant 20% slash on your subtotal.',
    bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    textColor: '#ffffff',
  },
];

const SpecialOffers = () => {
  const { applyPromoCode, appliedPromo } = useCart();

  const handleApply = (code) => {
    applyPromoCode(code);
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.info(`Promo code "${code}" copied to clipboard!`);
  };

  return (
    <section id="offers" style={{ padding: '60px 0' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">🏷️ Exclusive Deals</span>
          <h2 className="section-title">Special Offers & Coupons</h2>
          <p className="section-subtitle">
            Apply these limited-time promotional promo codes during checkout or add them right away!
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {offers.map((offer) => {
            const isApplied = appliedPromo?.code === offer.code;

            return (
              <div
                key={offer.code}
                style={{
                  background: offer.bg,
                  color: offer.textColor,
                  borderRadius: '20px',
                  padding: '28px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '200px',
                }}
              >
                {/* Decorative circle */}
                <div style={{
                  position: 'absolute',
                  right: '-20px',
                  bottom: '-20px',
                  width: '120px',
                  height: '120px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }} />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Sparkles size={18} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Limited Time
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 }}>
                    {offer.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', opacity: 0.9, lineHeight: 1.5, marginBottom: '20px' }}>
                    {offer.desc}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(6px)',
                  padding: '8px 14px',
                  borderRadius: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={16} />
                    <span style={{ fontWeight: 800, letterSpacing: '1px', fontSize: '1.05rem' }}>
                      {offer.code}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleCopy(offer.code)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.25)',
                        color: '#fff',
                        padding: '6px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Copy Code"
                    >
                      <Copy size={15} />
                    </button>

                    <button
                      onClick={() => handleApply(offer.code)}
                      style={{
                        background: isApplied ? '#10b981' : '#ffffff',
                        color: isApplied ? '#ffffff' : '#0f172a',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {isApplied ? (
                        <>
                          <Check size={14} /> Applied
                        </>
                      ) : (
                        'Apply Now'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;

