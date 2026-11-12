import React, { Suspense, lazy, useLayoutEffect } from 'react';
import { Navigate, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import ResourceHub from './pages/ResourceHub';
import ArticleDetail from './pages/ArticleDetail';
import StoryDetail from './pages/StoryDetail';
import DemoDialog from './components/demo/DemoDialog';

// Loaded when visited, so each page carries only its own code.
const Home = lazy(() => import('./pages/Home'));
const MtrLanding = lazy(() => import('./pages/MtrLanding'));
const CoaLanding = lazy(() => import('./pages/CoaLanding'));
const About = lazy(() => import('./pages/About'));
const MtrCampaign = lazy(() => import('./pages/MtrCampaign'));
const RfqLanding = lazy(() => import('./pages/RfqLanding'));
const BookDemo = lazy(() => import('./pages/BookDemo'));
const DemoThankYou = lazy(() => import('./pages/DemoThankYou'));

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
      {/* The demo form, opened over any page by its "Book a demo" buttons. */}
      <DemoDialog />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <Home />
            </Suspense>
          }
        />
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
        <Route
          path="/about-us"
          element={
            <Suspense fallback={null}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="/rfq-to-quote"
          element={
            <Suspense fallback={null}>
              <RfqLanding />
            </Suspense>
          }
        />
        <Route
          path="/mtr-campaign"
          element={
            <Suspense fallback={null}>
              <MtrCampaign />
            </Suspense>
          }
        />
        <Route
          path="/book-a-demo"
          element={
            <Suspense fallback={null}>
              <BookDemo />
            </Suspense>
          }
        />
        <Route
          path="/book-a-demo/thank-you"
          element={
            <Suspense fallback={null}>
              <DemoThankYou />
            </Suspense>
          }
        />
        {/* The page's first address, kept for links already shared. */}
        <Route path="/about" element={<Navigate to="/about-us" replace />} />
      </Routes>
    </div>
  );
}
