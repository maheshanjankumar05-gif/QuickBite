const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a food name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide food description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide food price'],
      min: 0,
    },
    image: {
      type: String,
      required: [true, 'Please provide food image URL or path'],
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    prepTime: {
      type: String,
      default: '25-30 min',
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Food', foodSchema);

