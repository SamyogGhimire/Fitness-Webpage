import React, { useState, useEffect } from 'react';
import { getPlans, bookMembership } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import QRCodeDisplay from '../components/QRCodeDisplay';
import PaymentButton from '../components/PaymentButton';

const FALLBACK_PLANS = [
  {
    _id: '1',
    name: 'Day Pass',
    duration: '1 Day',
    price: 299,
    description: 'Perfect for a one-time gym experience.',
    benefits: ['Full gym access', 'Locker room', 'Free WiFi', 'Water station'],
    badge: '',
  },
  {
    _id: '2',
    name: 'Monthly Membership',
    duration: '1 Month',
    price: 1999,
    description: 'Ideal for building a consistent fitness routine.',
    benefits: ['Unlimited gym access', 'Group classes', 'Locker room', 'Nutrition guide', 'Free WiFi'],
    badge: 'Popular',
  },
  {
    _id: '3',
    name: 'Yearly Membership',
    duration: '1 Year',
    price: 14999,
    description: 'Best value for serious athletes.',
    benefits: ['Unlimited gym access', 'All group classes', 'Personal trainer (2/mo)', 'Locker and towel service', 'Diet consultation', 'Priority booking', 'Guest passes (2)'],
    badge: 'Best Value',
  },
];

function LoginPromptModal({ onClose, onLoginClick }) {
  return (
    <Modal title="Login Required" onClose={onClose}>
      <div className="text-center py-6">
        <div className="text-5xl mb-4">🔐</div>
        <h3 className="font-display text-2xl text-white mb-2">
          LOGIN REQUIRED
        </h3>
        <p className="text-brand-muted text-sm mb-6">
          You need to login or create an account before booking a membership.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-outline flex-1 py-3 text-xs"
          >
            Cancel
          </button>
          <button
            onClick={onLoginClick}
            className="btn-primary flex-1 py-3 text-xs"
          >
            Login / Sign Up
          </button>
        </div>
      </div>
    </Modal>
  );
}

