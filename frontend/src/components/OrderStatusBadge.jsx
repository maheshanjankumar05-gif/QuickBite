import React from 'react';
import { Clock, CheckCircle2, ChefHat, Bike, CheckCheck, XCircle } from 'lucide-react';

const statusConfig = {
  Pending: {
    bg: '#fef3c7',
    color: '#b45309',
    icon: Clock,
  },
  Confirmed: {
    bg: '#e0e7ff',
    color: '#4338ca',
    icon: CheckCircle2,
  },
  Preparing: {
    bg: '#fef08a',
    color: '#854d0e',
    icon: ChefHat,
  },
  'Out for Delivery': {
    bg: '#e0f2fe',
    color: '#0369a1',
    icon: Bike,
  },
  Delivered: {
    bg: '#dcfce7',
    color: '#15803d',
    icon: CheckCheck,
  },
  Cancelled: {
    bg: '#fee2e2',
    color: '#b91c1c',
    icon: XCircle,
  },
};

const OrderStatusBadge = ({ status }) => {
  const current = statusConfig[status] || statusConfig.Pending;
  const Icon = current.icon;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: current.bg,
        color: current.color,
        padding: '5px 12px',
        borderRadius: '9999px',
        fontSize: '0.82rem',
        fontWeight: 700,
      }}
    >
      <Icon size={14} />
      <span>{status}</span>
    </span>
  );
};

export default OrderStatusBadge;

