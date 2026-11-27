import { MouseEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Language } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { BUSINESS_INFO } from '../data/business';
import { TICINO_CITIES } from '../data/services';

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

  const getHref = (path: string) =>
    lang === 'it' ? path : `${path}?lang=${lang}`;

  const handleLinkClick = (
    e: MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="border-t border-[#292524] bg-[#0C0A09] text-[#A8A29E]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <a
              href={getHref('/')}
              onClick={(e) => handleLinkClick(e, '/')}
              className="inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-[#FAFAF9] cursor-pointer"
            >
              <img
                src="/logo.jpg"
                alt=""
                aria-hidden="true"
                width="28"
                height="28"
                className="h-7 w-7 rounded-lg object-cover shrink-0"
              />
              <span>{BUSINESS_INFO.brandName}</span>
            </a>
            <p className="text-sm leading-relaxed text-[#A8A29E] max-w-md">
              {t.footer.tagline}
            </p>
            <address className="not-italic pt-2 text-xs font-mono text-[#A8A29E]">
              <p>{BUSINESS_INFO.address.locality}</p>
            </address>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h2 className="font-display text-sm font-semibold text-[#FAFAF9]">
              {t.footer.navigationTitle}
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={getHref('/prodotti')}
                  onClick={(e) => handleLinkClick(e, '/prodotti')}
                  className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                >
                  {t.nav.products}
                </a>
              </li>
              <li>
                <a
                  href={getHref('/lavori')}
                  onClick={(e) => handleLinkClick(e, '/lavori')}
                  className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                >
                  {t.nav.works}
                </a>
              </li>
              <li>
                <a
                  href={getHref('/servizi')}
                  onClick={(e) => handleLinkClick(e, '/servizi')}
                  className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                >
                  {t.nav.services}
                </a>
              </li>
              <li>
                <a
                  href={getHref('/chi-siamo')}
                  onClick={(e) => handleLinkClick(e, '/chi-siamo')}
                  className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                >
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a
                  href={getHref('/contatti')}
                  onClick={(e) => handleLinkClick(e, '/contatti')}
                  className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                >
                  {t.nav.contact}
                </a>
              </li>
              <li>
                <a
                  href={getHref('/affiliate')}
                  onClick={(e) => handleLinkClick(e, '/affiliate')}
                  className="hover:text-[#2DD4BF] transition-colors cursor-pointer"
                >
                  Area Agenti &amp; Partner
                </a>
              </li>
              <li>
                <a
                  href={getHref('/admin/affiliates')}
                  onClick={(e) => handleLinkClick(e, '/admin/affiliates')}
                  className="text-xs text-[#A8A29E]/80 hover:text-[#FAFAF9] transition-colors cursor-pointer"
                >
                  Admin Agenti / Payouts
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-6">
            <div className="space-y-3">
              <h2 className="font-display text-sm font-semibold text-[#FAFAF9]">
                {t.footer.legalTitle}
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={getHref('/privacy')}
                    onClick={(e) => handleLinkClick(e, '/privacy')}
                    className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                  >
                    {t.footer.privacyLink}
                  </a>
                </li>
                <li>
                  <a
                    href={getHref('/cookie')}
                    onClick={(e) => handleLinkClick(e, '/cookie')}
                    className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                  >
                    {t.footer.cookieLink}
                  </a>
                </li>
                <li>
                  <a
                    href={getHref('/impressum')}
                    onClick={(e) => handleLinkClick(e, '/impressum')}
                    className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                  >
                    {t.footer.impressumLink}
                  </a>
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
                  href="https://www.linkedin.com/company/kreativalab"
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
          <div className="flex flex-wrap items-center gap-2 font-mono">
            {TICINO_CITIES.map((city, idx) => (
              <span key={city.slug} className="inline-flex items-center gap-2">
                {idx > 0 && <span aria-hidden="true">·</span>}
                <a
                  href={getHref(`/servizi/${city.slug}`)}
                  onClick={(e) => handleLinkClick(e, `/servizi/${city.slug}`)}
                  className="hover:text-[#FAFAF9] transition-colors cursor-pointer"
                >
                  {city.name}
                </a>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}