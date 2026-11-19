import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Language } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { getSaasProjects } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectCardSkeleton } from '../components/ProjectCardSkeleton';

interface ProductsHubViewProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

export function ProductsHubView({ lang, onNavigate }: ProductsHubViewProps) {
  const t = TRANSLATIONS[lang];
  const saasProjects = getSaasProjects();
  const [statusFilter, setStatusFilter] = useState<'all' | 'live-saas' | 'ai-division'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const firstMount = useRef(true);

  useEffect(() => {
    setIsLoading(true);
    const delay = firstMount.current ? 300 : 210;
    firstMount.current = false;
    const timer = window.setTimeout(() => setIsLoading(false), delay);
    return () => window.clearTimeout(timer);
  }, [statusFilter]);

  const visible =
    statusFilter === 'all'
      ? saasProjects
      : saasProjects.filter((p) => p.status === statusFilter);

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      <header className="glass-panel rounded-3xl p-6 sm:p-10 max-w-4xl space-y-4">
        <p className="text-xs font-medium uppercase tracking-wider text-[#2DD4BF]">
          {t.dualEngine.saasTag} · GWD Group
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAFAF9]">
          {t.dualEngine.saasTitle}
        </h1>
        <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
          {t.dualEngine.saasDescription}
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#292524]">
        <div className="inline-flex items-center rounded-full border border-[#292524] bg-[#1C1917] p-1">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#2DD4BF] text-[#0C0A09] font-semibold'
                : 'text-[#A8A29E] hover:text-[#FAFAF9]'
            }`}
          >
            {t.filterSection.all} ({saasProjects.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('live-saas')}
            className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              statusFilter === 'live-saas'
                ? 'bg-[#22C55E] text-[#0C0A09] font-semibold'
                : 'text-[#A8A29E] hover:text-[#FAFAF9]'
            }`}
          >
            {t.badges['live-saas']}
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('ai-division')}
            className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              statusFilter === 'ai-division'
                ? 'bg-[#60A5FA] text-[#0C0A09] font-semibold'
                : 'text-[#A8A29E] hover:text-[#FAFAF9]'
            }`}
          >
            {t.badges['ai-division']}
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/lavori')}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#292524] bg-[#1C1917] px-4 py-2 text-xs font-semibold text-[#FBBF24] hover:border-[#FBBF24] cursor-pointer"
        >
          <span>{t.dualEngine.agencyCta}</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-busy="true"
          aria-live="polite"
        >
          {Array.from({ length: visible.length || 3 }).map((_, idx) => (
            <ProjectCardSkeleton
              key={idx}
              accent={statusFilter === 'ai-division' ? 'ai' : 'saas'}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              lang={lang}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
