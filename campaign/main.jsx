import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import MtrCampaign from '../src/pages/MtrCampaign';
import '../src/index.css';

// The MTR campaign page on its own, for starsoftware.co at
// /landing-page/campaign/mtr/ (vite.campaign.config.js). The router only
// reads the address (#sections and ?faq=), under the page's own base.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <MtrCampaign />
    </BrowserRouter>
  </React.StrictMode>
);
