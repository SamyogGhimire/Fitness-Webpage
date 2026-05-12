const MembershipBooking = require('../models/MembershipBooking');
const jwt = require('jsonwebtoken');

const createBooking = async (req, res) => {
  try {
    const { fullName, email, phone, selectedPlan, startDate } = req.body;

    if (!fullName || !email || !phone || !selectedPlan || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    // Get userId from token if logged in
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (_) {}
    }

    const booking = await MembershipBooking.create({
      ...req.body,
      userId,
    });

    res.status(201).json({
      success: true,
      message: 'Membership booked successfully!',
      bookingId: booking.bookingId,
      qrToken: booking.qrToken,
      data: booking,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await MembershipBooking.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await MembershipBooking.findOne({
      bookingId: req.params.id,
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookingByQRToken = async (req, res) => {
  try {
    const booking = await MembershipBooking.findOne({
      qrToken: req.params.token,
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Invalid QR code',
      });
    }
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const allowed = ['pending', 'completed', 'failed'];
    if (!allowed.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }
    const booking = await MembershipBooking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Payment status updated',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingByQRToken,
  updateBookingStatus,
};