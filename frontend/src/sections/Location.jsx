import React, { useEffect, useRef } from 'react';

const GYM_LAT = 12.9716;
const GYM_LNG = 77.5946;

const HOURS = [
  { day: 'Monday – Friday', time: '5:00 AM – 11:00 PM' },
  { day: 'Saturday', time: '6:00 AM – 10:00 PM' },
  { day: 'Sunday', time: '7:00 AM – 8:00 PM' },
  { day: 'Public Holidays', time: '8:00 AM – 6:00 PM' },
];

function InfoCard() {
  return (
    <div className="card-dark p-8 h-full flex flex-col">
      <span className="tag-red mb-6 inline-block">Find Us</span>
      <h3 className="font-display text-4xl text-white mb-6">IRONPEAK FITNESS</h3>

      {/* Address */}
      <div className="flex gap-4 mb-6 pb-6 border-b border-brand-border">
        <div className="text-brand-red text-xl mt-0.5">📍</div>
        <div>
          <div className="text-xs text-brand-muted uppercase tracking-widest mb-1">Address</div>
          <div className="text-white text-sm leading-relaxed">
            #42, 3rd Floor, Koramangala 5th Block<br />
            Bengaluru, Karnataka – 560095<br />
            India
          </div>
        </div>
      </div>

      {/* Hours */}
      <div className="mb-6 pb-6 border-b border-brand-border">
        <div className="flex gap-4 mb-3">
          <div className="text-brand-red text-xl">🕐</div>
          <div className="text-xs text-brand-muted uppercase tracking-widest mt-1">Opening Hours</div>
        </div>
        <div className="ml-10 space-y-2">
          {HOURS.map((h) => (
            <div key={h.day} className="flex justify-between text-sm">
              <span className="text-brand-muted">{h.day}</span>
              <span className="text-white font-mono text-xs">{h.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-brand-red">📞</span>
          <a href="tel:+918012345678" className="text-white hover:text-brand-red text-sm transition-colors">
            +91 80 1234 5678
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-brand-red">✉️</span>
          <a href="mailto:hello@ironpeak.in" className="text-white hover:text-brand-red text-sm transition-colors">
            hello@ironpeak.in
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-brand-red">🌐</span>
          <span className="text-brand-muted text-sm">www.ironpeak.in</span>
        </div>
      </div>

      {/* Directions button */}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${GYM_LAT},${GYM_LNG}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary text-center text-xs py-4 mt-auto block"
      >
        🗺️ Get Directions
      </a>
    </div>
  );
}

export default function Location() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return; // already initialized

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;

        // Fix default icon
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        mapInstance.current = L.map(mapRef.current, {
          center: [GYM_LAT, GYM_LNG],
          zoom: 15,
          zoomControl: true,
          scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstance.current);

        // Custom red marker
        const redIcon = L.divIcon({
          html: `<div style="
            width: 36px; height: 36px; background: #E8192C;
            border: 3px solid #fff; border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg); box-shadow: 0 4px 20px rgba(232,25,44,0.6);
          "></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          className: '',
        });

        const marker = L.marker([GYM_LAT, GYM_LNG], { icon: redIcon }).addTo(mapInstance.current);

        marker.bindPopup(
          `<div style="font-family: 'DM Sans', sans-serif; color: #fff; background: #111; padding: 12px; border-left: 3px solid #E8192C; min-width: 160px;">
            <strong style="font-size: 14px;">IronPeak Fitness</strong><br/>
            <span style="font-size: 12px; color: #aaa;">Koramangala, Bangalore</span><br/>
            <span style="font-size: 11px; color: #E8192C;">⭐ 4.9 · Open Now</span>
          </div>`,
          { className: 'gym-popup' }
        ).openPopup();
      } catch (err) {
        console.error('Map init error:', err);
      }
    };

    if (mapRef.current) initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <section id="location" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="tag-red mb-4 inline-block">Feature 4</span>
          <h2 className="section-title">
            FIND <span className="text-brand-red">OUR GYM</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-xl mx-auto">
            Conveniently located in the heart of Koramangala, Bangalore. Easy parking available.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6 items-stretch">
          {/* Map */}
          <div className="md:col-span-3 h-[480px] overflow-hidden border border-brand-border">
            <div ref={mapRef} className="w-full h-full" />
          </div>

          {/* Info card */}
          <div className="md:col-span-2">
            <InfoCard />
          </div>
        </div>

        {/* Transport options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            { icon: '🚇', title: 'Metro', desc: 'Jayanagar Metro Station – 5 min walk (Green Line)' },
            { icon: '🚗', title: 'By Car', desc: 'Free parking available in the basement (30 spots)' },
            { icon: '🛵', title: 'Two-Wheeler', desc: 'Dedicated bike parking near entrance — no charge' },
          ].map((t) => (
            <div key={t.title} className="card-dark p-5 flex gap-4 items-start">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <div className="font-semibold text-white text-sm mb-1">{t.title}</div>
                <div className="text-brand-muted text-xs leading-relaxed">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .gym-popup .leaflet-popup-content-wrapper {
          background: #111 !important;
          border: 1px solid #1E1E1E !important;
          border-radius: 0 !important;
          padding: 0 !important;
        }
        .gym-popup .leaflet-popup-tip { background: #111 !important; }
      `}</style>
    </section>
  );
}