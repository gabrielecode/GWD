import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import express from 'express';
import contactHandler from './api/contact.js';
import { createAffiliateRouter } from './server/router.js';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  const isProd = process.env.NODE_ENV === 'production';

  app.set('trust proxy', true);

  // Existing contact endpoint
  app.post('/api/contact', express.json({ limit: '256kb' }), async (req, res) => {
    await contactHandler(
      { method: req.method, body: req.body },
      {
        setHeader: (name, value) => res.setHeader(name, value),
        status: (code) => ({
          json: (payload) => res.status(code).json(payload),
        }),
      }
    );
  });

  // Affiliate & CO 418a commission endpoints
  app.use('/api/affiliate', createAffiliateRouter());

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kreativalab server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
