const mongoose = require('mongoose');

const MembershipBookingSchema = new mongoose.Schema(
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
      required: [true, 'Phone number is required'],
    },
    selectedPlan: {
      type: String,
      required: [true, 'Plan is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    bookingId: {
      type: String,
      unique: true,
    },

    // ─── NEW FIELDS ──────────────────────────
    qrToken: {
      type: String,
      unique: true,
      // this is what gets encoded inside the QR
    },
    qrGeneratedAt: {
      type: Date,
      default: null,
    },
    // ─────────────────────────────────────────

  },
  {
    timestamps: true,
  }
);

// Auto-generate bookingId and qrToken before saving
MembershipBookingSchema.pre('save', function (next) {
  // Generate bookingId
  if (!this.bookingId) {
    this.bookingId =
      'MBK-' +
      Date.now() +
      '-' +
      Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  // Generate qrToken
  // This is what gets encoded in the QR code
  if (!this.qrToken) {
    this.qrToken =
      'QR-' +
      Date.now() +
      '-' +
      Math.random().toString(36).substr(2, 9).toUpperCase();
    this.qrGeneratedAt = new Date();
  }

  next();
});

module.exports = mongoose.model('MembershipBooking', MembershipBookingSchema);