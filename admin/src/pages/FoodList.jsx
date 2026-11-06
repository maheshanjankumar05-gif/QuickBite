import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FoodModal from '../components/FoodModal';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Search, Star, UtensilsCrossed } from 'lucide-react';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/category');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;

      const res = await api.get('/food', { params });
      if (res.data.success) {
        setFoods(res.data.foods);
      }
    } catch (err) {
      console.error('Error fetching food list:', err);
      toast.error('Failed to load food list');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) return;

    try {
      const res = await api.delete(`/food/${id}`);
      if (res.data.success) {
        toast.success(`"${name}" removed from menu.`);
        setFoods((prev) => prev.filter((f) => f._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete food item');
    }
  };

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Top action bar */}
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
            Menu Food Items ({foods.length})
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Add, update pricing, upload images, or manage food items
          </p>
        </div>

        <button
          onClick={() => {
            setEditingFood(null);
            setModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="admin-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search dishes by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '180px' }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Foods Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="spinner" />
        ) : filteredFoods.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <UtensilsCrossed size={40} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#475569' }}>
              No food dishes found
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
              Add dishes or adjust search query
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Dish Photo</th>
                  <th>Name & Type</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFoods.map((f) => {
                  const imageUrl = f.image?.startsWith('/uploads')
                    ? `http://localhost:5000${f.image}`
                    : f.image;

                  return (
                    <tr key={f._id}>
                      <td style={{ width: '80px' }}>
                        <img
                          src={imageUrl}
                          alt={f.name}
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                            backgroundColor: '#f1f5f9',
                          }}
                        />
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: f.isVeg ? '#10b981' : '#ef4444',
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{f.name}</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.description}
                        </p>
                      </td>

                      <td>
                        <span style={{
                          backgroundColor: '#f1f5f9',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                        }}>
                          {f.category}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 800, color: '#ff6b00', fontSize: '1rem' }}>
                          ₹{f.price}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700 }}>
                          <Star size={14} fill="#f59e0b" />
                          <span>{f.rating?.toFixed(1) || '4.5'}</span>
                        </div>
                      </td>

                      <td>
                        <span style={{
                          backgroundColor: f.isAvailable ? '#ecfdf5' : '#fee2e2',
                          color: f.isAvailable ? '#15803d' : '#b91c1c',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}>
                          {f.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setEditingFood(f);
                              setModalOpen(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            title="Edit food item"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDelete(f._id, f.name)}
                            className="btn btn-danger btn-sm"
                            title="Delete food item"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Food Modal */}
      {modalOpen && (
        <FoodModal
          food={editingFood}
          categories={categories}
          onClose={() => {
            setModalOpen(false);
            setEditingFood(null);
          }}
          onSuccess={fetchFoods}
        />
      )}
    </div>
  );
};

export default FoodList;

