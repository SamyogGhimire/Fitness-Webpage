import React, { useState, useEffect, useCallback } from 'react';
import { getLiveCrowd, getHourlyStats, checkIn } from '../services/api';

let socket = null;
try {
  const { io } = await import('socket.io-client');
  const SOCKET_URL = import.meta.env.VITE_API_URL || '';
  socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
} catch (_) {}

const CAPACITY = 50;

function CrowdBar({ percent, status }) {
  const color =
    status === 'Busy' ? '#E8192C' : status === 'Moderate Crowd' ? '#FF6B35' : '#22c55e';

  return (
    <div className="w-full bg-brand-border h-3 overflow-hidden">
      <div
        className="h-full transition-all duration-1000 ease-out"
        style={{ width: `${percent}%`, background: color }}
      />
    </div>
  );
}

function HourlyChart({ data }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-1 h-28">
      {data.map((d) => {
        const height = max > 0 ? Math.max((d.count / max) * 100, 4) : 4;
        const isNow = new Date().getHours() === d.hour;
        return (
          <div key={d.hour} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full flex items-end" style={{ height: '90px' }}>
              <div
                className={`w-full transition-all duration-700 ${isNow ? 'bg-brand-red' : 'bg-brand-border group-hover:bg-brand-red/50'}`}
                style={{ height: `${height}%` }}
              />
              {isNow && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-brand-red font-mono">
                  NOW
                </div>
              )}
            </div>
            {d.hour % 3 === 0 && (
              <span className="text-[9px] text-brand-muted">{d.label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CheckInModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      await checkIn(name.trim());
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-brand-card border border-brand-border w-full max-w-md p-8">
        <div className="w-6 h-0.5 bg-brand-red mb-4" />
        <h3 className="font-display text-3xl text-white mb-2">GYM CHECK-IN</h3>
        <p className="text-brand-muted text-sm mb-6">Enter your name to simulate gym entry and update live crowd count.</p>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-dark">Your Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="input-dark"
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? 'Checking in...' : '✓ Check In'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-1 py-3">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LiveCrowd() {
  const [crowd, setCrowd] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [lastPing, setLastPing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCrowd = useCallback(async () => {
    try {
      const res = await getLiveCrowd();
      setCrowd(res.data.data);
      setLastPing(new Date());
    } catch (_) {}
  }, []);

  const fetchHourly = useCallback(async () => {
    try {
      const res = await getHourlyStats();
      setHourly(res.data.data || []);
    } catch (_) {}
  }, []);

  useEffect(() => {
    Promise.all([fetchCrowd(), fetchHourly()]).finally(() => setLoading(false));

    // Poll every 30s as fallback
    const interval = setInterval(fetchCrowd, 30000);

    // Socket.IO real-time
    if (socket) {
      socket.on('crowdUpdate', () => { fetchCrowd(); setLastPing(new Date()); });
    }

    return () => {
      clearInterval(interval);
      if (socket) socket.off('crowdUpdate');
    };
  }, [fetchCrowd]);

  const statusColor = {
    'Low Crowd': 'text-green-400',
    'Moderate Crowd': 'text-orange-400',
    Busy: 'text-brand-red',
  };

  const bestTime = hourly.length
    ? hourly.reduce((a, b) => (a.count < b.count ? a : b), hourly[0])
    : null;

  const peakTime = hourly.length
    ? hourly.reduce((a, b) => (a.count > b.count ? a : b), hourly[0])
    : null;

  return (
    <section id="crowd" className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#E8192C 1px, transparent 1px), linear-gradient(90deg, #E8192C 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <span className="tag-red mb-4 inline-block">Feature 3 · Live</span>
          <h2 className="section-title">
            GYM CROWD <span className="text-brand-red">TRACKER</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-xl mx-auto">
            Real-time occupancy updates so you can choose the best time to train.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main crowd card */}
            <div className="md:col-span-2 card-dark p-8">
              {/* Live badge */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <span className="live-dot w-2.5 h-2.5 bg-brand-red rounded-full inline-block" />
                  <span className="font-mono text-xs text-brand-red uppercase tracking-widest">Live Now</span>
                </div>
                {lastPing && (
                  <span className="font-mono text-xs text-brand-muted">
                    Updated {lastPing.toLocaleTimeString()}
                  </span>
                )}
              </div>

              {/* Count display */}
              <div className="flex items-end gap-6 mb-8">
                <div>
                  <div className="font-display text-[clamp(5rem,15vw,9rem)] leading-none text-white counter">
                    {crowd?.count ?? 0}
                  </div>
                  <div className="text-brand-muted text-sm uppercase tracking-widest">People inside</div>
                </div>
                <div className="pb-4">
                  <div className="text-brand-muted text-xs mb-1">of {CAPACITY} capacity</div>
                  <div className={`font-display text-3xl ${statusColor[crowd?.status] || 'text-green-400'}`}>
                    {crowd?.status ?? 'Low Crowd'}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <CrowdBar percent={crowd?.occupancyPercent ?? 0} status={crowd?.status} />
              </div>
              <div className="flex justify-between text-xs text-brand-muted font-mono mb-8">
                <span>0</span>
                <span>{crowd?.occupancyPercent ?? 0}% occupied</span>
                <span>{CAPACITY}</span>
              </div>

              {/* Status guide */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Low Crowd', range: '0–30%', color: 'border-green-500/40 bg-green-500/5', dot: 'bg-green-500' },
                  { label: 'Moderate', range: '31–60%', color: 'border-orange-500/40 bg-orange-500/5', dot: 'bg-orange-500' },
                  { label: 'Busy', range: '61–100%', color: 'border-red-500/40 bg-red-500/5', dot: 'bg-red-500' },
                ].map((s) => (
                  <div key={s.label} className={`border p-3 text-center ${s.color}`}>
                    <div className={`w-2 h-2 rounded-full ${s.dot} mx-auto mb-2`} />
                    <div className="text-white text-xs font-semibold">{s.label}</div>
                    <div className="text-brand-muted text-xs">{s.range}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              {/* Check-in button */}
              <div className="card-dark p-6 text-center">
                <div className="text-4xl mb-3">📲</div>
                <h3 className="font-display text-xl text-white mb-2">SIMULATE CHECK-IN</h3>
                <p className="text-brand-muted text-xs mb-5 leading-relaxed">
                  Click to simulate a gym entry. Updates the live counter instantly for all viewers.
                </p>
                <button
                  onClick={() => setShowCheckIn(true)}
                  className="btn-primary w-full py-3 text-xs"
                >
                  Check In Now
                </button>
              </div>

              {/* Best / Peak time */}
              {bestTime && (
                <div className="card-dark p-5">
                  <div className="text-xs text-brand-muted uppercase tracking-widest mb-3">Today's Insights</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-brand-muted text-sm">🟢 Best time</span>
                      <span className="font-mono text-green-400 text-sm">{bestTime.label}</span>
                    </div>
                    {peakTime && (
                      <div className="flex justify-between items-center">
                        <span className="text-brand-muted text-sm">🔴 Peak time</span>
                        <span className="font-mono text-brand-red text-sm">{peakTime.label}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-brand-muted text-sm">⏰ Capacity</span>
                      <span className="font-mono text-white text-sm">{CAPACITY} people</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent check-ins */}
              {crowd?.recentVisits?.length > 0 && (
                <div className="card-dark p-5 flex-1">
                  <div className="text-xs text-brand-muted uppercase tracking-widest mb-3">Recent Check-ins</div>
                  <ul className="space-y-2">
                    {crowd.recentVisits.slice(0, 5).map((v, i) => (
                      <li key={i} className="flex items-center justify-between text-xs">
                        <span className="text-white">{v.userName}</span>
                        <span className="text-brand-muted font-mono">
                          {new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Hourly chart */}
            <div className="md:col-span-3 card-dark p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs text-brand-muted uppercase tracking-widest mb-1">Today's Traffic Pattern</div>
                  <div className="font-display text-2xl text-white">HOURLY CROWD</div>
                </div>
                <div className="flex items-center gap-4 text-xs text-brand-muted">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-brand-red inline-block" /> Current hour</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-brand-border inline-block" /> Past hours</span>
                </div>
              </div>
              <HourlyChart data={hourly} />
            </div>
          </div>
        )}
      </div>

      {showCheckIn && (
        <CheckInModal
          onClose={() => setShowCheckIn(false)}
          onSuccess={() => { fetchCrowd(); fetchHourly(); }}
        />
      )}
    </section>
  );
}