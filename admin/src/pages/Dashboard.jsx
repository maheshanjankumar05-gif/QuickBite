import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  Users,
  UtensilsCrossed,
  ShoppingBag,
  IndianRupee,
  Clock,
  ArrowRight,
  TrendingUp,
  Package,
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
      toast.error('Unable to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/order/${orderId}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        toast.success(`Order #${orderId.substring(orderId.length - 6)} status updated to ${newStatus}`);
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  if (loading) {
    return <div className="spinner" />;
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];

  return (
    <div>
      {/* 4 Primary Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
      }}>
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}`}
          icon={IndianRupee}
          color="#ff6b00"
          bgLight="#fff4eb"
          subtitle="Non-cancelled orders"
        />

        <StatCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          icon={ShoppingBag}
          color="#6366f1"
          bgLight="#eef2ff"
          subtitle="Lifetime orders count"
        />

        <StatCard
          title="Food Dishes in Menu"
          value={stats.totalFoods || 0}
          icon={UtensilsCrossed}
          color="#10b981"
          bgLight="#ecfdf5"
          subtitle={`${stats.totalCategories || 0} active categories`}
        />

        <StatCard
          title="Registered Users"
          value={stats.totalUsers || 0}
          icon={Users}
          color="#0284c7"
          bgLight="#f0f9ff"
          subtitle="Customer accounts"
        />
      </div>

      {/* Orders Status Grid Overview */}
      <div className="admin-card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
          Orders Pipeline Status
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '14px',
        }}>
          {Object.entries(stats.ordersByStatus || {}).map(([status, count]) => {
            const statusClass = status.toLowerCase().replace(/\s+/g, '-');
            return (
              <div
                key={status}
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  textAlign: 'center',
                }}
              >
                <span className={`status-pill status-${statusClass}`} style={{ marginBottom: '8px' }}>
                  {status}
                </span>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                  {count}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="admin-card">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Recent Orders
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
              Latest customer food delivery requests
            </p>
          </div>

          <Link to="/orders" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            <span>View All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '30px' }}>No orders yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items Ordered</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Order Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => {
                  const statusClass = ord.orderStatus.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <tr key={ord._id}>
                      <td style={{ fontWeight: 800, color: '#0f172a' }}>
                        #{ord._id.substring(ord._id.length - 6).toUpperCase()}
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{ord.customerDetails?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{ord.customerDetails?.phone}</div>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600 }}>
                          {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </span>
                      </td>

                      <td style={{ fontWeight: 800, color: '#ff6b00' }}>
                        ₹{ord.totalAmount}
                      </td>

                      <td>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: ord.paymentStatus === 'Paid' ? '#10b981' : '#b45309' }}>
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </td>

                      <td>
                        <span className={`status-pill status-${statusClass}`}>
                          {ord.orderStatus}
                        </span>
                      </td>

                      <td>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            backgroundColor: '#fff',
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

