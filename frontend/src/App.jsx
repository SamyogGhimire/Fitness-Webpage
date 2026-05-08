import React from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import Membership from './sections/Membership';
import Trainers from './sections/Trainers';
import LiveCrowd from './sections/LiveCrowd';
import Location from './sections/Location';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import AdminScanner from './pages/AdminScanner';

export default function App() {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  // Support both /admin and ?admin=true
  if (path === '/admin' || params.get('admin') === 'true') {
    return <AdminScanner />;
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white font-body">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Membership />
        <Trainers />
        <LiveCrowd />
        <Location />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}