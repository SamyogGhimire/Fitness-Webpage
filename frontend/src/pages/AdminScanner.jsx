import React, { useState, useEffect, useRef } from 'react';
import { scanQR, getLiveCrowd, loginUser } from '../services/api';

export default function AdminScanner() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [adminName, setAdminName] = useState('');

  const [mode, setMode] = useState('checkin');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [crowd, setCrowd] = useState(0);
  const [manualToken, setManualToken] = useState('');
  const html5QrRef = useRef(null);

  // Check session on mount
  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    const name = sessionStorage.getItem('adminName');
    if (auth === 'true') {
      setAuthenticated(true);
      setAdminName(name || 'Admin');
    }
  }, []);

  // Fetch live crowd count
  useEffect(() => {
    if (!authenticated) return;
    const fetchCrowd = async () => {
      try {
        const res = await getLiveCrowd();
        setCrowd(res.data.data.count);
      } catch (_) {}
    };
    fetchCrowd();
    const interval = setInterval(fetchCrowd, 10000);
    return () => clearInterval(interval);
  }, [authenticated]);

  // Handle admin login
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setAuthLoading(true);

    try {
      const res = await loginUser({ email, password });
      const userData = res.data.user;

      if (userData.role !== 'admin') {
        setPasswordError('Access denied. Admin accounts only.');
        setAuthLoading(false);
        return;
      }

      sessionStorage.setItem('adminAuth', 'true');
      sessionStorage.setItem('adminName', userData.fullName);
      setAdminName(userData.fullName);
      setAuthenticated(true);

    } catch (err) {
      setPasswordError(
        err.response?.data?.message || 'Invalid email or password'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminName');
    setAuthenticated(false);
    setEmail('');
    setPassword('');
    stopScanner();
  };

  // Handle QR scan result
  const handleScan = async (token) => {
    if (!token) return;
    setError('');
    setResult(null);

    try {
      const res = await scanQR(token.trim(), mode);
      setResult({
        success: true,
        message: res.data.message,
        data: res.data.data,
      });
      const crowdRes = await getLiveCrowd();
      setCrowd(crowdRes.data.data.count);
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || 'Scan failed',
        data: err.response?.data?.data || null,
      });
    }
  };

  // Start camera scanner
  const startScanner = async () => {
    setScanning(true);
    setResult(null);
    setError('');

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      html5QrRef.current = new Html5Qrcode('qr-reader');

      await html5QrRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await stopScanner();
          await handleScan(decodedText);
        },
        () => {}
      );
    } catch (err) {
      setError('Camera access denied. Use manual entry instead.');
      setScanning(false);
    }
  };

  // Stop camera scanner
  const stopScanner = async () => {
    try {
      if (html5QrRef.current) {
        await html5QrRef.current.stop();
        html5QrRef.current = null;
      }
    } catch (_) {}
    setScanning(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  // Manual token submit
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    await handleScan(manualToken.trim());
    setManualToken('');
  };

  // ─── LOGIN SCREEN ─────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <div className="w-full max-w-sm">

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-red flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🔐</span>
            </div>
            <h1 className="font-display text-4xl text-white">ADMIN ACCESS</h1>
            <p className="text-brand-muted text-sm mt-2">
              FitnessHub Entry Scanner
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordError && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 text-sm text-center">
                {passwordError}
              </div>
            )}

            <div>
              <label className="label-dark">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fitnesshub.in"
                className="input-dark"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="label-dark">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="input-dark"
                required
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Login to Admin Panel'
              )}
            </button>

            
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="block w-full text-center text-brand-muted text-xs hover:text-white transition-colors mt-4"
              >
                Back to Website
              </button>
          </form>

        </div>
      </div>
    );
  }

  // ─── SCANNER SCREEN ───────────────────────────────
  return (
    <div className="min-h-screen bg-brand-dark text-white font-body">

      {/* Header */}
      <div className="bg-black border-b border-brand-border px-4 py-4 sticky top-0 z-50">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-red flex items-center justify-center">
              <span className="text-white text-sm">⚡</span>
            </div>
            <div>
              <div className="font-display text-lg text-white">
                FITNESSHUB ADMIN
              </div>
              <div className="text-brand-muted text-xs">
                {adminName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center bg-brand-card border border-brand-border px-3 py-1">
              <div className="font-display text-xl text-brand-red">
                {crowd}
              </div>
              <div className="text-brand-muted text-xs">Inside</div>
            </div>

            <button
              onClick={handleLogout}
              className="text-brand-muted hover:text-white text-xs uppercase tracking-widest border border-brand-border px-3 py-2 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { setMode('checkin'); setResult(null); }}
            className={`py-4 text-sm font-semibold uppercase tracking-widest transition-all ${
              mode === 'checkin'
                ? 'bg-green-600 text-white'
                : 'border border-brand-border text-brand-muted'
            }`}
          >
            Check In
          </button>
          <button
            onClick={() => { setMode('checkout'); setResult(null); }}
            className={`py-4 text-sm font-semibold uppercase tracking-widest transition-all ${
              mode === 'checkout'
                ? 'bg-brand-red text-white'
                : 'border border-brand-border text-brand-muted'
            }`}
          >
            Check Out
          </button>
        </div>

        {/* Mode indicator */}
        <div className={`text-center py-2 text-xs font-mono uppercase tracking-widest ${
          mode === 'checkin' ? 'text-green-400' : 'text-brand-red'
        }`}>
          Mode: {mode === 'checkin' ? 'Checking In' : 'Checking Out'}
        </div>

        {/* Camera scanner */}
        <div className="card-dark p-4">
          <div className="text-xs text-brand-muted uppercase tracking-widest mb-3">
            Camera Scanner
          </div>

          <div
            id="qr-reader"
            className={`w-full bg-black mb-4 ${scanning ? 'block' : 'hidden'}`}
            style={{ minHeight: '280px' }}
          />

          {!scanning && (
            <div className="w-full h-52 bg-black border border-dashed border-brand-border flex flex-col items-center justify-center mb-4 gap-3">
              <span className="text-5xl">📷</span>
              <span className="text-brand-muted text-sm">
                Tap button to start camera
              </span>
              <span className="text-brand-muted text-xs">
                Allow camera access when prompted
              </span>
            </div>
          )}

          {!scanning ? (
            <button
              onClick={startScanner}
              className="btn-primary w-full py-4 text-sm"
            >
              Start Camera
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="w-full py-4 text-sm font-semibold uppercase tracking-widest border border-brand-red text-brand-red"
            >
              Stop Camera
            </button>
          )}
        </div>

        {/* Manual entry */}
        <div className="card-dark p-4">
          <div className="text-xs text-brand-muted uppercase tracking-widest mb-3">
            Manual Token Entry
          </div>
          <p className="text-brand-muted text-xs mb-3">
            If camera does not work, ask member for their QR token.
          </p>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="QR-1234567890-ABCDE"
              className="input-dark flex-1 text-xs font-mono"
            />
            <button
              type="submit"
              className="bg-brand-red text-white px-5 py-2 text-sm font-semibold uppercase"
            >
              Go
            </button>
          </form>
        </div>

        {/* Scan result */}
        {result && (
          <div className={`p-6 border ${
            result.success
              ? 'bg-green-900/20 border-green-500/50'
              : 'bg-red-900/20 border-red-500/50'
          }`}>
            <div className="text-4xl mb-3 text-center">
              {result.success ? '✅' : '❌'}
            </div>
            <div className={`font-display text-2xl mb-4 text-center ${
              result.success ? 'text-green-400' : 'text-red-400'
            }`}>
              {result.message}
            </div>

            {result.data && (
              <div className="space-y-2 text-sm bg-black/30 p-4 mb-4">
                {result.data.fullName && (
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Member</span>
                    <span className="text-white font-semibold">
                      {result.data.fullName}
                    </span>
                  </div>
                )}
                {result.data.selectedPlan && (
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Plan</span>
                    <span className="text-white">
                      {result.data.selectedPlan}
                    </span>
                  </div>
                )}
                {result.data.checkInTime && (
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Check In</span>
                    <span className="text-white font-mono text-xs">
                      {new Date(result.data.checkInTime).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {result.data.checkOutTime && (
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Check Out</span>
                    <span className="text-white font-mono text-xs">
                      {new Date(result.data.checkOutTime).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {result.data.timeSpentMinutes !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Time Spent</span>
                    <span className="text-white">
                      {result.data.timeSpentMinutes} min
                    </span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => { setResult(null); startScanner(); }}
              className="btn-primary w-full py-3 text-xs"
            >
              Scan Next Member
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 text-sm">
            {error}
          </div>
        )}

        {/* Instructions */}
        <div className="card-dark p-4 text-xs text-brand-muted space-y-2">
          <div className="text-white text-xs font-semibold uppercase tracking-widest mb-3">
            How to use
          </div>
          <div>1. Select Check In or Check Out mode</div>
          <div>2. Tap Start Camera to open scanner</div>
          <div>3. Point camera at member QR code</div>
          <div>4. Result appears automatically</div>
          <div>5. Live crowd count updates in real time</div>
        </div>

      </div>
    </div>
  );
}