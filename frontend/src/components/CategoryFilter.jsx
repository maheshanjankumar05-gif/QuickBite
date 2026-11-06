import React from 'react';

const categories = [
  { name: 'All', emoji: '🍽️', label: 'All Dishes' },
  { name: 'Pizza', emoji: '🍕', label: 'Pizzas' },
  { name: 'Burger', emoji: '🍔', label: 'Burgers' },
  { name: 'Biryani', emoji: '🍛', label: 'Biryani' },
  { name: 'Chinese', emoji: '🥢', label: 'Chinese' },
  { name: 'Desserts', emoji: '🍰', label: 'Desserts' },
  { name: 'Beverages', emoji: '🥤', label: 'Beverages' },
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      overflowX: 'auto',
      padding: '8px 4px 16px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      {categories.map((cat) => {
        const isActive =
          selectedCategory?.toLowerCase() === cat.name.toLowerCase() ||
          (!selectedCategory && cat.name === 'All');

        return (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name === 'All' ? '' : cat.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.92rem',
              whiteSpace: 'nowrap',
              transition: 'var(--transition)',
              backgroundColor: isActive ? '#ff6b00' : '#ffffff',
              color: isActive ? '#ffffff' : '#334155',
              border: isActive ? '1.5px solid #ff6b00' : '1.5px solid #e2e8f0',
              boxShadow: isActive ? '0 4px 14px rgba(255, 107, 0, 0.3)' : 'var(--shadow-sm)',
              transform: isActive ? 'scale(1.04)' : 'none',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;

