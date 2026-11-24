import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  Briefcase,
  Calendar,
  Check,
  Globe,
  Layers,
  MapPin,
  Play,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Language,
  ProjectFilter,
  TicinoCitySlug,
} from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { PROJECTS } from '../data/projects';
import { CLIENT_LOGOS, SERVICES, TESTIMONIALS, TICINO_CITIES } from '../data/services';
import { ProjectCard } from '../components/ProjectCard';
import { StatusBadge } from '../components/StatusBadge';
import { DevicePreview } from '../components/DevicePreview';
import { ContactForm } from '../components/ContactForm';
import {
  ProjectThumbnail,
  ServiceCardKind,
  ServicePreviewThumbnail,
} from '../components/VisualThumbnails';
import { SitiTicinoAppsSection } from '../components/SitiTicinoAppsSection';
import { ProjectCardSkeleton } from '../components/ProjectCardSkeleton';
import { ServiceFaqSection } from '../components/ServiceFaqSection';
import { getHeroStudioStats } from '../utils/studioStats';

interface HomeViewProps {
  lang: Language;
  activeFilter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
  onNavigate: (path: string, city?: TicinoCitySlug) => void;
}

export function HomeView({
  lang,
  activeFilter,
  onFilterChange,
  onNavigate,
}: HomeViewProps) {
  const t = TRANSLATIONS[lang];
  const heroStats = getHeroStudioStats(lang);
  const [selectedCaseSlug, setSelectedCaseSlug] = useState<string>('reverse-editing');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridLoading, setIsGridLoading] = useState(false);
  const isFirstFilterRun = useRef(true);

  useEffect(() => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false;
      setIsGridLoading(true);
      const initialTimer = window.setTimeout(() => setIsGridLoading(false), 320);
      return () => window.clearTimeout(initialTimer);
    }
    setIsGridLoading(true);
    const filterTimer = window.setTimeout(() => setIsGridLoading(false), 220);
    return () => window.clearTimeout(filterTimer);
  }, [activeFilter, searchQuery]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProjects = PROJECTS.filter((p) => {
    const matchesEngine = activeFilter === 'all' || p.engine === activeFilter;
    if (!matchesEngine) return false;
    if (!normalizedQuery) return true;
    return (
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.sector[lang].toLowerCase().includes(normalizedQuery) ||
      p.shortDescription[lang].toLowerCase().includes(normalizedQuery)
    );
  });

  const featuredSaas = PROJECTS.filter(
    (p) => p.engine === 'saas' && p.featured
  );

  const showcaseCases = PROJECTS.filter((p) =>
    ['reverse-editing', 'speedyjob', 'il-vicolo-lugano', 'aurora-ai'].includes(
      p.slug
    )
  );
  const activeCase =
    showcaseCases.find((c) => c.slug === selectedCaseSlug) || showcaseCases[0];


  const heroTitleParts = t.hero.title.split('&');
  const heroTitleStart = heroTitleParts[0]?.trim() || 'Digital Venture Studio';
  const heroTitleAccent = heroTitleParts[1] ? `& ${heroTitleParts[1].trim()}` : '';

  const bentoPillars: {
    kind: ServiceCardKind;
    title: string;
    desc: string;
    path: string;
  }[] = [
    {
      kind: 'saas',
      title: t.dualEngine.saasTitle,
      desc: t.dualEngine.saasPoints[0],
      path: '/prodotti',
    },
    {
      kind: 'siti-web',
      title: SERVICES[0].shortTitle[lang],
      desc: SERVICES[0].subtitle[lang],
      path: '/servizi/siti-web',
    },
    {
      kind: 'seo-locale',
      title: SERVICES[2].shortTitle[lang],
      desc: SERVICES[2].subtitle[lang],
      path: '/servizi/seo-locale',
    },
    {
      kind: 'agenti-ai',
      title: SERVICES[3].shortTitle[lang],
      desc: SERVICES[3].subtitle[lang],
      path: '/servizi/agenti-ai-vocali',
    },
  ];

  const metricIcons = [Layers, Globe, Sparkles, TrendingUp];

  return (
    <div className="space-y-20 lg:space-y-24 pb-20">
      {/* BLOCK 1: ATMOSPHERIC HERO + FLOATING SEARCH/FILTER BAR */}
      <section className="pt-8 lg:pt-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-[#292524] bg-gradient-to-br from-[#1C1917] via-[#121110] to-[#0C0A09] p-6 sm:p-8 lg:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="inline-flex w-fit items-center rounded-full border border-[#292524] bg-[#0C0A09] px-3.5 py-1.5 text-xs font-medium text-[#2DD4BF] mb-5">
                  {t.hero.eyebrow}
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[50px] font-bold tracking-tight text-[#FAFAF9] leading-[1.06]">
                  <span>{heroTitleStart} </span>
                  {heroTitleAccent && (
                    <span className="bg-gradient-to-r from-[#2DD4BF] to-[#FBBF24] bg-clip-text text-transparent">
                      {heroTitleAccent}
                    </span>
                  )}
                </h1>

                <p className="mt-5 text-base sm:text-lg text-[#A8A29E] leading-relaxed max-w-xl">
                  {t.hero.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <a
                    href="https://cal.com/kreativalab/call-20-minuti"
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 rounded-full bg-[#2DD4BF] px-5 py-3 text-sm font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity cursor-pointer min-h-[44px] whitespace-nowrap shadow-lg"
                  >
                    <span>{t.hero.ctaPrimary}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>

                  <a
                    href={lang === 'it' ? '/contatti' : `/contatti?lang=${lang}`}
                    onClick={(e) => {
                      if (
                        e.metaKey ||
                        e.ctrlKey ||
                        e.shiftKey ||
                        e.altKey ||
                        e.button !== 0
                      ) {
                        return;
                      }
                      e.preventDefault();
                      onNavigate('/contatti');
                    }}
                    className="inline-flex items-center gap-2.5 rounded-full border border-[#292524] bg-[#0C0A09] pr-5 pl-2.5 py-2 text-sm font-medium text-[#FAFAF9] hover:border-[#FBBF24] transition-colors cursor-pointer min-h-[44px] whitespace-nowrap"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FBBF24]/15 text-[#FBBF24]">
                      <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                    </span>
                    <span>{t.hero.ctaSecondary}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="relative h-full min-h-[260px] sm:min-h-[340px] lg:min-h-[400px] w-full overflow-hidden rounded-2xl border border-[#292524] bg-[#0C0A09] shadow-2xl">
                  <picture>
                    <source srcSet="/assets/aistudio/hero-ecosystem.webp" type="image/webp" />
                    <img
                      src="/assets/aistudio/AI_marketing_network_UI_illustra__8cfdf428_b55f773d.jpg"
                      alt={t.seoUi.heroImageAlt}
                      width={1376}
                      height={768}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="h-full w-full object-cover object-[48%_56%] scale-[1.15] select-none"
                    />
                  </picture>

                  {/* Edge-blending vignette to integrate cleanly with dark charcoal surface and trim baked screenshot borders */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(12, 10, 9, 0.55) 0%, transparent 18%, transparent 74%, rgba(12, 10, 9, 0.92) 100%), linear-gradient(90deg, rgba(12, 10, 9, 0.65) 0%, transparent 16%, transparent 88%, rgba(12, 10, 9, 0.6) 100%)',
                    }}
                    aria-hidden="true"
                  />

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#292524] bg-[#0C0A09]/85 px-4 py-2.5 backdrop-blur-md">
                    <div className="flex items-center gap-2.5 text-xs">
                      <span className="h-2 w-2 rounded-full bg-[#22C55E]" aria-hidden="true" />
                      <span className="font-medium text-[#FAFAF9]">kreativalab</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#A8A29E]">
                      6 SaaS · 10 Client Works · 4 Lingue
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data-Driven Hero Credibility Stats Bar */}
            <div
              aria-label="kreativalab Metrics"
              className="mt-7 pt-6 border-t border-[#292524]/80 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
            >
              <div className="rounded-2xl border border-[#292524] bg-[#0C0A09]/75 px-4 py-3.5 flex items-center gap-3.5 transition-colors hover:border-[#2DD4BF]/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#2DD4BF] shrink-0">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl sm:text-[26px] font-bold tabular-nums text-[#FAFAF9] leading-none">
                      {heroStats.activeSaasUsersFormatted}
                    </span>
                    <span className="text-xs font-semibold text-[#2DD4BF] truncate">
                      {t.hero.statsBar.activeUsersLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#A8A29E] truncate">
                    {t.hero.statsBar.activeUsersSub.replace(
                      '{count}',
                      String(heroStats.activeSaasPlatformsCount)
                    )}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#292524] bg-[#0C0A09]/75 px-4 py-3.5 flex items-center gap-3.5 transition-colors hover:border-[#FBBF24]/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FBBF24]/25 bg-[#FBBF24]/10 text-[#FBBF24] shrink-0">
                  <Briefcase className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl sm:text-[26px] font-bold tabular-nums text-[#FAFAF9] leading-none">
                      {heroStats.projectsDeliveredFormatted}
                    </span>
                    <span className="text-xs font-semibold text-[#FBBF24] truncate">
                      {t.hero.statsBar.projectsDeliveredLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#A8A29E] truncate">
                    {t.hero.statsBar.projectsDeliveredSub}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#292524] bg-[#0C0A09]/75 px-4 py-3.5 flex items-center gap-3.5 transition-colors hover:border-[#60A5FA]/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#60A5FA]/25 bg-[#60A5FA]/10 text-[#60A5FA] shrink-0">
                  <Award className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl sm:text-[26px] font-bold tabular-nums text-[#FAFAF9] leading-none">
                      {heroStats.yearsOfExperienceFormatted}
                    </span>
                    <span className="text-xs font-semibold text-[#60A5FA] truncate">
                      {t.hero.statsBar.yearsExperienceLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#A8A29E] truncate">
                    {t.hero.statsBar.yearsExperienceSub}
                  </p>
                </div>
              </div>
            </div>

            {/* Bridging Floating Search & Instant Filter Bar */}
            <div className="mt-8 lg:-mb-18 relative z-20 mx-auto max-w-3xl">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl sm:rounded-full bg-[#FAFAF9] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
                <div className="flex flex-1 items-center gap-2.5 px-3">
                  <Search className="h-4 w-4 text-stone-500 shrink-0" aria-hidden="true" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const target = document.getElementById('progetti-ecosistema');
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    placeholder="Swiss Lead Finder, SpeedyJob, PixaSolar, AI..."
                    aria-label={t.filterSection.sectionTitle}
                    className="w-full bg-transparent py-2 text-sm text-[#0C0A09] placeholder:text-stone-500 focus:outline-none"
                  />
                </div>

                <div className="flex w-full sm:w-auto items-center gap-1 rounded-xl sm:rounded-full bg-[#1C1917] p-1 overflow-x-auto">
                  {(
                    [
                      { key: 'all', label: t.filterSection.all },
                      { key: 'saas', label: t.filterSection.saas },
                      { key: 'agency', label: t.filterSection.agency },
                    ] as const
                  ).map((item) => {
                    const active = activeFilter === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          onFilterChange(item.key);
                          const target = document.getElementById('progetti-ecosistema');
                          if (target) target.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`flex-1 sm:flex-initial text-center rounded-lg sm:rounded-full px-2.5 sm:px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer min-h-[38px] ${
                          active
                            ? item.key === 'agency'
                              ? 'bg-[#FBBF24] text-[#0C0A09]'
                              : 'bg-[#2DD4BF] text-[#0C0A09]'
                            : 'text-[#A8A29E] hover:text-[#FAFAF9]'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 2 & 6 PREVIEW: "COSA FACCIAMO" 4-CARD BENTO + DOPPIO MOTORE */}
      <section className="pt-4 lg:pt-8">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-medium tracking-wider text-[#2DD4BF] uppercase mb-2">
                {t.dualEngine.saasTag} &amp; {t.dualEngine.agencyTag}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#FAFAF9]">
                {t.dualEngine.sectionTitle}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-xl">
              <p className="text-sm text-[#A8A29E] leading-relaxed">
                {t.dualEngine.sectionSubtitle}
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/servizi')}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#292524] bg-[#1C1917] px-4 py-2 text-xs font-semibold text-[#FAFAF9] hover:border-[#FBBF24] whitespace-nowrap shrink-0 cursor-pointer min-h-[38px]"
              >
                <span>{t.nav.services}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* 4 Service Cards with Interactive Miniature Website Previews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bentoPillars.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => onNavigate(card.path)}
                className="group glass-panel rounded-2xl p-5 text-left flex flex-col justify-between hover:border-[#2DD4BF]/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-full">
                  <ServicePreviewThumbnail kind={card.kind} title={card.title} />
                  <h3 className="font-display text-lg font-semibold text-[#FAFAF9] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed line-clamp-3">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-5 flex justify-end">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#292524] bg-[#0C0A09] text-[#FAFAF9] group-hover:bg-[#FAFAF9] group-hover:text-[#0C0A09] transition-colors">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Dual-Engine Split (SaaS Teal vs Agency Gold) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-6 rounded-2xl border border-[#2DD4BF]/30 bg-[#1C1917] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2DD4BF] mb-2">
                  <Layers className="h-4 w-4" aria-hidden="true" />
                  <span>{t.dualEngine.saasTag}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-[#FAFAF9] mb-2">
                  {t.dualEngine.saasTitle}
                </h3>
                <p className="text-sm text-[#A8A29E] leading-relaxed mb-5">
                  {t.dualEngine.saasDescription}
                </p>
                <ul className="space-y-2.5 mb-6">
                  {t.dualEngine.saasPoints.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-xs sm:text-sm text-[#FAFAF9]">
                      <Check className="h-4 w-4 text-[#2DD4BF] mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/prodotti')}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[#2DD4BF]/50 bg-[#2DD4BF]/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#2DD4BF] hover:bg-[#2DD4BF]/20 transition-colors cursor-pointer min-h-[42px]"
              >
                <span>{t.dualEngine.saasCta}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="lg:col-span-6 rounded-2xl border border-[#FBBF24]/30 bg-[#1C1917] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FBBF24] mb-2">
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  <span>{t.dualEngine.agencyTag}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-[#FAFAF9] mb-2">
                  {t.dualEngine.agencyTitle}
                </h3>
                <p className="text-sm text-[#A8A29E] leading-relaxed mb-5">
                  {t.dualEngine.agencyDescription}
                </p>
                <ul className="space-y-2.5 mb-6">
                  {t.dualEngine.agencyPoints.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-xs sm:text-sm text-[#FAFAF9]">
                      <Check className="h-4 w-4 text-[#FBBF24] mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/lavori')}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FBBF24]/50 bg-[#FBBF24]/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#FBBF24] hover:bg-[#FBBF24]/20 transition-colors cursor-pointer min-h-[42px]"
              >
                <span>{t.dualEngine.agencyCta}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* 4-METRIC GLASS RIBBON */}
          <div className="glass-panel-warm rounded-2xl p-5 sm:p-7">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {t.hero.metrics.map((m, idx) => {
                const MIcon = metricIcons[idx % metricIcons.length];
                const iconTint = idx % 2 === 0 ? 'text-[#2DD4BF]' : 'text-[#FBBF24]';
                return (
                  <div key={m.label} className="flex items-center gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#292524] bg-[#0C0A09] ${iconTint} shrink-0`}>
                      <MIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-[#FAFAF9] leading-none">
                        {m.value}
                      </div>
                      <div className="mt-1 text-xs text-[#A8A29E]">
                        {m.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PROGETTI / APP SITITICINO.CH */}
      <section>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <SitiTicinoAppsSection lang={lang} />
        </div>
      </section>

      {/* BLOCK 3: FILTRO PROGETTI */}
      <section id="progetti-ecosistema">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-xl">
              <p className="text-xs font-medium uppercase tracking-wider text-[#FBBF24] mb-1.5">
                Portfolio &amp; Venture Studio
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#FAFAF9]">
                {t.filterSection.sectionTitle}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#A8A29E]">
                {t.filterSection.sectionSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                className="inline-flex max-w-full overflow-x-auto items-center rounded-full border border-[#292524] bg-[#1C1917] p-1"
                role="tablist"
                aria-label={t.filterSection.sectionTitle}
              >
                {(
                  [
                    { key: 'all', label: t.filterSection.all },
                    { key: 'saas', label: t.filterSection.saas },
                    { key: 'agency', label: t.filterSection.agency },
                  ] as const
                ).map((tab) => {
                  const isActive = activeFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => onFilterChange(tab.key)}
                      className={`rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] ${
                        isActive
                          ? tab.key === 'agency'
                            ? 'bg-[#FBBF24] text-[#0C0A09] font-semibold'
                            : 'bg-[#2DD4BF] text-[#0C0A09] font-semibold'
                          : 'text-[#A8A29E] hover:text-[#FAFAF9]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <span className="font-mono text-xs text-[#A8A29E] tabular-nums">
                {filteredProjects.length} {t.filterSection.countLabel}
              </span>
            </div>
          </div>

          {isGridLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              aria-busy="true"
              aria-live="polite"
            >
              {Array.from({
                length: Math.max(3, Math.min(6, filteredProjects.length || 3)),
              }).map((_, idx) => (
                <ProjectCardSkeleton
                  key={idx}
                  accent={activeFilter === 'agency' ? 'agency' : activeFilter === 'saas' ? 'saas' : idx % 2 === 0 ? 'saas' : 'agency'}
                />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-[#292524] bg-[#1C1917] p-10 text-center space-y-3">
              <p className="text-base text-[#FAFAF9]">
                Nessun progetto corrisponde a “{searchQuery}”.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onFilterChange('all');
                }}
                className="rounded-full bg-[#2DD4BF] px-5 py-2 text-xs font-semibold text-[#0C0A09] cursor-pointer"
              >
                Ripristina filtri
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  lang={lang}
                  onNavigate={(p) => onNavigate(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BLOCK 4: PRODOTTI SAAS IN EVIDENZA */}
      <section>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAF9]">
                {t.featuredSaas.sectionTitle}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#A8A29E]">
                {t.featuredSaas.sectionSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/prodotti')}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#292524] bg-[#1C1917] px-4 py-2 text-xs font-semibold text-[#2DD4BF] hover:border-[#2DD4BF] whitespace-nowrap cursor-pointer min-h-[38px]"
            >
              <span>{t.featuredSaas.viewAll}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredSaas.map((saas) => (
              <div
                key={saas.slug}
                className="group rounded-2xl border border-[#292524] bg-[#1C1917] p-6 flex flex-col justify-between transition-all duration-300 ease-out hover:border-[#2DD4BF]/50 hover:-translate-y-1 hover:shadow-[0_20px_44px_-16px_rgba(0,0,0,0.75)]"
              >
                <div>
                  <div className="mb-4">
                    <ProjectThumbnail project={saas} lang={lang} />
                  </div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <StatusBadge status={saas.status} lang={lang} />
                    <span className="font-mono text-xs text-[#A8A29E]">
                      {saas.previewTheme.domainUrl}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#FAFAF9] tracking-tight">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/prodotti/${saas.slug}`)}
                      className="text-left hover:text-[#2DD4BF] transition-colors cursor-pointer"
                    >
                      {saas.name}
                    </button>
                  </h3>
                  <p className="mt-2 text-sm text-[#A8A29E] leading-relaxed">
                    {saas.tagline[lang]}
                  </p>

                  <div className="my-6 rounded-xl border border-[#292524] bg-[#0C0A09] p-4 flex items-baseline justify-between gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums text-[#2DD4BF]">
                      {saas.heroMetric.value}
                    </span>
                    <span className="text-xs text-[#A8A29E] text-right">
                      {saas.heroMetric.label[lang]}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#292524]">
                  <a
                    href={saas.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#2DD4BF] px-4 py-2 text-xs font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity whitespace-nowrap min-h-[40px]"
                  >
                    <span>{t.featuredSaas.openPlatform}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/prodotti/${saas.slug}`)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#FAFAF9] hover:text-[#2DD4BF] cursor-pointer min-h-[40px]"
                  >
                    <span>{t.featuredSaas.technicalSheet}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 5: CASI STUDIO */}
      <section>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAF9]">
                {t.caseStudies.sectionTitle}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#A8A29E]">
                {t.caseStudies.sectionSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/lavori')}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#292524] bg-[#1C1917] px-4 py-2 text-xs font-semibold text-[#FBBF24] hover:border-[#FBBF24] whitespace-nowrap cursor-pointer min-h-[38px]"
            >
              <span>{t.caseStudies.viewAllWorks}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            {showcaseCases.map((item) => {
              const selected = item.slug === activeCase.slug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setSelectedCaseSlug(item.slug)}
                  className={`rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap min-h-[40px] ${
                    selected
                      ? 'border-[#FBBF24] bg-[#FBBF24] text-[#0C0A09] font-semibold'
                      : 'border-[#292524] bg-[#1C1917] text-[#A8A29E] hover:text-[#FAFAF9]'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 rounded-2xl border border-[#292524] bg-[#1C1917] p-6 sm:p-7 space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-[#A8A29E]">{activeCase.sector[lang]}</p>
                  <h3 className="font-display text-2xl font-bold text-[#FAFAF9] mt-0.5">
                    {activeCase.name}
                  </h3>
                </div>
                <StatusBadge status={activeCase.status} lang={lang} />
              </div>

              <div className="space-y-4">
                <div className="border-t border-[#292524] pt-4">
                  <div className="text-xs font-semibold text-[#FB923C] mb-1">
                    01. {t.caseStudies.challengeLabel}
                  </div>
                  <p className="text-sm text-[#A8A29E] leading-relaxed">
                    {activeCase.problemOrChallenge[lang]}
                  </p>
                </div>

                <div className="border-t border-[#292524] pt-4">
                  <div className="text-xs font-semibold text-[#FBBF24] mb-1">
                    02. {t.caseStudies.solutionLabel}
                  </div>
                  <p className="text-sm text-[#A8A29E] leading-relaxed">
                    {activeCase.solution[lang]}
                  </p>
                </div>

                <div className="border-t border-[#292524] pt-4">
                  <div className="text-xs font-semibold text-[#22C55E] mb-1">
                    03. {t.caseStudies.resultLabel}
                  </div>
                  <p className="text-sm text-[#FAFAF9] leading-relaxed">
                    {activeCase.results[lang]}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate(`/lavori/${activeCase.slug}`)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FBBF24] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity cursor-pointer min-h-[42px]"
                >
                  <span>{t.caseStudies.viewCaseStudy}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <a
                  href={activeCase.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#A8A29E] hover:text-[#FAFAF9]"
                >
                  <span>{t.caseDetail.visitLiveSite}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <DevicePreview project={activeCase} lang={lang} />
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 7: PROVA SOCIALE TICINO */}
      <section>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAF9]">
                {t.socialProof.sectionTitle}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#A8A29E]">
                {t.socialProof.sectionSubtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigate('/servizi/agenti-ai-ristoranti')}
                className="rounded-full border border-[#60A5FA]/35 bg-[#60A5FA]/10 px-4 py-2 text-xs font-medium text-[#60A5FA] hover:bg-[#60A5FA]/20 cursor-pointer"
              >
                {t.servicesSection.aiRestaurantsCta}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/servizi/agenti-ai-parrucchieri')}
                className="rounded-full border border-[#60A5FA]/35 bg-[#60A5FA]/10 px-4 py-2 text-xs font-medium text-[#60A5FA] hover:bg-[#60A5FA]/20 cursor-pointer"
              >
                {t.servicesSection.aiSalonsCta}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CLIENT_LOGOS.map((brand) => (
              <div
                key={brand}
                className="rounded-xl border border-[#292524] bg-[#1C1917] px-3 py-3 text-center text-xs font-display font-semibold text-[#FAFAF9]"
              >
                {brand}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((rev) => (
              <blockquote
                key={rev.id}
                className="rounded-2xl border border-[#292524] bg-[#1C1917] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1 text-[#FBBF24]" aria-label="5/5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-current"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <span className="font-mono text-xs text-[#A8A29E]">
                      Google · {rev.city}
                    </span>
                  </div>
                  <p className="text-sm text-[#FAFAF9] leading-relaxed">
                    “{rev.quote[lang]}”
                  </p>
                </div>

                <footer className="mt-5 pt-4 border-t border-[#292524]">
                  <div className="text-sm font-semibold text-[#FAFAF9]">
                    {rev.authorName}
                  </div>
                  <div className="text-xs text-[#A8A29E]">
                    {rev.role[lang]} · {rev.company}
                  </div>
                  <div className="mt-2 font-mono text-xs text-[#2DD4BF]">
                    {rev.outcome[lang]}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TICINO_CITIES.map((city) => (
              <button
                key={city.slug}
                type="button"
                onClick={() => onNavigate(`/servizi/${city.slug}`)}
                className="group rounded-2xl border border-[#292524] bg-[#1C1917] p-5 text-left hover:border-[#2DD4BF]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 font-display text-lg font-semibold text-[#FAFAF9]">
                    <MapPin className="h-4 w-4 text-[#2DD4BF]" aria-hidden="true" />
                    {city.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#A8A29E] group-hover:text-[#2DD4BF] transition-colors" aria-hidden="true" />
                </div>
                <p className="text-xs text-[#A8A29E] mb-3">
                  {city.regionLabel[lang]}
                </p>
                <div className="font-mono text-xs text-[#FAFAF9] tabular-nums">
                  {city.stats.businessesServed} · {city.primaryKeyword}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 7B: FAQ INTERATTIVE PER CATEGORIA DI SERVIZIO */}
      <ServiceFaqSection
        lang={lang}
        onNavigate={(p) => onNavigate(p)}
      />

      {/* BLOCK 8: CONTATTO RAPIDO */}
      <section id="contatto-rapido">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="glass-panel-warm rounded-3xl p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#FBBF24] mb-2">
                    kreativalab · Lugano
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#FAFAF9]">
                    {t.quickContact.sectionTitle}
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-[#A8A29E] leading-relaxed">
                    {t.quickContact.sectionSubtitle}
                  </p>
                </div>


                <div className="rounded-2xl border border-[#292524] bg-[#0C0A09] p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-[#FBBF24] mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="font-display text-sm font-semibold text-[#FAFAF9]">
                        {t.quickContact.bookCallTitle}
                      </h3>
                      <p className="text-xs text-[#A8A29E]">
                        {t.quickContact.bookCallSub}
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://cal.com/kreativalab/call-20-minuti"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-full border border-[#FBBF24]/50 bg-[#FBBF24]/10 py-2.5 text-center text-xs font-semibold leading-[26px] text-[#FBBF24] hover:bg-[#FBBF24]/20 transition-colors min-h-[42px]"
                  >
                    {lang === 'de'
                      ? 'Termin im Kalender wählen'
                      : lang === 'fr'
                      ? 'Choisir un créneau'
                      : lang === 'en'
                      ? 'Pick a time slot'
                      : 'Scegli giorno e orario'}
                  </a>

                  <p className="text-xs text-[#A8A29E]">
                    {t.quickContact.responseTime}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <ContactForm
                  lang={lang}
                  onOpenPrivacy={() => onNavigate('/privacy')}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}