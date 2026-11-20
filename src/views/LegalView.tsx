import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { CookiePreferences, Language } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { BUSINESS_INFO } from '../data/business';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface LegalViewProps {
  mode: 'privacy' | 'cookie';
  lang: Language;
  cookiePrefs: CookiePreferences;
  onUpdateCookies: (prefs: CookiePreferences) => void;
  onNavigate?: (path: string) => void;
}

export function LegalView({
  mode,
  lang,
  cookiePrefs,
  onUpdateCookies,
  onNavigate,
}: LegalViewProps) {
  const t = TRANSLATIONS[lang];
  const [analytics, setAnalytics] = useState(cookiePrefs.analytics);
  const [savedNotice, setSavedNotice] = useState(false);

  const pageLabel = mode === 'privacy' ? t.footer.privacyLink : t.footer.cookieLink;

  return (
    <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      {onNavigate && (
        <Breadcrumbs
          items={[
            { label: t.seoUi.homeLabel, path: '/' },
            { label: pageLabel },
          ]}
          onNavigate={onNavigate}
        />
      )}

      <header className="space-y-3 border-b border-[#292524] pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <span>nLPD Svizzera · GDPR UE</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#FAFAF9]">
          {pageLabel}
        </h1>
        <p className="text-sm text-[#A8A29E]">
          {BUSINESS_INFO.brandName} · {BUSINESS_INFO.address.locality}
        </p>
      </header>

      {mode === 'privacy' ? (
        <div className="space-y-6 text-sm sm:text-base text-[#A8A29E] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-display text-xl font-semibold text-[#FAFAF9]">
              1. Titolare del trattamento / Controller
            </h2>
            <p>
              {BUSINESS_INFO.brandName} ({BUSINESS_INFO.combinedBrand}), {BUSINESS_INFO.address.locality}.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="font-display text-xl font-semibold text-[#FAFAF9]">
              2. Finalità e minimizzazione dei dati (nLPD / GDPR)
            </h2>
            <p>
              Raccogliamo esclusivamente i dati strettamente necessari per rispondere alle richieste di preventivo, demo SaaS o prenotazione di call (Nome/Azienda, Email e tipologia di esigenza). Nessun dato viene ceduto a terze parti per finalità pubblicitarie.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="font-display text-xl font-semibold text-[#FAFAF9]">
              3. Diritti dell’interessato
            </h2>
            <p>
              Ai sensi della Legge federale sulla protezione dei dati (nLPD) e del GDPR puoi richiedere in qualsiasi momento accesso, rettifica, portabilità o cancellazione tramite il modulo nella sezione Contatti.
            </p>
          </section>
        </div>
      ) : (
        <div className="space-y-8">
          <p className="text-sm sm:text-base text-[#A8A29E] leading-relaxed">
            {t.cookieBanner.description}
          </p>

          <div className="rounded-2xl border border-[#292524] bg-[#1C1917] p-6 space-y-4">
            <label className="flex items-center justify-between gap-4 border-b border-[#292524] pb-4">
              <div>
                <div className="text-sm font-semibold text-[#FAFAF9]">
                  {t.cookieBanner.necessaryLabel}
                </div>
                <div className="text-xs text-[#A8A29E] mt-0.5">
                  Lingua selezionata, sicurezza sessione, salvataggio consenso.
                </div>
              </div>
              <input
                type="checkbox"
                checked
                disabled
                className="h-4 w-4 accent-[#2DD4BF]"
              />
            </label>

            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <div className="text-sm font-semibold text-[#FAFAF9]">
                  {t.cookieBanner.analyticsLabel}
                </div>
                <div className="text-xs text-[#A8A29E] mt-0.5">
                  Misurazione aggregata clic “Apri piattaforma” e invio moduli senza profilazione individuale.
                </div>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => {
                  setAnalytics(e.target.checked);
                  setSavedNotice(false);
                }}
                className="h-4 w-4 accent-[#2DD4BF]"
              />
            </label>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onUpdateCookies({
                    necessary: true,
                    analytics,
                    decided: true,
                  });
                  setSavedNotice(true);
                }}
                className="rounded-full bg-[#2DD4BF] px-5 py-2.5 text-sm font-semibold text-[#0C0A09] hover:opacity-90 cursor-pointer min-h-[44px]"
              >
                {t.cookieBanner.savePreferences}
              </button>
              {savedNotice && (
                <span className="text-xs font-medium text-[#22C55E]">
                  Preferenze salvate.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
