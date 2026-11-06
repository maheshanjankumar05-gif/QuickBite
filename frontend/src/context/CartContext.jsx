import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('quickbite_local_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('quickbite_local_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync with MongoDB backend when user is logged in
  useEffect(() => {
    const fetchBackendCart = async () => {
      if (isAuthenticated) {
        try {
          setIsSyncing(true);
          // If we have items in local cart, sync them up first
          if (cartItems.length > 0) {
            await api.post('/cart/sync', {
              localItems: cartItems.map((item) => ({
                foodId: item._id,
                quantity: item.quantity,
              })),
            });
          }

          const res = await api.get('/cart');
          if (res.data.success && res.data.cart?.items) {
            const formatted = res.data.cart.items.map((item) => ({
              ...item.food,
              quantity: item.quantity,
            }));
            setCartItems(formatted);
          }
        } catch (err) {
          console.warn('Cart sync notice:', err.message);
        } finally {
          setIsSyncing(false);
        }
      }
    };

    fetchBackendCart();
  }, [isAuthenticated]);

  // Add food item
  const addToCart = async (food, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === food._id);
      if (existing) {
        return prev.map((item) =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...food, quantity: qty }];
    });

    toast.success(`Added ${food.name} to cart!`, { autoClose: 1800 });

    if (isAuthenticated) {
      try {
        await api.post('/cart/add', { foodId: food._id, quantity: qty });
      } catch (err) {
        console.error('Failed to sync add to backend:', err);
      }
    }
  };

  // Update quantity
  const updateQuantity = async (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item._id === foodId ? { ...item, quantity } : item))
    );

    if (isAuthenticated) {
      try {
        await api.put('/cart/update', { foodId, quantity });
      } catch (err) {
        console.error('Failed to update cart on backend:', err);
      }
    }
  };

  // Remove food item
  const removeFromCart = async (foodId) => {
    const itemToRemove = cartItems.find((i) => i._id === foodId);
    setCartItems((prev) => prev.filter((item) => item._id !== foodId));

    if (itemToRemove) {
      toast.info(`Removed ${itemToRemove.name} from cart`, { autoClose: 1500 });
    }

    if (isAuthenticated) {
      try {
        await api.delete(`/cart/remove/${foodId}`);
      } catch (err) {
        console.error('Failed to remove from backend cart:', err);
      }
    }
  };

  // Clear cart
  const clearCart = async () => {
    setCartItems([]);
    setAppliedPromo(null);
    setDiscountAmount(0);
    localStorage.removeItem('quickbite_local_cart');

    if (isAuthenticated) {
      try {
        await api.delete('/cart/clear');
      } catch (err) {
        console.error('Failed to clear backend cart:', err);
      }
    }
  };

  // Computations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 40;
  const tax = subtotal === 0 ? 0 : Math.round(subtotal * 0.05);

  // Apply promo code
  const applyPromoCode = (code) => {
    const normalized = code.trim().toUpperCase();
    if (subtotal === 0) {
      toast.error('Add items to cart before applying promo code');
      return false;
    }

    if (normalized === 'QUICK50') {
      const discount = Math.min(100, Math.round(subtotal * 0.5));
      setAppliedPromo({ code: 'QUICK50', description: '50% OFF up to ₹100' });
      setDiscountAmount(discount);
      toast.success('Promo code QUICK50 applied! ₹' + discount + ' saved');
      return true;
    } else if (normalized === 'FREEDEL') {
      if (deliveryFee > 0) {
        setAppliedPromo({ code: 'FREEDEL', description: 'Free Delivery' });
        setDiscountAmount(deliveryFee);
        toast.success('Free Delivery code applied!');
        return true;
      } else {
        toast.info('Delivery is already free for orders above ₹500!');
        return false;
      }
    } else if (normalized === 'TASTY20') {
      const discount = Math.round(subtotal * 0.2);
      setAppliedPromo({ code: 'TASTY20', description: '20% Flat Discount' });
      setDiscountAmount(discount);
      toast.success('Promo code TASTY20 applied! ₹' + discount + ' saved');
      return true;
    } else {
      toast.error('Invalid promo code. Try QUICK50, FREEDEL, or TASTY20');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setDiscountAmount(0);
    toast.info('Promo code removed');
  };

  const grandTotal = Math.max(0, subtotal + deliveryFee + tax - discountAmount);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Helper to check quantity of a particular food in cart
  const getItemQuantity = (foodId) => {
    const item = cartItems.find((i) => i._id === foodId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    appliedPromo,
    discountAmount,
    applyPromoCode,
    removePromoCode,
    grandTotal,
    totalItemCount,
    getItemQuantity,
    isSyncing,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

