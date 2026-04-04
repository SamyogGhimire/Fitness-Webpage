const mongoose = require('mongoose');

const MembershipPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Plan name is required'],
            trim: true,
        },
        duration: {
            type: String,
            requires: [true, 'Duration is required'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        description: {
            type: String,
            trim: true,
        },
        benefits: [
            {
                type: String,
            }
        ],
        badge: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('MembershipPlan', MembershipPlanSchema);