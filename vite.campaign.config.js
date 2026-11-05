import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// The MTR campaign page as a standalone site, for starsoftware.co (WordPress
// on Bluehost) at /landing-page/campaign/mtr/. `npm run build:campaign`
// writes it to dist-campaign/; upload that folder's contents to
// public_html/landing-page/campaign/mtr/. The page itself is the same one
// the app serves at /mtr-campaign.

const BASE = '/landing-page/campaign/mtr/';
const OUT_DIR = path.resolve('dist-campaign');
// What the page needs from public/; Vite copies the whole folder, the rest
// is removed from the upload.
const KEEP = new Set(['index.html', 'assets', 'mtr-campaign', '.htaccess']);

// Apache on Bluehost: the same "don't index" as the app's X-Robots-Tag, and
// long caching for the hashed files.
const HTACCESS = `<IfModule mod_headers.c>
  Header set X-Robots-Tag "noindex, nofollow"
  <FilesMatch "\\.(js|css|png|svg|woff2?)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
`;

function campaignOutput() {
  return {
    name: 'campaign-output',
    closeBundle() {
      for (const entry of fs.readdirSync(OUT_DIR)) {
        if (!KEEP.has(entry)) fs.rmSync(path.join(OUT_DIR, entry), { recursive: true, force: true });
      }
      fs.writeFileSync(path.join(OUT_DIR, '.htaccess'), HTACCESS);
    },
  };
}

export default defineConfig({
  root: 'campaign',
  base: BASE,
  publicDir: path.resolve('public'),
  plugins: [react(), campaignOutput()],
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
  },
  preview: {
    port: 4173,
    open: false,
  },
});
