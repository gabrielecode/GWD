import { ArrowRight, Globe, Layers, MapPin } from 'lucide-react';
import { Language } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { BUSINESS_INFO } from '../data/business';
import { TICINO_CITIES } from '../data/services';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface AboutViewProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

export function AboutView({ lang, onNavigate }: AboutViewProps) {
  const t = TRANSLATIONS[lang];

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      <Breadcrumbs
        items={[
          { label: t.seoUi.homeLabel, path: '/' },
          { label: t.nav.about },
        ]}
        onNavigate={onNavigate}
      />

      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-medium text-[#2DD4BF]">
          {BUSINESS_INFO.brandName} · {BUSINESS_INFO.address.locality}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAFAF9]">
          {t.about.title}
        </h1>
        <p className="text-lg text-[#A8A29E] leading-relaxed">
          {t.about.subtitle}
        </p>
      </header>

      {/* Group Story */}
      <section className="rounded-2xl border border-[#292524] bg-[#1C1917] p-6 sm:p-10 space-y-5">
        <h2 className="font-display text-2xl font-bold text-[#FAFAF9]">
          {t.about.groupStoryTitle}
        </h2>
        <p className="text-base text-[#A8A29E] leading-relaxed max-w-4xl">
          {t.about.groupStoryBody}
        </p>
        <div className="pt-4 border-t border-[#292524] flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-[#A8A29E]">
          <span>{BUSINESS_INFO.brandName}</span>
          <span>{BUSINESS_INFO.address.locality}</span>
        </div>
      </section>

      {/* Dual Engine: Studio & Agency */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-[#FAFAF9]">
          {t.about.brandsTitle}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#2DD4BF]/30 bg-[#1C1917] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2DD4BF]/15 text-[#2DD4BF]">
                <Layers className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#FAFAF9]">
                {t.about.gwdTitle}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-[#A8A29E] leading-relaxed">
              {t.about.gwdDesc}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/prodotti')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2DD4BF] hover:underline underline-offset-4 cursor-pointer"
            >
              <span>{t.dualEngine.saasCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="rounded-2xl border border-[#FBBF24]/30 bg-[#1C1917] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBBF24]/15 text-[#FBBF24]">
                <Globe className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#FAFAF9]">
                {t.about.sitiTicinoTitle}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-[#A8A29E] leading-relaxed">
              {t.about.sitiTicinoDesc}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/lavori')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FBBF24] hover:underline underline-offset-4 cursor-pointer"
              >
                <span>{t.dualEngine.agencyCta}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <a
                href="https://sititicino.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[#A8A29E] hover:text-[#FAFAF9]"
              >
                sititicino.ch ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Core Web Vitals & Engineering Standards */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-[#FAFAF9]">
          {t.about.standardsTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.about.standards.map((st) => (
            <div
              key={st.target}
              className="rounded-2xl border border-[#292524] bg-[#1C1917] p-6 space-y-2"
            >
              <div className="font-mono text-2xl font-bold tabular-nums text-[#2DD4BF]">
                {st.metric}
              </div>
              <div className="font-display text-base font-semibold text-[#FAFAF9]">
                {st.target}
              </div>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Ticino District Hubs */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-[#FAFAF9]">
          {t.socialProof.zonesLabel}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TICINO_CITIES.map((city) => (
            <button
              key={city.slug}
              type="button"
              onClick={() => onNavigate(`/servizi/${city.slug}`)}
              className="rounded-2xl border border-[#292524] bg-[#1C1917] p-5 text-left hover:border-[#2DD4BF]/50 transition-colors cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between text-sm font-semibold text-[#FAFAF9]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#2DD4BF]" aria-hidden="true" />
                  {city.name}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-[#A8A29E]" aria-hidden="true" />
              </div>
              <p className="text-xs text-[#A8A29E]">{city.districtsAndHubs[lang]}</p>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-[#292524] bg-[#1C1917] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FAFAF9]">
          {t.about.ctaTitle}
        </h2>
        <button
          type="button"
          onClick={() => onNavigate('/contatti')}
          className="inline-flex items-center gap-2 rounded-full bg-[#2DD4BF] px-6 py-3 text-sm font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity shrink-0 cursor-pointer min-h-[44px]"
        >
          <span>{t.about.ctaButton}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}
