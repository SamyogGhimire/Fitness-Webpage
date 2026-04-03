const mongoose = require('mongoose');

const TrainerBookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    trainerName: { type: String, required: true },
    trainingType: {
      type: String,
      enum: ['At Gym', 'Personal Training', 'Video Call'],
      required: true,
    },
    subscriptionType: { type: String, enum: ['Monthly', 'Yearly'], required: true },
    preferredTime: { type: String, required: true },
    address: { type: String, default: '' },
    bookingId: { type: String, unique: true },
  },
  { timestamps: true }
);

TrainerBookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'TBK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('TrainerBooking', TrainerBookingSchema);