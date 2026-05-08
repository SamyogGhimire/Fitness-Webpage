import React, { useEffect, useRef } from 'react';

const LAT = 12.641627;
const LNG = 77.440139;
const MAPSURL = 'https://maps.app.goo.gl/4fc8FE5n7xAwn218A';
const POPUPHTML = '<div style="padding:10px;background:#111;color:#fff;"><strong>Fitness Hub</strong></div>';
const MARKERHTML = '<div style="width:32px;height:32px;background:#E8192C;border:3px solid #fff;border-radius:50%;"></div>';

const HOURS = [
  { day: 'Mon to Fri', time: '5AM to 11PM' },
  { day: 'Saturday', time: '6AM to 10PM' },
  { day: 'Sunday', time: '7AM to 8PM' },
];

const TRANSPORT = [
  { icon: '🚇', title: 'Metro', desc: 'Silk Metro - 1.5 hours Bus' },
  { icon: '🚗', title: 'By Car', desc: 'Free basement parking' },
  { icon: '🛵', title: 'Bike', desc: 'Bike parking near entrance' },
];

export default function Location() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;
    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
        mapInstance.current = L.map(mapRef.current, {
          center: [LAT, LNG],
          zoom: 15,
          scrollWheelZoom: false,
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstance.current);
        const redIcon = L.divIcon({
          html: MARKERHTML,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          className: '',
        });
        L.marker([LAT, LNG], { icon: redIcon })
          .addTo(mapInstance.current)
          .bindPopup(POPUPHTML)
          .openPopup();
      } catch (err) {
        console.error('Map error:', err);
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
    <section id="location" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="tag-red mb-4 inline-block">Find Us</span>
          <h2 className="section-title">
            GYM <span className="text-brand-red">LOCATION</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-xl mx-auto">
            Located in Kanakapura, Bangalore.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">

          <div className="md:col-span-3 h-96 border border-brand-border overflow-hidden">
            <div ref={mapRef} className="w-full h-full" />
          </div>

          <div className="md:col-span-2 card-dark p-8 flex flex-col gap-5">

            <h3 className="font-display text-3xl text-white">
              FITNESS HUB
            </h3>

            <div className="flex gap-3 pb-5 border-b border-brand-border">
              <span className="text-brand-red">📍</span>
              <div>
                <p className="text-xs text-brand-muted uppercase tracking-widest mb-1">Address</p>
                <p className="text-white text-sm">Kanakapura Road, Bengaluru 562112</p>
              </div>
            </div>

            <div className="pb-5 border-b border-brand-border">
              <p className="text-xs text-brand-muted uppercase tracking-widest mb-3">Opening Hours</p>
              <div className="space-y-2">
                {HOURS.map((h) => (
                  <div key={h.day} className="flex justify-between text-sm">
                    <span className="text-brand-muted">{h.day}</span>
                    <span className="text-white">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-3 text-sm">
                <span className="text-brand-red">📞</span>
                <span className="text-white">+91 80 1234 5678</span>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-brand-red">✉️</span>
                <span className="text-white">hello@fitnesshub.in</span>
              </div>
            </div>

            <button
              onClick={() => window.open(MAPSURL, '_blank')}
              className="btn-primary text-center text-xs py-4 mt-auto"
            >
              Get Directions
            </button>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {TRANSPORT.map((t) => (
            <div key={t.title} className="card-dark p-5 flex gap-4">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <p className="font-semibold text-white text-sm mb-1">{t.title}</p>
                <p className="text-brand-muted text-xs">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}