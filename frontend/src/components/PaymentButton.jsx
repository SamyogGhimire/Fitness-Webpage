import React, { useState } from 'react';
import { createPaymentOrder, verifyPayment } from '../services/api';

export default function PaymentButton({
  amount,
  bookingId,
  memberName,
  email,
  phone,
  plan,
  onSuccess,
  onFailure,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const orderRes = await createPaymentOrder({ amount, bookingId });

      setTimeout(async () => {
        try {
          const mockResponse = {
            razorpay_order_id: orderRes.data.data.orderId,
            razorpay_payment_id: 'pay_mock_' + Date.now(),
            razorpay_signature: 'mock_signature_' + Date.now(),
            bookingId: bookingId,
          };

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

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 text-sm">
          {error}
        </div>
      )}

      <div className="card-dark p-4 space-y-2">
        <div className="text-xs text-brand-muted uppercase tracking-widest mb-3">
          Payment Summary
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Member</span>
          <span className="text-white">{memberName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Plan</span>
          <span className="text-white">{plan}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-brand-border pt-2 mt-2">
          <span className="text-brand-muted">Total Amount</span>
          <span className="text-brand-red font-display text-2xl">
            Rs {amount?.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500/30 p-3">
        <div className="text-yellow-400 text-xs font-semibold mb-1">
          DEMO PAYMENT
        </div>
        <div className="text-yellow-300/70 text-xs">
          This is a simulated payment for demo purposes.
          Click Pay Now to complete booking.
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-sm"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <span>Pay Rs {amount?.toLocaleString()} Now</span>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-brand-muted text-xs">
        <span>Secured Payment System</span>
      </div>
    </div>
  );
}