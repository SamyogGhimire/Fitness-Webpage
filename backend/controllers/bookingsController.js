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

    // Validate required fields
    if (!fullName || !email || !phone || !selectedPlan || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    // Create booking — qrToken is auto generated in model
    const booking = await MembershipBooking.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Membership booked successfully!',
      bookingId: booking.bookingId,

      // ─── NEW — send qrToken to frontend ───
      qrToken: booking.qrToken,
      // ──────────────────────────────────────

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

const getBookingByQRToken = async (req, res) => {
  try {
    // Find booking using the qrToken from the QR code
    const booking = await MembershipBooking.findOne({
      qrToken: req.params.token,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Invalid QR code — booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        fullName: booking.fullName,
        email: booking.email,
        phone: booking.phone,
        selectedPlan: booking.selectedPlan,
        startDate: booking.startDate,
        paymentStatus: booking.paymentStatus,
        bookingId: booking.bookingId,
        qrToken: booking.qrToken,
      },
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