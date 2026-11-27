import type { IncomingMessage, ServerResponse } from 'node:http';
import express from 'express';
import { createAffiliateRouter } from '../server/router';

const app = express();
app.use('/api/affiliate', createAffiliateRouter());

export default function handler(
  req: IncomingMessage & { url?: string },
  res: ServerResponse
) {
  const rawUrl = req.url || '/api/affiliate';
  const parsed = new URL(rawUrl, 'http://localhost');
  const rewrittenPath = parsed.searchParams.get('__path');

  if (rewrittenPath !== null) {
    parsed.searchParams.delete('__path');
    const cleanSubpath = rewrittenPath.replace(/^\/+/, '');
    const qs = parsed.searchParams.toString();
    req.url = `/api/affiliate${cleanSubpath ? `/${cleanSubpath}` : ''}${qs ? `?${qs}` : ''}`;
  } else if (!parsed.pathname.startsWith('/api/affiliate')) {
    const cleanPath = parsed.pathname.replace(/^\/+/, '');
    const qs = parsed.searchParams.toString();
    req.url = `/api/affiliate${cleanPath ? `/${cleanPath}` : ''}${qs ? `?${qs}` : ''}`;
  }

  return app(req as unknown as express.Request, res as unknown as express.Response);
}
