import { ArrowLeft, ArrowRight, CheckCircle2, Users } from 'lucide-react';
import { Language, ProjectItem } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { getProjectBySlug } from '../data/projects';
import { StatusBadge } from '../components/StatusBadge';
import { DevicePreview } from '../components/DevicePreview';
import { ProjectCard } from '../components/ProjectCard';

interface ProductDetailViewProps {
  project: ProjectItem;
  lang: Language;
  onNavigate: (path: string) => void;
}

export function ProductDetailView({
  project,
  lang,
  onNavigate,
}: ProductDetailViewProps) {
  const t = TRANSLATIONS[lang];
  const related = project.relatedSlugs
    .map((slug) => getProjectBySlug(slug))
    .filter((item): item is ProjectItem => Boolean(item));

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-16">
      {/* Breadcrumb back */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate('/prodotti')}
          className="inline-flex items-center gap-2 text-sm text-[#A8A29E] hover:text-[#FAFAF9] transition-colors cursor-pointer min-h-[40px]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>{t.productDetail.backToHub}</span>
        </button>
      </div>

      {/* Header: Title + Status Badge + Primary CTA "Apri piattaforma ↗" */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} lang={lang} />
            <span className="text-sm text-[#A8A29E]">{project.sector[lang]}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAFAF9]">
            {project.name}
          </h1>
          <p className="text-lg text-[#A8A29E] leading-relaxed max-w-2xl">
            {project.tagline[lang]}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#2DD4BF] px-6 py-3 text-sm font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity min-h-[44px]"
            >
              <span>{t.productDetail.openPlatform}</span>
            </a>
            <button
              type="button"
              onClick={() => onNavigate('/contatti')}
              className="inline-flex items-center gap-2 rounded-full border border-[#292524] bg-[#1C1917] px-5 py-3 text-sm font-medium text-[#FAFAF9] hover:border-[#2DD4BF] transition-colors cursor-pointer min-h-[44px]"
            >
              <span>{t.productDetail.nextActionCta}</span>
            </button>
          </div>
        </div>

        {/* Verified Metrics Column */}
        <div className="lg:col-span-4 rounded-2xl border border-[#292524] bg-[#1C1917] p-6 space-y-4">
          <div>
            <div className="font-mono text-3xl font-bold tabular-nums text-[#2DD4BF]">
              {project.heroMetric.value}
            </div>
            <div className="text-sm text-[#FAFAF9] mt-1">
              {project.heroMetric.label[lang]}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#292524]">
            {project.secondaryMetrics.map((m) => (
              <div key={m.value}>
                <div className="font-mono text-xl font-semibold tabular-nums text-[#FAFAF9]">
                  {m.value}
                </div>
                <div className="text-xs text-[#A8A29E] mt-0.5">
                  {m.label[lang]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Problem Solved + Target Audience */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-[#292524] bg-[#1C1917] p-6 sm:p-8 space-y-3">
          <h2 className="font-display text-xl font-semibold text-[#FAFAF9]">
            {t.productDetail.problemSolved}
          </h2>
          <p className="text-base text-[#FAFAF9] leading-relaxed">
            {project.problemOrChallenge[lang]}
          </p>
          <p className="text-sm text-[#A8A29E] leading-relaxed pt-2 border-t border-[#292524]">
            {project.solution[lang]}
          </p>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-[#292524] bg-[#1C1917] p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-[#2DD4BF] mb-3">
              <Users className="h-5 w-5" aria-hidden="true" />
              <h2 className="font-display text-xl font-semibold text-[#FAFAF9]">
                {t.productDetail.targetAudience}
              </h2>
            </div>
            <p className="text-base text-[#FAFAF9] leading-relaxed">
              {project.targetAudience[lang]}
            </p>
          </div>
          <div className="pt-4 border-t border-[#292524] text-xs text-[#A8A29E]">
            {project.results[lang]}
          </div>
        </div>
      </section>

      {/* 3 Key Features */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-[#FAFAF9]">
          {t.productDetail.keyFeatures}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {project.keyFeatures.map((feat, idx) => (
            <div
              key={feat.title[lang]}
              className="rounded-2xl border border-[#292524] bg-[#1C1917] p-6 space-y-3"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-[#2DD4BF]">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>0{idx + 1}</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-[#FAFAF9]">
                {feat.title[lang]}
              </h3>
              <p className="text-sm text-[#A8A29E] leading-relaxed">
                {feat.description[lang]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Screenshot / Platform Preview */}
      <section className="space-y-5">
        <h2 className="font-display text-2xl font-bold text-[#FAFAF9]">
          {t.productDetail.interactivePreview}
        </h2>
        <DevicePreview project={project} lang={lang} />
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-[#292524]">
          <h2 className="font-display text-2xl font-bold text-[#FAFAF9]">
            {t.productDetail.relatedProducts}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item) => (
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

      {/* Guided Next Step CTA */}
      <section className="rounded-2xl border border-[#2DD4BF]/35 bg-[#1C1917] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FAFAF9]">
            {t.productDetail.nextActionTitle}
          </h2>
          <p className="mt-1 text-sm text-[#A8A29E]">
            {project.name} · {project.previewTheme.domainUrl}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#2DD4BF] px-5 py-3 text-sm font-semibold text-[#0C0A09] hover:opacity-90 min-h-[44px]"
          >
            <span>{t.productDetail.openPlatform}</span>
          </a>
          <button
            type="button"
            onClick={() => onNavigate('/contatti')}
            className="inline-flex items-center gap-2 rounded-full border border-[#292524] bg-[#0C0A09] px-5 py-3 text-sm font-medium text-[#FAFAF9] hover:border-[#2DD4BF] cursor-pointer min-h-[44px]"
          >
            <span>{t.productDetail.nextActionCta}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
