const User = require('../models/User');
const Food = require('../models/Food');
const Order = require('../models/Order');
const Category = require('../models/Category');

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalFoods, totalOrders, totalCategories] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Food.countDocuments(),
      Order.countDocuments(),
      Category.countDocuments(),
    ]);

    // Calculate revenue (excluding cancelled orders)
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Status breakdown
    const statusAgg = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);
    const ordersByStatus = {
      Pending: 0,
      Confirmed: 0,
      Preparing: 0,
      'Out for Delivery': 0,
      Delivered: 0,
      Cancelled: 0,
    };
    statusAgg.forEach((s) => {
      if (ordersByStatus[s._id] !== undefined) {
        ordersByStatus[s._id] = s.count;
      }
    });

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Food category breakdown
    const categoryAgg = await Food.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalFoods,
        totalOrders,
        totalCategories,
        totalRevenue,
        ordersByStatus,
        categoryCounts: categoryAgg,
      },
      recentOrders,
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin stats',
    });
  }
};

module.exports = {
  getDashboardStats,
};

