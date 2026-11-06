import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { toast } from 'react-toastify';
import {
  Package,
  Calendar,
  Clock,
  ArrowRight,
  Eye,
  AlertCircle,
  XCircle,
} from 'lucide-react';

const MyOrders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('quickbite_token')) {
      navigate('/login?redirect=my-orders');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/order/my-orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Unable to fetch your orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const res = await api.put(`/order/${orderId}/cancel`);
      if (res.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.message || 'Cannot cancel order');
    }
  };

  return (
    <div style={{ padding: '50px 0 90px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
            My <span style={{ color: '#ff6b00' }}>Orders</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '4px' }}>
            View your order history and track live deliveries in real-time.
          </p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : orders.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '60px 20px',
              textAlign: 'center',
              maxWidth: '520px',
              margin: '0 auto',
              border: '1px solid #f1f5f9',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#fff4eb',
                color: '#ff6b00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Package size={40} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              No Orders Placed Yet
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
              You haven't ordered any delicious food yet. Treat yourself today!
            </p>
            <Link to="/menu" className="btn btn-primary btn-lg">
              Order Food Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isCancellable = order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed';

              return (
                <div
                  key={order._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    padding: '24px',
                    border: '1px solid #f1f5f9',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                  }}
                >
                  {/* Top Bar: Order ID, Date, Status */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '16px',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                          Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </span>
                        <OrderStatusBadge status={order.orderStatus} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>
                        <Calendar size={14} />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Link
                        to={`/track-order/${order._id}`}
                        className="btn btn-primary btn-sm"
                        style={{ gap: '6px' }}
                      >
                        <Eye size={16} />
                        <span>Track Order</span>
                      </Link>

                      {isCancellable && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          style={{
                            background: 'none',
                            color: '#ef4444',
                            border: '1px solid #fca5a5',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Middle: Items List */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          backgroundColor: '#f8fafc',
                          padding: '8px 14px',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <span style={{ fontWeight: 800, color: '#ff6b00', fontSize: '0.88rem' }}>
                          {item.quantity}x
                        </span>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1e293b' }}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom: Payment Method & Total */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '14px',
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      <span>Payment: <strong>{order.paymentMethod}</strong></span>
                      <span style={{ margin: '0 8px' }}>•</span>
                      <span style={{ color: order.paymentStatus === 'Paid' ? '#10b981' : '#b45309', fontWeight: 700 }}>
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Paid:</span>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ff6b00' }}>
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

