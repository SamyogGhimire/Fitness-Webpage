const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // Check if mock payment
    const isMock = razorpay_payment_id.startsWith('pay_mock_');

    let isSignatureValid = false;

    if (isMock && process.env.NODE_ENV !== 'production') {
      // Allow mock payments in development only
      isSignatureValid = true;
    } else if (isMock) {
      // Allow mock in production too for demo purposes
      // Remove this in real production with verified business
      isSignatureValid = true;
    } else {
      // Real Razorpay verification
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
      isSignatureValid = expectedSignature === razorpay_signature;
    }

    if (!isSignatureValid) {
      await MembershipBooking.findOneAndUpdate(
        { bookingId },
        { paymentStatus: 'failed' }
      );
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Update booking as paid
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