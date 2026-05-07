import React from 'react';

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Membership Plans', href: '#membership' },
  { label: 'Hire a Trainer', href: '#trainers' },
  { label: 'Live Crowd', href: '#crowd' },
  { label: 'Location', href: '#location' },
  { label: 'Contact', href: '#contact' },
];

const SERVICES = [
  'Strength Training',
  'Cardio Zone',
  'Yoga & Flexibility',
  'Personal Training',
  'HIIT Classes',
  'Diet Consultation',
  'Zumba & Dance',
  'Body Composition',
];

const SOCIALS = [
  { label: 'Instagram', symbol: 'IG' },
  { label: 'Facebook', symbol: 'FB' },
  { label: 'YouTube', symbol: 'YT' },
  { label: 'WhatsApp', symbol: 'WA' },
];

function scrollTo(href) {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-brand-border">
      {/* CTA Banner */}
      <div className="bg-brand-red">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-display text-4xl text-white">START YOUR JOURNEY TODAY.</div>
            <div className="text-red-200 text-sm mt-1">Join 2,000+ members who transformed their lives at our Gym.</div>
          </div>
          <button
            onClick={() => scrollTo('#membership')}
            className="bg-white text-brand-red font-body font-bold uppercase tracking-widest text-sm px-10 py-4 hover:bg-black hover:text-white transition-colors duration-300 flex-shrink-0"
          >
            Join Now →
          </button>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-brand-red flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
                </svg>
              </div>
              <span className="font-display text-2xl text-white tracking-wider">Fitness Hub</span>
            </div>
            <p className="text-brand-muted text-sm leading-relaxed mb-6">
              Bangalore's premier fitness destination. Transforming bodies and lives since 2009 with elite coaching and world-class facilities.
            </p>
            <div className="flex gap-2">
              {SOCIALS.map((s) => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  className="w-9 h-9 border border-brand-border hover:border-brand-red text-brand-muted hover:text-brand-red text-xs font-mono transition-all duration-200 flex items-center justify-center"
                >
                  {s.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-white mb-5 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-brand-red" />
              Quick Links
            </div>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                    className="text-brand-muted hover:text-brand-red text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-brand-red transition-all duration-200" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-white mb-5 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-brand-red" />
              Our Services
            </div>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s} className="text-brand-muted text-sm flex items-center gap-2">
                  <span className="text-brand-red text-xs">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Hours */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-white mb-5 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-brand-red" />
              Contact Us
            </div>
            <ul className="space-y-3 mb-8">
              <li className="text-brand-muted text-sm flex gap-2">
                <span>📍</span>
                <span>#42, Koramangala 5th Block,<br />Bengaluru – 560095</span>
              </li>
              <li>
                <a href="tel:+918012345678" className="text-brand-muted hover:text-white text-sm flex gap-2 transition-colors">
                  <span>📞</span> +91 80 1234 5678
                </a>
              </li>
              <li>
                <a href="mailto:hello@fitnesshub.in" className="text-brand-muted hover:text-white text-sm flex gap-2 transition-colors">
                  <span>✉️</span> hello@fitnesshub.in
                </a>
              </li>
            </ul>

            <div className="border-t border-brand-border pt-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-white mb-3">Hours</div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-brand-muted">
                  <span>Mon – Fri</span><span className="font-mono text-white">5AM – 11PM</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Saturday</span><span className="font-mono text-white">6AM – 10PM</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Sunday</span><span className="font-mono text-white">7AM – 8PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-brand-muted text-xs">
            © {year}  Fitness Hub. All rights reserved.
          </div>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((p) => (
              <a key={p} href="#" className="text-brand-muted hover:text-white text-xs transition-colors">
                {p}
              </a>
            ))}
          </div>
          <div className="text-brand-muted text-xs">
            Built with <span className="text-brand-red">♥</span> in Bengaluru
          </div>
        </div>
      </div>
    </footer>
  );
}