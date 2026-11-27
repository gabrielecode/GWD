import { Clock, MapPin } from 'lucide-react';
import { Language } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { BUSINESS_INFO } from '../data/business';
import { ContactForm } from '../components/ContactForm';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface ContactViewProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

export function ContactView({ lang, onNavigate }: ContactViewProps) {
  const t = TRANSLATIONS[lang];

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      <Breadcrumbs
        items={[
          { label: t.seoUi.homeLabel, path: '/' },
          { label: t.nav.contact },
        ]}
        onNavigate={onNavigate}
      />

      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-medium text-[#0F766E] dark:text-[#2DD4BF]">
          {BUSINESS_INFO.brandName} · {BUSINESS_INFO.address.locality}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141210] dark:text-[#FAFAF9]">
          {t.contactPage.title}
        </h1>
        <p className="text-lg text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
          {t.contactPage.subtitle}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Generic Lugano location + Hours + Lugano Map + Response Times */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-6 space-y-5 shadow-sm dark:shadow-none">
            <h2 className="font-display text-lg font-semibold text-[#141210] dark:text-[#FAFAF9]">
              {t.contactPage.directChannels}
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#57534E] dark:text-[#A8A29E] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs text-[#57534E] dark:text-[#A8A29E]">{t.contactPage.addressLabel}</div>
                  <address className="not-italic text-[#141210] dark:text-[#FAFAF9]">
                    {BUSINESS_INFO.brandName} · {BUSINESS_INFO.address.locality}
                  </address>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[#57534E] dark:text-[#A8A29E] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs text-[#57534E] dark:text-[#A8A29E]">{t.contactPage.hoursLabel}</div>
                  <div className="text-[#141210] dark:text-[#FAFAF9]">{BUSINESS_INFO.openingHours.displayLabel}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E2DC] dark:border-[#292524]">
              <div className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] mb-1">
                {t.contactPage.responseTitle}
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                {t.contactPage.responseValue}
              </p>
            </div>
          </div>

          {/* Architectural Lugano Map Box */}
          <div className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-6 space-y-4 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-[#141210] dark:text-[#FAFAF9]">
                {t.contactPage.mapTitle}
              </h2>
              <span className="font-mono text-xs text-[#57534E] dark:text-[#A8A29E]">
                {BUSINESS_INFO.geo.latitude.toFixed(4)}° N, {BUSINESS_INFO.geo.longitude.toFixed(4)}° E
              </span>
            </div>
            <div className="relative h-48 rounded-xl border border-[#E5E2DC] dark:border-[#292524] bg-[#F3F1EC] dark:bg-[#0C0A09] overflow-hidden p-4 flex flex-col justify-between">
              {/* Clean geometric Ticino coordinate grid */}
              <svg
                className="absolute inset-0 h-full w-full opacity-35 dark:opacity-25"
                viewBox="0 0 400 200"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M0 40H400M0 80H400M0 120H400M0 160H400M50 0V200M100 0V200M150 0V200M200 0V200M250 0V200M300 0V200M350 0V200"
                  stroke="#78716C"
                  strokeOpacity="0.35"
                  strokeDasharray="3 3"
                />
                <path
                  d="M40 165C110 140 175 110 220 95C270 78 320 65 385 35"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                />
              </svg>
              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#57534E] dark:text-[#A8A29E]">
                <span>Bellinzona · 25 min</span>
                <span>Mendrisio · 20 min</span>
              </div>
              <div className="relative z-10 self-center rounded-xl border border-[#0F766E]/35 dark:border-[#2DD4BF]/40 bg-white/95 dark:bg-[#1C1917]/95 px-3.5 py-2 text-xs text-[#141210] dark:text-[#FAFAF9] shadow-sm dark:shadow-none">
                <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">{BUSINESS_INFO.brandName}</span> · {BUSINESS_INFO.address.locality}
              </div>
              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#57534E] dark:text-[#A8A29E]">
                <span>Locarno · 35 min</span>
                <a
                  href="https://maps.google.com/?q=Lugano,+Switzerland"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0F766E] dark:text-[#2DD4BF] hover:underline"
                >
                  Google Maps ↗
                </a>
              </div>
            </div>
            <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
              {t.contactPage.mapSubtitle}
            </p>
          </div>
        </div>

        {/* Right: Short 4-Field Form */}
        <div className="lg:col-span-7">
          <ContactForm
            lang={lang}
            onOpenPrivacy={() => onNavigate('/privacy')}
          />
        </div>
      </div>
    </div>
  );
}
