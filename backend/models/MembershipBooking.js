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
    amount: {
      type: Number,
      default: 0,
      // stores amount in rupees
    },

    // Payment Fields 
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
      default: null,
      // from Razorpay when order is created
    },
    razorpayPaymentId: {
      type: String,
      default: null,
      // from Razorpay after payment success
    },
    razorpaySignature: {
      type: String,
      default: null,
      // used to verify payment is genuine
    },
    paidAt: {
      type: Date,
      default: null,
      // timestamp of successful payment
    },
    
    //QR Fields 
    bookingId: {
      type: String,
      unique: true,
    },
    qrToken: {
      type: String,
      unique: true,
    },
    qrGeneratedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto generate bookingId and qrToken
MembershipBookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId =
      'MBK-' +
      Date.now() +
      '-' +
      Math.random().toString(36).substr(2, 5).toUpperCase();
  }
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

module.exports = mongoose.model(
  'MembershipBooking',
  MembershipBookingSchema
);