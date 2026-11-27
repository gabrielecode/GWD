import { BUSINESS_INFO } from '../src/data/business.js';
import {
  escapeHtml,
  sendAdminEmailNotification,
  sendTransactionalEmail,
} from '../server/emailService.js';

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
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
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

  const userConfirmHtml = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #1c1917; max-width: 600px;">
      <h2 style="margin: 0 0 12px;">Abbiamo ricevuto la tua richiesta · Kreativalab</h2>
      <p>Ciao <strong>${escapeHtml(nome)}</strong>,</p>
      <p>Grazie per aver contattato <strong>Kreativalab</strong>. Abbiamo ricevuto il tuo messaggio e ti risponderemo al più presto.</p>
      <div style="background: #f5f5f4; border-left: 4px solid #2DD4BF; padding: 12px 16px; margin: 16px 0;">
        <p style="margin: 0 0 6px; font-size: 12px; color: #57534e;"><strong>Riepilogo del tuo messaggio:</strong></p>
        <p style="margin: 0; white-space: pre-wrap; font-size: 14px;">${escapeHtml(messaggio)}</p>
      </div>
      <p style="font-size: 13px; color: #57534e;">Cordiali saluti,<br/><strong>Team Kreativalab</strong> · Lugano, Ticino (CH)<br/><a href="https://www.kreativalab.ch" style="color: #0d9488;">www.kreativalab.ch</a></p>
    </div>
  `.trim();

  const [adminResult] = await Promise.all([
    sendAdminEmailNotification(`Richiesta contatto sito · ${safeSubjectName}`, htmlBody, {
      replyTo: email,
      textContent: textBody,
    }),
    sendTransactionalEmail({
      to: email,
      subject: 'Abbiamo ricevuto la tua richiesta · Kreativalab',
      html: userConfirmHtml,
      replyTo: BUSINESS_INFO.email,
    }).catch(() => null),
  ]);

  if (!adminResult.ok) {
    res.status(502).json({
      error: adminResult.error || 'Invio email non riuscito.',
    });
    return;
  }

  res.status(200).json({ ok: true, id: adminResult.id ?? null });
}
