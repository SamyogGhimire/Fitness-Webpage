const express = require('express');
const router = express.Router();
const { createTrainerBooking, getTrainerBookings } = require('../controllers/trainerBookingsController');

router.post('/', createTrainerBooking);
router.get('/', getTrainerBookings);

module.exports = router;