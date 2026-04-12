const Razorpay = require('razorpay');
const crypto = require('crypto');
const MembershipBooking = require('../models/MembershipBooking');

// Initialize Razorpay with your keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    // Validate inputs
    if (!amount || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and bookingId are required',
      });
    }

    // Find the booking
    const booking = await MembershipBooking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if already paid
    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already paid',
      });
    }

    // Razorpay requires amount in PAISE (1 rupee = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    // Create order on Razorpay
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: bookingId,
      notes: {
        bookingId: booking.bookingId,
        memberName: booking.fullName,
        plan: booking.selectedPlan,
      },
    });

    // Save razorpayOrderId to booking
    booking.razorpayOrderId = order.id;
    booking.amount = amount;
    await booking.save();

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        bookingId: booking.bookingId,
        memberName: booking.fullName,
        plan: booking.selectedPlan,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order',
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // Validate all fields present
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !bookingId
    ) {
      return res.status(400).json({
        success: false,
        message: 'All payment details are required',
      });
    }

    // Verify signature 
    // This proves the payment is genuine and not tampered with
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      // Payment is fake or tampered
      await MembershipBooking.findOneAndUpdate(
        { bookingId },
        { paymentStatus: 'failed' }
      );

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed — invalid signature',
      });
    }

    // Payment is genuine — update booking
    const booking = await MembershipBooking.findOneAndUpdate(
      { bookingId },
      {
        paymentStatus: 'completed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully!',
      data: {
        bookingId: booking.bookingId,
        qrToken: booking.qrToken,
        fullName: booking.fullName,
        selectedPlan: booking.selectedPlan,
        amount: booking.amount,
        paidAt: booking.paidAt,
        paymentId: razorpay_payment_id,
      },
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed',
    });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const booking = await MembershipBooking.findOne({
      bookingId: req.params.bookingId,
    }).select(
      'bookingId fullName selectedPlan amount paymentStatus paidAt razorpayPaymentId'
    );

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
  createOrder,
  verifyPayment,
  getPaymentStatus,
};