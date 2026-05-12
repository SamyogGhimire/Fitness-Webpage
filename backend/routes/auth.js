const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getMe,
  getMyBookings,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/my-bookings', protect, getMyBookings);

module.exports = router;