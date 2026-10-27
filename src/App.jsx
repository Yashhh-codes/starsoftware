import React, { Suspense, lazy, useLayoutEffect } from 'react';
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CustomerLogos from './components/CustomerLogos';
import CoaFeatures from './components/CoaFeatures';
import ResourceHub from './pages/ResourceHub';
import ArticleDetail from './pages/ArticleDetail';
import StoryDetail from './pages/StoryDetail';

// Loaded when visited, so the homepage doesn't carry them.
const MtrLanding = lazy(() => import('./pages/MtrLanding'));
const CoaLanding = lazy(() => import('./pages/CoaLanding'));

function Home() {
  return (
    <>
      <Navbar />

      <main className="home-main">
        <Hero />
        <CustomerLogos />
        <CoaFeatures />
      </main>
    </>
  );
}

// React Router keeps the scroll position when the page changes, so a link
// clicked halfway down one page opened the next one halfway down too. New
// pages start at the top; back/forward (POP) is left to the browser, and a
// #fragment link is left for the page to scroll to its target.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === 'POP' || hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash, navigationType]);

  return null;
}

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<ResourceHub />} />
        <Route path="/resources/stories/:slug" element={<StoryDetail />} />
        <Route path="/resources/:slug" element={<ArticleDetail />} />
        <Route
          path="/mtr-automation"
          element={
            <Suspense fallback={null}>
              <MtrLanding />
            </Suspense>
          }
        />
        <Route
          path="/coa-automation"
          element={
            <Suspense fallback={null}>
              <CoaLanding />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}
