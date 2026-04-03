import React from 'react';

const SERVICES = [
  {
    icon: '🏋️',
    title: 'Strength Training',
    desc: 'Full free-weight area, power racks, and strength machines for every level.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  },
  {
    icon: '🏃',
    title: 'Cardio Zone',
    desc: 'Treadmills, bikes, ellipticals, and rowers with integrated entertainment systems.',
    image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&q=80',
  },
  {
    icon: '🧘',
    title: 'Yoga & Mindfulness',
    desc: 'Daily yoga sessions in a serene studio. Hatha, Vinyasa, and restorative classes.',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80',
  },
  {
    icon: '🎯',
    title: 'Personal Training',
    desc: 'One-on-one sessions with certified trainers for accelerated results.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
  },
  {
    icon: '🥗',
    title: 'Diet Consultation',
    desc: 'Personalized nutrition plans from certified dietitians aligned with your goals.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
  },
  {
    icon: '⚡',
    title: 'HIIT & Functional',
    desc: 'High-intensity group classes for maximum calorie burn and athletic performance.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="tag-red mb-4 inline-block">What We Offer</span>
          <h2 className="section-title">
            OUR <span className="text-brand-red">SERVICES</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-xl mx-auto">
            Everything you need for a complete fitness lifestyle — all under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((service, i) => (
            <div
              key={service.title}
              className="group relative overflow-hidden h-64 cursor-pointer"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 group-hover:via-black/80 transition-all duration-300" />

              {/* Red accent on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-red scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="text-3xl mb-3 transform group-hover:-translate-y-1 transition-transform duration-300">
                  {service.icon}
                </span>
                <h3 className="font-display text-2xl text-white mb-2 tracking-wide">{service.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-300">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}