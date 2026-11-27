import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Shuffle,
} from 'lucide-react';
import { Language, ProjectItem } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { StatusBadge } from './StatusBadge';
import { ProjectThumbnail } from './VisualThumbnails';

interface FeaturedProductsCarouselProps {
  projects: ProjectItem[];
  lang: Language;
  onNavigate: (path: string) => void;
}

function shuffleItems<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getResponsiveVisibleCount(): number {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

export function FeaturedProductsCarousel({
  projects,
  lang,
  onNavigate,
}: FeaturedProductsCarouselProps) {
  const t = TRANSLATIONS[lang];
  const [deck, setDeck] = useState<ProjectItem[]>(() => shuffleItems(projects));
  const [visibleCount, setVisibleCount] = useState<number>(() =>
    getResponsiveVisibleCount()
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [isUserPaused, setIsUserPaused] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [isInteracting, setIsInteracting] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const total = deck.length;
  const effectiveVisibleCount = Math.min(visibleCount, Math.max(1, total));
  const extendedDeck =
    total > effectiveVisibleCount
      ? [...deck, ...deck.slice(0, effectiveVisibleCount)]
      : deck;

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getResponsiveVisibleCount());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const restoreTransitionNextFrame = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = window.requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
      });
    });
  }, []);

  const handleNext = useCallback(() => {
    if (total <= effectiveVisibleCount) return;
    setIsTransitionEnabled(true);
    setCurrentIndex((prev) => (prev >= total ? total : prev + 1));
  }, [total, effectiveVisibleCount]);

  const handlePrev = useCallback(() => {
    if (total <= effectiveVisibleCount) return;
    if (currentIndex === 0) {
      setIsTransitionEnabled(false);
      setCurrentIndex(total);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = window.requestAnimationFrame(() => {
          setIsTransitionEnabled(true);
          setCurrentIndex(total - 1);
        });
      });
      return;
    }
    setIsTransitionEnabled(true);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, [currentIndex, total, effectiveVisibleCount]);

  const handleShuffle = useCallback(() => {
    setIsTransitionEnabled(false);
    setDeck(shuffleItems(projects));
    setCurrentIndex(0);
    restoreTransitionNextFrame();
  }, [projects, restoreTransitionNextFrame]);

  const handleTrackTransitionEnd = (
    e: React.TransitionEvent<HTMLDivElement>
  ) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') {
      return;
    }
    if (currentIndex >= total && total > effectiveVisibleCount) {
      setIsTransitionEnabled(false);
      setCurrentIndex(0);
      // Keep currently visible cards steady while reshuffling the rest for the next random cycle
      setDeck((prev) => [
        ...prev.slice(0, effectiveVisibleCount),
        ...shuffleItems(prev.slice(effectiveVisibleCount)),
      ]);
      restoreTransitionNextFrame();
    }
  };

  useEffect(() => {
    if (isUserPaused || isInteracting || total <= effectiveVisibleCount) {
      return;
    }
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        handleNext();
      }
    }, 4200);
    return () => window.clearInterval(timer);
  }, [
    isUserPaused,
    isInteracting,
    total,
    effectiveVisibleCount,
    handleNext,
  ]);

  const activeDotIndex = total > 0 ? currentIndex % total : 0;

  return (
    <div
      className="space-y-6"
      role="region"
      aria-roledescription="carousel"
      aria-label={t.featuredSaas.sectionTitle}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocusCapture={() => setIsInteracting(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsInteracting(false);
        }
      }}
    >
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#141210] dark:text-[#FAFAF9]">
            {t.featuredSaas.sectionTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#57534E] dark:text-[#A8A29E]">
            {t.featuredSaas.sectionSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E2DC] bg-white dark:border-[#292524] dark:bg-[#1C1917] p-1">
            <button
              type="button"
              onClick={handlePrev}
              aria-label={t.featuredSaas.prevSlide}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#141210] hover:bg-[#F3F1EC] dark:text-[#FAFAF9] dark:hover:bg-[#292524] transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            <span className="px-2 font-mono text-xs tabular-nums text-[#57534E] dark:text-[#A8A29E] select-none">
              {String(activeDotIndex + 1).padStart(2, '0')} /{' '}
              {String(total).padStart(2, '0')}
            </span>

            <button
              type="button"
              onClick={handleNext}
              aria-label={t.featuredSaas.nextSlide}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#141210] hover:bg-[#F3F1EC] dark:text-[#FAFAF9] dark:hover:bg-[#292524] transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleShuffle}
            aria-label={t.featuredSaas.shuffleCards}
            title={t.featuredSaas.shuffleCards}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E2DC] bg-white text-[#141210] hover:border-[#0F766E] dark:border-[#292524] dark:bg-[#1C1917] px-3.5 py-2 text-xs font-medium dark:text-[#FAFAF9] dark:hover:border-[#2DD4BF] transition-colors cursor-pointer min-h-[40px] whitespace-nowrap"
          >
            <Shuffle className="h-3.5 w-3.5 text-[#0F766E] dark:text-[#2DD4BF]" aria-hidden="true" />
            <span>{t.featuredSaas.shuffleCards}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsUserPaused((prev) => !prev)}
            aria-label={
              isUserPaused
                ? t.featuredSaas.playAutoplay
                : t.featuredSaas.pauseAutoplay
            }
            title={
              isUserPaused
                ? t.featuredSaas.playAutoplay
                : t.featuredSaas.pauseAutoplay
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E2DC] bg-white text-[#57534E] hover:text-[#141210] hover:border-[#141210]/30 dark:border-[#292524] dark:bg-[#1C1917] dark:text-[#A8A29E] dark:hover:text-[#FAFAF9] dark:hover:border-[#FAFAF9]/30 transition-colors cursor-pointer shrink-0"
          >
            {isUserPaused ? (
              <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            ) : (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/prodotti')}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E2DC] bg-white text-[#0F766E] hover:border-[#0F766E] dark:border-[#292524] dark:bg-[#1C1917] px-4 py-2 text-xs font-semibold dark:text-[#2DD4BF] dark:hover:border-[#2DD4BF] whitespace-nowrap cursor-pointer min-h-[40px]"
          >
            <span>{t.featuredSaas.viewAll}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Sliding Viewport */}
      <div
        className="overflow-hidden py-2 -my-2"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
          touchStartY.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null || touchStartY.current === null) {
            return;
          }
          const deltaX = e.changedTouches[0].clientX - touchStartX.current;
          const deltaY = e.changedTouches[0].clientY - touchStartY.current;
          touchStartX.current = null;
          touchStartY.current = null;
          if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
              handleNext();
            } else {
              handlePrev();
            }
          }
        }}
      >
        <div className="-mx-3">
          <div
            onTransitionEnd={handleTrackTransitionEnd}
            className="flex will-change-transform"
            style={{
              transform: `translate3d(-${
                (currentIndex * 100) / effectiveVisibleCount
              }%, 0, 0)`,
              transitionProperty: 'transform',
              transitionDuration: isTransitionEnabled ? '520ms' : '0ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {extendedDeck.map((item, idx) => {
              const isSaas = item.engine === 'saas';
              const isAi = item.status === 'ai-division';
              const accentHex = isAi
                ? '#60A5FA'
                : isSaas
                ? '#2DD4BF'
                : '#FBBF24';
              const accentTextVar = isAi
                ? 'var(--kl-accent-ai)'
                : isSaas
                ? 'var(--kl-accent-saas)'
                : 'var(--kl-accent-agency)';
              const hoverBorderClass = isAi
                ? 'hover:border-[#1D4ED8]/50 dark:hover:border-[#60A5FA]/50'
                : isSaas
                ? 'hover:border-[#0F766E]/50 dark:hover:border-[#2DD4BF]/50'
                : 'hover:border-[#B45309]/50 dark:hover:border-[#FBBF24]/50';
              const detailPath = isSaas
                ? `/prodotti/${item.slug}`
                : `/lavori/${item.slug}`;
              const isClone = idx >= total;

              return (
                <div
                  key={`${item.slug}-${idx}`}
                  aria-hidden={isClone}
                  className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-3 flex"
                >
                  <article
                    className={`group w-full rounded-2xl border border-[#E5E2DC] bg-white dark:border-[#292524] dark:bg-[#1C1917] p-6 flex flex-col justify-between transition-all duration-300 ease-out ${hoverBorderClass} hover:-translate-y-1 hover:shadow-[0_18px_36px_-16px_rgba(20,18,16,0.16)] dark:hover:shadow-[0_20px_44px_-16px_rgba(0,0,0,0.75)]`}
                  >
                    <div>
                      <div className="mb-4">
                        <ProjectThumbnail project={item} lang={lang} />
                      </div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <StatusBadge status={item.status} lang={lang} />
                        <span className="font-mono text-xs text-[#57534E] dark:text-[#A8A29E] truncate">
                          {item.previewTheme.domainUrl}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl font-bold text-[#141210] dark:text-[#FAFAF9] tracking-tight">
                        <button
                          type="button"
                          tabIndex={isClone ? -1 : undefined}
                          onClick={() => onNavigate(detailPath)}
                          className="text-left hover:underline underline-offset-4 transition-colors cursor-pointer"
                        >
                          {item.name}
                        </button>
                      </h3>
                      <p className="mt-2 text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed line-clamp-3">
                        {item.tagline[lang]}
                      </p>

                      <div className="my-6 rounded-xl border border-[#E5E2DC] bg-[#F3F1EC] dark:border-[#292524] dark:bg-[#0C0A09] p-4 flex items-baseline justify-between gap-3">
                        <span
                          className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums shrink-0"
                          style={{ color: accentTextVar }}
                        >
                          {item.heroMetric.value}
                        </span>
                        <span className="text-xs text-[#57534E] dark:text-[#A8A29E] text-right">
                          {item.heroMetric.label[lang]}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E2DC] dark:border-[#292524]">
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isClone ? -1 : undefined}
                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity whitespace-nowrap min-h-[40px]"
                        style={{ backgroundColor: accentHex }}
                      >
                        <span>
                          {isSaas
                            ? t.featuredSaas.openPlatform
                            : t.filterSection.visitSite}
                        </span>
                      </a>
                      <button
                        type="button"
                        tabIndex={isClone ? -1 : undefined}
                        onClick={() => onNavigate(detailPath)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#141210] dark:text-[#FAFAF9] hover:underline underline-offset-4 cursor-pointer min-h-[40px] whitespace-nowrap"
                      >
                        <span>
                          {isSaas
                            ? t.featuredSaas.technicalSheet
                            : t.caseStudies.viewCaseStudy}
                        </span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Progress Indicators */}
      <div
        className="flex items-center justify-center gap-1.5 pt-1"
        role="tablist"
        aria-label={t.featuredSaas.carouselPagination}
      >
        {deck.map((item, idx) => {
          const isActive = idx === activeDotIndex;
          return (
            <button
              key={item.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${item.name} (${idx + 1}/${total})`}
              onClick={() => {
                setIsTransitionEnabled(true);
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-7 bg-[#0F766E] dark:bg-[#2DD4BF]'
                  : 'w-2 bg-[#D6D3CD] hover:bg-[#57534E]/60 dark:bg-[#292524] dark:hover:bg-[#A8A29E]/60'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
