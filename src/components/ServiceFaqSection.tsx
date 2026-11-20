import { useMemo, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Language, ServiceItem } from '../types/showcase';
import { SERVICES } from '../data/services';
import { TRANSLATIONS } from '../data/translations';

interface ServiceFaqSectionProps {
  lang: Language;
  onNavigate: (path: string) => void;
}

type FaqCategorySelection = 'all' | string;

function getAccentHex(accentType: ServiceItem['accentType']): string {
  if (accentType === 'saas') return '#2DD4BF';
  if (accentType === 'ai') return '#60A5FA';
  return '#FBBF24';
}

export function ServiceFaqSection({ lang, onNavigate }: ServiceFaqSectionProps) {
  const t = TRANSLATIONS[lang];
  const [selectedSlug, setSelectedSlug] = useState<FaqCategorySelection>(
    SERVICES[0]?.slug ?? 'all'
  );
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>(() => {
    const firstSlug = SERVICES[0]?.slug;
    return firstSlug ? { [`${firstSlug}:0`]: true } : {};
  });

  const visibleServices = useMemo(() => {
    if (selectedSlug === 'all') return SERVICES;
    return SERVICES.filter((srv) => srv.slug === selectedSlug);
  }, [selectedSlug]);

  const activeSingleService = useMemo(() => {
    if (selectedSlug === 'all') return null;
    return SERVICES.find((srv) => srv.slug === selectedSlug) ?? null;
  }, [selectedSlug]);

  const visibleQuestionKeys = useMemo(() => {
    const keys: string[] = [];
    for (const srv of visibleServices) {
      srv.faqs.forEach((_, idx) => {
        keys.push(`${srv.slug}:${idx}`);
      });
    }
    return keys;
  }, [visibleServices]);

  const allVisibleOpen =
    visibleQuestionKeys.length > 0 &&
    visibleQuestionKeys.every((key) => Boolean(openKeys[key]));

  const handleSelectCategory = (slug: FaqCategorySelection) => {
    setSelectedSlug(slug);
    if (slug !== 'all') {
      const hasAnyOpen = SERVICES.find((s) => s.slug === slug)?.faqs.some(
        (_, idx) => Boolean(openKeys[`${slug}:${idx}`])
      );
      if (!hasAnyOpen) {
        setOpenKeys((prev) => ({ ...prev, [`${slug}:0`]: true }));
      }
    }
  };

  const handleToggleFaq = (key: string) => {
    setOpenKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleAllVisible = () => {
    const nextState = !allVisibleOpen;
    setOpenKeys((prev) => {
      const updated = { ...prev };
      for (const key of visibleQuestionKeys) {
        updated[key] = nextState;
      }
      return updated;
    });
  };

  const scrollToQuickContact = () => {
    const target = document.getElementById('contatto-rapido');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('/contatti');
    }
  };

  const totalFaqCount = useMemo(
    () => SERVICES.reduce((sum, srv) => sum + srv.faqs.length, 0),
    []
  );

  return (
    <section id="faq-servizi" aria-labelledby="home-faq-heading">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-[#2DD4BF] mb-2">
              {t.homeFaq.eyebrow}
            </p>
            <h2
              id="home-faq-heading"
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAF9] text-balance"
            >
              {t.homeFaq.sectionTitle}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#A8A29E] leading-relaxed">
              {t.homeFaq.sectionSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleAllVisible}
            className="inline-flex items-center justify-center rounded-full border border-[#292524] bg-[#1C1917] px-4 py-2 text-xs font-semibold text-[#FAFAF9] hover:border-[#2DD4BF] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
          >
            {allVisibleOpen ? t.homeFaq.collapseAll : t.homeFaq.expandAll}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Service Category Selector */}
          <div
            className="lg:col-span-4 space-y-2"
            role="tablist"
            aria-label={t.homeFaq.eyebrow}
          >
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {SERVICES.map((srv, idx) => {
                const isSelected = selectedSlug === srv.slug;
                const accent = getAccentHex(srv.accentType);
                const indexLabel = String(idx + 1).padStart(2, '0');

                return (
                  <button
                    key={srv.slug}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectCategory(srv.slug)}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors cursor-pointer min-h-[44px] whitespace-nowrap lg:whitespace-normal shrink-0 lg:w-full ${
                      isSelected
                        ? 'bg-[#1C1917] text-[#FAFAF9]'
                        : 'border-[#292524] bg-[#0C0A09] text-[#A8A29E] hover:text-[#FAFAF9] hover:border-[#292524]/80'
                    }`}
                    style={
                      isSelected
                        ? { borderColor: `${accent}88` }
                        : undefined
                    }
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span
                        className="font-mono text-xs tabular-nums shrink-0"
                        style={{ color: isSelected ? accent : '#A8A29E' }}
                      >
                        {indexLabel}.
                      </span>
                      <span className="text-sm font-medium truncate">
                        {srv.shortTitle[lang]}
                      </span>
                    </span>
                    <span className="font-mono text-xs tabular-nums text-[#A8A29E] shrink-0">
                      {srv.faqs.length}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                role="tab"
                aria-selected={selectedSlug === 'all'}
                onClick={() => handleSelectCategory('all')}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors cursor-pointer min-h-[44px] whitespace-nowrap lg:whitespace-normal shrink-0 lg:w-full ${
                  selectedSlug === 'all'
                    ? 'border-[#2DD4BF]/60 bg-[#1C1917] text-[#FAFAF9]'
                    : 'border-[#292524] bg-[#0C0A09] text-[#A8A29E] hover:text-[#FAFAF9]'
                }`}
              >
                <span className="text-sm font-medium">
                  {t.homeFaq.allCategories}
                </span>
                <span className="font-mono text-xs tabular-nums text-[#A8A29E] shrink-0">
                  {totalFaqCount}
                </span>
              </button>
            </div>

            {activeSingleService && (
              <div className="hidden lg:block pt-3 space-y-3 border-t border-[#292524]">
                <p className="text-xs text-[#A8A29E] leading-relaxed">
                  {activeSingleService.subtitle[lang]}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate(`/servizi/${activeSingleService.slug}`)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline cursor-pointer min-h-[40px]"
                  style={{ color: getAccentHex(activeSingleService.accentType) }}
                >
                  <span>
                    {t.homeFaq.exploreServiceCta}: {activeSingleService.shortTitle[lang]}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* Expandable Questions Panel */}
          <div className="lg:col-span-8 rounded-2xl border border-[#292524] bg-[#1C1917] p-6 sm:p-8 space-y-6">
            {visibleServices.map((srv, serviceIdx) => {
              const accent = getAccentHex(srv.accentType);
              return (
                <div
                  key={srv.slug}
                  className={serviceIdx > 0 ? 'pt-6 border-t border-[#292524]' : ''}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-baseline gap-2 text-xs text-[#A8A29E]">
                      <h3
                        className="font-display text-base sm:text-lg font-semibold"
                        style={{ color: '#FAFAF9' }}
                      >
                        {srv.title[lang]}
                      </h3>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums" style={{ color: accent }}>
                        {srv.faqs.length} {t.homeFaq.questionsLabel}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate(`/servizi/${srv.slug}`)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#A8A29E] hover:text-[#FAFAF9] cursor-pointer whitespace-nowrap"
                    >
                      <span>{t.homeFaq.exploreServiceCta}</span>
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="divide-y divide-[#292524]">
                    {srv.faqs.map((faq, faqIdx) => {
                      const itemKey = `${srv.slug}:${faqIdx}`;
                      const isOpen = Boolean(openKeys[itemKey]);
                      const triggerId = `home-faq-trigger-${srv.slug}-${faqIdx}`;
                      const panelId = `home-faq-panel-${srv.slug}-${faqIdx}`;

                      return (
                        <div key={itemKey} className="py-4 first:pt-2 last:pb-1">
                          <button
                            id={triggerId}
                            type="button"
                            onClick={() => handleToggleFaq(itemKey)}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            className="flex w-full items-center justify-between gap-4 text-left font-medium text-[#FAFAF9] hover:text-white cursor-pointer min-h-[44px]"
                          >
                            <span className="text-sm sm:text-base leading-snug">
                              {faq.question[lang]}
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                              style={{ color: isOpen ? accent : '#A8A29E' }}
                              aria-hidden="true"
                            />
                          </button>

                          <div
                            id={panelId}
                            role="region"
                            aria-labelledby={triggerId}
                            className={`grid transition-[grid-template-rows,opacity] duration-200 ${
                              isOpen
                                ? 'grid-rows-[1fr] opacity-100 mt-2'
                                : 'grid-rows-[0fr] opacity-0'
                            }`}
                            aria-hidden={!isOpen}
                          >
                            <div className="overflow-hidden">
                              <p className="text-sm text-[#A8A29E] leading-relaxed pr-6">
                                {faq.answer[lang]}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="pt-5 border-t border-[#292524] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-[#A8A29E]">
                {t.homeFaq.contactBridgeText}
              </p>
              <button
                type="button"
                onClick={scrollToQuickContact}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[#2DD4BF] px-4 py-2 text-xs font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
              >
                <span>{t.homeFaq.contactBridgeCta}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
