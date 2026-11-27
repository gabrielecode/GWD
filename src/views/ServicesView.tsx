import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, MapPin } from 'lucide-react';
import { Language, ProjectItem, TicinoCitySlug } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { SERVICES, TICINO_CITIES } from '../data/services';
import { getProjectBySlug } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';
import { SitiTicinoAppsSection } from '../components/SitiTicinoAppsSection';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface ServicesViewProps {
  lang: Language;
  activeServiceSlug?: string;
  activeCity: TicinoCitySlug;
  onSelectCity: (city: TicinoCitySlug) => void;
  onNavigate: (path: string, city?: TicinoCitySlug) => void;
}

export function ServicesView({
  lang,
  activeServiceSlug,
  activeCity,
  onSelectCity,
  onNavigate,
}: ServicesViewProps) {
  const t = TRANSLATIONS[lang];
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const selectedService =
    SERVICES.find((s) => s.slug === activeServiceSlug) || SERVICES[0];

  const mainServices = SERVICES.filter((s) => !s.isAiVertical);
  const aiVerticals = SERVICES.filter((s) => s.isAiVertical);

  const relatedCases = selectedService.relatedCaseSlugs
    .map((slug) => getProjectBySlug(slug))
    .filter((item): item is ProjectItem => Boolean(item));

  const cityProfile =
    TICINO_CITIES.find((c) => c.slug === activeCity) || TICINO_CITIES[0];

  const accentColor =
    selectedService.accentType === 'saas'
      ? '#2DD4BF'
      : selectedService.accentType === 'ai'
      ? '#60A5FA'
      : '#FBBF24';

  const accentTextVar =
    selectedService.accentType === 'saas'
      ? 'var(--kl-accent-saas)'
      : selectedService.accentType === 'ai'
      ? 'var(--kl-accent-ai)'
      : 'var(--kl-accent-agency)';

  const serviceAngleKey: keyof typeof cityProfile.serviceAngles =
    selectedService.slug === 'ecommerce'
      ? 'ecommerce'
      : selectedService.slug === 'seo-locale'
      ? 'seo'
      : selectedService.slug.startsWith('agenti-ai')
      ? 'ai'
      : 'web';

  const breadcrumbItems = activeServiceSlug
    ? [
        { label: t.seoUi.homeLabel, path: '/' },
        { label: t.nav.services, path: '/servizi' },
        { label: `${selectedService.shortTitle[lang]} · ${cityProfile.name}` },
      ]
    : [
        { label: t.seoUi.homeLabel, path: '/' },
        { label: t.nav.services },
      ];

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-16">
      <Breadcrumbs items={breadcrumbItems} onNavigate={(p) => onNavigate(p)} />

      {/* Service Selector Header */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {mainServices.map((srv) => {
              const isSelected = srv.slug === selectedService.slug;
              return (
                <button
                  key={srv.slug}
                  type="button"
                  onClick={() => onNavigate(`/servizi/${srv.slug}`)}
                  className={`rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap min-h-[40px] ${
                    isSelected
                      ? 'border-[#FBBF24] bg-[#FBBF24] text-[#0C0A09] font-semibold'
                      : 'border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] text-[#57534E] hover:text-[#141210] dark:text-[#A8A29E] dark:hover:text-[#FAFAF9]'
                  }`}
                >
                  {srv.shortTitle[lang]}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#57534E] dark:text-[#A8A29E] mr-1">
              {t.serviceDetail.aiVerticalsTitle}:
            </span>
            {aiVerticals.map((srv) => {
              const isSelected = srv.slug === selectedService.slug;
              return (
                <button
                  key={srv.slug}
                  type="button"
                  onClick={() => onNavigate(`/servizi/${srv.slug}`)}
                  className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap min-h-[38px] ${
                    isSelected
                      ? 'border-[#60A5FA] bg-[#60A5FA] text-[#0C0A09] font-semibold'
                      : 'border-[#1D4ED8]/30 dark:border-[#60A5FA]/35 bg-[#1D4ED8]/10 dark:bg-[#60A5FA]/10 text-[#1D4ED8] dark:text-[#60A5FA] hover:bg-[#1D4ED8]/15 dark:hover:bg-[#60A5FA]/20'
                  }`}
                >
                  {srv.shortTitle[lang]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#57534E] dark:text-[#A8A29E]">
              {selectedService.targetKeywords[lang].map((kw, i) => (
                <span key={kw} className="inline-flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">·</span>}
                  <span>{kw}</span>
                </span>
              ))}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141210] dark:text-[#FAFAF9]">
              {selectedService.title[lang]}
            </h1>
            <p className="text-lg text-[#57534E] dark:text-[#A8A29E] leading-relaxed max-w-2xl">
              {selectedService.subtitle[lang]}
            </p>
          </div>

          {/* Main Benefit Card */}
          <div className="lg:col-span-4 rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-6 space-y-3 shadow-sm dark:shadow-none">
            <div
              className="text-xs font-semibold"
              style={{ color: accentTextVar }}
            >
              {t.serviceDetail.mainBenefit}
            </div>
            <p className="text-sm text-[#141210] dark:text-[#FAFAF9] leading-relaxed">
              {selectedService.mainBenefit[lang]}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/contatti')}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[#0C0A09] cursor-pointer min-h-[44px] hover:opacity-90 transition-opacity"
              style={{ backgroundColor: accentColor }}
            >
              <span>{t.serviceDetail.ctaQuote}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Progetti / App SitiTicino.ch (5 App Cards) */}
      <SitiTicinoAppsSection lang={lang} />

      {/* How it works in 3 steps */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-[#141210] dark:text-[#FAFAF9]">
          {t.serviceDetail.howItWorks}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedService.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-6 space-y-3 shadow-sm dark:shadow-none"
            >
              <span
                className="font-mono text-sm font-semibold"
                style={{ color: accentTextVar }}
              >
                {step.stepNumber}.
              </span>
              <h3 className="font-display text-lg font-semibold text-[#141210] dark:text-[#FAFAF9]">
                {step.title[lang]}
              </h3>
              <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                {step.description[lang]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What is included + FAQ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-6 sm:p-8 space-y-5 shadow-sm dark:shadow-none">
          <h2 className="font-display text-xl font-bold text-[#141210] dark:text-[#FAFAF9]">
            {t.serviceDetail.whatIncluded}
          </h2>
          <ul className="space-y-3.5">
            {selectedService.includedItems[lang].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-[#141210] dark:text-[#FAFAF9]"
              >
                <Check
                  className="h-4 w-4 mt-0.5 shrink-0"
                  style={{ color: accentTextVar }}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-6 sm:p-8 space-y-4 shadow-sm dark:shadow-none">
          <h2 className="font-display text-xl font-bold text-[#141210] dark:text-[#FAFAF9]">
            {t.serviceDetail.faqTitle}
          </h2>
          <div className="divide-y divide-[#E5E2DC] dark:divide-[#292524]">
            {selectedService.faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={faq.question[lang]} className="py-4 first:pt-1 last:pb-1">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 text-left font-medium text-[#141210] dark:text-[#FAFAF9] cursor-pointer min-h-[40px]"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base">{faq.question[lang]}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#57534E] dark:text-[#A8A29E] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ${
                      isOpen ? 'grid-rows-[1fr] opacity-100 mt-2.5' : 'grid-rows-[0fr] opacity-0'
                    }`}
                    aria-hidden={!isOpen}
                  >
                    <p className="overflow-hidden text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                      {faq.answer[lang]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ticino Geographic Localization Matrix (Section 08: Lugano, Bellinzona, Locarno, Mendrisio) */}
      <section className="rounded-3xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#141210] dark:text-[#FAFAF9]">
              {t.serviceDetail.localTitle}
            </h2>
            <p className="mt-1 text-sm text-[#57534E] dark:text-[#A8A29E]">
              {t.serviceDetail.localSubtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {TICINO_CITIES.map((city) => {
              const active = city.slug === cityProfile.slug;
              return (
                <button
                  key={city.slug}
                  type="button"
                  onClick={() => onSelectCity(city.slug)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium cursor-pointer min-h-[38px] ${
                    active
                      ? 'border-[#0F766E] dark:border-[#2DD4BF] bg-[#0F766E]/10 dark:bg-[#2DD4BF]/15 text-[#0F766E] dark:text-[#2DD4BF]'
                      : 'border-[#E5E2DC] dark:border-[#292524] bg-[#F3F1EC] dark:bg-[#0C0A09] text-[#57534E] hover:text-[#141210] dark:text-[#A8A29E] dark:hover:text-[#FAFAF9]'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{city.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
          <div className="lg:col-span-8 rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-[#F3F1EC] dark:bg-[#0C0A09] p-6 space-y-4">
            <div className="text-xs font-mono text-[#0F766E] dark:text-[#2DD4BF]">
              {cityProfile.name} · {cityProfile.regionLabel[lang]}
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#141210] dark:text-[#FAFAF9]">
              {cityProfile.headline[lang]}
            </h3>
            <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
              {cityProfile.description[lang]}
            </p>

            {/* Genuinely differentiated strategy for the active service & city */}
            <div className="rounded-xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#141210] p-4 space-y-1.5">
              <div className="text-xs font-semibold text-[#B45309] dark:text-[#FBBF24]">
                {t.seoUi.serviceAngleLabel}: {selectedService.shortTitle[lang]} ({cityProfile.name})
              </div>
              <p className="text-xs sm:text-sm text-[#141210] dark:text-[#FAFAF9] leading-relaxed">
                {cityProfile.serviceAngles[serviceAngleKey][lang]}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5E2DC] dark:border-[#292524] text-xs">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] mb-1">
                  {t.seoUi.districtsLabel}
                </div>
                <p className="text-[#141210] dark:text-[#FAFAF9]">{cityProfile.districtsAndHubs[lang]}</p>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] mb-1">
                  {t.seoUi.industriesLabel}
                </div>
                <p className="text-[#141210] dark:text-[#FAFAF9]">
                  {cityProfile.keyIndustries[lang].join(' · ')}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E5E2DC] dark:border-[#292524] flex flex-wrap items-center justify-between gap-2 text-xs text-[#57534E] dark:text-[#A8A29E]">
              <span>
                <strong className="text-[#141210] dark:text-[#FAFAF9] font-medium">{t.seoUi.keywordsLabel}:</strong>{' '}
                <span className="font-mono">{cityProfile.localKeywords[lang].join(' · ')}</span>
              </span>
              <a
                href="https://sititicino.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[#0F766E] dark:text-[#2DD4BF] hover:underline shrink-0"
              >
                <span>{t.seoUi.sitiTicinoNetworkLabel}</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-[#F3F1EC] dark:bg-[#0C0A09] p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="font-mono text-lg font-semibold text-[#141210] dark:text-[#FAFAF9] tabular-nums">
                    {cityProfile.stats.businessesServed}
                  </div>
                  <div className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">PMI</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-semibold text-[#0F766E] dark:text-[#2DD4BF] tabular-nums">
                    {cityProfile.stats.avgLighthouse}
                  </div>
                  <div className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">Lighthouse</div>
                </div>
                <div>
                  <div className="font-mono text-sm font-semibold text-[#141210] dark:text-[#FAFAF9]">
                    {cityProfile.stats.responseTime}
                  </div>
                  <div className="text-[11px] text-[#57534E] dark:text-[#A8A29E]">Supporto</div>
                </div>
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed pt-3 border-t border-[#E5E2DC] dark:border-[#292524]">
                {cityProfile.localFocus[lang]}
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  const target = getProjectBySlug(cityProfile.featuredCaseSlug);
                  if (target) {
                    onNavigate(
                      target.engine === 'saas'
                        ? `/prodotti/${target.slug}`
                        : `/lavori/${target.slug}`
                    );
                  }
                }}
                className="w-full inline-flex items-center justify-between gap-2 rounded-full border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] px-4 py-2.5 text-xs font-medium text-[#141210] dark:text-[#FAFAF9] hover:border-[#0F766E] dark:hover:border-[#2DD4BF] cursor-pointer min-h-[40px]"
              >
                <span>Case {cityProfile.name}</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#0F766E] dark:text-[#2DD4BF]" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/contatti')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2DD4BF] px-4 py-2.5 text-xs font-semibold text-[#0C0A09] hover:opacity-90 cursor-pointer min-h-[40px]"
              >
                <span>{t.serviceDetail.ctaQuote}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Case Studies */}
      {relatedCases.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-[#141210] dark:text-[#FAFAF9]">
            {t.serviceDetail.examplesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCases.map((item) => (
              <ProjectCard
                key={item.slug}
                project={item}
                lang={lang}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
