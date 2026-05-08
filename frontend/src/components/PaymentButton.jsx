const handlePayment = async () => {
  setLoading(true);
  setError('');

  try {
    // Create order on backend
    const orderRes = await createPaymentOrder({ amount, bookingId });

    // Simulate payment success after 2 seconds
    // Remove this and use real Razorpay when domain is verified
    setTimeout(async () => {
      try {
        // Generate mock payment details
        const mockResponse = {
          razorpay_order_id: orderRes.data.data.orderId,
          razorpay_payment_id: 'pay_mock_' + Date.now(),
          razorpay_signature: 'mock_signature_' + Date.now(),
          bookingId: bookingId,
        };

        // Call verify on backend
        const verifyRes = await verifyPayment(mockResponse);

        if (verifyRes.data.success) {
          onSuccess(verifyRes.data.data);
        }
      } catch (err) {
        setError('Payment failed. Try again.');
      } finally {
        setLoading(false);
      }
    }, 2000);

  } catch (err) {
    setError(err.response?.data?.message || 'Failed to initiate payment');
    setLoading(false);
  }
};