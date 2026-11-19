import { ArrowUpRight } from 'lucide-react';
import { Language, SitiTicinoAppItem } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { SITITICINO_APPS } from '../data/sitiTicinoApps';
import { BrowserFrame } from './BrowserFrame';

interface SitiTicinoAppsSectionProps {
  lang: Language;
}

const IFRAME_ALLOWED_APPS = new Set<SitiTicinoAppItem['id']>([
  'pratiko',
  'rankuplist',
  'karepet',
  'demapp',
]);

function AppMiniatureSiteFallback({ app }: { app: SitiTicinoAppItem }) {
  switch (app.id) {
    case 'pratiko':
      return (
        <div className="h-full w-full bg-[#F8FAFC] text-[#0F172A] p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="font-display text-[10px] font-bold tracking-tight text-[#0F172A]">
              Pratiko<span className="text-[#0D9488]">.ch</span>
            </span>
            <div className="flex items-center gap-2 text-[8px] text-slate-500">
              <span>Funzioni</span>
              <span>Prezzi</span>
              <span className="rounded bg-[#0D9488] px-1.5 py-0.5 font-semibold text-white">
                Prova gratis
              </span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2 items-center my-auto py-1">
            <div className="col-span-7 space-y-1">
              <div className="text-[11px] font-extrabold leading-tight text-slate-900">
                Fatture QR svizzere in 30 secondi
              </div>
              <div className="text-[8px] text-slate-600 leading-snug">
                Preventivi, clienti e incassi SIX per artigiani e PMI.
              </div>
            </div>
            <div className="col-span-5 rounded-md border border-slate-200 bg-white p-1.5 shadow-sm">
              <div className="text-[7px] font-mono text-slate-500">QR-IBAN CH93</div>
              <div className="text-[10px] font-bold text-[#0D9488]">CHF 1&apos;480.00</div>
              <div className="mt-1 inline-block rounded bg-emerald-100 px-1 py-0.5 text-[7px] font-semibold text-emerald-700">
                Pagata ✓
              </div>
            </div>
          </div>
        </div>
      );

    case 'rankuplist':
      return (
        <div className="h-full w-full bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0C0A09] text-white p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="font-display text-[10px] font-bold text-white">
              RankUp<span className="text-[#60A5FA]">List</span>
            </span>
            <span className="rounded-full bg-[#60A5FA]/20 border border-[#60A5FA]/40 px-2 py-0.5 text-[7px] font-semibold text-[#60A5FA]">
              AI SEO 98/100
            </span>
          </div>
          <div className="space-y-1.5 my-auto">
            <div className="text-[11px] font-bold leading-tight">
              Ottimizza annunci Etsy, Amazon &amp; eBay
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[8px]">
              <div className="rounded bg-white/10 p-1.5">
                <div className="text-slate-300">Titoli AI</div>
                <div className="font-mono font-bold text-[#60A5FA]">+64% CTR</div>
              </div>
              <div className="rounded bg-white/10 p-1.5">
                <div className="text-slate-300">13 Tag</div>
                <div className="font-mono font-bold text-[#2DD4BF]">Auto SEO</div>
              </div>
              <div className="rounded bg-white/10 p-1.5">
                <div className="text-slate-300">Ordini</div>
                <div className="font-mono font-bold text-[#22C55E]">+41%</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'swissleadfinder':
      return (
        <div className="h-full w-full bg-[#F8FAFC] text-[#0F172A] p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="font-display text-[10px] font-bold text-[#0F172A]">
              Swiss<span className="text-[#0D9488]">LeadFinder</span>
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[7px] font-bold text-emerald-800">
              nLPD Compliant
            </span>
          </div>
          <div className="space-y-1.5 my-auto">
            <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-2 py-1 shadow-xs">
              <span className="text-[8px] font-medium text-slate-600">
                Canton Ticino · Ristorazione &amp; PMI
              </span>
              <span className="rounded bg-[#0D9488] px-1.5 py-0.5 text-[7px] font-bold text-white">
                Cerca Lead
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[8px]">
              <div className="rounded border border-slate-200 bg-white p-1.5">
                <div className="font-bold text-slate-900 truncate">Hotel Lugano SA</div>
                <div className="text-[7px] text-[#0D9488] font-mono">Email + Tel ✓</div>
              </div>
              <div className="rounded border border-slate-200 bg-white p-1.5">
                <div className="font-bold text-slate-900 truncate">Studio Bianchi Sagl</div>
                <div className="text-[7px] text-[#0D9488] font-mono">Export CRM ✓</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'karepet':
      return (
        <div className="h-full w-full bg-gradient-to-br from-[#ECFDF5] via-[#F8FAFC] to-[#E0F2FE] text-[#0F172A] p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-emerald-200/70 pb-1.5">
            <span className="font-display text-[10px] font-bold text-emerald-900">
              Karepet<span className="text-emerald-600">.app</span>
            </span>
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[7px] font-bold text-white">
              WebApp &amp; PWA
            </span>
          </div>
          <div className="grid grid-cols-12 gap-2 items-center my-auto">
            <div className="col-span-7 space-y-1">
              <div className="text-[10px] font-extrabold text-slate-900 leading-tight">
                Cartella clinica &amp; dieta BARF
              </div>
              <div className="text-[8px] text-slate-600">
                Vaccini, pesi e routine giornaliere sempre in tasca.
              </div>
            </div>
            <div className="col-span-5 rounded-lg border border-emerald-200 bg-white p-1.5 shadow-sm text-[8px]">
              <div className="font-bold text-slate-900">Leo · 28 kg</div>
              <div className="text-emerald-600 font-mono text-[7px]">BARF: 420g/gg</div>
              <div className="text-slate-500 text-[7px] mt-0.5">Vaccini: OK</div>
            </div>
          </div>
        </div>
      );

    case 'demapp':
    default:
      return (
        <div className="h-full w-full bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#0C0A09] text-[#FAFAF9] p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="font-display text-[10px] font-bold text-[#FAFAF9]">
              Demapp<span className="text-[#FBBF24]">.shop</span>
            </span>
            <span className="rounded-full bg-[#FBBF24] px-2 py-0.5 text-[7px] font-bold text-[#0C0A09]">
              PWA Demo Live
            </span>
          </div>
          <div className="space-y-1.5 my-auto">
            <div className="text-[10px] font-bold leading-tight text-[#FAFAF9]">
              App locali installabili senza App Store
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[8px]">
              <div className="rounded-md border border-[#FBBF24]/35 bg-[#0C0A09]/80 p-1.5">
                <div className="font-bold text-[#FBBF24]">Salone Beauty</div>
                <div className="text-[7px] text-[#A8A29E]">Booking &amp; Push</div>
              </div>
              <div className="rounded-md border border-[#2DD4BF]/35 bg-[#0C0A09]/80 p-1.5">
                <div className="font-bold text-[#2DD4BF]">Pizzeria Ticino</div>
                <div className="text-[7px] text-[#A8A29E]">Menu &amp; Ordini</div>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

export function SitiTicinoAppsSection({ lang }: SitiTicinoAppsSectionProps) {
  const t = TRANSLATIONS[lang];

  return (
    <section
      id="progetti-app-sititicino"
      className="space-y-8 pt-4"
      aria-labelledby="sititicino-apps-heading"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-[#2DD4BF]">
            {t.serviceDetail.appsSectionTag}
          </p>
          <h2
            id="sititicino-apps-heading"
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAF9]"
          >
            {t.serviceDetail.appsSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#A8A29E] leading-relaxed">
            {t.serviceDetail.appsSectionSubtitle}
          </p>
        </div>

        <span className="font-mono text-xs text-[#A8A29E] tabular-nums shrink-0">
          5 / 5 App · sititicino.ch
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SITITICINO_APPS.map((app) => {
          const frameAccent: 'saas' | 'agency' | 'ai' =
            app.accentHex === '#60A5FA'
              ? 'ai'
              : app.accentHex === '#FBBF24'
              ? 'agency'
              : 'saas';

          return (
            <article
              key={app.id}
              className="group rounded-2xl border border-[#292524] bg-[#1C1917] p-5 flex flex-col justify-between transition-all duration-300 ease-out hover:border-[#2DD4BF]/50 hover:-translate-y-1 hover:shadow-[0_20px_44px_-16px_rgba(0,0,0,0.75)]"
            >
              <div>
                {/* Unified Responsive BrowserFrame Wrapping Live App Link */}
                <BrowserFrame
                  url={app.url}
                  domainLabel={app.domainLabel}
                  title={app.name}
                  allowIframe={IFRAME_ALLOWED_APPS.has(app.id)}
                  allowScreenshotApi={app.id === 'swissleadfinder'}
                  accent={frameAccent}
                  fallbackContent={<AppMiniatureSiteFallback app={app} />}
                  className="mb-5"
                />

                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
                    style={{
                      borderColor: `${app.accentHex}4D`,
                      backgroundColor: `${app.accentHex}1A`,
                      color: app.accentHex,
                    }}
                  >
                    {app.category[lang]}
                  </span>
                  <span className="font-mono text-[11px] text-[#A8A29E]">
                    {app.badgeText}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-[#FAFAF9] tracking-tight mb-2">
                  {app.name}
                </h3>

                <p className="text-sm text-[#A8A29E] leading-relaxed mb-6">
                  {app.description[lang]}
                </p>
              </div>

              <div className="pt-4 border-t border-[#292524] flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-[#A8A29E] truncate">
                  {app.domainLabel}
                </span>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 min-h-[38px]"
                  style={{ backgroundColor: app.accentHex }}
                >
                  <span>{app.buttonText[lang]}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
