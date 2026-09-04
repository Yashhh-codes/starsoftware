import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Helper to stream video with HTTP 206 Partial Content support
function handleVideoRequest(req, res, next) {
  const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
  if (decodedUrl.startsWith('/videos/') || decodedUrl.startsWith('/vid2/')) {
    const filePath = path.join(process.cwd(), decodedUrl);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4',
        });
        fileStream.pipe(res);
        return;
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes',
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }
  }
  next();
}

function videoServerPlugin() {
  return {
    name: 'serve-root-videos',
    configureServer(server) {
      server.middlewares.use(handleVideoRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleVideoRequest);
    },
    closeBundle() {
      const srcDir = path.join(process.cwd(), 'videos');
      const destDir = path.join(process.cwd(), 'dist', 'videos');
      if (fs.existsSync(srcDir)) {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        const files = fs.readdirSync(srcDir);
        for (const file of files) {
          const srcFile = path.join(srcDir, file);
          const destFile = path.join(destDir, file);
          if (fs.statSync(srcFile).isFile() && !fs.existsSync(destFile)) {
            fs.copyFileSync(srcFile, destFile);
          }
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), videoServerPlugin()],
  server: {
    port: 3000,
    open: false,
    host: true,
  },
  preview: {
    port: 3000,
    open: false,
    host: true,
  },
});
