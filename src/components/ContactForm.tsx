import { useEffect, useState, FormEvent } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Language } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';

interface ContactFormProps {
  lang: Language;
  defaultNeed?: string;
  onOpenPrivacy?: () => void;
}

export function ContactForm({
  lang,
  defaultNeed,
  onOpenPrivacy,
}: ContactFormProps) {
  const t = TRANSLATIONS[lang];
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
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    if (defaultNeed) {
      setNeed(defaultNeed);
    } else {
      setNeed(t.form.needOptions[0]);
    }
  }, [lang, defaultNeed, t.form.needOptions]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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

    const code = `GWD-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(code);
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
          className="w-full rounded-xl border border-[#292524] bg-[#0C0A09] px-4 py-3 text-base text-[#FAFAF9] placeholder:text-[#A8A29E]/60 focus:border-[#2DD4BF] focus:outline-none min-h-[44px]"
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
          className="w-full rounded-xl border border-[#292524] bg-[#0C0A09] px-4 py-3 text-base text-[#FAFAF9] placeholder:text-[#A8A29E]/60 focus:border-[#2DD4BF] focus:outline-none min-h-[44px]"
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
          className="w-full rounded-xl border border-[#292524] bg-[#0C0A09] px-4 py-3 text-base text-[#FAFAF9] focus:border-[#2DD4BF] focus:outline-none min-h-[44px]"
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

      <button
        type="submit"
        className="w-full rounded-full bg-[#2DD4BF] px-6 py-3 text-sm font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity cursor-pointer min-h-[44px]"
      >
        {t.form.submit}
      </button>
    </form>
  );
}
