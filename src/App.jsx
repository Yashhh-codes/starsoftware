import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CustomerLogos from './components/CustomerLogos';
import TrustProof from './components/TrustProof';
import ProblemsSection from './components/ProblemsSection';
import ResourceHub from './pages/ResourceHub';
import ArticleDetail from './pages/ArticleDetail';
import ArticleDetailPreview from './pages/ArticleDetailPreview';

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <CustomerLogos />
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
        <Route path="/article-preview" element={<ArticleDetailPreview />} />
      </Routes>
    </div>
  );
}
