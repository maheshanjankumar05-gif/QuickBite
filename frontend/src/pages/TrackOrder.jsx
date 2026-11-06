import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import OrderTracker from '../components/OrderTracker';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { toast } from 'react-toastify';
import {
  Package,
  Calendar,
  MapPin,
  Phone,
  RefreshCw,
  ArrowLeft,
  Clock,
  CheckCircle,
} from 'lucide-react';

const TrackOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/order/${id}`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error('Error fetching order track details:', err);
      toast.error('Unable to fetch order details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrder();
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 0', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Order Not Found</h2>
        <Link to="/my-orders" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div style={{ padding: '40px 0 90px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Navigation link */}
        <Link
          to="/my-orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            fontSize: '0.9rem',
            fontWeight: 700,
            marginBottom: '24px',
          }}
        >
          <ArrowLeft size={16} />
          Back to My Orders
        </Link>

        {/* Top Header Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #f1f5f9',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                Order #{order._id.substring(order._id.length - 8).toUpperCase()}
              </h1>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
              Placed on {formattedDate}
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
            disabled={refreshing}
          >
            <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Live Step Tracker */}
        <div style={{ marginBottom: '32px' }}>
          <OrderTracker orderStatus={order.orderStatus} />
        </div>

        {/* 2 Column Details: Items & Delivery Information */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {/* Items Summary */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #f1f5f9',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Items Ordered ({order.items.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.92rem',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #f8fafc',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 800, color: '#ff6b00' }}>{item.quantity}x</span>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#64748b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Fee</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Taxes</span>
                <span>₹{order.tax}</span>
              </div>
              <div style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: '12px',
                marginTop: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                color: '#0f172a',
                fontSize: '1.1rem',
                fontWeight: 800,
              }}>
                <span>Total Amount</span>
                <span style={{ color: '#ff6b00' }}>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #f1f5f9',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Delivery Destination
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={18} color="#ff6b00" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontWeight: 700, color: '#0f172a' }}>{order.customerDetails.name}</p>
                  <p style={{ color: '#64748b', marginTop: '2px' }}>
                    {order.customerDetails.address}, {order.customerDetails.city} - {order.customerDetails.postalCode}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={18} color="#ff6b00" style={{ flexShrink: 0 }} />
                <span style={{ color: '#475569' }}>{order.customerDetails.phone}</span>
              </div>

              {order.customerDetails.notes && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  marginTop: '8px',
                }}>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Delivery Instructions
                  </p>
                  <p style={{ color: '#334155', fontSize: '0.88rem', marginTop: '4px' }}>
                    {order.customerDetails.notes}
                  </p>
                </div>
              )}

              <div style={{
                backgroundColor: '#fff4eb',
                padding: '14px',
                borderRadius: '12px',
                marginTop: '12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#9a3412', fontWeight: 600 }}>Payment Mode:</span>
                  <strong style={{ color: '#ff6b00', fontSize: '0.92rem' }}>{order.paymentMethod}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#9a3412', fontWeight: 600 }}>Payment Status:</span>
                  <span style={{ fontWeight: 700, color: order.paymentStatus === 'Paid' ? '#10b981' : '#b45309' }}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;

