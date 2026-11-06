const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  addCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllCategories);
router.post('/', protect, adminOnly, addCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;

