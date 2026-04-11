import React, { useState, useEffect } from 'react';
import { getPlans, bookMembership } from '../services/api';
import Modal from '../components/Modal';
import QRCodeDisplay from '../components/QRCodeDisplay'; 

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
    benefits: ['Unlimited gym access', 'All group classes', 'Personal trainer (2/mo)', 'Locker & towel service', 'Diet consultation', 'Priority booking', 'Guest passes (2)'],
    badge: 'Best Value',
  },
];

function PlanCard({ plan, onBook }) {
  const isPopular = plan.badge === 'Popular';
  const isBest = plan.badge === 'Best Value';

  return (
    <div
      className={`relative card-dark flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-red/10 ${
        isPopular ? 'border-brand-red ring-1 ring-brand-red' : ''
      }`}
    >
      {plan.badge && (
        <div className={`absolute -top-3 left-6 tag-red text-xs`}>{plan.badge}</div>
      )}

      <div className="p-8 flex flex-col flex-1">
        <div className="mb-6">
          <div className="text-brand-muted text-xs uppercase tracking-widest mb-2">{plan.duration}</div>
          <div className="font-display text-4xl text-white">{plan.name}</div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-brand-muted text-lg">₹</span>
            <span className="font-display text-6xl text-white">{plan.price.toLocaleString()}</span>
          </div>
          <div className="text-brand-muted text-xs mt-1">per {plan.duration.toLowerCase()}</div>
        </div>

        <p className="text-brand-muted text-sm mb-6 leading-relaxed">{plan.description}</p>

        <ul className="flex-1 space-y-3 mb-8">
          {plan.benefits.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm text-brand-light">
              <span className="text-brand-red mt-0.5 flex-shrink-0">✓</span>
              {b}
            </li>
          ))}
        </ul>

        <button
          onClick={() => onBook(plan)}
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

function BookingForm({ plan, onClose }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    selectedPlan: plan?.name || '',
    startDate: '',
    paymentStatus: 'pending',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [bookingResult, setBookingResult] = useState(null);
 
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await bookMembership(form);

      // ─── NEW — save booking result with qrToken ──
      setBookingResult({
        bookingId: res.data.bookingId,
        qrToken: res.data.qrToken,
        fullName: form.fullName,
        plan: plan?.name,
      });

    } catch (err) {
      setError(
        err.response?.data?.message || 'Booking failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

 if (bookingResult) {
    return (
      <QRCodeDisplay
        bookingId={bookingResult.bookingId}
        qrToken={bookingResult.qrToken}
        fullName={bookingResult.fullName}
        plan={bookingResult.plan}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="card-dark p-4 mb-6">
        <div className="text-xs text-brand-muted uppercase tracking-widest">
          Selected Plan
        </div>
        <div className="font-display text-2xl text-white">{plan?.name}</div>
        <div className="text-brand-red font-semibold">
          ₹{plan?.price?.toLocaleString()} / {plan?.duration}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label-dark">Full Name *</label>
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
          <label className="label-dark">Phone Number *</label>
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
        <label className="label-dark">Email Address *</label>
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
        <label className="label-dark">Start Date *</label>
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

      <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 text-xs text-yellow-400">
        💳 Payment collected at gym on first visit.
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-4"
      >
        {loading ? 'Processing...' : 'Confirm Booking'}
      </button>
    </form>
  );
}

export default function Membership() {
  const [plans, setPlans] = useState(FALLBACK_PLANS);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlans()
      .then((res) => { if (res.data.data?.length) setPlans(res.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="membership" className="py-24 bg-brand-dark relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-red/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <span className="tag-red mb-4 inline-block">Feature 1</span>
          <h2 className="section-title">
            MEMBERSHIP <span className="text-brand-red">PLANS</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-xl mx-auto">
            Transparent pricing with no hidden fees. Choose the plan that fits your lifestyle.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PlanCard key={plan._id} plan={plan} onBook={setSelectedPlan} />
            ))}
          </div>
        )}
      </div>

      {selectedPlan && (
        <Modal title="Book Membership" onClose={() => setSelectedPlan(null)}>
          <BookingForm plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
        </Modal>
      )}
    </section>
  );
}