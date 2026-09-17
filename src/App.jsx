import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustProof from './components/TrustProof';
import ProblemsSection from './components/ProblemsSection';
import ResourceHub from './pages/ResourceHub';
import ArticleDetail from './pages/ArticleDetail';

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <TrustProof />
        <ProblemsSection />
      </main>
    </>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<ResourceHub />} />
        <Route path="/resources/:slug" element={<ArticleDetail />} />
      </Routes>
    </div>
  );
}
