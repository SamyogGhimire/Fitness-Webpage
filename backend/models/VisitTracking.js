const mongoose = require('mongoose');

const VisitTrackingSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['inside', 'left'],
      default: 'inside',
    },

    qrToken: {
      type: String,
      default: null,

    },
    bookingId: {
      type: String,
      default: null,

    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('VisitTracking', VisitTrackingSchema);