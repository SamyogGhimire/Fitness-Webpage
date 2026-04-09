const express = require('express');
const router = express.Router();
const { createTrainerBooking, getAllTrainerBookings } = require('../controllers/trainerBookingsController');

router.post('/', createTrainerBooking);
router.get('/', getAllTrainerBookings);

module.exports = router;