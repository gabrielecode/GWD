import { useEffect, useState, FormEvent } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Mail } from 'lucide-react';
import { Language } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { BUSINESS_INFO } from '../data/business';

interface ContactFormProps {
  lang: Language;
  defaultNeed?: string;
  onOpenPrivacy?: () => void;
}

const FALLBACK_COPY: Record<
  Language,
  { errorMessage: string; mailtoCta: string }
> = {
  it: {
    errorMessage:
      'Impossibile inviare il modulo in questo momento. Puoi scriverci direttamente via email:',
    mailtoCta: 'Invia tramite client email',
  },
  de: {
    errorMessage:
      'Das Formular konnte derzeit nicht gesendet werden. Schreiben Sie uns direkt per E-Mail:',
    mailtoCta: 'Per E-Mail-Programm senden',
  },
  fr: {
    errorMessage:
      'Impossible d’envoyer le formulaire pour le moment. Écrivez-nous directement par e-mail :',
    mailtoCta: 'Envoyer via votre messagerie',
  },
  en: {
    errorMessage:
      'Unable to send the form right now. You can email us directly instead:',
    mailtoCta: 'Send via email client',
  },
};

export function ContactForm({
  lang,
  defaultNeed,
  onOpenPrivacy,
}: ContactFormProps) {
  const t = TRANSLATIONS[lang];
  const fallbackCopy = FALLBACK_COPY[lang];
  const needOptions = t.form.needOptions;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [need, setNeed] = useState(defaultNeed || needOptions[0]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    consent?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fallbackMailto, setFallbackMailto] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    if (defaultNeed) {
      setNeed(defaultNeed);
    } else {
      setNeed(t.form.needOptions[0]);
    }
  }, [lang, defaultNeed, t.form.needOptions]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors: { name?: string; email?: string; consent?: string } = {};

    if (name.trim().length < 2) {
      nextErrors.name = t.form.errorName;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = t.form.errorEmail;
    }
    if (!consent) {
      nextErrors.consent = t.form.errorConsent;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const code = `KL-${Math.floor(1000 + Math.random() * 9000)}`;
    const messaggio = `Servizio richiesto: ${need}\nLingua: ${lang.toUpperCase()}\nCodice riferimento: ${code}`;

    const oggetto = encodeURIComponent(
      `Richiesta dal sito ${BUSINESS_INFO.brandName} (${code}) - ${need}`
    );
    const corpo = encodeURIComponent(
      `Nome: ${name.trim()}\nEmail: ${email.trim()}\n${messaggio}`
    );
    const mailtoHref = `mailto:${BUSINESS_INFO.email}?subject=${oggetto}&body=${corpo}`;

    setIsSubmitting(true);
    setSubmitError(null);
    setFallbackMailto(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: name.trim(),
          email: email.trim(),
          messaggio,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setSubmittedRef(code);
    } catch {
      setSubmitError(fallbackCopy.errorMessage);
      setFallbackMailto(mailtoHref);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedRef) {
    return (
      <div className="rounded-2xl border border-[#22C55E]/40 bg-[#1C1917] p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-[#22C55E] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-display text-xl font-semibold text-[#FAFAF9]">
              {t.form.successTitle}
            </h3>
            <p className="mt-2 text-sm text-[#A8A29E] leading-relaxed">
              {t.form.successBody}
            </p>
            <div className="mt-4 inline-flex items-center gap-3 font-mono text-xs text-[#A8A29E]">
              <span>Ref: {submittedRef}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate max-w-[220px]">{email}</span>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setSubmittedRef(null);
                  setSubmitError(null);
                  setFallbackMailto(null);
                  setName('');
                  setEmail('');
                  setConsent(false);
                }}
                className="rounded-full border border-[#292524] bg-[#0C0A09] px-5 py-2.5 text-sm font-medium text-[#FAFAF9] hover:border-[#2DD4BF] transition-colors cursor-pointer min-h-[44px]"
              >
                {t.form.reset}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-[#292524] bg-[#1C1917] p-6 sm:p-8 space-y-5"
    >
      <div>
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium text-[#FAFAF9] mb-1.5"
        >
          {t.form.nameLabel}
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder={t.form.namePlaceholder}
          disabled={isSubmitting}
          className="w-full rounded-xl border border-[#292524] bg-[#0C0A09] px-4 py-3 text-base text-[#FAFAF9] placeholder:text-[#A8A29E]/60 focus:border-[#2DD4BF] focus:outline-none min-h-[44px] disabled:opacity-60"
        />
        {errors.name && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#FB923C]" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{errors.name}</span>
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium text-[#FAFAF9] mb-1.5"
        >
          {t.form.emailLabel}
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder={t.form.emailPlaceholder}
          disabled={isSubmitting}
          className="w-full rounded-xl border border-[#292524] bg-[#0C0A09] px-4 py-3 text-base text-[#FAFAF9] placeholder:text-[#A8A29E]/60 focus:border-[#2DD4BF] focus:outline-none min-h-[44px] disabled:opacity-60"
        />
        {errors.email && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#FB923C]" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{errors.email}</span>
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="contact-need"
          className="block text-sm font-medium text-[#FAFAF9] mb-1.5"
        >
          {t.form.needLabel}
        </label>
        <select
          id="contact-need"
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          disabled={isSubmitting}
          className="w-full rounded-xl border border-[#292524] bg-[#0C0A09] px-4 py-3 text-base text-[#FAFAF9] focus:border-[#2DD4BF] focus:outline-none min-h-[44px] disabled:opacity-60"
        >
          {needOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-[#1C1917] text-[#FAFAF9]">
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={consent}
            disabled={isSubmitting}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (errors.consent)
                setErrors((prev) => ({ ...prev, consent: undefined }));
            }}
            className="mt-1 h-4 w-4 rounded border-[#292524] bg-[#0C0A09] accent-[#2DD4BF] shrink-0"
          />
          <span className="text-xs text-[#A8A29E] leading-relaxed">
            {t.form.consentLabel}{' '}
            {onOpenPrivacy && (
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-[#FAFAF9] underline underline-offset-2 hover:text-[#2DD4BF] cursor-pointer"
              >
                nLPD / GDPR
              </button>
            )}
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#FB923C]" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{errors.consent}</span>
          </p>
        )}
      </div>

      {submitError && (
        <div
          role="alert"
          className="rounded-xl border border-[#FB923C]/40 bg-[#0C0A09] p-4 space-y-3"
        >
          <p className="flex items-start gap-2 text-xs text-[#FB923C] leading-relaxed">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{submitError}</span>
          </p>
          {fallbackMailto && (
            <a
              href={fallbackMailto}
              className="inline-flex items-center gap-2 rounded-full border border-[#292524] bg-[#1C1917] px-4 py-2 text-xs font-semibold text-[#FAFAF9] hover:border-[#2DD4BF] hover:text-[#2DD4BF] transition-colors min-h-[38px]"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {fallbackCopy.mailtoCta} ({BUSINESS_INFO.email})
              </span>
            </a>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2DD4BF] px-6 py-3 text-sm font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity cursor-pointer min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        <span>{isSubmitting ? t.form.submitting : t.form.submit}</span>
      </button>
    </form>
  );
}