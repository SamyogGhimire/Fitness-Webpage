import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Membership', href: '#membership' },
  { label: 'Hire Trainer', href: '#trainers' },
  { label: 'Live Crowd', href: '#crowd' },
  { label: 'Location', href: '#location' },
  { label: 'Contact', href: '#contact' },
];

const LOGO_PATH = 'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
  
    // Listen for login modal trigger from other components
    const openLogin = () => setModal('login');
    window.addEventListener('openLoginModal', openLogin);
  
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('openLoginModal', openLogin);
    };
  }, []);

  const handleNav = (href) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const closeModal = () => setModal(null);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/95 backdrop-blur-sm border-b border-brand-border'
            : 'bg-black/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => handleNav('#home')}
            className="flex items-center gap-3 group flex-shrink-0"
          >
            <div className="w-9 h-9 bg-brand-red flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d={LOGO_PATH} />
              </svg>
            </div>
            <span className="font-display text-2xl tracking-wider text-white group-hover:text-brand-red transition-colors">
              FITNESSHUB
            </span>
          </button>

          {/* Desktop Nav — center */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-xs font-semibold uppercase tracking-widest text-brand-light hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Auth — right */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <>
                <button
                  onClick={() => setModal('dashboard')}
                  className="text-xs font-semibold uppercase tracking-widest text-white border border-brand-border hover:border-brand-red px-4 py-2 transition-colors"
                >
                  My Account
                </button>
                <button
                  onClick={logout}
                  className="text-xs font-semibold uppercase tracking-widest text-brand-muted hover:text-brand-red transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setModal('login')}
                className="btn-primary text-xs py-2.5 px-6"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          {/* Hamburger — mobile */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 flex-shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 bg-black border-t border-brand-border overflow-hidden ${menuOpen ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-left text-sm font-semibold uppercase tracking-widest text-brand-light hover:text-brand-red py-3 border-b border-brand-border/50 transition-colors"
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setMenuOpen(false); setModal('dashboard'); }}
                    className="text-left text-sm font-semibold uppercase tracking-widest text-white border border-brand-border px-4 py-3 transition-colors"
                  >
                    My Account
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="text-left text-sm font-semibold uppercase tracking-widest text-brand-muted hover:text-brand-red py-2 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); setModal('login'); }}
                  className="btn-primary w-full text-center text-xs py-3"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      {modal === 'login' && (
        <Modal title="Login" onClose={closeModal}>
          <Login onSwitch={() => setModal('signup')} onClose={closeModal} />
        </Modal>
      )}
      {modal === 'signup' && (
        <Modal title="Create Account" onClose={closeModal}>
          <Signup onSwitch={() => setModal('login')} onClose={closeModal} />
        </Modal>
      )}
      {modal === 'dashboard' && (
        <Modal title="My Account" onClose={closeModal}>
          <Dashboard onClose={closeModal} />
        </Modal>
      )}
    </>
  );
}