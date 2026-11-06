import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CategoryModal from '../components/CategoryModal';
import { toast } from 'react-toastify';
import { Plus, Trash2, FolderTree } from 'lucide-react';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/category');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Dishes in this category may be affected.`)) return;

    try {
      const res = await api.delete(`/category/${id}`);
      if (res.data.success) {
        toast.success(`Category "${name}" deleted.`);
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  return (
    <div>
      {/* Header */}
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
            Food Categories ({categories.length})
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Manage category classifications used across menus and filters
          </p>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : categories.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <FolderTree size={40} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#475569' }}>No categories created</h3>
          <button onClick={() => setModalOpen(true)} className="btn btn-primary" style={{ marginTop: '16px' }}>
            Add First Category
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="admin-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                position: 'relative',
              }}
            >
              <div>
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    backgroundColor: '#f1f5f9',
                    marginBottom: '14px',
                  }}
                />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.45, marginBottom: '16px' }}>
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  className="btn btn-danger btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <CategoryModal
          onClose={() => setModalOpen(false)}
          onSuccess={fetchCategories}
        />
      )}
    </div>
  );
};

export default CategoryList;

