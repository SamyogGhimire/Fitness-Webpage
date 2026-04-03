import React from 'react';

const WHY_US = [
  { icon: '🏋️', title: 'World-Class Equipment', desc: 'Premium machines and free weights from top brands, maintained daily.' },
  { icon: '👥', title: 'Expert Community', desc: 'Train alongside motivated members in a supportive, energetic environment.' },
  { icon: '🎯', title: 'Goal-Oriented Programs', desc: 'Personalized training programs tailored to your specific fitness goals.' },
  { icon: '⚡', title: 'Open 24/7', desc: 'Whenever your schedule allows — morning, night, or any time in between.' },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Image grid */}
          <div className="relative grid grid-cols-2 gap-3">
            <img
              src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80"
              alt="Gym floor"
              className="w-full h-56 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80"
              alt="Training"
              className="w-full h-56 object-cover mt-8"
            />
            <img
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80"
              alt="Weights"
              className="w-full h-56 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=80"
              alt="Cardio"
              className="w-full h-56 object-cover mt-8"
            />
            {/* Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-red text-white text-center p-6 shadow-2xl">
              <div className="font-display text-5xl">15+</div>
              <div className="text-xs uppercase tracking-widest mt-1">Years of Excellence</div>
            </div>
          </div>

          {/* Right: Text */}
          <div>
            <span className="tag-red mb-4 inline-block">About IronPeak</span>
            <h2 className="section-title mb-6">
              MORE THAN
              <br />
              <span className="text-brand-red">A GYM.</span>
            </h2>
            <p className="section-subtitle mb-6">
              Founded in 2009, IronPeak Fitness Center has been Bangalore's premier destination for serious fitness. We
              combine cutting-edge equipment with elite coaching to help every member surpass their goals.
            </p>
            <p className="section-subtitle mb-10">
              Our 15,000 sq.ft facility houses dedicated zones for strength training, cardio, functional fitness, yoga,
              and recovery — all under one roof.
            </p>

            {/* Mission/Vision */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="card-dark p-5">
                <div className="text-brand-red font-display text-xl mb-2">MISSION</div>
                <p className="text-brand-muted text-sm leading-relaxed">
                  To make elite fitness accessible, inspiring every person to achieve their best self.
                </p>
              </div>
              <div className="card-dark p-5">
                <div className="text-brand-red font-display text-xl mb-2">VISION</div>
                <p className="text-brand-muted text-sm leading-relaxed">
                  To be South India's most trusted fitness destination by 2030.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {WHY_US.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-white text-sm mb-1">{item.title}</div>
                    <div className="text-brand-muted text-xs leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}