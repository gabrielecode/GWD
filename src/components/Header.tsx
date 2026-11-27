import { useState, useRef, useEffect, MouseEvent } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Globe,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { Language } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentPath: string;
  lang: Language;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (path: string) => void;
  onChangeLang: (lang: Language) => void;
}

const LANGUAGE_OPTIONS: Array<{ code: Language; label: string }> = [
  { code: 'it', label: 'Italiano' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
];

const AGENT_MENU_LABELS: Record<
  Language,
  {
    portalDesc: string;
    adminDesc: string;
    payoutsTitle: string;
    payoutsDesc: string;
  }
> = {
  it: {
    portalDesc: 'Dashboard partner, link referral e lead',
    adminDesc: 'Gestione agenti, candidature e team',
    payoutsTitle: 'Payout & Provvigioni',
    payoutsDesc: 'Estratti conto e liquidazioni mensili',
  },
  de: {
    portalDesc: 'Partner-Dashboard, Referral-Links & Leads',
    adminDesc: 'Agenten, Bewerbungen & Team verwalten',
    payoutsTitle: 'Auszahlungen & Provisionen',
    payoutsDesc: 'Monatliche Abrechnungen & Auszahlungen',
  },
  fr: {
    portalDesc: 'Portail partenaire, liens referral et leads',
    adminDesc: 'Gestion des agents, candidatures et équipe',
    payoutsTitle: 'Paiements & Commissions',
    payoutsDesc: 'Relevés mensuels et versements',
  },
  en: {
    portalDesc: 'Partner dashboard, referral links & leads',
    adminDesc: 'Manage agents, applications & team',
    payoutsTitle: 'Payouts & Commissions',
    payoutsDesc: 'Monthly statements & settlements',
  },
};

export function Header({
  currentPath,
  lang,
  theme,
  onToggleTheme,
  onNavigate,
  onChangeLang,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [agentMenuOpen, setAgentMenuOpen] = useState(false);
  const [mobileAgentOpen, setMobileAgentOpen] = useState(false);

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const agentDropdownRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[lang];
  const agentLabels = AGENT_MENU_LABELS[lang];
  const isDark = theme === 'dark';
  const themeLabel = isDark ? t.nav.themeLight : t.nav.themeDark;

  const primaryNavItems = [
    { label: t.nav.products, path: '/prodotti' },
    { label: t.nav.works, path: '/lavori' },
    { label: t.nav.services, path: '/servizi' },
    { label: t.nav.about, path: '/chi-siamo' },
    { label: t.nav.contact, path: '/contatti' },
  ];

  const agentSubItems = [
    {
      label: t.nav.affiliatePortal,
      description: agentLabels.portalDesc,
      path: '/affiliate',
      icon: Users,
    },
    {
      label: t.nav.adminConsole,
      description: agentLabels.adminDesc,
      path: '/admin/affiliates',
      icon: ShieldCheck,
    },
    {
      label: agentLabels.payoutsTitle,
      description: agentLabels.payoutsDesc,
      path: '/admin/payouts',
      icon: Wallet,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;
      if (langDropdownRef.current && !langDropdownRef.current.contains(target)) {
        setLangMenuOpen(false);
      }
      if (agentDropdownRef.current && !agentDropdownRef.current.contains(target)) {
        setAgentMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLangMenuOpen(false);
        setAgentMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getHref = (path: string) =>
    lang === 'it' ? path : `${path}?lang=${lang}`;

  const isRouteActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const isAgentSectionActive =
    isRouteActive('/affiliate') ||
    isRouteActive('/admin/affiliates') ||
    isRouteActive('/admin/payouts');

  const handleLinkClick = (
    e: MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      setMobileMenuOpen(false);
      setAgentMenuOpen(false);
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    setAgentMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-[#E5E2DC] bg-[#F8F7F4]/88 dark:border-[#292524] dark:bg-[#0C0A09]/85 backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto flex h-14 lg:h-16 max-w-[1280px] items-center justify-between gap-4 lg:gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href={getHref('/')}
          onClick={(e) => handleLinkClick(e, '/')}
          aria-label="kreativalab — Home"
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer"
        >
          <img
            src="/logo.jpg"
            alt=""
            aria-hidden="true"
            width="28"
            height="28"
            className="h-7 w-7 rounded-lg object-cover shrink-0"
          />
          <span className="font-display text-lg font-bold tracking-tight text-[#141210] dark:text-[#FAFAF9]">
            kreativalab
          </span>
        </a>

        {/* Zone 2: Primary navigation + consolidated Area Agenti dropdown */}
        <nav
          aria-label="Navigazione principale"
          className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium"
        >
          {primaryNavItems.map((item) => {
            const active = isRouteActive(item.path);
            return (
              <a
                key={item.path}
                href={getHref(item.path)}
                onClick={(e) => handleLinkClick(e, item.path)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'text-[#141210] dark:text-[#FAFAF9]'
                    : 'text-[#57534E] hover:text-[#141210] dark:text-[#A8A29E] dark:hover:text-[#FAFAF9]'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-[#0F766E] dark:bg-[#2DD4BF]"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}

          {/* Consolidated Partner / Admin Agenti dropdown */}
          <div className="relative" ref={agentDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setAgentMenuOpen((prev) => !prev);
                setLangMenuOpen(false);
              }}
              aria-expanded={agentMenuOpen}
              aria-haspopup="menu"
              className={`relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isAgentSectionActive || agentMenuOpen
                  ? 'border-[#0F766E]/40 bg-[#0F766E]/10 text-[#0F766E] dark:border-[#2DD4BF]/40 dark:bg-[#2DD4BF]/10 dark:text-[#2DD4BF]'
                  : 'border-[#E5E2DC] bg-white/70 text-[#57534E] hover:border-[#141210]/30 hover:text-[#141210] dark:border-[#292524] dark:bg-[#1C1917]/70 dark:text-[#A8A29E] dark:hover:border-[#FAFAF9]/30 dark:hover:text-[#FAFAF9]'
              }`}
            >
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.nav.affiliatePortal}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-150 ${
                  agentMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {agentMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#E5E2DC] bg-white p-1.5 shadow-xl dark:border-[#292524] dark:bg-[#1C1917] z-50"
              >
                {agentSubItems.map((sub) => {
                  const Icon = sub.icon;
                  const active = isRouteActive(sub.path);
                  return (
                    <a
                      key={sub.path}
                      role="menuitem"
                      href={getHref(sub.path)}
                      onClick={(e) => handleLinkClick(e, sub.path)}
                      className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#2DD4BF]/10 dark:text-[#2DD4BF]'
                          : 'text-[#141210] hover:bg-[#F8F7F4] dark:text-[#FAFAF9] dark:hover:bg-[#292524]/70'
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                          active
                            ? 'border-[#0F766E]/30 bg-[#0F766E]/15 text-[#0F766E] dark:border-[#2DD4BF]/30 dark:bg-[#2DD4BF]/15 dark:text-[#2DD4BF]'
                            : 'border-[#E5E2DC] bg-[#F8F7F4] text-[#57534E] dark:border-[#292524] dark:bg-[#0C0A09] dark:text-[#A8A29E]'
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold leading-tight">
                          {sub.label}
                        </div>
                        <div className="mt-0.5 text-[11px] leading-snug text-[#57534E] dark:text-[#A8A29E]">
                          {sub.description}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Consolidated Utility Capsule (Theme + Language Dropdown) + Primary CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="inline-flex items-center rounded-full border border-[#E5E2DC] bg-white p-0.5 dark:border-[#292524] dark:bg-[#1C1917]">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={themeLabel}
              aria-pressed={!isDark}
              title={themeLabel}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#141210] hover:bg-[#F8F7F4] hover:text-[#0F766E] dark:text-[#FAFAF9] dark:hover:bg-[#292524] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer shrink-0"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-[#FBBF24]" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
              )}
            </button>

            <span
              className="h-4 w-[1px] bg-[#E5E2DC] dark:bg-[#292524]"
              aria-hidden="true"
            />

            {/* Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setLangMenuOpen((prev) => !prev);
                  setAgentMenuOpen(false);
                }}
                aria-label={t.footer.languageTitle}
                aria-expanded={langMenuOpen}
                aria-haspopup="listbox"
                className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-mono font-semibold uppercase text-[#141210] hover:bg-[#F8F7F4] dark:text-[#FAFAF9] dark:hover:bg-[#292524] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Globe className="h-3.5 w-3.5 text-[#57534E] dark:text-[#A8A29E]" aria-hidden="true" />
                <span>{lang}</span>
                <ChevronDown
                  className={`h-3 w-3 text-[#57534E] dark:text-[#A8A29E] transition-transform duration-150 ${
                    langMenuOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {langMenuOpen && (
                <div
                  role="listbox"
                  aria-label={t.footer.languageTitle}
                  className="absolute right-0 mt-2 w-40 rounded-2xl border border-[#E5E2DC] bg-white p-1.5 shadow-xl dark:border-[#292524] dark:bg-[#1C1917] z-50"
                >
                  {LANGUAGE_OPTIONS.map((option) => {
                    const selected = lang === option.code;
                    return (
                      <button
                        key={option.code}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          onChangeLang(option.code);
                          setLangMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#141210] text-[#FAFAF9] font-semibold dark:bg-[#FAFAF9] dark:text-[#0C0A09]'
                            : 'text-[#57534E] hover:bg-[#F8F7F4] hover:text-[#141210] dark:text-[#A8A29E] dark:hover:bg-[#292524] dark:hover:text-[#FAFAF9]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono uppercase">{option.code}</span>
                          <span>{option.label}</span>
                        </span>
                        {selected && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <a
            href="https://cal.com/kreativalab/call-20-minuti"
            target="_blank"
            rel="noopener"
            className="hidden md:inline-flex items-center gap-1.5 justify-center rounded-full bg-[#141210] px-4 py-2 text-xs font-semibold text-[#FAFAF9] hover:bg-[#0F766E] dark:bg-[#FAFAF9] dark:text-[#0C0A09] dark:hover:bg-[#2DD4BF] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px]"
          >
            <span>{t.nav.ctaHeader}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex lg:hidden items-center justify-center rounded-full border border-[#E5E2DC] bg-white text-[#141210] dark:border-[#292524] dark:bg-[#1C1917] dark:text-[#FAFAF9] h-9 w-9 cursor-pointer"
            aria-label={mobileMenuOpen ? t.nav.menuClose : t.nav.menuOpen}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E2DC] bg-[#F8F7F4]/98 dark:border-[#292524] dark:bg-[#0C0A09]/98 backdrop-blur-xl px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-1">
            {primaryNavItems.map((item) => {
              const active = isRouteActive(item.path);
              return (
                <a
                  key={item.path}
                  href={getHref(item.path)}
                  onClick={(e) => handleLinkClick(e, item.path)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-left text-base font-medium min-h-[44px] cursor-pointer ${
                    active
                      ? 'bg-white text-[#0F766E] border border-[#E5E2DC] dark:border-transparent dark:bg-[#1C1917] dark:text-[#2DD4BF]'
                      : 'text-[#57534E] hover:bg-white hover:text-[#141210] dark:text-[#A8A29E] dark:hover:bg-[#1C1917] dark:hover:text-[#FAFAF9]'
                  }`}
                >
                  <span>{item.label}</span>
                </a>
              );
            })}

            {/* Consolidated Mobile Partner / Admin Accordion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setMobileAgentOpen((prev) => !prev)}
                aria-expanded={mobileAgentOpen || isAgentSectionActive}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-base font-medium min-h-[44px] cursor-pointer ${
                  isAgentSectionActive
                    ? 'bg-white text-[#0F766E] border border-[#E5E2DC] dark:border-transparent dark:bg-[#1C1917] dark:text-[#2DD4BF]'
                    : 'text-[#57534E] hover:bg-white hover:text-[#141210] dark:text-[#A8A29E] dark:hover:bg-[#1C1917] dark:hover:text-[#FAFAF9]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  <span>{t.nav.affiliatePortal}</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-150 ${
                    mobileAgentOpen || isAgentSectionActive ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {(mobileAgentOpen || isAgentSectionActive) && (
                <div className="mt-1 ml-3 pl-3 border-l border-[#E5E2DC] dark:border-[#292524] space-y-1">
                  {agentSubItems.map((sub) => {
                    const Icon = sub.icon;
                    const active = isRouteActive(sub.path);
                    return (
                      <a
                        key={sub.path}
                        href={getHref(sub.path)}
                        onClick={(e) => handleLinkClick(e, sub.path)}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium min-h-[40px] cursor-pointer ${
                          active
                            ? 'bg-white text-[#0F766E] dark:bg-[#1C1917] dark:text-[#2DD4BF]'
                            : 'text-[#57534E] hover:bg-white hover:text-[#141210] dark:text-[#A8A29E] dark:hover:bg-[#1C1917] dark:hover:text-[#FAFAF9]'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{sub.label}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          <div className="pt-3 border-t border-[#E5E2DC] dark:border-[#292524]">
            <a
              href="https://cal.com/kreativalab/call-20-minuti"
              target="_blank"
              rel="noopener"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-[#141210] text-[#FAFAF9] dark:bg-[#FAFAF9] dark:text-[#0C0A09] px-4 py-2.5 text-sm font-semibold min-h-[44px] cursor-pointer"
            >
              <span>{t.nav.ctaHeader}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}