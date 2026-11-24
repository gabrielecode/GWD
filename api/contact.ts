import process from 'node:process';
import { BUSINESS_INFO } from '../src/data/business';

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (payload: unknown) => void;
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseBody(rawBody: unknown): Record<string, unknown> | null {
  if (rawBody && typeof rawBody === 'object' && !Array.isArray(rawBody)) {
    return rawBody as Record<string, unknown>;
  }
  if (typeof rawBody === 'string') {
    try {
      const parsed: unknown = JSON.parse(rawBody);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
  }
  return null;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = parseBody(req.body);
  if (!body) {
    res.status(400).json({ error: 'Invalid JSON payload' });
    return;
  }

  const nome = typeof body.nome === 'string' ? body.nome.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const messaggio =
    typeof body.messaggio === 'string' ? body.messaggio.trim() : '';

  if (nome.length < 2 || nome.length > 200) {
    res.status(400).json({ error: 'Nome non valido (min 2 caratteri).' });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    res.status(400).json({ error: 'Indirizzo email non valido.' });
    return;
  }

  if (messaggio.length < 2 || messaggio.length > 5000) {
    res.status(400).json({ error: 'Messaggio non valido.' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Servizio email non configurato.' });
    return;
  }

  const fromAddress =
    process.env.RESEND_FROM_EMAIL || 'kreativalab <noreply@kreativalab.ch>';
  const safeSubjectName = nome.replace(/[\r\n]+/g, ' ');

  const textBody = [
    `Nuova richiesta dal sito ${BUSINESS_INFO.brandName}`,
    '',
    `Nome: ${nome}`,
    `Email: ${email}`,
    '',
    'Messaggio:',
    messaggio,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: sans-serif; line-height: 1.5; color: #1c1917;">
      <h2 style="margin: 0 0 12px;">Nuova richiesta dal sito ${escapeHtml(BUSINESS_INFO.brandName)}</h2>
      <p style="margin: 4px 0;"><strong>Nome:</strong> ${escapeHtml(nome)}</p>
      <p style="margin: 4px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <hr style="margin: 16px 0; border: 0; border-top: 1px solid #e7e5e4;" />
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(messaggio)}</p>
    </div>
  `.trim();

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [BUSINESS_INFO.email],
        reply_to: email,
        subject: `Richiesta contatto sito · ${safeSubjectName}`,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!resendResponse.ok) {
      res.status(502).json({ error: 'Invio email non riuscito.' });
      return;
    }

    const data = (await resendResponse.json().catch(() => ({}))) as {
      id?: string;
    };
    res.status(200).json({ ok: true, id: data.id ?? null });
  } catch {
    res.status(502).json({ error: 'Errore di rete durante l’invio.' });
  }
}
