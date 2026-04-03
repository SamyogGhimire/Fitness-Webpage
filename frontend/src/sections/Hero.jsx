import React, { useEffect, useState } from 'react';

const STATS = [
  { value: '2000+', label: 'Active Members' },
  { value: '50+', label: 'Expert Trainers' },
  { value: '15+', label: 'Years Experience' },
  { value: '98%', label: 'Success Rate' },
];

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80&auto=format&fit=crop"
          alt="Gym"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        {/* Red accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20">
        <div
          className={`transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className="tag-red mb-6 inline-block">Est. 2009 · Premium Fitness</span>

          <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-none text-white mb-6 max-w-3xl">
            TRANSFORM
            <br />
            <span className="text-brand-red">YOUR BODY,</span>
            <br />
            TRANSFORM
            <br />
            YOUR LIFE.
          </h1>

          <p className="text-brand-light text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-light">
            State-of-the-art equipment, world-class trainers, and a community that pushes you beyond your limits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <button
              onClick={() => scrollTo('#membership')}
              className="btn-primary text-sm py-4 px-10"
            >
              Join Membership
            </button>
            <button
              onClick={() => scrollTo('#trainers')}
              className="btn-outline text-sm py-4 px-10"
            >
              Hire a Trainer
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-4xl md:text-5xl text-brand-red">{stat.value}</div>
                <div className="text-brand-muted text-sm uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-brand-muted text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-brand-red to-transparent" />
      </div>
    </section>
  );
}