const MembershipBooking = require('../models/MembershipBooking');

const createBooking = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      selectedPlan,
      startDate,
    } = req.body;

    if (!fullName || !email || !phone || !selectedPlan || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }


    const booking = await MembershipBooking.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Membership booked successfully!',
      bookingId: booking.bookingId,
      data: booking,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const getBookings = async (req, res) => {
  try {

    const bookings = await MembershipBooking.find()
      .sort({ createdAt: -1 });

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
  getBookings,
  getBookingById,
  updateBookingStatus,
};