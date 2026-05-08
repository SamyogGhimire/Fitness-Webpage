import React, { useState } from 'react';
import { submitContact } from '../services/api';

const ISSUE_TYPES = ['Inquiry', 'Complaint', 'Suggestion', 'Technical Issue'];
const SUBJECTS = [
  'Membership Question',
  'Trainer Booking',
  'Billing & Payment',
  'Facility Feedback',
  'Schedule & Classes',
  'Other',
];

const CONTACT_INFO = [
  { icon: '📞', label: 'Phone', value: '+91 80 1234 5678', href: 'tel:+918012345678' },
  { icon: '✉️', label: 'Email', value: 'hello@fitnesshub.in', href: 'mailto:hello@fitnesshub.in' },
  { icon: '📍', label: 'Address', value: '#Bengaluru – 562112', href: '#location' },
  { icon: '🕐', label: 'Support Hours', value: 'Mon–Sat · 9 AM – 8 PM', href: null },
];

const SOCIALS = [
  { label: 'Instagram', icon: '📸', href: '#' },
  { label: 'Facebook', icon: '👍', href: '#' },
  { label: 'YouTube', icon: '▶️', href: '#' },
  { label: 'WhatsApp', icon: '💬', href: '#' },
];

export default function Contact() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    subject: '', issueType: 'Inquiry', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await submitContact(form);
      setSuccess(true);
      setForm({ fullName: '', email: '', phone: '', subject: '', issueType: 'Inquiry', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <span className="tag-red mb-4 inline-block">Feature 5</span>
          <h2 className="section-title">
            GET IN <span className="text-brand-red">TOUCH</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-xl mx-auto">
            Have a question, complaint, or suggestion? We're here to help. Our team responds within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Left: Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Contact cards */}
            <div className="space-y-3">
              {CONTACT_INFO.map((c) => (
                <div key={c.label} className="card-dark p-5 flex gap-4 items-start group">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <div className="text-xs text-brand-muted uppercase tracking-widest mb-1">{c.label}</div>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="text-white text-sm hover:text-brand-red transition-colors"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <div className="text-white text-sm">{c.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="card-dark p-6">
              <div className="text-xs text-brand-muted uppercase tracking-widest mb-4">Follow Us</div>
              <div className="grid grid-cols-2 gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="flex items-center gap-2 border border-brand-border hover:border-brand-red p-3 transition-colors group"
                  >
                    <span>{s.icon}</span>
                    <span className="text-brand-muted group-hover:text-white text-xs transition-colors font-semibold">
                      {s.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Emergency card */}
            <div className="bg-brand-red/10 border border-brand-red/30 p-5">
              <div className="font-display text-xl text-brand-red mb-2">EMERGENCY CONTACT</div>
              <p className="text-brand-muted text-xs leading-relaxed mb-3">
                For medical emergencies at the facility, our trained staff are available at all times.
              </p>
              <a href="tel:+918012345678" className="text-white text-sm font-semibold hover:text-brand-red transition-colors">
                📞 Gym Helpline: +91 80 1234 5678
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-3">
            <div className="card-dark p-8">
              <div className="w-6 h-0.5 bg-brand-red mb-2" />
              <h3 className="font-display text-3xl text-white mb-6">SEND US A MESSAGE</h3>

              {success ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h4 className="font-display text-3xl text-white mb-2">MESSAGE SENT!</h4>
                  <p className="text-brand-muted mb-6">
                    Thank you for reaching out! Our team will get back to you within 24 hours.
                  </p>
                  <button onClick={() => setSuccess(false)} className="btn-primary">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 text-sm">{error}</div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label-dark">Full Name *</label>
                      <input
                        name="fullName" required value={form.fullName}
                        onChange={handleChange} placeholder="John Doe"
                        className="input-dark"
                      />
                    </div>
                    <div>
                      <label className="label-dark">Phone Number</label>
                      <input
                        name="phone" value={form.phone}
                        onChange={handleChange} placeholder="+91 9876543210"
                        className="input-dark"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-dark">Email Address *</label>
                    <input
                      type="email" name="email" required value={form.email}
                      onChange={handleChange} placeholder="john@example.com"
                      className="input-dark"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label-dark">Type of Issue *</label>
                      <select
                        name="issueType" value={form.issueType}
                        onChange={handleChange} className="input-dark"
                      >
                        {ISSUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label-dark">Subject *</label>
                      <select
                        name="subject" required value={form.subject}
                        onChange={handleChange} className="input-dark"
                      >
                        <option value="">Select subject</option>
                        {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label-dark">Message *</label>
                    <textarea
                      name="message" required value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your issue, suggestion, or question in detail..."
                      rows={5}
                      className="input-dark resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-3 bg-brand-border/20 p-4">
                    <span className="text-brand-red mt-0.5">ℹ️</span>
                    <p className="text-brand-muted text-xs leading-relaxed">
                      Your message is saved securely and reviewed by our team. We typically respond within
                      24 business hours. For urgent issues, please call us directly.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      '→ Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}