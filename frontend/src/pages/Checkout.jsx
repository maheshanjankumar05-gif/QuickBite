import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  Truck,
  ArrowRight,
} from 'lucide-react';

const Checkout = () => {
  const { cartItems, subtotal, deliveryFee, tax, discountAmount, grandTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || 'New Delhi',
    postalCode: user?.address?.postalCode || '110001',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    }
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, cartItems, navigate]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address?.street || '',
        city: prev.city || user.address?.city || 'New Delhi',
        postalCode: prev.postalCode || user.address?.postalCode || '110001',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim()) {
      toast.error('Please fill in your name, contact phone, and delivery address');
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        items: cartItems.map((item) => ({
          foodId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.notes,
        },
        paymentMethod,
        notes: formData.notes,
      };

      const res = await api.post('/order', orderPayload);

      if (res.data.success) {
        toast.success('🎉 Order placed successfully! Tracking your delivery...');
        clearCart();
        navigate(`/track-order/${res.data.order._id}`);
      }
    } catch (err) {
      console.error('Order placement error:', err);
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '40px 0 90px' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Secure <span style={{ color: '#ff6b00' }}>Checkout</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '32px' }}>
          Confirm your delivery location and select your preferred payment option.
        </p>

        <form onSubmit={handlePlaceOrder}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'flex-start',
          }}>
            {/* Left Column: Delivery Details & Payment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Delivery Details Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '28px',
                  border: '1px solid #f1f5f9',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{
                    backgroundColor: '#fff4eb',
                    color: '#ff6b00',
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <MapPin size={20} />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    Delivery Address
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Street Address / House / Flat No. *</label>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. 42 Blossom Avenue, Flat 3B, Near Central Park"
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. New Delhi"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="e.g. 110001"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Delivery Instructions (Optional)</label>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="e.g. Leave package with guard, ring doorbell twice"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '28px',
                  border: '1px solid #f1f5f9',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{
                    backgroundColor: '#fff4eb',
                    color: '#ff6b00',
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <CreditCard size={20} />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    Choose Payment Method
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Option 1: Cash on Delivery */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      border: paymentMethod === 'Cash on Delivery' ? '2px solid #ff6b00' : '1.5px solid #e2e8f0',
                      backgroundColor: paymentMethod === 'Cash on Delivery' ? '#fffaf5' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={() => setPaymentMethod('Cash on Delivery')}
                        style={{ accentColor: '#ff6b00', width: '18px', height: '18px' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Banknote size={22} color="#ff6b00" />
                        <div>
                          <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                            Cash on Delivery (COD)
                          </p>
                          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            Pay in cash or UPI when your food arrives
                          </p>
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', background: '#ecfdf5', padding: '4px 8px', borderRadius: '6px' }}>
                      POPULAR
                    </span>
                  </label>

                  {/* Option 2: UPI / QR Code */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      border: paymentMethod === 'UPI' ? '2px solid #ff6b00' : '1.5px solid #e2e8f0',
                      backgroundColor: paymentMethod === 'UPI' ? '#fffaf5' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'UPI'}
                        onChange={() => setPaymentMethod('UPI')}
                        style={{ accentColor: '#ff6b00', width: '18px', height: '18px' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Smartphone size={22} color="#6366f1" />
                        <div>
                          <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                            Instant UPI (GPay, PhonePe, Paytm)
                          </p>
                          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            Pay instantly using any UPI app
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Option 3: Credit / Debit Card */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      border: paymentMethod === 'Card' ? '2px solid #ff6b00' : '1.5px solid #e2e8f0',
                      backgroundColor: paymentMethod === 'Card' ? '#fffaf5' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'Card'}
                        onChange={() => setPaymentMethod('Card')}
                        style={{ accentColor: '#ff6b00', width: '18px', height: '18px' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CreditCard size={22} color="#0284c7" />
                        <div>
                          <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                            Credit or Debit Card
                          </p>
                          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            Visa, Mastercard, RuPay & Amex supported
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Place Order Button */}
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
                Order Summary
              </h2>

              {/* Items preview */}
              <div style={{
                maxHeight: '220px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px',
                paddingRight: '6px',
              }}>
                {cartItems.map((item) => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: '#ff6b00' }}>{item.quantity}x</span>
                      <span style={{ color: '#0f172a', fontWeight: 600 }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#475569' }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Delivery Fee</span>
                  <span style={{ fontWeight: 700, color: deliveryFee === 0 ? '#10b981' : '#0f172a' }}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Taxes (5%)</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{tax}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 700 }}>
                    <span>Coupon Discount</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}

                <div style={{
                  borderTop: '2px dashed #e2e8f0',
                  paddingTop: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Total Amount</span>
                  <span style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ff6b00' }}>₹{grandTotal}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1.05rem',
                  borderRadius: '14px',
                  marginTop: '24px',
                  opacity: submitting ? 0.7 : 1,
                  gap: '10px',
                }}
              >
                {submitting ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <span>Place Order (₹{grandTotal})</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px',
                color: '#64748b',
                fontSize: '0.78rem',
              }}>
                <Truck size={14} color="#ff6b00" />
                <span>Estimated Delivery: 25 - 35 minutes</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

