const express = require('express');
const router = express.Router();

const {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingByQRToken,  
  updateBookingStatus,
} = require('../controllers/bookingsController');


router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/qr/:token', getBookingByQRToken); 
router.get('/:id', getBookingById);
router.put('/:id', updateBookingStatus);

module.exports = router;