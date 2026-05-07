import React, { useState, useEffect, useRef } from 'react';
import { scanQR } from '../services/api';
import { getLiveCrowd } from '../services/api';

export default function AdminScanner() {
  const [mode, setMode] = useState('checkin');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [crowd, setCrowd] = useState(0);
  const [manualToken, setManualToken] = useState('');
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);

  // Fetch live crowd count
  useEffect(() => {
    const fetchCrowd = async () => {
      try {
        const res = await getLiveCrowd();
        setCrowd(res.data.data.count);
      } catch (_) {}
    };
    fetchCrowd();
    const interval = setInterval(fetchCrowd, 10000);
    return () => clearInterval(interval);
  }, []);

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
      // Refresh crowd count
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
        { facingMode: 'environment' }, // use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Stop scanner after successful scan
          await stopScanner();
          await handleScan(decodedText);
        },
        () => {} 
      );
    } catch (err) {
      setError('Camera access denied or not available');
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

  return (
    <div className="min-h-screen bg-brand-dark text-white font-body">

      {/* Header */}
      <div className="bg-black border-b border-brand-border px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-red flex items-center justify-center">
              <span className="text-white text-sm">⚡</span>
            </div>
            <div>
              <div className="font-display text-xl text-white">
                 ADMIN
              </div>
              <div className="text-brand-muted text-xs">Entry Scanner</div>
            </div>
          </div>

          {/* Live crowd badge */}
          <div className="text-center bg-brand-card border border-brand-border px-4 py-2">
            <div className="font-display text-2xl text-brand-red">{crowd}</div>
            <div className="text-brand-muted text-xs">Inside</div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { setMode('checkin'); setResult(null); }}
            className={`py-3 text-sm font-semibold uppercase tracking-widest transition-all ${
              mode === 'checkin'
                ? 'bg-green-600 text-white'
                : 'border border-brand-border text-brand-muted'
            }`}
          >
            ✅ Check In
          </button>
          <button
            onClick={() => { setMode('checkout'); setResult(null); }}
            className={`py-3 text-sm font-semibold uppercase tracking-widest transition-all ${
              mode === 'checkout'
                ? 'bg-brand-red text-white'
                : 'border border-brand-border text-brand-muted'
            }`}
          >
            👋 Check Out
          </button>
        </div>

        {/* Camera scanner */}
        <div className="card-dark p-4">
          <div className="text-xs text-brand-muted uppercase tracking-widest mb-3">
            Camera Scanner
          </div>

          {/* QR reader container */}
          <div
            id="qr-reader"
            ref={scannerRef}
            className={`w-full bg-black mb-4 ${scanning ? 'block' : 'hidden'}`}
            style={{ minHeight: '280px' }}
          />

          {/* Placeholder when not scanning */}
          {!scanning && (
            <div className="w-full h-48 bg-black border border-brand-border flex flex-col items-center justify-center mb-4 gap-3">
              <span className="text-5xl">📷</span>
              <span className="text-brand-muted text-sm">
                Camera not active
              </span>
            </div>
          )}

          {/* Scanner controls */}
          {!scanning ? (
            <button
              onClick={startScanner}
              className="btn-primary w-full py-3 text-sm"
            >
              📷 Start Camera Scanner
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="w-full py-3 text-sm font-semibold uppercase tracking-widest border border-brand-red text-brand-red"
            >
              ⏹ Stop Scanner
            </button>
          )}
        </div>

        {/* Manual token input */}
        <div className="card-dark p-4">
          <div className="text-xs text-brand-muted uppercase tracking-widest mb-3">
            Manual Entry (type QR token)
          </div>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="e.g. QR-1234567890-ABCDE"
              className="input-dark flex-1 text-xs"
            />
            <button
              type="submit"
              className="bg-brand-red text-white px-4 py-2 text-sm font-semibold uppercase tracking-wider"
            >
              Go
            </button>
          </form>
        </div>

        {/* Scan result */}
        {result && (
          <div
            className={`p-5 border ${
              result.success
                ? 'bg-green-900/20 border-green-500/50'
                : 'bg-red-900/20 border-red-500/50'
            }`}
          >
            <div className="text-2xl mb-2">
              {result.success ? '✅' : '❌'}
            </div>
            <div
              className={`font-display text-2xl mb-3 ${
                result.success ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {result.message}
            </div>

            {result.data && (
              <div className="space-y-2 text-sm">
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
                      {new Date(result.data.checkInTime)
                        .toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {result.data.checkOutTime && (
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Check Out</span>
                    <span className="text-white font-mono text-xs">
                      {new Date(result.data.checkOutTime)
                        .toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {result.data.timeSpentMinutes && (
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Time Spent</span>
                    <span className="text-white">
                      {result.data.timeSpentMinutes} minutes
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Scan again button */}
            <button
              onClick={() => { setResult(null); startScanner(); }}
              className="btn-primary w-full py-3 text-xs mt-4"
            >
              📷 Scan Next Member
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 text-sm">
            ❌ {error}
          </div>
        )}

      </div>
    </div>
  );
}