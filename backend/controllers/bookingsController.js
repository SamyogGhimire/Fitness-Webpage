const MembershipBooking = require('../models/MembershipBooking');

exports.createBooking = async (req, res) => {
  try {
    const booking = await MembershipBooking.create(req.body);
    res.status(201).json({ success: true, data: booking, bookingId: booking.bookingId });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await MembershipBooking.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await MembershipBooking.findOne({ bookingId: req.params.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};