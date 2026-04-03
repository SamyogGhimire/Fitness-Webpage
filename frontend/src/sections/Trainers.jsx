import React, { useState, useEffect } from 'react';
import { getTrainers, bookTrainer } from '../services/api';
import Modal from '../components/Modal';

const FALLBACK_TRAINERS = [
  { _id: '1', name: 'Rahul Sharma', specialization: 'Strength & Powerlifting', experience: 8, image: 'https://randomuser.me/api/portraits/men/32.jpg', rating: 4.9, availableModes: ['At Gym', 'Video Call'], clients: 120 },
  { _id: '2', name: 'Priya Nair', specialization: 'Yoga & Flexibility', experience: 6, image: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 4.8, availableModes: ['At Gym', 'Personal Training', 'Video Call'], clients: 95 },
  { _id: '3', name: 'Arjun Mehta', specialization: 'Weight Loss & Cardio', experience: 5, image: 'https://randomuser.me/api/portraits/men/55.jpg', rating: 4.7, availableModes: ['At Gym', 'Personal Training', 'Video Call'], clients: 200 },
  { _id: '4', name: 'Sneha Kapoor', specialization: 'Bodybuilding & Aesthetics', experience: 7, image: 'https://randomuser.me/api/portraits/women/68.jpg', rating: 4.9, availableModes: ['At Gym', 'Video Call'], clients: 80 },
  { _id: '5', name: 'Vikram Rao', specialization: 'Functional Training & HIIT', experience: 4, image: 'https://randomuser.me/api/portraits/men/76.jpg', rating: 4.6, availableModes: ['At Gym', 'Personal Training'], clients: 65 },
  { _id: '6', name: 'Meera Iyer', specialization: 'Zumba & Dance Fitness', experience: 5, image: 'https://randomuser.me/api/portraits/women/90.jpg', rating: 4.8, availableModes: ['At Gym', 'Video Call'], clients: 150 },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </div>
  );
}

function TrainerCard({ trainer, onHire }) {
  return (
    <div className="card-dark group hover:border-brand-red/50 transition-all duration-300 overflow-hidden">
      <div className="relative h-56 overflow-hidden">
        <img
          src={trainer.image}
          alt={trainer.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <div className="tag-red text-xs">{trainer.specialization}</div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-2xl text-white mb-1">{trainer.name}</h3>

        <div className="flex items-center gap-3 mb-4">
          <StarRating rating={trainer.rating} />
          <span className="text-brand-muted text-xs">({trainer.rating})</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center bg-black p-3">
            <div className="font-display text-2xl text-brand-red">{trainer.experience}</div>
            <div className="text-xs text-brand-muted uppercase tracking-wide">Yrs Exp</div>
          </div>
          <div className="text-center bg-black p-3">
            <div className="font-display text-2xl text-brand-red">{trainer.clients}+</div>
            <div className="text-xs text-brand-muted uppercase tracking-wide">Clients</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {trainer.availableModes.map((mode) => (
            <span key={mode} className="text-xs bg-brand-border text-brand-muted px-2 py-1">
              {mode}
            </span>
          ))}
        </div>

        <button
          onClick={() => onHire(trainer)}
          className="w-full border border-brand-border hover:border-brand-red hover:text-brand-red text-white text-xs font-semibold uppercase tracking-widest py-3 transition-all duration-300"
        >
          Hire Trainer
        </button>
      </div>
    </div>
  );
}

function HireForm({ trainer, onClose }) {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    trainerName: trainer?.name || '',
    trainingType: 'At Gym',
    subscriptionType: 'Monthly',
    preferredTime: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await bookTrainer(form);
      setSuccess(res.data.bookingId);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">💪</div>
        <h3 className="font-display text-3xl text-white mb-2">TRAINER HIRED!</h3>
        <p className="text-brand-muted mb-4">Your session with {trainer.name} is confirmed.</p>
        <div className="bg-brand-red/10 border border-brand-red/30 p-4 mb-6">
          <div className="text-xs text-brand-muted uppercase tracking-widest">Booking ID</div>
          <div className="font-mono text-brand-red text-lg">{success}</div>
        </div>
        <button onClick={onClose} className="btn-primary">Done</button>
      </div>
    );
  }

  const TIME_SLOTS = ['6:00 AM - 7:00 AM', '7:00 AM - 8:00 AM', '8:00 AM - 9:00 AM',
    '9:00 AM - 10:00 AM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Trainer info */}
      <div className="flex items-center gap-4 card-dark p-4 mb-2">
        <img src={trainer?.image} alt={trainer?.name} className="w-14 h-14 object-cover object-top" />
        <div>
          <div className="font-display text-xl text-white">{trainer?.name}</div>
          <div className="text-brand-muted text-xs">{trainer?.specialization}</div>
        </div>
      </div>

      {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label-dark">Full Name *</label>
          <input name="fullName" required value={form.fullName} onChange={handleChange} placeholder="John Doe" className="input-dark" />
        </div>
        <div>
          <label className="label-dark">Phone *</label>
          <input name="phone" required value={form.phone} onChange={handleChange} placeholder="+91 9876543210" className="input-dark" />
        </div>
      </div>

      <div>
        <label className="label-dark">Email *</label>
        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="john@example.com" className="input-dark" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label-dark">Training Type *</label>
          <select name="trainingType" value={form.trainingType} onChange={handleChange} className="input-dark">
            {trainer?.availableModes?.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dark">Subscription *</label>
          <select name="subscriptionType" value={form.subscriptionType} onChange={handleChange} className="input-dark">
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label-dark">Preferred Time Slot *</label>
        <select name="preferredTime" required value={form.preferredTime} onChange={handleChange} className="input-dark">
          <option value="">Select a time slot</option>
          {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Address field: only if Personal Training */}
      {form.trainingType === 'Personal Training' && (
        <div className="animate-fade-in">
          <label className="label-dark">Your Address *</label>
          <textarea
            name="address"
            required
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your full address for the trainer to visit"
            rows={3}
            className="input-dark resize-none"
          />
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full py-4">
        {loading ? 'Processing...' : 'Confirm Booking'}
      </button>
    </form>
  );
}

export default function Trainers() {
  const [trainers, setTrainers] = useState(FALLBACK_TRAINERS);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const specializations = ['All', ...new Set(FALLBACK_TRAINERS.map((t) => t.specialization.split(' & ')[0]))];

  useEffect(() => {
    getTrainers()
      .then((res) => { if (res.data.data?.length) setTrainers(res.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? trainers : trainers.filter((t) => t.specialization.includes(filter));

  return (
    <section id="trainers" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="tag-red mb-4 inline-block">Feature 2</span>
          <h2 className="section-title">
            HIRE A <span className="text-brand-red">TRAINER</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-xl mx-auto">
            Work with certified professionals tailored to your specific goals. At gym, your place, or online.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setFilter(spec)}
              className={`text-xs font-semibold uppercase tracking-widest px-4 py-2 transition-all duration-200 ${
                filter === spec
                  ? 'bg-brand-red text-white'
                  : 'border border-brand-border text-brand-muted hover:border-brand-red hover:text-white'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((trainer) => (
              <TrainerCard key={trainer._id} trainer={trainer} onHire={setSelectedTrainer} />
            ))}
          </div>
        )}
      </div>

      {selectedTrainer && (
        <Modal title="Hire Trainer" onClose={() => setSelectedTrainer(null)}>
          <HireForm trainer={selectedTrainer} onClose={() => setSelectedTrainer(null)} />
        </Modal>
      )}
    </section>
  );
}