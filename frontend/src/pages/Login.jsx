import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login({ onSwitch, onClose }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-display text-4xl text-white mb-2">WELCOME BACK</h2>
        <p className="text-brand-muted text-sm">Login to access your membership and QR code</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-dark">Email Address</label>
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
          <label className="label-dark">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
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
            'Login to My Account'
          )}
        </button>
      </form>

      <p className="text-center text-brand-muted text-sm mt-6">
        Don't have an account?{' '}
        <button
          onClick={onSwitch}
          className="text-brand-red hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}