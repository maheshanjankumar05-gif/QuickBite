import React from 'react';
import { Check, Clock, ChefHat, Bike, CheckCircle2, AlertTriangle } from 'lucide-react';

const steps = [
  { status: 'Pending', label: 'Order Placed', desc: 'Waiting for restaurant confirmation', icon: Clock },
  { status: 'Confirmed', label: 'Order Confirmed', desc: 'Kitchen has accepted your order', icon: CheckCircle2 },
  { status: 'Preparing', label: 'Preparing Food', desc: 'Chef is cooking your fresh meal', icon: ChefHat },
  { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider is on the way to your door', icon: Bike },
  { status: 'Delivered', label: 'Delivered', desc: 'Order completed. Enjoy your meal!', icon: Check },
];

const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

const OrderTracker = ({ orderStatus }) => {
  if (orderStatus === 'Cancelled') {
    return (
      <div style={{
        backgroundColor: '#fee2e2',
        border: '1.5px solid #fca5a5',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        color: '#b91c1c',
      }}>
        <AlertTriangle size={36} />
        <div>
          <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>This order has been cancelled</h4>
          <p style={{ fontSize: '0.88rem', marginTop: '4px', opacity: 0.9 }}>
            If you were charged, your refund will be credited to your original payment method in 3-5 business days.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(orderStatus);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '28px',
      border: '1px solid #f1f5f9',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>
        Live Order Tracker
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.status}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                position: 'relative',
              }}
            >
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    left: '18px',
                    top: '36px',
                    bottom: '-20px',
                    width: '3px',
                    backgroundColor: idx < currentIndex ? '#10b981' : '#e2e8f0',
                    zIndex: 1,
                  }}
                />
              )}

              {/* Step Circle */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  zIndex: 2,
                  flexShrink: 0,
                  transition: 'var(--transition)',
                  backgroundColor: isCompleted
                    ? '#10b981'
                    : isCurrent
                    ? '#ff6b00'
                    : '#f1f5f9',
                  color: isCompleted || isCurrent ? '#ffffff' : '#94a3b8',
                  boxShadow: isCurrent
                    ? '0 0 0 4px rgba(255, 107, 0, 0.2)'
                    : isCompleted
                    ? '0 0 0 4px rgba(16, 185, 129, 0.15)'
                    : 'none',
                }}
              >
                {isCompleted ? <Check size={18} /> : <StepIcon size={18} />}
              </div>

              {/* Step Description */}
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: isCurrent || isCompleted ? 700 : 600,
                      color: isCurrent ? '#ff6b00' : isCompleted ? '#0f172a' : '#94a3b8',
                    }}
                  >
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: '#ff6b00',
                        backgroundColor: '#fff4eb',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                      }}
                    >
                      In Progress
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;

