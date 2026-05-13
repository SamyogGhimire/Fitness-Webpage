import React, { useState } from 'react';
import { signupUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Signup({ onSwitch, onClose }) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const res = await signupUser({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      login(res.data.user, res.data.token);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-display text-4xl text-white mb-2">CREATE ACCOUNT</h2>
        <p className="text-brand-muted text-sm">Join FitnessHub and manage your membership</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="label-dark">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="input-dark"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-dark">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              className="input-dark"
            />
          </div>
          <div>
            <label className="label-dark">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              className="input-dark"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Create My Account'
          )}
        </button>
      </form>

      <p className="text-center text-brand-muted text-sm mt-6">
        Already have an account?{' '}
        <button
          onClick={onSwitch}
          className="text-brand-red hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}