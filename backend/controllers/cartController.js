const Cart = require('../models/Cart');
const Food = require('../models/Food');

// Helper to calculate totals
const computeTotals = (items) => {
  let subtotal = 0;
  const processedItems = items
    .filter((item) => item.food != null)
    .map((item) => {
      const price = item.food.price || 0;
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;
      return {
        food: item.food,
        quantity: item.quantity,
        itemSubtotal,
      };
    });

  const deliveryFee = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0;
  const tax = subtotal > 0 ? Math.round(subtotal * 0.05) : 0; // 5% GST/tax
  const grandTotal = subtotal + deliveryFee + tax;

  return {
    items: processedItems,
    subtotal,
    deliveryFee,
    tax,
    grandTotal,
    itemCount: processedItems.reduce((acc, curr) => acc + curr.quantity, 0),
  };
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.food');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const totals = computeTotals(cart.items);

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        user: cart.user,
        ...totals,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching cart',
    });
  }
};

// @desc    Add item to cart or increment
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { foodId, quantity = 1 } = req.body;

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: 'Food ID is required',
      });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{ food: foodId, quantity: Math.max(1, Number(quantity)) }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.food.toString() === foodId.toString()
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ food: foodId, quantity: Math.max(1, Number(quantity)) });
      }
    }

    await cart.save();
    await cart.populate('items.food');

    const totals = computeTotals(cart.items);

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        _id: cart._id,
        user: cart.user,
        ...totals,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding to cart',
    });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    if (!foodId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Food ID and quantity are required',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      // Remove item
      cart.items = cart.items.filter(
        (item) => item.food.toString() !== foodId.toString()
      );
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.food.toString() === foodId.toString()
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = qty;
      } else {
        cart.items.push({ food: foodId, quantity: qty });
      }
    }

    await cart.save();
    await cart.populate('items.food');

    const totals = computeTotals(cart.items);

    res.json({
      success: true,
      message: 'Cart updated',
      cart: {
        _id: cart._id,
        user: cart.user,
        ...totals,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating cart item',
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:foodId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item.food.toString() !== foodId.toString()
    );

    await cart.save();
    await cart.populate('items.food');

    const totals = computeTotals(cart.items);

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        _id: cart._id,
        user: cart.user,
        ...totals,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing item from cart',
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      cart: {
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        tax: 0,
        grandTotal: 0,
        itemCount: 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error clearing cart',
    });
  }
};

// @desc    Sync local cart with server cart on login
// @route   POST /api/cart/sync
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { localItems = [] } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    for (const item of localItems) {
      const foodId = item.foodId || item._id;
      const qty = Number(item.quantity) || 1;
      const existing = cart.items.find(
        (i) => i.food.toString() === foodId.toString()
      );
      if (existing) {
        existing.quantity = Math.max(existing.quantity, qty);
      } else {
        cart.items.push({ food: foodId, quantity: qty });
      }
    }

    await cart.save();
    await cart.populate('items.food');

    const totals = computeTotals(cart.items);

    res.json({
      success: true,
      message: 'Cart synced successfully',
      cart: {
        _id: cart._id,
        user: cart.user,
        ...totals,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error syncing cart',
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
};

