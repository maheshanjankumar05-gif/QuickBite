import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const FoodModal = ({ food, categories = [], onClose, onSuccess }) => {
  const isEditing = Boolean(food);

  const [formData, setFormData] = useState({
    name: food?.name || '',
    description: food?.description || '',
    price: food?.price || '',
    category: food?.category || (categories[0]?.name || 'Pizza'),
    rating: food?.rating || 4.5,
    prepTime: food?.prepTime || '20-25 min',
    isVeg: food?.isVeg !== undefined ? food.isVeg : true,
    isAvailable: food?.isAvailable !== undefined ? food.isAvailable : true,
    tags: food?.tags ? food.tags.join(', ') : '',
    imageUrl: food?.image?.startsWith('/uploads') ? '' : (food?.image || ''),
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    food?.image
      ? food.image.startsWith('/uploads')
        ? `http://localhost:5000${food.image}`
        : food.image
      : ''
  );
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, imageUrl: '' });
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    if (url.trim()) {
      setImagePreview(url.trim());
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim() || !formData.price || !formData.category) {
      toast.error('Please fill in name, description, price, and category');
      return;
    }

    if (!imageFile && !formData.imageUrl.trim() && !food?.image) {
      toast.error('Please upload an image file or provide an image URL');
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('rating', formData.rating);
      data.append('prepTime', formData.prepTime);
      data.append('isVeg', formData.isVeg);
      data.append('isAvailable', formData.isAvailable);
      data.append('tags', formData.tags);

      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.imageUrl.trim()) {
        data.append('image', formData.imageUrl.trim());
      }

      if (isEditing) {
        await api.put(`/food/${food._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Food item updated successfully!');
      } else {
        await api.post('/food', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('New food item added to menu!');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving food item:', err);
      toast.error(err.message || 'Failed to save food item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 17, 26, 0.75)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
            {isEditing ? 'Edit Food Item' : 'Add New Food Item'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', color: '#64748b', display: 'flex' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Food Dish Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Gourmet Truffle Mushroom Pizza"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c._id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Pizza">Pizza</option>
                    <option value="Burger">Burger</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="299"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Appetizing Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe flavors, fresh toppings, authentic sauces..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-textarea"
              />
            </div>

            {/* Image Preview & Upload Option */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Food Photo / Image</label>

              {imagePreview && (
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
                    Image selected & ready
                  </span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    backgroundColor: '#f8fafc',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#475569',
                  }}>
                    <Upload size={16} />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                <div>
                  <input
                    type="url"
                    placeholder="Or paste image URL (Unsplash, etc.)"
                    value={formData.imageUrl}
                    onChange={handleUrlChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preparation Time</label>
              <input
                type="text"
                placeholder="20-25 min"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Rating (1 - 5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="Bestseller, Spicy, Chef Special, Trending"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Checkbox Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', gridColumn: 'span 2', marginTop: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.92rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={formData.isVeg}
                  onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
                />
                <span style={{ color: formData.isVeg ? '#10b981' : '#64748b' }}>
                  Pure Vegetarian Dish
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.92rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#ff6b00' }}
                />
                <span>Currently Available to Order</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Saving Item...' : isEditing ? 'Save Changes' : 'Create Food Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodModal;

