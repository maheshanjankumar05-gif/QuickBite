import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  X,
  Truck,
} from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    appliedPromo,
    discountAmount,
    applyPromoCode,
    removePromoCode,
    grandTotal,
    totalItemCount,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput.trim());
      setPromoInput('');
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '80px 0', minHeight: '65vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '520px' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#fff4eb',
              color: '#ff6b00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <ShoppingBag size={48} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
            Your Cart is Hungry!
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Looks like you haven't added anything to your cart yet. Explore our mouthwatering menu and discover fresh delights!
          </p>
          <Link to="/menu" className="btn btn-primary btn-lg" style={{ gap: '10px' }}>
            <span>Browse Delicious Menu</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '50px 0 90px' }}>
      <div className="container">
        {/* Page Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
              Your <span style={{ color: '#ff6b00' }}>Shopping Cart</span>
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>
              {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in your order
            </p>
          </div>

          <button
            onClick={clearCart}
            style={{
              background: 'none',
              color: '#ef4444',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Trash2 size={16} />
            Clear Cart
          </button>
        </div>

        {/* Free Delivery Progress Alert */}
        {subtotal < 500 && (
          <div
            style={{
              backgroundColor: '#fff4eb',
              border: '1.5px solid #fed7aa',
              borderRadius: '14px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '28px',
              color: '#9a3412',
            }}
          >
            <Truck size={22} color="#ff6b00" />
            <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>
              Add items worth <strong>₹{500 - subtotal}</strong> more to unlock <strong style={{ color: '#ff6b00' }}>FREE Delivery!</strong>
            </div>
          </div>
        )}

        {/* 2-Column Grid: Items & Order Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'flex-start',
        }}>
          {/* Left Column: Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cartItems.map((item) => {
              const imageUrl = item.image?.startsWith('/uploads')
                ? `http://localhost:5000${item.image}`
                : item.image;

              return (
                <div
                  key={item._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    border: '1px solid #f1f5f9',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    position: 'relative',
                  }}
                >
                  {/* Food Thumbnail */}
                  <img
                    src={imageUrl}
                    alt={item.name}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      backgroundColor: '#f1f5f9',
                      flexShrink: 0,
                    }}
                  />

                  {/* Food Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: item.isVeg ? '#10b981' : '#ef4444',
                        }}
                      />
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                        {item.name}
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '6px' }}>
                      {item.category} • ₹{item.price} each
                    </p>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ff6b00' }}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '4px',
                      gap: '8px',
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      style={{
                        background: '#ffffff',
                        color: '#0f172a',
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                      }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ fontWeight: 800, minWidth: '18px', textAlign: 'center', fontSize: '0.9rem' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      style={{
                        background: '#ff6b00',
                        color: '#ffffff',
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(255, 107, 0, 0.4)',
                      }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    style={{
                      background: 'none',
                      color: '#94a3b8',
                      padding: '8px',
                      borderRadius: '8px',
                      transition: 'var(--transition)',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Column: Order Summary Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid #f1f5f9',
              boxShadow: 'var(--shadow-md)',
              position: 'sticky',
              top: '100px',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
              Order Bill Summary
            </h2>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. QUICK50)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  />
                  <Tag size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                </div>
                <button type="submit" className="btn btn-dark btn-sm" style={{ borderRadius: '10px', fontWeight: 700 }}>
                  Apply
                </button>
              </div>
            </form>

            {/* Applied Promo Alert */}
            {appliedPromo && (
              <div
                style={{
                  backgroundColor: '#ecfdf5',
                  border: '1.5px solid #a7f3d0',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  fontSize: '0.85rem',
                  color: '#065f46',
                }}
              >
                <div>
                  <strong>{appliedPromo.code}</strong>: {appliedPromo.description}
                </div>
                <button
                  onClick={removePromoCode}
                  style={{ background: 'none', color: '#065f46', display: 'flex' }}
                  title="Remove promo"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Item Subtotal</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{subtotal}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Delivery Charges</span>
                <span style={{ fontWeight: 700, color: deliveryFee === 0 ? '#10b981' : '#0f172a' }}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Taxes & Platform Fees (5%)</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{tax}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 700 }}>
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

              <div
                style={{
                  borderTop: '2px dashed #e2e8f0',
                  paddingTop: '16px',
                  marginTop: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                    Total Payable
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Inclusive of all taxes</span>
                </div>
                <span style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ff6b00' }}>
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1.05rem',
                borderRadius: '14px',
                gap: '10px',
              }}
            >
              <span>{isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
              <ArrowRight size={20} />
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '16px',
              fontSize: '0.78rem',
              color: '#94a3b8',
            }}>
              <ShieldCheck size={16} color="#10b981" />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

