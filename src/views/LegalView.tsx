import { useState } from 'react';
import { ShieldCheck, FileText, Database, Building2, Check, AlertCircle } from 'lucide-react';
import { CookiePreferences, Language, LegalMode } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { LEGAL_CONTENT } from '../data/legalContent';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface LegalViewProps {
  mode: LegalMode;
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
  const legal = LEGAL_CONTENT[lang];
  const [analytics, setAnalytics] = useState(cookiePrefs.analytics);
  const [savedNotice, setSavedNotice] = useState(false);

  const getPageTitle = () => {
    switch (mode) {
      case 'privacy':
        return legal.privacy.title;
      case 'cookie':
        return legal.cookie.title;
      case 'impressum':
        return legal.impressum.title;
    }
  };

  const getBreadcrumbLabel = () => {
    switch (mode) {
      case 'privacy':
        return t.footer.privacyLink;
      case 'cookie':
        return t.footer.cookieLink;
      case 'impressum':
        return t.footer.impressumLink;
    }
  };

  return (
    <div className="mx-auto max-w-[960px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      {onNavigate && (
        <Breadcrumbs
          items={[
            { label: t.seoUi.homeLabel, path: '/' },
            { label: getBreadcrumbLabel() },
          ]}
          onNavigate={onNavigate}
        />
      )}

      {/* Header and Compliance Badge */}
      <header className="space-y-4 border-b border-[#E5E2DC] dark:border-[#292524] pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#0F766E] dark:text-[#2DD4BF]">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <span>{legal.ui.badge}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#141210] dark:text-[#FAFAF9]">
          {getPageTitle()}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E]">
          <span>{legal.ui.lastUpdatedLabel}: {legal.ui.lastUpdatedValue}</span>
        </div>

        {/* Quick Nav Tabs between Legal Views */}
        {onNavigate && (
          <nav
            aria-label="Legal Sections Navigation"
            className="flex flex-wrap items-center gap-2 pt-2"
          >
            <button
              type="button"
              onClick={() => onNavigate('/privacy')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer min-h-[44px] ${
                mode === 'privacy'
                  ? 'bg-[#0F766E]/10 dark:bg-[#2DD4BF]/15 border border-[#0F766E]/40 dark:border-[#2DD4BF]/40 text-[#0F766E] dark:text-[#2DD4BF]'
                  : 'bg-white dark:bg-[#1C1917] border border-[#E5E2DC] dark:border-[#292524] text-[#57534E] hover:text-[#141210] dark:text-[#A8A29E] dark:hover:text-[#FAFAF9] hover:border-[#D6D3CD] dark:hover:border-[#383330]'
              }`}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>{legal.ui.tabs.privacy}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/cookie')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer min-h-[44px] ${
                mode === 'cookie'
                  ? 'bg-[#0F766E]/10 dark:bg-[#2DD4BF]/15 border border-[#0F766E]/40 dark:border-[#2DD4BF]/40 text-[#0F766E] dark:text-[#2DD4BF]'
                  : 'bg-white dark:bg-[#1C1917] border border-[#E5E2DC] dark:border-[#292524] text-[#57534E] hover:text-[#141210] dark:text-[#A8A29E] dark:hover:text-[#FAFAF9] hover:border-[#D6D3CD] dark:hover:border-[#383330]'
              }`}
            >
              <Database className="h-4 w-4" aria-hidden="true" />
              <span>{legal.ui.tabs.cookie}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/impressum')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer min-h-[44px] ${
                mode === 'impressum'
                  ? 'bg-[#0F766E]/10 dark:bg-[#2DD4BF]/15 border border-[#0F766E]/40 dark:border-[#2DD4BF]/40 text-[#0F766E] dark:text-[#2DD4BF]'
                  : 'bg-white dark:bg-[#1C1917] border border-[#E5E2DC] dark:border-[#292524] text-[#57534E] hover:text-[#141210] dark:text-[#A8A29E] dark:hover:text-[#FAFAF9] hover:border-[#D6D3CD] dark:hover:border-[#383330]'
              }`}
            >
              <Building2 className="h-4 w-4" aria-hidden="true" />
              <span>{legal.ui.tabs.impressum}</span>
            </button>
          </nav>
        )}
      </header>

      {/* 1. Privacy Policy View */}
      {mode === 'privacy' && (
        <div className="space-y-8 text-sm sm:text-base text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
          <div className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-5 sm:p-6 space-y-2 shadow-sm dark:shadow-none">
            <h2 className="font-display text-lg font-semibold text-[#141210] dark:text-[#FAFAF9]">
              {legal.privacy.controllerTitle}
            </h2>
            <p className="text-sm text-[#57534E] dark:text-[#A8A29E]">
              {legal.privacy.controllerBody}
            </p>
          </div>

          {legal.privacy.sections.map((section, idx) => (
            <section
              key={idx}
              className="space-y-3 rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white/90 dark:bg-[#1C1917]/70 p-5 sm:p-6 shadow-sm dark:shadow-none"
            >
              <h2 className="font-display text-lg sm:text-xl font-semibold text-[#141210] dark:text-[#FAFAF9]">
                {section.title}
              </h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-sm sm:text-base text-[#57534E] dark:text-[#A8A29E]">
                  {p}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2 pt-2 text-sm text-[#141210]/90 dark:text-[#FAFAF9]/90">
                  {section.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <span className="text-[#0F766E] dark:text-[#2DD4BF] font-mono text-base mt-[-2px]" aria-hidden="true">
                        •
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      {/* 2. Cookie & Storage View */}
      {mode === 'cookie' && (
        <div className="space-y-8 text-sm sm:text-base text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
          <div className="rounded-2xl border border-[#0F766E]/30 dark:border-[#2DD4BF]/30 bg-[#0F766E]/5 dark:bg-[#2DD4BF]/5 p-5 sm:p-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>Privacy by Design & by Default</span>
            </div>
            <p className="text-sm sm:text-base text-[#141210] dark:text-[#FAFAF9]">
              {legal.cookie.noProfilingNotice}
            </p>
            <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
              {legal.cookie.intro}
            </p>
          </div>

          {/* Storage Table */}
          <div className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-5 sm:p-6 space-y-4 shadow-sm dark:shadow-none">
            <h2 className="font-display text-lg font-semibold text-[#141210] dark:text-[#FAFAF9]">
              {legal.cookie.storageTableTitle}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E2DC] dark:border-[#292524] text-[#141210] dark:text-[#FAFAF9]">
                    <th className="py-2.5 pr-4 font-semibold">{legal.cookie.storageTableHeaders.key}</th>
                    <th className="py-2.5 px-4 font-semibold">{legal.cookie.storageTableHeaders.type}</th>
                    <th className="py-2.5 px-4 font-semibold">{legal.cookie.storageTableHeaders.purpose}</th>
                    <th className="py-2.5 pl-4 font-semibold">{legal.cookie.storageTableHeaders.duration}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2DC] dark:divide-[#292524]/60">
                  {legal.cookie.storageItems.map((item, idx) => (
                    <tr key={idx} className="text-[#57534E] dark:text-[#A8A29E]">
                      <td className="py-3 pr-4 font-mono text-xs text-[#0F766E] dark:text-[#2DD4BF] whitespace-nowrap">
                        {item.key}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{item.type}</td>
                      <td className="py-3 px-4 text-xs leading-relaxed max-w-xs">{item.purpose}</td>
                      <td className="py-3 pl-4 text-xs whitespace-nowrap">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preferences Control Card */}
          <div className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-6 space-y-5 shadow-sm dark:shadow-none">
            <div>
              <h2 className="font-display text-lg font-semibold text-[#141210] dark:text-[#FAFAF9]">
                {legal.cookie.settingsCardTitle}
              </h2>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1">
                {legal.cookie.settingsCardSubtitle}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <label className="flex items-center justify-between gap-4 border-b border-[#E5E2DC] dark:border-[#292524] pb-4">
                <div>
                  <div className="text-sm font-semibold text-[#141210] dark:text-[#FAFAF9]">
                    {t.cookieBanner.necessaryLabel}
                  </div>
                  <div className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5">
                    Lingua preferita, visualizzazione reattiva e salvataggio preferenze consenso.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 accent-[#0F766E] dark:accent-[#2DD4BF]"
                />
              </label>

              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-[#141210] dark:text-[#FAFAF9]">
                    {t.cookieBanner.analyticsLabel}
                  </div>
                  <div className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5">
                    Abilita misurazioni statistiche aggregate privacy-first (disattivate di default; nessun tracking di terze parti).
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => {
                    setAnalytics(e.target.checked);
                    setSavedNotice(false);
                  }}
                  className="h-4 w-4 accent-[#0F766E] dark:accent-[#2DD4BF] cursor-pointer"
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
                  className="rounded-full bg-[#2DD4BF] px-6 py-2.5 text-sm font-semibold text-[#0C0A09] hover:opacity-90 cursor-pointer min-h-[44px]"
                >
                  {t.cookieBanner.savePreferences}
                </button>
                {savedNotice && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#15803D] dark:text-[#22C55E]">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Preferenze salvate con successo.</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Browser control section */}
          <div className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white/90 dark:bg-[#1C1917]/70 p-5 sm:p-6 space-y-2 shadow-sm dark:shadow-none">
            <h2 className="font-display text-base font-semibold text-[#141210] dark:text-[#FAFAF9]">
              {legal.cookie.browserControlTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
              {legal.cookie.browserControlBody}
            </p>
          </div>
        </div>
      )}

      {/* 3. Impressum View */}
      {mode === 'impressum' && (
        <div className="space-y-8 text-sm sm:text-base text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
          {/* Status Box */}
          <div className="rounded-2xl border border-[#B45309]/30 dark:border-[#FBBF24]/30 bg-[#FBBF24]/10 dark:bg-[#FBBF24]/5 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-[#B45309] dark:text-[#FBBF24] shrink-0" aria-hidden="true" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#B45309] dark:text-[#FBBF24]">
                {legal.impressum.statusBadge}
              </span>
            </div>
            <h2 className="font-display text-lg font-semibold text-[#141210] dark:text-[#FAFAF9]">
              {legal.impressum.statusTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
              {legal.impressum.statusBody}
            </p>
          </div>

          {/* Corporate Entity Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-5 sm:p-6 space-y-3 shadow-sm dark:shadow-none">
              <h2 className="font-display text-base font-semibold text-[#141210] dark:text-[#FAFAF9]">
                {legal.impressum.entitySectionTitle}
              </h2>
              <div className="space-y-1 text-sm text-[#141210] dark:text-[#FAFAF9]">
                <p className="font-semibold">{legal.impressum.entityName}</p>
                <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">Venture Studio SaaS & Digital Agency</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-5 sm:p-6 space-y-3 shadow-sm dark:shadow-none">
              <h2 className="font-display text-base font-semibold text-[#141210] dark:text-[#FAFAF9]">
                {legal.impressum.headquartersTitle}
              </h2>
              <ul className="space-y-1 text-xs text-[#141210]/90 dark:text-[#FAFAF9]/90 font-mono">
                {legal.impressum.locationDetails.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Box */}
          <div className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-5 sm:p-6 space-y-3 shadow-sm dark:shadow-none">
            <h2 className="font-display text-base font-semibold text-[#141210] dark:text-[#FAFAF9]">
              {legal.impressum.contactTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
              {legal.impressum.contactBody}
            </p>
            {onNavigate && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/contatti')}
                  className="rounded-full border border-[#E5E2DC] dark:border-[#292524] bg-[#F3F1EC] dark:bg-[#0C0A09] px-5 py-2.5 text-xs font-semibold text-[#141210] dark:text-[#FAFAF9] hover:border-[#0F766E] dark:hover:border-[#2DD4BF] transition-colors cursor-pointer min-h-[44px]"
                >
                  {t.nav.contact} ↗
                </button>
              </div>
            )}
          </div>

          {/* Disclaimers & Copyright */}
          <div className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white/90 dark:bg-[#1C1917]/70 p-5 sm:p-6 space-y-4 shadow-sm dark:shadow-none">
            <div className="space-y-1.5">
              <h2 className="font-display text-base font-semibold text-[#141210] dark:text-[#FAFAF9]">
                {legal.impressum.disclaimerTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                {legal.impressum.disclaimerBody}
              </p>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-[#E5E2DC] dark:border-[#292524]">
              <h2 className="font-display text-base font-semibold text-[#141210] dark:text-[#FAFAF9]">
                {legal.impressum.copyrightTitle}
              </h2>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                {legal.impressum.copyrightBody}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
