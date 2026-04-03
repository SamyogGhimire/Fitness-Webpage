const mongoose = require('mongoose');

const MembershipPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    duration: { type: String, required: true }, // e.g. "1 Day", "1 Month", "1 Year"
    price: { type: Number, required: true },
    description: { type: String },
    benefits: [{ type: String }],
    badge: { type: String }, // e.g. "Popular", "Best Value"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MembershipPlan', MembershipPlanSchema);