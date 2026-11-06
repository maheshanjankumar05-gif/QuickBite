const Food = require('../models/Food');
const fs = require('fs');
const path = require('path');

// @desc    Get all foods with search and filter
// @route   GET /api/food
// @access  Public
const getAllFoods = async (req, res) => {
  try {
    const { search, category, vegOnly, sort } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (vegOnly === 'true') {
      query.isVeg = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    else if (sort === 'price-high') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };

    const foods = await Food.find(query).sort(sortOption);

    res.json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching food items',
    });
  }
};

// @desc    Get food item by ID
// @route   GET /api/food/:id
// @access  Public
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }
    res.json({
      success: true,
      food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching food item',
    });
  }
};

// @desc    Add new food item
// @route   POST /api/food
// @access  Private/Admin
const addFood = async (req, res) => {
  try {
    const { name, description, price, category, rating, prepTime, isVeg, isAvailable, tags } = req.body;

    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, and category are required',
      });
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image is required (either upload file or provide image URL)',
      });
    }

    let parsedTags = [];
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    const food = await Food.create({
      name,
      description,
      price: Number(price),
      image: imageUrl,
      category,
      rating: rating ? Number(rating) : 4.5,
      prepTime: prepTime || '25-30 min',
      isVeg: isVeg === 'true' || isVeg === true,
      isAvailable: isAvailable === undefined ? true : (isAvailable === 'true' || isAvailable === true),
      tags: parsedTags,
    });

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      food,
    });
  } catch (error) {
    console.error('Add Food Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating food item',
    });
  }
};

// @desc    Update food item
// @route   PUT /api/food/:id
// @access  Private/Admin
const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    const { name, description, price, category, rating, prepTime, isVeg, isAvailable, tags } = req.body;

    if (name) food.name = name;
    if (description) food.description = description;
    if (price !== undefined) food.price = Number(price);
    if (category) food.category = category;
    if (rating !== undefined) food.rating = Number(rating);
    if (prepTime) food.prepTime = prepTime;
    if (isVeg !== undefined) food.isVeg = isVeg === 'true' || isVeg === true;
    if (isAvailable !== undefined) food.isAvailable = isAvailable === 'true' || isAvailable === true;

    if (tags !== undefined) {
      food.tags = typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : tags;
    }

    if (req.file) {
      // Remove old file if it was a local upload
      if (food.image && food.image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', food.image);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { /* ignore */ }
        }
      }
      food.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      food.image = req.body.image;
    }

    const updatedFood = await food.save();

    res.json({
      success: true,
      message: 'Food item updated successfully',
      food: updatedFood,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating food item',
    });
  }
};

// @desc    Delete food item
// @route   DELETE /api/food/:id
// @access  Private/Admin
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    if (food.image && food.image.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', food.image);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) { /* ignore */ }
      }
    }

    await Food.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Food item deleted successfully',
      foodId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting food item',
    });
  }
};

module.exports = {
  getAllFoods,
  getFoodById,
  addFood,
  updateFood,
  deleteFood,
};

