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
      // Step 1 — Create order on backend
      const orderRes = await createPaymentOrder({ amount, bookingId });
      const { orderId, keyId } = orderRes.data.data;

      // Step 2 — Open Razorpay payment modal
      const options = {
        key: keyId,
        amount: amount * 100, // in paise
        currency: 'INR',
        name: 'Fitness Center',
        description: `${plan} Membership`,
        image: 'https://i.imgur.com/n5tjHFD.png',
        order_id: orderId,

        // Step 3 — On payment success
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            });

            if (verifyRes.data.success) {
              onSuccess(verifyRes.data.data);
            }
          } catch (err) {
            setError('Payment verification failed. Contact support.');
            if (onFailure) onFailure(err);
          }
        },

        // Prefill user details
        prefill: {
          name: memberName,
          email: email,
          contact: phone,
        },

        // Razorpay modal theme
        theme: {
          color: '#E8192C',
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            setError('Payment cancelled. Try again when ready.');
          },
        },
      };

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      // Open payment modal
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        if (onFailure) onFailure(response.error);
        setLoading(false);
      });

      rzp.open();
      setLoading(false);

    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to initiate payment'
      );
      setLoading(false);
    }
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Payment summary */}
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
            ₹{amount?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Test mode notice */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 p-3">
        <div className="text-yellow-400 text-xs font-semibold mb-1">
          🧪 TEST MODE
        </div>
        <div className="text-yellow-300/70 text-xs space-y-1">
          <div>Use test card: 4111 1111 1111 1111</div>
          <div>Expiry: Any future date · CVV: Any 3 digits</div>
          <div>OTP: Any number · No real money charged</div>
        </div>
      </div>

      {/* Pay button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-sm"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Opening Payment...
          </>
        ) : (
          <>
            💳 Pay ₹{amount?.toLocaleString()} Now
          </>
        )}
      </button>

      {/* Secure badge */}
      <div className="flex items-center justify-center gap-2 text-brand-muted text-xs">
        <span>🔒</span>
        <span>Secured by Razorpay · 256-bit SSL encryption</span>
      </div>
    </div>
  );
}