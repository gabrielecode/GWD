import { useState, MouseEvent } from 'react';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';
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

const LANGUAGES: Language[] = ['it', 'de', 'fr', 'en'];

export function Header({
  currentPath,
  lang,
  theme,
  onToggleTheme,
  onNavigate,
  onChangeLang,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];
  const isDark = theme === 'dark';
  const themeLabel = isDark ? t.nav.themeLight : t.nav.themeDark;

  const navItems = [
    { label: t.nav.products, path: '/prodotti' },
    { label: t.nav.works, path: '/lavori' },
    { label: t.nav.services, path: '/servizi' },
    { label: t.nav.about, path: '/chi-siamo' },
    { label: t.nav.contact, path: '/contatti' },
  ];

  const getHref = (path: string) =>
    lang === 'it' ? path : `${path}?lang=${lang}`;

  const isRouteActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const handleLinkClick = (
    e: MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      setMobileMenuOpen(false);
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
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

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav
          aria-label="Navigazione principale"
          className="hidden lg:flex items-center gap-7 text-sm font-medium"
        >
          {navItems.map((item) => {
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
        </nav>

        {/* Zone 3: Theme Toggle + Language Switch + Primary CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={themeLabel}
            aria-pressed={!isDark}
            title={themeLabel}
            className="inline-flex items-center justify-center rounded-full border border-[#E5E2DC] bg-white text-[#141210] hover:border-[#0F766E] hover:text-[#0F766E] dark:border-[#292524] dark:bg-[#1C1917] dark:text-[#FAFAF9] dark:hover:border-[#2DD4BF] dark:hover:text-[#2DD4BF] h-[38px] w-[38px] transition-colors cursor-pointer shrink-0"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-[#FBBF24]" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 text-[#0F766E]" aria-hidden="true" />
            )}
          </button>

          <div
            className="hidden sm:flex items-center border border-[#E5E2DC] bg-white dark:border-[#292524] dark:bg-[#1C1917] rounded-full p-0.5"
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
                    ? 'bg-[#141210] text-[#FAFAF9] dark:bg-[#FAFAF9] dark:text-[#0C0A09]'
                    : 'text-[#57534E] hover:text-[#141210] dark:text-[#A8A29E] dark:hover:text-[#FAFAF9]'
                }`}
                aria-pressed={lang === code}
              >
                {code}
              </button>
            ))}
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
            className="inline-flex lg:hidden items-center justify-center rounded-full border border-[#E5E2DC] bg-white text-[#141210] dark:border-[#292524] dark:bg-[#1C1917] dark:text-[#FAFAF9] h-10 w-10 cursor-pointer"
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
            {navItems.map((item) => {
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
          </nav>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#E5E2DC] dark:border-[#292524]">
            <div className="flex items-center gap-1 rounded-full border border-[#E5E2DC] bg-white dark:border-[#292524] dark:bg-[#1C1917] p-1">
              {LANGUAGES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onChangeLang(code)}
                  className={`px-2.5 py-1.5 text-xs font-mono uppercase rounded-full min-h-[36px] cursor-pointer ${
                    lang === code
                      ? 'bg-[#141210] text-[#FAFAF9] dark:bg-[#FAFAF9] dark:text-[#0C0A09] font-semibold'
                      : 'text-[#57534E] hover:text-[#141210] dark:text-[#A8A29E] dark:hover:text-[#FAFAF9]'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <a
              href="https://cal.com/kreativalab/call-20-minuti"
              target="_blank"
              rel="noopener"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#141210] text-[#FAFAF9] dark:bg-[#FAFAF9] dark:text-[#0C0A09] px-4 py-2.5 text-sm font-semibold min-h-[44px] cursor-pointer"
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