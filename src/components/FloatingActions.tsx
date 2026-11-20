import { useState } from 'react';
import { MessageCircle, ShieldCheck, X } from 'lucide-react';
import { CookiePreferences, Language } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';

interface FloatingActionsProps {
  lang: Language;
  cookiePrefs: CookiePreferences;
  showCookieModal: boolean;
  onUpdateCookies: (prefs: CookiePreferences) => void;
  onCloseCookieModal: () => void;
  onNavigate?: (path: string) => void;
}

export function FloatingActions({
  lang,
  cookiePrefs,
  showCookieModal,
  onUpdateCookies,
  onCloseCookieModal,
  onNavigate,
}: FloatingActionsProps) {
  const t = TRANSLATIONS[lang];
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(cookiePrefs.analytics);

  const shouldShowBanner = !cookiePrefs.decided || showCookieModal;

  return (
    <>
      {onNavigate && (
        <button
          type="button"
          onClick={() => onNavigate('/contatti')}
          aria-label={t.nav.ctaHeader}
          className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-[#292524] bg-[#1C1917]/95 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#FAFAF9] shadow-2xl backdrop-blur-xl hover:border-[#2DD4BF] transition-colors cursor-pointer min-h-[44px]"
        >
          <MessageCircle className="h-4 w-4 text-[#2DD4BF] shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">{t.nav.contact}</span>
        </button>
      )}

      {shouldShowBanner && (
        <aside
          aria-label={t.cookieBanner.title}
          className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 rounded-2xl border border-[#292524] bg-[#1C1917]/98 p-5 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#2DD4BF] shrink-0" aria-hidden="true" />
              <h3 className="font-display text-sm font-semibold text-[#FAFAF9]">
                {t.cookieBanner.title}
              </h3>
            </div>
            {cookiePrefs.decided && (
              <button
                type="button"
                onClick={onCloseCookieModal}
                aria-label={t.nav.menuClose}
                className="text-[#A8A29E] hover:text-[#FAFAF9] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <p className="text-xs text-[#A8A29E] leading-relaxed mb-4">
            {t.cookieBanner.description}{' '}
            {onNavigate && (
              <button
                type="button"
                onClick={() => {
                  onNavigate('/cookie');
                  onCloseCookieModal();
                }}
                className="text-[#FAFAF9] underline underline-offset-2 hover:text-[#2DD4BF] cursor-pointer ml-1"
              >
                {t.footer.cookieLink}
              </button>
            )}
          </p>

          {customizeOpen && (
            <div className="mb-4 space-y-2.5 rounded-xl border border-[#292524] bg-[#0C0A09] p-3 text-xs">
              <label className="flex items-center justify-between gap-3 text-[#A8A29E]">
                <span>{t.cookieBanner.necessaryLabel}</span>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 accent-[#2DD4BF]"
                />
              </label>
              <label className="flex items-center justify-between gap-3 text-[#FAFAF9] cursor-pointer">
                <span>{t.cookieBanner.analyticsLabel}</span>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="h-4 w-4 accent-[#2DD4BF]"
                />
              </label>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onUpdateCookies({
                  necessary: true,
                  analytics: true,
                  decided: true,
                });
                onCloseCookieModal();
              }}
              className="rounded-full bg-[#2DD4BF] px-4 py-2 text-xs font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity cursor-pointer min-h-[38px]"
            >
              {t.cookieBanner.acceptAll}
            </button>

            <button
              type="button"
              onClick={() => {
                onUpdateCookies({
                  necessary: true,
                  analytics: false,
                  decided: true,
                });
                onCloseCookieModal();
              }}
              className="rounded-full border border-[#292524] bg-[#0C0A09] px-4 py-2 text-xs font-medium text-[#FAFAF9] hover:border-[#A8A29E] transition-colors cursor-pointer min-h-[38px]"
            >
              {t.cookieBanner.onlyNecessary}
            </button>

            {!customizeOpen ? (
              <button
                type="button"
                onClick={() => setCustomizeOpen(true)}
                className="px-2.5 py-2 text-xs text-[#A8A29E] hover:text-[#FAFAF9] underline underline-offset-4 cursor-pointer min-h-[38px]"
              >
                {t.cookieBanner.customize}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onUpdateCookies({
                    necessary: true,
                    analytics: analyticsEnabled,
                    decided: true,
                  });
                  setCustomizeOpen(false);
                  onCloseCookieModal();
                }}
                className="rounded-full border border-[#2DD4BF]/50 px-4 py-2 text-xs font-medium text-[#2DD4BF] hover:bg-[#2DD4BF]/10 cursor-pointer min-h-[38px]"
              >
                {t.cookieBanner.savePreferences}
              </button>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
