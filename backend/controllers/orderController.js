const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Food = require('../models/Food');

// @desc    Place a new order
// @route   POST /api/order
// @access  Private
const placeOrder = async (req, res) => {
  try {
    const { items, customerDetails, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided',
      });
    }

    if (
      !customerDetails ||
      !customerDetails.name ||
      !customerDetails.phone ||
      !customerDetails.address ||
      !customerDetails.city
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full customer details (name, phone, address, city)',
      });
    }

    // Calculate subtotal from items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const foodItem = await Food.findById(item.foodId || item._id);
      const price = foodItem ? foodItem.price : item.price;
      const name = foodItem ? foodItem.name : item.name;
      const image = foodItem ? foodItem.image : item.image;
      const quantity = Math.max(1, Number(item.quantity) || 1);

      subtotal += price * quantity;
      orderItems.push({
        food: foodItem ? foodItem._id : null,
        name,
        price,
        quantity,
        image,
      });
    }

    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const tax = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + deliveryFee + tax;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      customerDetails: {
        name: customerDetails.name,
        email: customerDetails.email || req.user.email,
        phone: customerDetails.phone,
        address: customerDetails.address,
        city: customerDetails.city,
        postalCode: customerDetails.postalCode || '110001',
        notes: notes || '',
      },
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Online' ? 'Paid' : 'Pending',
      orderStatus: 'Pending',
    });

    // Clear cart upon successful order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('Place Order Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error placing order',
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/order/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching your orders',
    });
  }
};

// @desc    Get order by ID (with tracking status)
// @route   GET /api/order/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Ensure the user requesting is either the owner or an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching order details',
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/order/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && status !== 'All') {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching all orders',
    });
  }
};

// @desc    Update order status
// @route   PUT /api/order/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const validStatuses = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'Delivered' && order.paymentMethod === 'Cash on Delivery') {
        order.paymentStatus = 'Paid';
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating order status',
    });
  }
};

// @desc    Cancel order (by customer if still pending)
// @route   PUT /api/order/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an order that has already been delivered',
      });
    }

    if (order.orderStatus === 'Out for Delivery' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Order is already out for delivery. Please contact support to cancel.',
      });
    }

    order.orderStatus = 'Cancelled';
    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling order',
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};

