import React, { useState } from 'react';
import { X, Star, Clock, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FoodModal = ({ food, onClose }) => {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const [qty, setQty] = useState(1);

  if (!food) return null;

  const inCartQty = getItemQuantity(food._id);
  const imageUrl = food.image?.startsWith('/uploads')
    ? `http://localhost:5000${food.image}`
    : food.image;

  const handleAddToCart = () => {
    addToCart(food, qty);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 17, 26, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'rgba(15, 17, 26, 0.6)',
            color: '#ffffff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
          aria-label="Close food details"
        >
          <X size={20} />
        </button>

        {/* Food Image */}
        <div style={{ width: '100%', height: '260px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
          <img
            src={imageUrl}
            alt={food.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Details Container */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: food.isVeg ? '#10b981' : '#ef4444',
              }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: food.isVeg ? '#10b981' : '#ef4444' }}>
              {food.isVeg ? 'Pure Veg' : 'Non-Vegetarian'}
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{food.category}</span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            {food.name}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
              <Star size={16} fill="#f59e0b" />
              <span>{food.rating ? food.rating.toFixed(1) : '4.5'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.88rem' }}>
              <Clock size={16} />
              <span>{food.prepTime || '25 min'}</span>
            </div>
          </div>

          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
            {food.description}
          </p>

          {/* Action Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', fontWeight: 600 }}>Price</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ff6b00' }}>
                ₹{food.price * qty}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Stepper for quantity */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '4px',
                  gap: '8px',
                }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{
                    background: '#fff',
                    color: '#0f172a',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ fontWeight: 800, minWidth: '24px', textAlign: 'center', fontSize: '1rem' }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  style={{
                    background: '#fff',
                    color: '#0f172a',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add button */}
              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ gap: '8px', padding: '12px 24px', borderRadius: '12px' }}
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodModal;

