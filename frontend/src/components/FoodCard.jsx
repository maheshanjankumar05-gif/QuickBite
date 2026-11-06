import React from 'react';
import { useCart } from '../context/CartContext';
import { Star, Clock, Plus, Minus, Flame } from 'lucide-react';

const FoodCard = ({ food, onSelectFood }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(food._id);

  // Fallback image helper
  const imageUrl = food.image?.startsWith('/uploads')
    ? `http://localhost:5000${food.image}`
    : food.image;

  return (
    <div
      className="card fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '18px',
        backgroundColor: '#ffffff',
        border: '1px solid #f1f5f9',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* Image Container with Badges */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '190px',
          overflow: 'hidden',
          backgroundColor: '#f1f5f9',
          cursor: 'pointer',
        }}
        onClick={() => onSelectFood && onSelectFood(food)}
      >
        <img
          src={imageUrl}
          alt={food.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />

        {/* Veg / Non-Veg Indicator */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            border: `1.5px solid ${food.isVeg ? '#10b981' : '#ef4444'}`,
          }}
          title={food.isVeg ? 'Pure Veg' : 'Non-Veg'}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: food.isVeg ? '#10b981' : '#ef4444',
            }}
          />
        </div>

        {/* Tag (Bestseller, Trending, etc.) */}
        {food.tags && food.tags.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(15, 17, 26, 0.85)',
              backdropFilter: 'blur(4px)',
              color: '#ffaa00',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            <Flame size={12} color="#ff6b00" />
            <span>{food.tags[0]}</span>
          </div>
        )}

        {/* Rating Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: '#ffffff',
            borderRadius: '9999px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#0f172a',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <Star size={13} fill="#f59e0b" color="#f59e0b" />
          <span>{food.rating ? food.rating.toFixed(1) : '4.5'}</span>
        </div>

        {/* Prep Time */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderRadius: '9999px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#475569',
          }}
        >
          <Clock size={12} />
          <span>{food.prepTime || '25 min'}</span>
        </div>
      </div>

      {/* Details Body */}
      <div
        style={{
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#0f172a',
                lineHeight: 1.3,
                cursor: 'pointer',
              }}
              onClick={() => onSelectFood && onSelectFood(food)}
            >
              {food.name}
            </h3>
          </div>

          <p
            style={{
              fontSize: '0.85rem',
              color: '#64748b',
              lineHeight: 1.45,
              marginBottom: '16px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {food.description}
          </p>
        </div>

        {/* Price & Action Area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', fontWeight: 600 }}>Price</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ff6b00' }}>
              ₹{food.price}
            </span>
          </div>

          {quantity > 0 ? (
            /* Quantity Stepper Button */
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#fff4eb',
                border: '1.5px solid #ff6b00',
                borderRadius: '10px',
                padding: '4px',
                gap: '8px',
              }}
            >
              <button
                onClick={() => updateQuantity(food._id, quantity - 1)}
                style={{
                  background: '#ffffff',
                  color: '#ff6b00',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>

              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ff6b00', minWidth: '18px', textAlign: 'center' }}>
                {quantity}
              </span>

              <button
                onClick={() => addToCart(food, 1)}
                style={{
                  background: '#ff6b00',
                  color: '#ffffff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  boxShadow: '0 2px 5px rgba(255, 107, 0, 0.4)',
                }}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            /* Add to Cart Button */
            <button
              onClick={() => addToCart(food, 1)}
              className="btn btn-primary btn-sm"
              style={{
                borderRadius: '10px',
                padding: '9px 18px',
                fontWeight: 700,
                fontSize: '0.88rem',
              }}
            >
              <Plus size={16} />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