function PlanCard({ plan, onBook, onLoginRequired }) {
  const { user } = useAuth();
  const isPopular = plan.badge === 'Popular';

  const handleBook = () => {
    if (!user) {
      onLoginRequired();
      return;
    }
    onBook(plan);
  };

  return (
    <div
      className={`relative card-dark flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-red/10 ${
        isPopular ? 'border-brand-red ring-1 ring-brand-red' : ''
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-6 tag-red text-xs">
          {plan.badge}
        </div>
      )}

      <div className="p-8 flex flex-col flex-1">
        <div className="mb-6">
          <div className="text-brand-muted text-xs uppercase tracking-widest mb-2">
            {plan.duration}
          </div>
          <div className="font-display text-4xl text-white">{plan.name}</div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-brand-muted text-lg">Rs</span>
            <span className="font-display text-6xl text-white">
              {plan.price.toLocaleString()}
            </span>
          </div>
          <div className="text-brand-muted text-xs mt-1">
            per {plan.duration.toLowerCase()}
          </div>
        </div>

        <p className="text-brand-muted text-sm mb-6 leading-relaxed">
          {plan.description}
        </p>

        <ul className="flex-1 space-y-3 mb-8">
          {plan.benefits.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm text-brand-light">
              <span className="text-brand-red mt-0.5 flex-shrink-0">✓</span>
              {b}
            </li>
          ))}
        </ul>

        <button
          onClick={handleBook}
          className={`w-full py-4 text-sm font-semibold uppercase tracking-widest transition-all duration-300 ${
            isPopular
              ? 'bg-brand-red hover:bg-red-700 text-white'
              : 'border border-brand-border hover:border-brand-red text-white hover:text-brand-red'
          }`}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

function BookingModal({ plan, onClose }) {
  const { user } = useAuth();
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    selectedPlan: plan?.name || '',
    startDate: '',
    amount: plan?.price || 0,
    paymentStatus: 'pending',
  });
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await bookMembership({ ...form, amount: plan?.price });
      setBookingData({
        bookingId: res.data.bookingId,
        qrToken: res.data.qrToken,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        plan: plan?.name,
        amount: plan?.price,
      });
      setStep('payment');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    setBookingData((prev) => ({ ...prev, ...paymentData }));
    setStep('success');
  };

  return (
    <div>
      {/* Progress steps */}
      {step !== 'success' && (
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 'form' ? 'bg-brand-red text-white' : 'bg-green-600 text-white'}`}>
              {step === 'form' ? '1' : '✓'}
            </div>
            <span className={`text-xs uppercase tracking-widest ${step === 'form' ? 'text-white' : 'text-green-400'}`}>
              Details
            </span>
          </div>
          <div className={`flex-1 h-px ${step === 'payment' ? 'bg-brand-red' : 'bg-brand-border'}`} />
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 'payment' ? 'bg-brand-red text-white' : 'bg-brand-border text-brand-muted'}`}>
              2
            </div>
            <span className={`text-xs uppercase tracking-widest ${step === 'payment' ? 'text-white' : 'text-brand-muted'}`}>
              Payment
            </span>
          </div>
          <div className="flex-1 h-px bg-brand-border" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-brand-border text-brand-muted">
              3
            </div>
            <span className="text-xs uppercase tracking-widest text-brand-muted">
              QR Code
            </span>
          </div>
        </div>
      )}

      {/* Step 1 - Form */}
      {step === 'form' && (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="card-dark p-4 mb-2">
            <div className="text-xs text-brand-muted uppercase tracking-widest">
              Selected Plan
            </div>
            <div className="font-display text-2xl text-white">{plan?.name}</div>
            <div className="text-brand-red font-semibold">
              Rs {plan?.price?.toLocaleString()} / {plan?.duration}
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Full Name</label>
              <input
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="input-dark"
              />
            </div>
            <div>
              <label className="label-dark">Phone</label>
              <input
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="input-dark"
              />
            </div>
          </div>

          <div>
            <label className="label-dark">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="input-dark"
            />
          </div>

          <div>
            <label className="label-dark">Start Date</label>
            <input
              type="date"
              name="startDate"
              required
              value={form.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="input-dark"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Continue to Payment'
            )}
          </button>
        </form>
      )}

      {/* Step 2 - Payment */}
      {step === 'payment' && bookingData && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="font-display text-2xl text-white mb-1">
              COMPLETE PAYMENT
            </div>
            <p className="text-brand-muted text-sm">
              One last step — complete your payment
            </p>
          </div>
          <PaymentButton
            amount={bookingData.amount}
            bookingId={bookingData.bookingId}
            memberName={bookingData.fullName}
            email={bookingData.email}
            phone={bookingData.phone}
            plan={bookingData.plan}
            onSuccess={handlePaymentSuccess}
            onFailure={() => setError('Payment failed. Try again.')}
          />
          <button
            onClick={() => setStep('form')}
            className="w-full text-brand-muted hover:text-white text-xs uppercase tracking-widest py-2 transition-colors"
          >
            Back to Details
          </button>
        </div>
      )}

      {/* Step 3 - QR Code */}
      {step === 'success' && bookingData && (
        <div>
          <QRCodeDisplay
            bookingId={bookingData.bookingId}
            qrToken={bookingData.qrToken}
            fullName={bookingData.fullName}
            plan={bookingData.plan}
          />
          <button
            onClick={onClose}
            className="btn-outline w-full py-3 mt-4 text-xs"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default function Membership() {
  const [plans, setPlans] = useState(FALLBACK_PLANS);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlans()
      .then((res) => { if (res.data.data?.length) setPlans(res.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLoginClick = () => {
    setShowLoginPrompt(false);
    // Trigger login modal via navbar
    const event = new CustomEvent('openLoginModal');
    window.dispatchEvent(event);
  };

  return (
    <section id="membership" className="py-24 bg-brand-dark relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-red/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <span className="tag-red mb-4 inline-block">Membership Plans</span>
          <h2 className="section-title">
            CHOOSE YOUR <span className="text-brand-red">PLAN</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-xl mx-auto">
            Transparent pricing. No hidden fees. Login to book your plan.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onBook={setSelectedPlan}
                onLoginRequired={() => setShowLoginPrompt(true)}
              />
            ))}
          </div>
        )}
      </div>

      {showLoginPrompt && (
        <LoginPromptModal
          onClose={() => setShowLoginPrompt(false)}
          onLoginClick={handleLoginClick}
        />
      )}

      {selectedPlan && (
        <Modal title="Book Membership" onClose={() => setSelectedPlan(null)}>
          <BookingModal
            plan={selectedPlan}
            onClose={() => setSelectedPlan(null)}
          />
        </Modal>
      )}
    </section>
  );
}