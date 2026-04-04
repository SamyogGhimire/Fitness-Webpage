import React, { useState, useEffect, useRef } from 'react';

const TESTIMONIALS = [
  {
    name: 'Aditya Verma',
    role: 'Software Engineer · Member since 2022',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    rating: 5,
    text: 'IronPeak completely transformed my approach to fitness. The trainers are knowledgeable, the equipment is world-class, and the atmosphere keeps you motivated. Lost 18kg in 8 months!',
    result: '18kg lost in 8 months',
  },
  {
    name: 'Divya Menon',
    role: 'Marketing Manager · Member since 2021',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    rating: 5,
    text: 'Priya\'s yoga sessions changed my life. I came in with chronic back pain and left with a completely new body. The online booking system is super convenient.',
    result: 'Chronic back pain eliminated',
  },
  {
    name: 'Rohan Gupta',
    role: 'Competitive Powerlifter · Member since 2020',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    rating: 5,
    text: 'Rahul is an absolute beast of a coach. He took my squat from 100kg to 185kg in 18 months. The facility has everything a serious lifter needs. No other gym compares.',
    result: 'Squat 100kg → 185kg',
  },
  {
    name: 'Lakshmi Nair',
    role: 'Entrepreneur · Member since 2023',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    rating: 5,
    text: 'The live crowd tracker is genius — I always know when to show up for a quieter session. The personal training at home option is perfect for my busy schedule.',
    result: 'First marathon completed',
  },
  {
    name: 'Karthik Subramanian',
    role: 'Doctor · Member since 2022',
    avatar: 'https://randomuser.me/api/portraits/men/66.jpg',
    rating: 5,
    text: 'As a physician, I can say IronPeak maintains the highest hygiene and safety standards I\'ve seen at any gym. The diet consultation service is evidence-based and effective.',
    result: '12% body fat reduction',
  },
  {
    name: 'Ananya Singh',
    role: 'Architecture Student · Member since 2023',
    avatar: 'https://randomuser.me/api/portraits/women/77.jpg',
    rating: 5,
    text: 'The yearly membership is unbeatable value. Meera\'s Zumba classes are a highlight of my week — you don\'t even realize you\'re working out because it\'s so much fun!',
    result: '15kg lost in 6 months',
  },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? 'star-filled text-sm' : 'star-empty text-sm'}>★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const next = () => goTo((current + 1) % TESTIMONIALS.length);
  const prev = () => goTo((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 6000);
    return () => clearInterval(timerRef.current);
  }, [current]);

  const t = TESTIMONIALS[current];
  const visible = [
    TESTIMONIALS[(current) % TESTIMONIALS.length],
    TESTIMONIALS[(current + 1) % TESTIMONIALS.length],
    TESTIMONIALS[(current + 2) % TESTIMONIALS.length],
  ];

  return (
    <section id="testimonials" className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Big background quote */}
      <div className="absolute top-0 left-0 font-display text-[20rem] leading-none text-white/[0.02] pointer-events-none select-none">
        "
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <span className="tag-red mb-4 inline-block">Real Results</span>
          <h2 className="section-title">
            SUCCESS <span className="text-brand-red">STORIES</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-xl mx-auto">
            Don't take our word for it — hear from members who transformed their lives at IronPeak.
          </p>
        </div>

        {/* Desktop: 3-card grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mb-10">
          {visible.map((t, i) => (
            <div
              key={`${current}-${i}`}
              className={`card-dark p-7 flex flex-col transition-all duration-500 ${
                i === 0 ? 'border-brand-red/50 ring-1 ring-brand-red/30' : ''
              }`}
              style={{ opacity: i === 0 ? 1 : 0.65 + i * 0.15, animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="text-brand-red/30 font-display text-6xl leading-none">"</div>
                <StarRating count={t.rating} />
              </div>

              <p className="text-brand-light text-sm leading-relaxed flex-1 mb-6">
                {t.text}
              </p>

              <div className="bg-brand-red/10 border border-brand-red/20 px-4 py-2 mb-5 text-center">
                <span className="text-brand-red text-xs font-mono">🏆 {t.result}</span>
              </div>

              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 object-cover rounded-full border border-brand-border" />
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-brand-muted text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: single card */}
        <div className="lg:hidden mb-10">
          <div className={`card-dark border-brand-red/50 ring-1 ring-brand-red/30 p-7 transition-all duration-400 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex items-start justify-between mb-5">
              <div className="text-brand-red/30 font-display text-6xl leading-none">"</div>
              <StarRating count={t.rating} />
            </div>
            <p className="text-brand-light text-sm leading-relaxed mb-6">{t.text}</p>
            <div className="bg-brand-red/10 border border-brand-red/20 px-4 py-2 mb-5 text-center">
              <span className="text-brand-red text-xs font-mono">🏆 {t.result}</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={t.avatar} alt={t.name} className="w-11 h-11 object-cover rounded-full border border-brand-border" />
              <div>
                <div className="text-white font-semibold text-sm">{t.name}</div>
                <div className="text-brand-muted text-xs">{t.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prev}
            className="w-10 h-10 border border-brand-border hover:border-brand-red text-white hover:text-brand-red transition-all flex items-center justify-center text-lg"
          >
            ←
          </button>

          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 ${
                  i === current ? 'w-8 h-1.5 bg-brand-red' : 'w-4 h-1.5 bg-brand-border hover:bg-brand-muted'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 border border-brand-border hover:border-brand-red text-white hover:text-brand-red transition-all flex items-center justify-center text-lg"
          >
            →
          </button>
        </div>

        {/* Aggregate stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-16 border-t border-brand-border">
          {[
            { value: '4.9', label: 'Average Rating', unit: '/ 5.0' },
            { value: '2,400+', label: 'Happy Members', unit: '' },
            { value: '98%', label: 'Would Recommend', unit: '' },
            { value: '500+', label: 'Transformations', unit: 'documented' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl md:text-5xl text-white">
                {s.value}
                {s.unit && <span className="text-brand-muted text-xl ml-1">{s.unit}</span>}
              </div>
              <div className="text-brand-muted text-xs uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}