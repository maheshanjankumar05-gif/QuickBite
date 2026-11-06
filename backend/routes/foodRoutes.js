const express = require('express');
const router = express.Router();
const {
  getAllFoods,
  getFoodById,
  addFood,
  updateFood,
  deleteFood,
} = require('../controllers/foodController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllFoods);
router.get('/:id', getFoodById);
router.post('/', protect, adminOnly, upload.single('image'), addFood);
router.put('/:id', protect, adminOnly, upload.single('image'), updateFood);
router.delete('/:id', protect, adminOnly, deleteFood);

module.exports = router;

