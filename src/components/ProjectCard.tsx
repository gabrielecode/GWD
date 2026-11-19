import { ArrowRight } from 'lucide-react';
import { Language, ProjectItem } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { StatusBadge } from './StatusBadge';
import { ProjectThumbnail } from './VisualThumbnails';

interface ProjectCardProps {
  project: ProjectItem;
  lang: Language;
  onNavigate: (path: string) => void;
}

export function ProjectCard({ project, lang, onNavigate }: ProjectCardProps) {
  const t = TRANSLATIONS[lang];
  const detailPath =
    project.engine === 'saas'
      ? `/prodotti/${project.slug}`
      : `/lavori/${project.slug}`;

  const accentTextColor =
    project.status === 'ai-division'
      ? 'text-[#60A5FA]'
      : project.engine === 'saas'
      ? 'text-[#2DD4BF]'
      : 'text-[#FBBF24]';

  const cardHoverBorder =
    project.engine === 'saas'
      ? 'hover:border-[#2DD4BF]/50'
      : 'hover:border-[#FBBF24]/50';

  return (
    <article
      className={`group rounded-2xl border border-[#292524] bg-[#1C1917] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 ease-out ${cardHoverBorder} hover:-translate-y-1 hover:shadow-[0_20px_44px_-16px_rgba(0,0,0,0.75)]`}
    >
      <div>
        <div className="mb-4">
          <ProjectThumbnail project={project} lang={lang} />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#A8A29E] mb-1.5">
          <span>{project.category[lang]}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{project.sector[lang]}</span>
        </div>

        <h3 className="font-display text-xl font-semibold text-[#FAFAF9] tracking-tight mb-2">
          <button
            type="button"
            onClick={() => onNavigate(detailPath)}
            className="text-left hover:underline underline-offset-4 cursor-pointer"
          >
            {project.name}
          </button>
        </h3>

        <p className="text-sm text-[#A8A29E] leading-relaxed line-clamp-4 mb-5">
          {project.shortDescription[lang]}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#292524]">
        <div className="flex items-center gap-2 min-w-0">
          <StatusBadge status={project.status} lang={lang} />
        </div>

        {project.engine === 'agency' ? (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 min-h-[38px]"
            style={{
              backgroundColor:
                project.status === 'ai-division' ? '#60A5FA' : '#FBBF24',
            }}
          >
            <span>{t.filterSection.visitSite}</span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate(detailPath)}
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${accentTextColor} hover:underline underline-offset-4 whitespace-nowrap cursor-pointer min-h-[40px]`}
          >
            <span>{t.filterSection.viewCard}</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </article>
  );
}
