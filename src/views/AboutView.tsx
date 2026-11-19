import { ArrowRight, Globe, Layers } from 'lucide-react';
import { Language } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';

interface AboutViewProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

export function AboutView({ lang, onNavigate }: AboutViewProps) {
  const t = TRANSLATIONS[lang];

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-medium text-[#2DD4BF]">
          GWD Group · Lugano, Svizzera
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAFAF9]">
          {t.about.title}
        </h1>
        <p className="text-lg text-[#A8A29E] leading-relaxed">
          {t.about.subtitle}
        </p>
      </header>

      {/* Group Story */}
      <section className="rounded-2xl border border-[#292524] bg-[#1C1917] p-6 sm:p-10 space-y-4">
        <h2 className="font-display text-2xl font-bold text-[#FAFAF9]">
          {t.about.groupStoryTitle}
        </h2>
        <p className="text-base text-[#A8A29E] leading-relaxed max-w-4xl">
          {t.about.groupStoryBody}
        </p>
      </section>

      {/* Two Group Brands: GWD & SitiTicino */}
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
            <button
              type="button"
              onClick={() => onNavigate('/lavori')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FBBF24] hover:underline underline-offset-4 cursor-pointer"
            >
              <span>{t.dualEngine.agencyCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
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
