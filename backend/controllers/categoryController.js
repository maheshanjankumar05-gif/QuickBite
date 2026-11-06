const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/category
// @access  Public
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching categories',
    });
  }
};

// @desc    Add a new category
// @route   POST /api/category
// @access  Private/Admin
const addCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: 'Category name and image URL are required',
      });
    }

    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    const category = await Category.create({
      name,
      image,
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating category',
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/category/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting category',
    });
  }
};

module.exports = {
  getAllCategories,
  addCategory,
  deleteCategory,
};

