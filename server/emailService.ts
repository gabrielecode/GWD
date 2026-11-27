import { Resend } from 'resend';
import process from 'node:process';

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendAdminEmailNotification(subject: string, htmlContent: string): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    return false;
  }
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || 'admin@kreativalab.ch';
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || 'Kreativalab Notifiche <noreply@kreativalab.ch>';

  try {
    await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject,
      html: htmlContent,
    });
    return true;
  } catch (err) {
    console.error('Resend email error:', err);
    return false;
  }
}
