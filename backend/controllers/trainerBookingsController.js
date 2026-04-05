const TrainerBooking = require('../models/TrainerBooking');


const createTrainerBooking = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      trainerName,
      trainingType,
      subscriptionType,
      preferredTime,
    } = req.body;

    if (!fullName || !email || !phone || !trainerName ||
        !trainingType || !subscriptionType || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    if (trainingType === 'Personal Training' && !req.body.address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required for Personal Training',
      });
    }

    const booking = await TrainerBooking.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Trainer booked successfully!',
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

const getAllTrainerBookings = async (req, res) => {
  try {
    const bookings = await TrainerBooking.find()
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

const getTrainerBookingById = async (req, res) => {
  try {
    const booking = await TrainerBooking.findOne({
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

module.exports = {
  createTrainerBooking,
  getAllTrainerBookings,
  getTrainerBookingById,
};