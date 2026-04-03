const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getBookingById } = require('../controllers/bookingsController');

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);

module.exports = router;