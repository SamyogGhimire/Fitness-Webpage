const mongoose = require('mongoose');

const TrainerBookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    trainerName: {
      type: String,
      required: [true, 'Trainer name is required'],
    },
    trainingType: {
      type: String,
      enum: ['At Gym', 'Personal Training', 'Video Call'],
      required: [true, 'Training type is required'],
    },
    subscriptionType: {
      type: String,
      enum: ['Monthly', 'Yearly'],
      required: [true, 'Subscription type is required'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Preferred time is required'],
    },
    address: {
      type: String,
      default: '',
     
    },
    bookingId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

TrainerBookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId =
      'TBK-' +
      Date.now() +
      '-' +
      Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('TrainerBooking', TrainerBookingSchema);