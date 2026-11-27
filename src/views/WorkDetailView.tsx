import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Language, ProjectItem } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { getProjectBySlug } from '../data/projects';
import { StatusBadge } from '../components/StatusBadge';
import { DevicePreview } from '../components/DevicePreview';
import { ProjectCard } from '../components/ProjectCard';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface WorkDetailViewProps {
  project: ProjectItem;
  lang: Language;
  onNavigate: (path: string) => void;
}

export function WorkDetailView({
  project,
  lang,
  onNavigate,
}: WorkDetailViewProps) {
  const t = TRANSLATIONS[lang];
  const related = project.relatedSlugs
    .map((slug) => getProjectBySlug(slug))
    .filter((item): item is ProjectItem => Boolean(item));

  const mapServicePath = (label: string): string => {
    const lower = label.toLowerCase();
    if (lower.includes('ristor')) return '/servizi/agenti-ai-ristoranti';
    if (lower.includes('parrucch') || lower.includes('salon')) return '/servizi/agenti-ai-parrucchieri';
    if (lower.includes('ai') || lower.includes('vocal') || lower.includes('sprach') || lower.includes('voice')) return '/servizi/agenti-ai-vocali';
    if (lower.includes('seo') || lower.includes('google') || lower.includes('maps')) return '/servizi/seo-locale';
    if (lower.includes('book') || lower.includes('comm') || lower.includes('prenot')) return '/servizi/ecommerce';
    return '/servizi/siti-web';
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Breadcrumbs
          items={[
            { label: t.seoUi.homeLabel, path: '/' },
            { label: t.nav.works, path: '/lavori' },
            { label: project.name },
          ]}
          onNavigate={onNavigate}
        />
        <button
          type="button"
          onClick={() => onNavigate('/lavori')}
          className="inline-flex items-center gap-2 text-sm text-[#57534E] hover:text-[#141210] dark:text-[#A8A29E] dark:hover:text-[#FAFAF9] transition-colors cursor-pointer min-h-[40px]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>{t.caseDetail.backToHub}</span>
        </button>
      </div>

      {/* Header: Client & Sector + Status + Live link */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} lang={lang} />
            <span className="text-sm text-[#57534E] dark:text-[#A8A29E]">
              {t.caseDetail.clientSector}: {project.sector[lang]}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141210] dark:text-[#FAFAF9]">
            {project.name}
          </h1>
          <p className="text-lg text-[#57534E] dark:text-[#A8A29E] leading-relaxed max-w-2xl">
            {project.tagline[lang]}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/contatti')}
              className="inline-flex items-center gap-2 rounded-full bg-[#FBBF24] px-6 py-3 text-sm font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity cursor-pointer min-h-[44px]"
            >
              <span>{t.caseDetail.similarProjectCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] px-5 py-3 text-sm font-medium text-[#141210] dark:text-[#FAFAF9] hover:border-[#B45309] dark:hover:border-[#FBBF24] transition-colors min-h-[44px]"
            >
              <span>{t.caseDetail.visitLiveSite}</span>
            </a>
          </div>
        </div>

        {/* Quantitative Metrics Summary */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-6 space-y-4 shadow-sm dark:shadow-none">
          <div>
            <div className="font-mono text-3xl font-bold tabular-nums text-[#B45309] dark:text-[#FBBF24]">
              {project.heroMetric.value}
            </div>
            <div className="text-sm text-[#141210] dark:text-[#FAFAF9] mt-1">
              {project.heroMetric.label[lang]}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E2DC] dark:border-[#292524]">
            {project.secondaryMetrics.map((m) => (
              <div key={m.value}>
                <div className="font-mono text-xl font-semibold tabular-nums text-[#141210] dark:text-[#FAFAF9]">
                  {m.value}
                </div>
                <div className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-0.5">
                  {m.label[lang]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Sfida -> Soluzione -> Risultato */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-6 space-y-3 shadow-sm dark:shadow-none">
          <div className="font-mono text-xs font-semibold text-[#C2410C] dark:text-[#FB923C]">
            01 · {t.caseDetail.challenge}
          </div>
          <p className="text-sm sm:text-base text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
            {project.problemOrChallenge[lang]}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-6 space-y-3 shadow-sm dark:shadow-none">
          <div className="font-mono text-xs font-semibold text-[#B45309] dark:text-[#FBBF24]">
            02 · {t.caseDetail.solution}
          </div>
          <p className="text-sm sm:text-base text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
            {project.solution[lang]}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-6 space-y-3 shadow-sm dark:shadow-none">
          <div className="font-mono text-xs font-semibold text-[#15803D] dark:text-[#22C55E]">
            03 · {t.caseDetail.results}
          </div>
          <p className="text-sm sm:text-base text-[#141210] dark:text-[#FAFAF9] leading-relaxed">
            {project.results[lang]}
          </p>
        </div>
      </section>

      {/* Interactive Desktop / Mobile Preview */}
      <section className="space-y-5">
        <h2 className="font-display text-2xl font-bold text-[#141210] dark:text-[#FAFAF9]">
          {t.caseDetail.previewTitle}
        </h2>
        <DevicePreview project={project} lang={lang} />
      </section>

      {/* Services Used & Key Deliverables */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-6 sm:p-8 space-y-4 shadow-sm dark:shadow-none">
          <h2 className="font-display text-xl font-semibold text-[#141210] dark:text-[#FAFAF9]">
            {t.caseDetail.servicesUsed}
          </h2>
          <ul className="space-y-3">
            {project.servicesUsed[lang].map((srv) => (
              <li
                key={srv}
                className="border-b border-[#E5E2DC] dark:border-[#292524] pb-2.5 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => onNavigate(mapServicePath(srv))}
                  className="flex w-full items-center justify-between gap-2.5 text-sm text-[#141210] dark:text-[#FAFAF9] hover:text-[#B45309] dark:hover:text-[#FBBF24] transition-colors cursor-pointer text-left"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-[#B45309] dark:text-[#FBBF24] shrink-0" aria-hidden="true" />
                    <span>{srv}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#57534E] dark:text-[#A8A29E] shrink-0" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {project.keyFeatures.map((feat) => (
            <div
              key={feat.title[lang]}
              className="rounded-2xl border border-[#E5E2DC] dark:border-[#292524] bg-white dark:bg-[#1C1917] p-5 space-y-2 shadow-sm dark:shadow-none"
            >
              <h3 className="font-display text-base font-semibold text-[#141210] dark:text-[#FAFAF9]">
                {feat.title[lang]}
              </h3>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                {feat.description[lang]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Case Studies */}
      {related.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-[#E5E2DC] dark:border-[#292524]">
          <h2 className="font-display text-2xl font-bold text-[#141210] dark:text-[#FAFAF9]">
            {t.caseDetail.relatedWorks}
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

      {/* Guided CTA: "Vuoi un progetto simile?" */}
      <section className="rounded-2xl border border-[#B45309]/30 dark:border-[#FBBF24]/35 bg-white dark:bg-[#1C1917] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm dark:shadow-none">
        <div className="max-w-xl">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#141210] dark:text-[#FAFAF9]">
            {t.caseDetail.similarProjectTitle}
          </h2>
          <p className="mt-1.5 text-sm text-[#57534E] dark:text-[#A8A29E]">
            {t.caseDetail.similarProjectSub}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('/contatti')}
          className="inline-flex items-center gap-2 rounded-full bg-[#FBBF24] px-6 py-3 text-sm font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity shrink-0 cursor-pointer min-h-[44px]"
        >
          <span>{t.caseDetail.similarProjectCta}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}
