const mongoose = require('mongoose');

const MembershipBookingSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
        },
        email:{
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
        },
        phone:{
            type: String,
            required :[true, 'Phone number is required'],
        },
        selectedPlan:{
            type: String,
            required: [true, 'Plan is Required'],
        },
        startDate: {
            type: Date,
            required :[true, 'Start date is required'],
        },
        paymentStatus: {
            type:String,
            enum: ['pending','completed','failed'],
            default: 'pending'
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

MembershipBookingSchema.pre('save', function(next){
    if(!this.bookingId){
        this.bookingId = 
        'MBK-' +
        Date.now() +
        '-' +
        Math.random().toString(36).substr(2,5).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('MembershipBooking', MembershipBookingSchema);