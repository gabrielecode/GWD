import process from 'node:process';
import { BUSINESS_INFO } from '../src/data/business.js';
import { getConfiguredAdminEmails } from './db.js';

export interface EmailSendResult {
  ok: boolean;
  id?: string | null;
  recipients: string[];
  from: string;
  error?: string | null;
}

export interface EmailConfigDiagnostic {
  configured: boolean;
  from_email: string;
  admin_recipients: string[];
  hint?: string | null;
}

export function escapeHtml(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getAdminNotificationRecipients(extraEmails: string[] = []): string[] {
  const recipients = new Set<string>();

  for (const email of getConfiguredAdminEmails()) {
    if (email && email.includes('@')) {
      recipients.add(email.trim().toLowerCase());
    }
  }

  if (BUSINESS_INFO.email && BUSINESS_INFO.email.includes('@')) {
    recipients.add(BUSINESS_INFO.email.trim().toLowerCase());
  }

  for (const extra of extraEmails) {
    const clean = (extra || '').trim().toLowerCase();
    if (clean && clean.includes('@')) {
      recipients.add(clean);
    }
  }

  return Array.from(recipients);
}

export function getEmailConfigDiagnostic(): EmailConfigDiagnostic {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() || 'Kreativalab <noreply@kreativalab.ch>';
  const adminRecipients = getAdminNotificationRecipients();

  return {
    configured: Boolean(apiKey),
    from_email: fromEmail,
    admin_recipients: adminRecipients,
    hint: apiKey
      ? null
      : 'Variabile RESEND_API_KEY mancante su Vercel. Aggiungila in Settings -> Environment Variables e riesegui il deploy.',
  };
}

async function sendViaResendApi(params: {
  apiKey: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<{ ok: boolean; id?: string | null; status: number; errorMessage?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: params.from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        ...(params.text ? { text: params.text } : {}),
        ...(params.replyTo ? { reply_to: params.replyTo } : {}),
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
      error?: string | { message?: string };
    };

    if (response.ok) {
      return {
        ok: true,
        id: payload.id ?? null,
        status: response.status,
      };
    }

    const errMsg =
      payload.message ||
      (typeof payload.error === 'string' ? payload.error : payload.error?.message) ||
      `HTTP ${response.status}`;

    return {
      ok: false,
      status: response.status,
      errorMessage: errMsg,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      errorMessage: err instanceof Error ? err.message : 'Errore di rete verso Resend API',
    };
  }
}

export async function sendTransactionalEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const primaryFrom =
    process.env.RESEND_FROM_EMAIL?.trim() || 'Kreativalab <noreply@kreativalab.ch>';

  const recipients = Array.from(
    new Set(
      (Array.isArray(options.to) ? options.to : [options.to])
        .map((e) => (e || '').trim().toLowerCase())
        .filter((e) => e.includes('@'))
    )
  );

  if (recipients.length === 0) {
    return {
      ok: false,
      recipients: [],
      from: primaryFrom,
      error: 'Nessun destinatario email valido.',
    };
  }

  if (!apiKey) {
    console.warn('[Resend] RESEND_API_KEY non configurata. Email non inviata:', options.subject);
    return {
      ok: false,
      recipients,
      from: primaryFrom,
      error: 'RESEND_API_KEY non configurata nelle variabili ambiente.',
    };
  }

  // Send to each recipient individually so a sandbox restriction or single invalid address
  // never blocks delivery to the remaining recipients (e.g. contatto@kreativalab.ch).
  let lastId: string | null = null;
  let usedFrom = primaryFrom;
  const errors: string[] = [];
  let anySuccess = false;

  for (const recipient of recipients) {
    let res = await sendViaResendApi({
      apiKey,
      from: primaryFrom,
      to: [recipient],
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    // If custom domain in RESEND_FROM_EMAIL / noreply@kreativalab.ch is not yet verified in Resend,
    // automatically retry with Resend's default onboarding@resend.dev sender
    if (
      !res.ok &&
      res.errorMessage &&
      /domain is not verified|not verified|verify your domain/i.test(res.errorMessage) &&
      !primaryFrom.includes('onboarding@resend.dev')
    ) {
      const fallbackFrom = 'Kreativalab <onboarding@resend.dev>';
      const retryRes = await sendViaResendApi({
        apiKey,
        from: fallbackFrom,
        to: [recipient],
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
      });
      if (retryRes.ok) {
        res = retryRes;
        usedFrom = fallbackFrom;
      } else {
        res = {
          ok: false,
          status: retryRes.status,
          errorMessage: `${res.errorMessage} (Fallback onboarding@resend.dev: ${retryRes.errorMessage})`,
        };
      }
    }

    if (res.ok) {
      anySuccess = true;
      lastId = res.id ?? lastId;
    } else {
      console.error(`[Resend] Errore invio a ${recipient}:`, res.errorMessage);
      errors.push(`${recipient}: ${res.errorMessage}`);
    }
  }

  return {
    ok: anySuccess,
    id: lastId,
    recipients,
    from: usedFrom,
    error: errors.length > 0 ? errors.join(' | ') : null,
  };
}

export async function sendAdminEmailNotification(
  subject: string,
  htmlContent: string,
  options?: { replyTo?: string; textContent?: string; extraRecipients?: string[] }
): Promise<EmailSendResult> {
  const adminRecipients = getAdminNotificationRecipients(options?.extraRecipients);
  return sendTransactionalEmail({
    to: adminRecipients,
    subject,
    html: htmlContent,
    text: options?.textContent,
    replyTo: options?.replyTo,
  });
}
