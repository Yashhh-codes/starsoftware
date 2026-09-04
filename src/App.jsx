import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CustomerLogos from './components/CustomerLogos';

export default function App() {
  return (
    <div className="app-shell">
      {/* Structural Architectural Grid Lines (continuous through page) */}
      <div className="structural-grid-lines" aria-hidden="true">
        <div className="grid-line-left" />
        <div className="grid-line-right" />
      </div>

      <Navbar />

      <main>
        <Hero />
        <CustomerLogos />
      </main>
    </div>
  );
}
