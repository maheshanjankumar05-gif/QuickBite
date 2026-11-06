import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import FoodCard from '../components/FoodCard';
import CategoryFilter from '../components/CategoryFilter';
import FoodModal from '../components/FoodModal';
import { Search, Filter, Leaf, RefreshCw } from 'lucide-react';

const Menu = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [activeModalFood, setActiveModalFood] = useState(null);

  useEffect(() => {
    // Sync with query params changes
    const q = searchParams.get('search');
    const c = searchParams.get('category');
    if (q !== null) setSearch(q);
    if (c !== null) setCategory(c);
  }, [location.search]);

  useEffect(() => {
    fetchFoods();
  }, [search, category, vegOnly, sortBy]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (vegOnly) params.vegOnly = 'true';
      if (sortBy === 'price-low') params.sort = 'price-low';
      if (sortBy === 'price-high') params.sort = 'price-high';
      if (sortBy === 'rating') params.sort = 'rating';

      const res = await api.get('/food', { params });
      if (res.data.success) {
        setFoods(res.data.foods);
      }
    } catch (err) {
      console.error('Error fetching menu foods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearch('');
    setCategory('');
    setVegOnly(false);
    setSortBy('popular');
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Our Delicious <span style={{ color: '#ff6b00' }}>Menu</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '6px' }}>
            Explore artisanal handcrafted recipes prepared fresh for you.
          </p>
        </div>

        {/* Category Pills */}
        <div style={{ marginBottom: '24px' }}>
          <CategoryFilter
            selectedCategory={category}
            onSelectCategory={(cat) => setCategory(cat)}
          />
        </div>

        {/* Filter / Search Bar Toolbar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '20px',
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
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search dishes, ingredients, pizzas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: '12px',
                border: '1.5px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                fontSize: '0.92rem',
              }}
            />
            <Search
              size={18}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
          </div>

          {/* Pure Veg Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              border: vegOnly ? '1.5px solid #10b981' : '1.5px solid #e2e8f0',
              backgroundColor: vegOnly ? '#ecfdf5' : '#ffffff',
              color: vegOnly ? '#10b981' : '#475569',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'var(--transition)',
            }}
          >
            <Leaf size={16} />
            <span>Pure Veg</span>
            {vegOnly && <span>✓</span>}
          </button>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="#64748b" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #e2e8f0',
                backgroundColor: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#1e293b',
              }}
            >
              <option value="popular">Recommended</option>
              <option value="rating">Top Rated (★)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(search || category || vegOnly || sortBy !== 'popular') && (
            <button
              onClick={handleReset}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Reset all filters"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          )}
        </div>

        {/* Results Counter */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.92rem', fontWeight: 600 }}>
            Showing <strong style={{ color: '#0f172a' }}>{foods.length}</strong> delicious items
            {category && <span> in <span style={{ color: '#ff6b00' }}>{category}</span></span>}
            {search && <span> for "<strong>{search}</strong>"</span>}
          </p>
        </div>

        {/* Grid or Empty */}
        {loading ? (
          <div className="spinner" />
        ) : foods.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid #f1f5f9',
            }}
          >
            <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🍽️</p>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b' }}>
              No culinary items match your search
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '6px' }}>
              Try searching for something else or reset your active filters.
            </p>
            <button
              onClick={handleReset}
              className="btn btn-primary"
              style={{ marginTop: '20px' }}
            >
              Show All Dishes
            </button>
          </div>
        ) : (
          <div className="food-grid">
            {foods.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                onSelectFood={(item) => setActiveModalFood(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Food Detail Modal */}
      {activeModalFood && (
        <FoodModal
          food={activeModalFood}
          onClose={() => setActiveModalFood(null)}
        />
      )}
    </div>
  );
};

export default Menu;

