import React, { useState, useEffect } from 'react';
import { getMyBookings } from '../services/api';
import { useAuth } from '../context/AuthContext';
import QRCodeDisplay from '../components/QRCodeDisplay';

export default function Dashboard({ onClose }) {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getMyBookings();
        const all = res.data.data || [];
        setBookings(all);
        // Find most recent completed booking
        const completed = all.find((b) => b.paymentStatus === 'completed');
        if (completed) setActiveBooking(completed);
      } catch (_) {}
      finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-3xl text-white">
            {user?.fullName?.toUpperCase()}
          </div>
          <div className="text-brand-muted text-sm">{user?.email}</div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs uppercase tracking-widest text-brand-muted hover:text-brand-red border border-brand-border px-4 py-2 transition-colors"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activeBooking ? (
        <>
          {/* Active membership badge */}
          <div className="bg-green-900/20 border border-green-500/30 p-4 flex items-center justify-between">
            <div>
              <div className="text-green-400 text-xs uppercase tracking-widest mb-1">
                Active Membership
              </div>
              <div className="font-display text-2xl text-white">
                {activeBooking.selectedPlan}
              </div>
            </div>
            <div className="text-green-400 text-2xl">✓</div>
          </div>

          {/* QR Code */}
          <div>
            <div className="text-xs text-brand-muted uppercase tracking-widest mb-3">
              Your Gym Entry QR Code
            </div>
            <QRCodeDisplay
              bookingId={activeBooking.bookingId}
              qrToken={activeBooking.qrToken}
              fullName={activeBooking.fullName}
              plan={activeBooking.selectedPlan}
            />
          </div>

          {/* Booking details */}
          <div className="card-dark p-5 space-y-3">
            <div className="text-xs text-brand-muted uppercase tracking-widest mb-2">
              Booking Details
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Booking ID</span>
              <span className="text-white font-mono text-xs">
                {activeBooking.bookingId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Start Date</span>
              <span className="text-white">
                {new Date(activeBooking.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Amount Paid</span>
              <span className="text-white">
                Rs {activeBooking.amount?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Payment</span>
              <span className="text-green-400 capitalize">
                {activeBooking.paymentStatus}
              </span>
            </div>
          </div>

          {/* All bookings */}
          {bookings.length > 1 && (
            <div className="card-dark p-5">
              <div className="text-xs text-brand-muted uppercase tracking-widest mb-3">
                All Bookings
              </div>
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b._id}
                    className="flex justify-between items-center text-sm border-b border-brand-border pb-3"
                  >
                    <div>
                      <div className="text-white">{b.selectedPlan}</div>
                      <div className="text-brand-muted text-xs">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`text-xs capitalize ${
                        b.paymentStatus === 'completed'
                          ? 'text-green-400'
                          : b.paymentStatus === 'failed'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">🏋️</div>
          <div className="font-display text-2xl text-white mb-2">
            NO ACTIVE MEMBERSHIP
          </div>
          <p className="text-brand-muted text-sm mb-6">
            You have no active membership yet. Book a plan to get your QR code.
          </p>
          <button
            onClick={onClose}
            className="btn-primary py-3 px-8"
          >
            View Membership Plans
          </button>
        </div>
      )}
    </div>
  );
}