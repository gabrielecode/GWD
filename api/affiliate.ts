import type { IncomingMessage, ServerResponse } from 'node:http';
import express from 'express';
import { createAffiliateRouter } from '../server/router';

const app = express();
app.use('/api/affiliate', createAffiliateRouter());

interface VercelLikeRequest extends IncomingMessage {
  url?: string;
  query?: Record<string, string | string[] | undefined>;
}

export default function handler(req: VercelLikeRequest, res: ServerResponse) {
  try {
    const rawUrl = (req.url || '/api/affiliate').replace(/^\/+/, '/');
    const parsed = new URL(rawUrl, 'http://localhost');
    const queryPath = req.query?.__path;
    const rewrittenPath =
      parsed.searchParams.get('__path') ??
      (Array.isArray(queryPath) ? queryPath.join('/') : queryPath ?? null);

    if (rewrittenPath !== null) {
      parsed.searchParams.delete('__path');
      const cleanSubpath = String(rewrittenPath).replace(/^\/+/, '');
      const qs = parsed.searchParams.toString();
      req.url = `/api/affiliate${cleanSubpath ? `/${cleanSubpath}` : ''}${qs ? `?${qs}` : ''}`;
    } else if (!parsed.pathname.startsWith('/api/affiliate')) {
      const cleanPath = parsed.pathname.replace(/^\/+/, '');
      const qs = parsed.searchParams.toString();
      req.url = `/api/affiliate${cleanPath ? `/${cleanPath}` : ''}${qs ? `?${qs}` : ''}`;
    }

    return app(req as unknown as express.Request, res as unknown as express.Response);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Errore interno serverless.';
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: message }));
  }
}
