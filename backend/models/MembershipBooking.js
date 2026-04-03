const mongoose = require('mongoose');

const MembershipBookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    selectedPlan: { type: String, required: true },
    startDate: { type: Date, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    bookingId: { type: String, unique: true },
  },
  { timestamps: true }
);

MembershipBookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'MBK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('MembershipBooking', MembershipBookingSchema);