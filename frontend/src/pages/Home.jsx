import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import CategoryFilter from '../components/CategoryFilter';
import FoodCard from '../components/FoodCard';
import SpecialOffers from '../components/SpecialOffers';
import FoodModal from '../components/FoodModal';
import api from '../services/api';
import { ArrowRight, Sparkles, Filter, Leaf, Utensils } from 'lucide-react';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [activeModalFood, setActiveModalFood] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, vegOnly, sortBy]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (vegOnly) params.vegOnly = 'true';
      if (sortBy === 'price-low') params.sort = 'price-low';
      if (sortBy === 'price-high') params.sort = 'price-high';
      if (sortBy === 'rating') params.sort = 'rating';

      const res = await api.get('/food', { params });
      if (res.data.success) {
        setFoods(res.data.foods);
      }
    } catch (err) {
      console.error('Failed to load foods:', err);
    } finally {
      setLoading(false);
    }
  };

  // Popular and recommendations slices
  const popularDishes = foods.slice(0, 8);
  const recommendedDishes = foods.filter((f) => f.rating >= 4.7).slice(0, 4);

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Main Menu & Category Section */}
      <section style={{ padding: '60px 0 30px' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '24px' }}>
            <span className="section-tag">Explore Menu</span>
            <h2 className="section-title">What are you craving today?</h2>
            <p className="section-subtitle">
              Choose from our curated culinary categories cooked fresh upon your order.
            </p>
          </div>

          {/* Category Filter Pills */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />

          {/* Filter & Sorting Controls */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginTop: '28px',
            marginBottom: '32px',
            padding: '16px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #f1f5f9',
            boxShadow: 'var(--shadow-sm)',
          }}>
            {/* Pure Veg Toggle */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                border: vegOnly ? '1.5px solid #10b981' : '1.5px solid #e2e8f0',
                backgroundColor: vegOnly ? '#ecfdf5' : '#ffffff',
                color: vegOnly ? '#10b981' : '#475569',
                fontWeight: 700,
                fontSize: '0.88rem',
                transition: 'var(--transition)',
              }}
            >
              <Leaf size={16} />
              <span>Pure Veg Only</span>
              {vegOnly && <span style={{ fontSize: '0.8rem' }}>✓</span>}
            </button>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="#64748b" />
              <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#1e293b',
                }}
              >
                <option value="popular">Popularity & Newest</option>
                <option value="rating">Top Rated (★)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Food Cards Grid */}
          {loading ? (
            <div className="spinner" />
          ) : foods.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #f1f5f9',
            }}>
              <Utensils size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155' }}>
                No dishes found matching your criteria
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
                Try clearing your category or veg filter to see more tasty options!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setVegOnly(false);
                }}
                className="btn btn-outline btn-sm"
                style={{ marginTop: '20px' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="food-grid">
              {popularDishes.map((food) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  onSelectFood={(item) => setActiveModalFood(item)}
                />
              ))}
            </div>
          )}

          {/* View Full Menu Link */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/menu" className="btn btn-outline btn-lg" style={{ gap: '8px' }}>
              <span>Explore All {foods.length} Menu Items</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <SpecialOffers />

      {/* Chef's Highly Recommended Section */}
      {recommendedDishes.length > 0 && (
        <section style={{ padding: '60px 0 80px', backgroundColor: '#ffffff' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-tag" style={{ background: '#fef3c7', color: '#b45309' }}>
                <Sparkles size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Hand-Picked Specialities
              </span>
              <h2 className="section-title">Chef's Recommended Food</h2>
              <p className="section-subtitle">
                The top-rated customer favourites crafted with signature gourmet recipes.
              </p>
            </div>

            <div className="food-grid">
              {recommendedDishes.map((food) => (
                <FoodCard
                  key={`rec-${food._id}`}
                  food={food}
                  onSelectFood={(item) => setActiveModalFood(item)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

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

export default Home;

