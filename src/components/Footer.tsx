import { ArrowUpRight } from 'lucide-react';
import { Language } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  lang: Language;
  onNavigate: (path: string) => void;
  onChangeLang: (lang: Language) => void;
  onOpenCookieSettings: () => void;
}

const LANGUAGES: Language[] = ['it', 'de', 'fr', 'en'];

export function Footer({
  lang,
  onNavigate,
  onChangeLang,
  onOpenCookieSettings,
}: FooterProps) {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="border-t border-[#292524] bg-[#0C0A09] text-[#A8A29E]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="font-display text-xl font-bold tracking-tight text-[#FAFAF9] cursor-pointer"
            >
              GWD Group <span className="text-[#A8A29E] font-normal">· GWD + SitiTicino</span>
            </button>
            <p className="text-sm leading-relaxed text-[#A8A29E] max-w-md">
              {t.footer.tagline}
            </p>
            <div className="pt-2 space-y-1 text-xs font-mono text-[#A8A29E]">
              <p>{t.footer.address}</p>
              <p>{t.footer.vat}</p>
              <p>+41 91 000 42 10 · hello@gwdgroup.ch</p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="font-display text-sm font-semibold text-[#FAFAF9]">
              {t.footer.navigationTitle}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/prodotti')}
                  className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                >
                  {t.nav.products}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/lavori')}
                  className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                >
                  {t.nav.works}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/servizi')}
                  className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/chi-siamo')}
                  className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contatti')}
                  className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-6">
            <div className="space-y-3">
              <h3 className="font-display text-sm font-semibold text-[#FAFAF9]">
                {t.footer.legalTitle}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/privacy')}
                    className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                  >
                    {t.footer.privacyLink}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('/cookie')}
                    className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                  >
                    {t.footer.cookieLink}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenCookieSettings}
                    className="text-xs text-[#2DD4BF] hover:underline underline-offset-4 cursor-pointer"
                  >
                    {t.cookieBanner.customize}
                  </button>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#292524]">
              <div className="flex items-center gap-4 text-xs">
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#FAFAF9] transition-colors"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
                <a
                  href="https://sititicino.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#FAFAF9] transition-colors"
                >
                  <span>SitiTicino.ch</span>
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>

              <div
                className="flex items-center gap-1 rounded-full border border-[#292524] bg-[#1C1917] p-0.5"
                role="group"
                aria-label={t.footer.languageTitle}
              >
                {LANGUAGES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onChangeLang(code)}
                    className={`px-2.5 py-1 text-xs font-mono uppercase rounded-full cursor-pointer ${
                      lang === code
                        ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                        : 'text-[#A8A29E] hover:text-[#FAFAF9]'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#292524] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#A8A29E]">
          <p>{t.footer.copyright}</p>
          <p className="font-mono">Lugano · Bellinzona · Locarno · Mendrisio</p>
        </div>
      </div>
    </footer>
  );
}
