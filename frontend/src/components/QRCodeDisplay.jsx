import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeDisplay({ bookingId, qrToken, fullName, plan }) {
  const canvasRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!qrToken) return;

    // Generate QR code from qrToken
    QRCode.toDataURL(
      qrToken,
      {
        width: 280,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      },
      (err, url) => {
        if (!err) setQrDataUrl(url);
      }
    );
  }, [qrToken]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `fitnesshub-qr-${bookingId}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="text-center">
      {/* Success header */}
      <div className="text-5xl mb-3">🎉</div>
      <h3 className="font-display text-3xl text-white mb-1">
        BOOKING CONFIRMED!
      </h3>
      <p className="text-brand-muted text-sm mb-6">
        Show this QR code at the gym entrance to check in
      </p>

      {/* QR Code box */}
      <div className="inline-block bg-white p-4 mb-4">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Gym Entry QR Code"
            className="w-52 h-52"
          />
        ) : (
          <div className="w-52 h-52 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Booking details */}
      <div className="card-dark p-4 mb-4 text-left space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Name</span>
          <span className="text-white font-semibold">{fullName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Plan</span>
          <span className="text-white font-semibold">{plan}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Booking ID</span>
          <span className="text-brand-red font-mono text-xs">{bookingId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">QR Token</span>
          <span className="text-brand-muted font-mono text-xs truncate ml-4">
            {qrToken}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 mb-6 text-left">
        <div className="text-yellow-400 text-xs font-semibold mb-2">
          📋 HOW TO USE
        </div>
        <ul className="text-yellow-300/80 text-xs space-y-1">
          <li>→ Screenshot or download this QR code</li>
          <li>→ Open the FitnessHub app and go to My Account to get your QR code</li>
          <li>→ Show it to the admin at gym entrance</li>
          <li>→ Admin scans it to check you in</li>
          <li>→ Scan again when leaving to check out</li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          disabled={!qrDataUrl}
          className="btn-primary flex-1 py-3 text-xs"
        >
          ⬇️ Download QR
        </button>
      </div>
    </div>
  );
}