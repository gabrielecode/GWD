import { useId, useState } from 'react';
import { ArrowRight, ChevronDown, Code2 } from 'lucide-react';
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
  const [isMobileStackOpen, setIsMobileStackOpen] = useState(false);
  const stackPanelId = useId();

  const detailPath =
    project.engine === 'saas'
      ? `/prodotti/${project.slug}`
      : `/lavori/${project.slug}`;

  const accentHex =
    project.status === 'ai-division'
      ? '#60A5FA'
      : project.engine === 'saas'
      ? '#2DD4BF'
      : '#FBBF24';

  const accentVar =
    project.status === 'ai-division'
      ? 'var(--kl-accent-ai)'
      : project.engine === 'saas'
      ? 'var(--kl-accent-saas)'
      : 'var(--kl-accent-agency)';

  const accentTextColor =
    project.status === 'ai-division'
      ? 'text-[#1D4ED8] dark:text-[#60A5FA]'
      : project.engine === 'saas'
      ? 'text-[#0F766E] dark:text-[#2DD4BF]'
      : 'text-[#B45309] dark:text-[#FBBF24]';

  const cardHoverBorder =
    project.engine === 'saas'
      ? 'hover:border-[#0F766E]/50 dark:hover:border-[#2DD4BF]/50'
      : 'hover:border-[#B45309]/50 dark:hover:border-[#FBBF24]/50';

  const technicalTags = project.servicesUsed[lang];
  const totalDetailsCount = project.techStack.length + technicalTags.length;

  return (
    <article
      className={`group rounded-2xl border border-[#E5E2DC] bg-white dark:border-[#292524] dark:bg-[#1C1917] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 ease-out ${cardHoverBorder} hover:-translate-y-1 hover:shadow-[0_18px_36px_-16px_rgba(20,18,16,0.16)] dark:hover:shadow-[0_20px_44px_-16px_rgba(0,0,0,0.75)]`}
    >
      <div>
        <div className="mb-4">
          <ProjectThumbnail project={project} lang={lang} />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] mb-1.5">
          <span>{project.category[lang]}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{project.sector[lang]}</span>
        </div>

        <h3 className="font-display text-xl font-semibold text-[#141210] dark:text-[#FAFAF9] tracking-tight mb-2">
          <button
            type="button"
            onClick={() => onNavigate(detailPath)}
            className="text-left hover:underline underline-offset-4 cursor-pointer"
          >
            {project.name}
          </button>
        </h3>

        <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed line-clamp-4 mb-4">
          {project.shortDescription[lang]}
        </p>

        {/* Desktop Compact Stack Preview */}
        <div className="hidden md:flex flex-wrap items-center gap-1.5 mb-5">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E2DC] bg-[#F3F1EC] text-[#57534E] dark:border-[#292524] dark:bg-[#0C0A09] px-2 py-0.5 font-mono text-[11px] dark:text-[#A8A29E]"
            >
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: accentVar }}
                aria-hidden="true"
              />
              <span>{tech}</span>
            </span>
          ))}
        </div>

        {/* Mobile Tap-to-Expand Technical Tags & Tech Stack */}
        <div className="md:hidden mb-4">
          <button
            type="button"
            aria-expanded={isMobileStackOpen}
            aria-controls={stackPanelId}
            onClick={() => setIsMobileStackOpen((prev) => !prev)}
            className="w-full flex items-center justify-between gap-2 rounded-xl border border-[#E5E2DC] bg-[#F3F1EC]/80 text-[#141210] dark:border-[#292524] dark:bg-[#0C0A09]/80 px-3 py-2.5 text-left text-xs font-medium dark:text-[#FAFAF9] active:scale-[0.99] transition-all cursor-pointer touch-manipulation min-h-[42px]"
          >
            <span className="flex items-center gap-2 min-w-0">
              <Code2
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: accentVar }}
                aria-hidden="true"
              />
              <span className="truncate">
                {isMobileStackOpen
                  ? t.filterSection.hideTechStack
                  : t.filterSection.showTechStack}
              </span>
              <span
                className="inline-flex items-center justify-center rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#0C0A09] shrink-0"
                style={{ backgroundColor: accentHex }}
              >
                {totalDetailsCount}
              </span>
            </span>
            <ChevronDown
              className={`h-4 w-4 text-[#57534E] dark:text-[#A8A29E] shrink-0 transition-transform duration-200 ${
                isMobileStackOpen ? 'rotate-180 text-[#141210] dark:text-[#FAFAF9]' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          <div
            id={stackPanelId}
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
              isMobileStackOpen
                ? 'grid-rows-[1fr] opacity-100 mt-2'
                : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="rounded-xl border border-[#E5E2DC] bg-[#F3F1EC] dark:border-[#292524] dark:bg-[#0C0A09] p-3 space-y-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] mb-1.5">
                    {t.filterSection.techStackHeading}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E2DC] bg-white text-[#141210] dark:border-[#292524] dark:bg-[#1C1917] px-2 py-1 font-mono text-[11px] dark:text-[#FAFAF9]"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: accentVar }}
                          aria-hidden="true"
                        />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E2DC] dark:border-[#292524]/80">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E] mb-1.5">
                    {t.filterSection.technicalTagsHeading}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {technicalTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md border border-[#E5E2DC] bg-white text-[#57534E] dark:border-[#292524] dark:bg-[#141210] px-2 py-1 text-[11px] dark:text-[#A8A29E]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E5E2DC] dark:border-[#292524]">
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
