import { useState } from 'react';
import { Monitor, Smartphone, ArrowUpRight, Check } from 'lucide-react';
import { Language, ProjectItem } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';

interface DevicePreviewProps {
  project: ProjectItem;
  lang: Language;
  initialMode?: 'desktop' | 'mobile';
}

export function DevicePreview({
  project,
  lang,
  initialMode = 'desktop',
}: DevicePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>(initialMode);
  const [activeHighlightIdx, setActiveHighlightIdx] = useState(0);
  const t = TRANSLATIONS[lang];

  const accentHex = project.previewTheme.primaryHex;
  const modules = project.previewTheme.uiModules[lang];
  const highlights = project.previewTheme.highlights;

  return (
    <div className="rounded-2xl border border-[#292524] bg-[#1C1917] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#292524] bg-[#171412] px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="h-2.5 w-2.5 rounded-sm shrink-0"
            style={{ backgroundColor: accentHex }}
            aria-hidden="true"
          />
          <span className="font-mono text-xs text-[#A8A29E] truncate">
            {project.previewTheme.domainUrl}
          </span>
        </div>

        <div
          className="inline-flex items-center rounded-full border border-[#292524] bg-[#0C0A09] p-1"
          role="group"
          aria-label={t.caseDetail.previewTitle}
        >
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-[#FAFAF9] text-[#0C0A09]'
                : 'text-[#A8A29E] hover:text-[#FAFAF9]'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.caseStudies.desktopView}</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-[#FAFAF9] text-[#0C0A09]'
                : 'text-[#A8A29E] hover:text-[#FAFAF9]'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.caseStudies.mobileView}</span>
          </button>
        </div>
      </div>

      {/* Viewport */}
      <div className="p-4 sm:p-6 bg-[#0C0A09]">
        {deviceMode === 'desktop' ? (
          project.previewImage ? (
            <div className="rounded-xl border border-[#292524] bg-[#1C1917] overflow-hidden">
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative w-full bg-[#0C0A09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF]"
                aria-label={`${project.name} — ${project.previewTheme.domainUrl}`}
              >
                <img
                  src={project.previewImage}
                  alt={`Anteprima desktop della piattaforma ${project.name} (${project.previewTheme.domainUrl})`}
                  loading="lazy"
                  className="w-full h-auto block object-cover object-top"
                />
              </a>
            </div>
          ) : (
          <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-[#292524] pb-4 mb-5">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-[#0C0A09] shrink-0"
                  style={{ backgroundColor: accentHex }}
                >
                  {project.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="font-display text-sm font-semibold text-[#FAFAF9] truncate">
                  {project.name}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-[#A8A29E]">
                {modules.slice(0, 2).map((mod) => (
                  <span key={mod} className="truncate max-w-[140px]">
                    {mod}
                  </span>
                ))}
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-[#FAFAF9] px-3 py-1 text-xs font-semibold text-[#0C0A09] whitespace-nowrap shrink-0"
                >
                  <span>Live</span>
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs font-medium text-[#A8A29E] mb-1.5">
                    {project.sector[lang]}
                  </p>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-[#FAFAF9] leading-snug">
                    {project.previewTheme.desktopHeadline[lang]}
                  </h3>
                  <p className="mt-2 text-sm text-[#A8A29E]">
                    {project.previewTheme.desktopSubline[lang]}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  {modules.map((mod, idx) => (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => setActiveHighlightIdx(idx % highlights.length)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                        activeHighlightIdx === idx % highlights.length
                          ? 'border-[#FAFAF9]/40 bg-[#0C0A09] text-[#FAFAF9]'
                          : 'border-[#292524] bg-[#0C0A09]/60 text-[#A8A29E] hover:text-[#FAFAF9]'
                      }`}
                    >
                      <Check
                        className="h-3.5 w-3.5 shrink-0"
                        style={{ color: accentHex }}
                        aria-hidden="true"
                      />
                      <span className="truncate">{mod}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 rounded-xl border border-[#292524] bg-[#0C0A09] p-4 flex flex-col justify-between">
                <div className="text-xs font-medium text-[#A8A29E] mb-2">
                  {project.heroMetric.label[lang]}
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums text-[#FAFAF9] mb-4">
                  {project.heroMetric.value}
                </div>
                <div className="space-y-2 border-t border-[#292524] pt-3">
                  {highlights.map((item, idx) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between gap-2 text-xs rounded-lg px-2.5 py-1.5 transition-colors ${
                        activeHighlightIdx === idx
                          ? 'bg-[#1C1917] text-[#FAFAF9]'
                          : 'text-[#A8A29E]'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      <span
                        className="font-mono font-medium tabular-nums shrink-0"
                        style={{ color: accentHex }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          )
        ) : (
          <div className="mx-auto max-w-[320px] rounded-3xl border border-[#292524] bg-[#1C1917] p-4 shadow-2xl">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[#292524]" aria-hidden="true" />
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#292524]">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold text-[#0C0A09] shrink-0"
                  style={{ backgroundColor: accentHex }}
                >
                  {project.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="font-display text-xs font-semibold text-[#FAFAF9] truncate">
                  {project.name}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#A8A29E]">4G · 90+</span>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-[11px] text-[#A8A29E]">{project.sector[lang]}</p>
              <h3 className="font-display text-base font-semibold text-[#FAFAF9] leading-snug">
                {project.previewTheme.desktopHeadline[lang]}
              </h3>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                {project.previewTheme.desktopSubline[lang]}
              </p>

              <div className="rounded-xl border border-[#292524] bg-[#0C0A09] p-3">
                <div className="text-[11px] text-[#A8A29E]">
                  {project.heroMetric.label[lang]}
                </div>
                <div className="font-mono text-xl font-semibold tabular-nums text-[#FAFAF9] mt-0.5">
                  {project.heroMetric.value}
                </div>
              </div>

              <div className="space-y-1.5">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-xs border-b border-[#292524] pb-1.5 last:border-b-0"
                  >
                    <span className="text-[#A8A29E] truncate">{item.label}</span>
                    <span
                      className="font-mono font-medium tabular-nums shrink-0"
                      style={{ color: accentHex }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#FAFAF9] py-2.5 text-xs font-semibold text-[#0C0A09] min-h-[44px]"
            >
              <span>{project.engine === 'saas' ? t.productDetail.openPlatform : t.caseDetail.visitLiveSite}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
