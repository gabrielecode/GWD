import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Language } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentPath: string;
  lang: Language;
  onNavigate: (path: string) => void;
  onChangeLang: (lang: Language) => void;
}

const LANGUAGES: Language[] = ['it', 'de', 'fr', 'en'];

export function Header({
  currentPath,
  lang,
  onNavigate,
  onChangeLang,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const navItems = [
    { label: t.nav.products, path: '/prodotti' },
    { label: t.nav.works, path: '/lavori' },
    { label: t.nav.services, path: '/servizi' },
    { label: t.nav.about, path: '/chi-siamo' },
    { label: t.nav.contact, path: '/contatti' },
  ];

  const isRouteActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-[#292524] bg-[#0C0A09]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 lg:h-16 max-w-[1280px] items-center justify-between gap-4 lg:gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('/')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect x="2" y="2" width="9" height="9" rx="3" fill="#2DD4BF" />
            <rect x="13" y="2" width="9" height="9" rx="3" fill="#FBBF24" />
            <rect x="2" y="13" width="9" height="9" rx="3" fill="#60A5FA" />
            <rect x="13" y="13" width="9" height="9" rx="3" stroke="#FAFAF9" strokeOpacity="0.65" strokeWidth="1.8" />
          </svg>
          <span className="font-display text-lg font-bold tracking-tight text-[#FAFAF9]">
            GWD Group
          </span>
        </button>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav
          aria-label="Navigazione principale"
          className="hidden lg:flex items-center gap-7 text-sm font-medium"
        >
          {navItems.map((item) => {
            const active = isRouteActive(item.path);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleLinkClick(item.path)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active ? 'text-[#FAFAF9]' : 'text-[#A8A29E] hover:text-[#FAFAF9]'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-[#2DD4BF]"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language Switch + Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="hidden sm:flex items-center border border-[#292524] rounded-full bg-[#1C1917] p-0.5"
            role="group"
            aria-label={t.footer.languageTitle}
          >
            {LANGUAGES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onChangeLang(code)}
                className={`px-2.5 py-1 text-xs font-mono font-medium uppercase rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  lang === code
                    ? 'bg-[#FAFAF9] text-[#0C0A09]'
                    : 'text-[#A8A29E] hover:text-[#FAFAF9]'
                }`}
                aria-pressed={lang === code}
              >
                {code}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleLinkClick('/contatti')}
            className="hidden md:inline-flex items-center gap-1.5 justify-center rounded-full bg-[#FAFAF9] px-4 py-2 text-xs font-semibold text-[#0C0A09] hover:bg-[#2DD4BF] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px]"
          >
            <span>{t.nav.ctaHeader}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex lg:hidden items-center justify-center rounded-full border border-[#292524] bg-[#1C1917] h-10 w-10 text-[#FAFAF9] cursor-pointer"
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
        <div className="lg:hidden border-t border-[#292524] bg-[#0C0A09]/98 backdrop-blur-xl px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const active = isRouteActive(item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleLinkClick(item.path)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-left text-base font-medium min-h-[44px] cursor-pointer ${
                    active
                      ? 'bg-[#1C1917] text-[#2DD4BF]'
                      : 'text-[#A8A29E] hover:bg-[#1C1917] hover:text-[#FAFAF9]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#292524]">
            <div className="flex items-center gap-1 rounded-full border border-[#292524] bg-[#1C1917] p-1">
              {LANGUAGES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onChangeLang(code)}
                  className={`px-2.5 py-1.5 text-xs font-mono uppercase rounded-full min-h-[36px] cursor-pointer ${
                    lang === code
                      ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                      : 'text-[#A8A29E] hover:text-[#FAFAF9]'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleLinkClick('/contatti')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FAFAF9] px-4 py-2.5 text-sm font-semibold text-[#0C0A09] min-h-[44px] cursor-pointer"
            >
              <span>{t.nav.ctaHeader}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
