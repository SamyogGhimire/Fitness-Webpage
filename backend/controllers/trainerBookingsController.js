const TrainerBooking = require('../models/TrainerBooking');

exports.createTrainerBooking = async (req, res) => {
  try {
    const booking = await TrainerBooking.create(req.body);
    res.status(201).json({ success: true, data: booking, bookingId: booking.bookingId });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getTrainerBookings = async (req, res) => {
  try {
    const bookings = await TrainerBooking.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};