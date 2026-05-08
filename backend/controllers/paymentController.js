const Razorpay = require('razorpay');
const crypto = require('crypto');
const MembershipBooking = require('../models/MembershipBooking');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test',
});

const createOrder = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and bookingId are required',
      });
    }

    const booking = await MembershipBooking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const amountInPaise = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: bookingId,
    });

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
      message: error.message,
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

    if (!razorpay_order_id || !razorpay_payment_id || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'All payment details are required',
      });
    }

    // Allow mock payments for demo
    const isMock = razorpay_payment_id.startsWith('pay_mock_');
    let isValid = false;

    if (isMock) {
      isValid = true;
    } else {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');
      isValid = expected === razorpay_signature;
    }

    if (!isValid) {
      await MembershipBooking.findOneAndUpdate(
        { bookingId },
        { paymentStatus: 'failed' }
      );
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const booking = await MembershipBooking.findOne({
      bookingId: req.params.bookingId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        bookingId: booking.bookingId,
        paymentStatus: booking.paymentStatus,
        amount: booking.amount,
        paidAt: booking.paidAt,
      },
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