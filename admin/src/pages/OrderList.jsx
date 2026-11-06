import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  ShoppingBag,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  RefreshCw,
} from 'lucide-react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus !== 'All') params.status = filterStatus;

      const res = await api.get('/order/all', { params });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/order/${orderId}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        toast.success(`Order #${orderId.substring(orderId.length - 6).toUpperCase()} status updated to "${newStatus}"`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const id = o._id.toLowerCase();
    const name = o.customerDetails?.name?.toLowerCase() || '';
    const phone = o.customerDetails?.phone?.toLowerCase() || '';
    return id.includes(q) || name.includes(q) || phone.includes(q);
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            Customer Orders Management ({orders.length})
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Track, update statuses, and monitor deliveries across the pipeline
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="btn btn-secondary btn-sm"
          style={{ gap: '6px' }}
        >
          <RefreshCw size={15} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search by order ID, customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="#64748b" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '180px' }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="spinner" />
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <ShoppingBag size={40} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#475569' }}>
              No orders found
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
              Try changing the status filter
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Info</th>
                  <th>Customer & Destination</th>
                  <th>Order Items</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Current Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => {
                  const statusClass = ord.orderStatus.toLowerCase().replace(/\s+/g, '-');
                  const formattedDate = new Date(ord.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={ord._id}>
                      <td>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>
                          #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8', marginTop: '3px' }}>
                          <Calendar size={12} />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          {ord.customerDetails?.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {ord.customerDetails?.phone}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                          📍 {ord.customerDetails?.address}, {ord.customerDetails?.city}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.85rem' }}>
                          {ord.items.map((i, idx) => (
                            <span key={idx}>
                              <strong>{i.quantity}x</strong> {i.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 800, color: '#ff6b00', fontSize: '1.05rem' }}>
                          ₹{ord.totalAmount}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          Items: ₹{ord.subtotal} + Tax: ₹{ord.tax}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: ord.paymentStatus === 'Paid' ? '#10b981' : '#b45309' }}>
                          {ord.paymentMethod}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Status: {ord.paymentStatus}
                        </div>
                      </td>

                      <td>
                        <span className={`status-pill status-${statusClass}`}>
                          {ord.orderStatus}
                        </span>
                      </td>

                      <td>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid #cbd5e1',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            backgroundColor: '#ffffff',
                            color: '#0f172a',
                            cursor: 'pointer',
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

export default OrderList;

