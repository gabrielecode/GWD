import { useEffect, useRef, useState } from 'react';
import { Language, ProjectItem } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';
import { BrowserFrame } from './BrowserFrame';

export function HeroAtmosphericArt({ lang = 'it' }: { lang?: Language }) {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (imgRef.current?.complete) {
      setHeroLoaded(true);
    }
  }, []);

  return (
    <div className="relative h-full min-h-[260px] sm:min-h-[340px] lg:min-h-[400px] w-full overflow-hidden rounded-2xl border border-[#292524] bg-[#0C0A09] shadow-2xl">
      {!heroLoaded && (
        <div
          className="skeleton-obsidian absolute inset-0 z-10 p-6 flex flex-col justify-between"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between">
            <div className="skeleton-surface h-4 w-32 rounded-full" />
            <div className="skeleton-surface h-4 w-20 rounded-full" />
          </div>
          <div className="mx-auto flex flex-col items-center gap-3">
            <div className="skeleton-surface h-24 w-24 rounded-full border border-[#292524]" />
            <div className="skeleton-surface h-3 w-44 rounded-full" />
          </div>
          <div className="h-10" />
        </div>
      )}

      <picture>
        <source srcSet="/assets/aistudio/hero-ecosystem.webp" type="image/webp" />
        <img
          ref={imgRef}
          src="/assets/aistudio/AI_marketing_network_UI_illustra__8cfdf428_b55f773d.jpg"
          alt={t.seoUi.heroImageAlt}
          width={1376}
          height={768}
          fetchPriority="high"
          decoding="async"
          onLoad={() => setHeroLoaded(true)}
          className={`h-full w-full object-cover object-[48%_56%] scale-[1.15] select-none transition-opacity duration-500 ${
            heroLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="eager"
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
          <span className="font-medium text-[#FAFAF9]">kreativalab + SitiTicino</span>
        </div>
        <span className="font-mono text-[11px] text-[#A8A29E]">
          6 SaaS · 10 Client Works · 4 Lingue
        </span>
      </div>
    </div>
  );
}

function renderSiteBodyPreview(project: ProjectItem, lang: Language) {
  const accent = project.previewTheme.primaryHex;

  switch (project.slug) {
    case 'reverse-editing':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#1C1917] border border-[#292524] p-2.5 flex items-center justify-between gap-2">
            <div className="space-y-1 min-w-0">
              <div className="text-[10px] font-bold text-[#FAFAF9] leading-tight truncate">
                {project.previewTheme.desktopHeadline[lang]}
              </div>
              <div className="inline-block rounded-full bg-[#FBBF24] px-2 py-0.5 text-[8px] font-semibold text-[#0C0A09]">
                Showreel 4K
              </div>
            </div>
            <div className="h-10 w-14 rounded bg-[#0C0A09] border border-[#292524] flex items-center justify-center shrink-0">
              <div className="h-0 w-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-[#FBBF24] ml-0.5" />
            </div>
          </div>
          <div className="rounded-md bg-[#0C0A09] border border-[#292524] p-2 space-y-1">
            <div className="flex gap-1">
              <div className="h-2 w-1/3 rounded-sm bg-[#FBBF24]" />
              <div className="h-2 w-1/2 rounded-sm bg-[#FB923C]/80" />
              <div className="h-2 w-1/6 rounded-sm bg-[#60A5FA]/80" />
            </div>
            <div className="flex gap-1">
              <div className="h-1.5 w-1/4 rounded-sm bg-[#2DD4BF]/70" />
              <div className="h-1.5 w-2/3 rounded-sm bg-[#2DD4BF]/40" />
            </div>
          </div>
        </div>
      );

    case 'speedyjob':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#1C1917] border border-[#FBBF24]/30 p-2.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-[#FAFAF9] truncate">SpeedyJob.ch</div>
              <div className="text-[9px] text-[#FBBF24]">Recruiting CH · 60s Apply</div>
            </div>
            <span className="rounded-full bg-[#FBBF24] px-2.5 py-1 text-[8px] font-bold text-[#0C0A09] shrink-0">
              Candidati ora
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[8px]">
            <div className="rounded border border-[#292524] bg-[#0C0A09] px-2 py-1 text-[#FAFAF9] truncate">
              Lugano · Hospitality
            </div>
            <div className="rounded border border-[#292524] bg-[#0C0A09] px-2 py-1 font-mono text-[#22C55E] text-right">
              +110% Mobile
            </div>
          </div>
        </div>
      );

    case 'reverse-editing-shop':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#1C1917] border border-[#FBBF24]/30 p-2.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-[#FAFAF9] truncate">Reverse Editing Shop</div>
              <div className="text-[8px] text-[#FBBF24]">LUT Packs · Presets · SFX</div>
            </div>
            <span className="rounded bg-[#FBBF24] px-2 py-0.5 text-[8px] font-bold text-[#0C0A09] shrink-0">
              Instant DL
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[8px] font-mono">
            <div className="rounded border border-[#292524] bg-[#0C0A09] p-1 text-center text-[#FAFAF9]">LUT Pro</div>
            <div className="rounded border border-[#292524] bg-[#0C0A09] p-1 text-center text-[#FAFAF9]">Motion</div>
            <div className="rounded bg-[#FBBF24]/20 p-1 text-center text-[#FBBF24]">+78% AOV</div>
          </div>
        </div>
      );

    case 'aurora-phone':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#1C1917] border border-[#60A5FA]/35 p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-[#FAFAF9]">Aurora Phone AI</div>
              <div className="text-[9px] text-[#60A5FA]">Cloud SIP · 24/7</div>
            </div>
            <span className="rounded-full bg-[#60A5FA]/15 border border-[#60A5FA]/35 px-2 py-0.5 font-mono text-[8px] text-[#60A5FA]">
              &lt; 0.8s
            </span>
          </div>
          <div className="rounded-md bg-[#0C0A09] border border-[#292524] p-2 flex items-center justify-between gap-2 text-[9px]">
            <span className="text-[#A8A29E] truncate">IT · DE · FR · EN Routing</span>
            <span className="font-mono text-[#22C55E] shrink-0">Active</span>
          </div>
        </div>
      );

    case 'pixasolar':
      return (
        <div className="space-y-2">
          <div
            className="rounded-md border border-[#FBBF24]/30 p-2.5 flex items-center justify-between gap-2"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.16), rgba(28, 25, 23, 0.96))',
            }}
          >
            <div>
              <div className="text-[11px] font-bold text-[#FAFAF9]">PixaSolar</div>
              <div className="text-[8px] text-[#FBBF24]">BIPV &amp; Architectural Solar</div>
            </div>
            <span className="font-mono text-xs font-bold text-[#22C55E]">+94% Leads</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[8px] font-mono">
            <div className="rounded border border-[#292524] bg-[#0C0A09] px-2 py-1 text-[#FAFAF9]">
              Stima kWp
            </div>
            <div className="rounded border border-[#292524] bg-[#0C0A09] px-2 py-1 text-[#FBBF24] text-right">
              97 Lighthouse
            </div>
          </div>
        </div>
      );

    case 'visual-studio-facile':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#1C1917] border border-[#292524] p-2.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-[#FAFAF9] truncate">Visual Studio Facile</div>
              <div className="text-[8px] text-[#A8A29E]">Guide IDE · Snippet · Debug</div>
            </div>
            <span className="rounded bg-[#FBBF24] px-1.5 py-0.5 font-mono text-[8px] font-bold text-[#0C0A09] shrink-0">
              3.8x SEO
            </span>
          </div>
          <div className="rounded-md bg-[#0C0A09] border border-[#292524] px-2 py-1.5 font-mono text-[8px] text-[#2DD4BF] flex items-center justify-between">
            <span>&gt; dotnet build --release</span>
            <span className="text-[#22C55E]">99/100</span>
          </div>
        </div>
      );

    case 'il-vicolo-lugano':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#1C1917] border border-[#292524] p-2.5 flex items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-bold text-[#FAFAF9]">Il Vicolo Lugano</div>
              <div className="text-[9px] text-[#FBBF24]">Menu HTML · Centro</div>
            </div>
            <span className="rounded-full bg-[#FBBF24] px-2.5 py-1 text-[8px] font-bold text-[#0C0A09] shrink-0">
              Prenota tavolo
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded border border-[#292524] bg-[#0C0A09] p-1.5">
              <div className="text-[9px] font-semibold text-[#FAFAF9] truncate">Risotto Merlot</div>
              <div className="text-[8px] font-mono text-[#FB923C]">CHF 28</div>
            </div>
            <div className="rounded border border-[#292524] bg-[#0C0A09] p-1.5">
              <div className="text-[9px] font-semibold text-[#FAFAF9] truncate">Menu del Giorno</div>
              <div className="text-[8px] font-mono text-[#22C55E]">Top 2 Maps</div>
            </div>
          </div>
        </div>
      );

    case 'aurora-adv':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#1C1917] border border-[#292524] p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-[#FAFAF9]">Aurora ADV</div>
              <div className="text-[9px] text-[#A8A29E]">Google &amp; Meta Ads</div>
            </div>
            <span className="font-mono text-xs font-bold text-[#FBBF24]">-38% CPL</span>
          </div>
          <div className="rounded-md bg-[#0C0A09] border border-[#292524] p-2 flex items-end gap-1.5 h-11">
            {[35, 52, 48, 70, 86, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${h}%`,
                  backgroundColor: i >= 4 ? '#FBBF24' : '#292524',
                }}
              />
            ))}
          </div>
        </div>
      );

    case 'dj-magix':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#1C1917] border border-[#292524] p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#FAFAF9]">DJ MAGIX</span>
              <span className="rounded-full bg-[#FBBF24] px-2 py-0.5 text-[8px] font-bold text-[#0C0A09]">
                Check Date
              </span>
            </div>
            <div className="mt-2.5 flex items-end gap-1 h-7">
              {[40, 80, 55, 95, 70, 85, 45, 90, 60, 75, 50, 88].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-gradient-to-t from-[#FB923C] to-[#FBBF24]"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-[#A8A29E] px-0.5">
            <span>Lugano · Como · Zürich</span>
            <span className="text-[#FBBF24]">2.4x Booking</span>
          </div>
        </div>
      );

    case 'aurora-ai':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#1C1917] border border-[#60A5FA]/35 p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-[#FAFAF9]">Aurora AI Voice</div>
              <div className="text-[9px] text-[#60A5FA]">24/7 IT · DE · FR · EN</div>
            </div>
            <span className="rounded-full bg-[#60A5FA]/15 border border-[#60A5FA]/35 px-2 py-0.5 font-mono text-[8px] text-[#60A5FA]">
              0.8s latency
            </span>
          </div>
          <div className="rounded-md bg-[#0C0A09] border border-[#292524] p-2 flex items-center justify-between gap-2 text-[9px]">
            <span className="text-[#A8A29E] truncate">“Tavolo per 4 alle 20:00”</span>
            <span className="font-mono text-[#22C55E] shrink-0">Confermato</span>
          </div>
        </div>
      );

    case 'swiss-lead-finder':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#0C0A09] border border-[#292524] px-2.5 py-1.5 flex items-center justify-between text-[9px]">
            <span className="text-[#A8A29E]">Canton: TI · Ristorazione</span>
            <span className="rounded bg-[#2DD4BF] px-1.5 py-0.5 font-bold text-[#0C0A09]">
              142 Lead
            </span>
          </div>
          <div className="space-y-1">
            {[
              { name: 'Hotel Belvedere SA', score: 'CWV 42' },
              { name: 'Studio Bianchi Sagl', score: 'No HTTPS' },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded border border-[#292524] bg-[#1C1917] px-2 py-1 text-[9px]"
              >
                <span className="text-[#FAFAF9] truncate">{row.name}</span>
                <span className="font-mono text-[#2DD4BF] shrink-0">{row.score}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'rankuplist':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#0C0A09] border border-[#292524] p-2 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-[#FAFAF9]">Google Map Pack</div>
              <div className="text-[8px] text-[#A8A29E]">35 directory CH allineate</div>
            </div>
            <span className="font-mono text-xs font-bold text-[#2DD4BF]">+64%</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[8px] font-mono">
            <div className="rounded border border-[#292524] bg-[#1C1917] p-1 text-center text-[#FAFAF9]">#1 Lugano</div>
            <div className="rounded border border-[#292524] bg-[#1C1917] p-1 text-center text-[#FAFAF9]">#2 Locarno</div>
            <div className="rounded bg-[#2DD4BF]/20 p-1 text-center text-[#2DD4BF]">NAP 100%</div>
          </div>
        </div>
      );

    case 'sititicino-geoboost':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#1C1917] border border-[#2DD4BF]/30 p-2.5">
            <div className="text-[10px] font-bold text-[#FAFAF9]">SitiTicino GeoBoost</div>
            <div className="text-[8px] text-[#A8A29E] mt-0.5">
              Lugano · Bellinzona · Locarno · Mendrisio
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[9px]">
            <div className="rounded border border-[#292524] bg-[#0C0A09] px-2 py-1 text-[#FAFAF9]">
              Schema LocalBusiness
            </div>
            <div className="rounded border border-[#2DD4BF]/35 bg-[#2DD4BF]/10 px-2 py-1 font-mono text-[#2DD4BF] text-right">
              SEO 96/100
            </div>
          </div>
        </div>
      );

    case 'karepet':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#1C1917] border border-[#2DD4BF]/30 p-2.5 flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-bold text-[#FAFAF9]">Leo · Pet Passport</div>
              <div className="text-[8px] text-[#2DD4BF]">Microchip OK · Vaccini 2026</div>
            </div>
            <div className="grid grid-cols-3 gap-0.5 rounded bg-[#FAFAF9] p-1 shrink-0">
              <span className="h-1.5 w-1.5 bg-[#0C0A09]" />
              <span className="h-1.5 w-1.5 bg-[#FAFAF9]" />
              <span className="h-1.5 w-1.5 bg-[#0C0A09]" />
              <span className="h-1.5 w-1.5 bg-[#FAFAF9]" />
              <span className="h-1.5 w-1.5 bg-[#0C0A09]" />
              <span className="h-1.5 w-1.5 bg-[#0C0A09]" />
              <span className="h-1.5 w-1.5 bg-[#0C0A09]" />
              <span className="h-1.5 w-1.5 bg-[#0C0A09]" />
              <span className="h-1.5 w-1.5 bg-[#FAFAF9]" />
            </div>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-[#A8A29E] px-0.5">
            <span>Clinica Lugano</span>
            <span className="text-[#22C55E]">QR &lt; 1.2s</span>
          </div>
        </div>
      );

    case 'auto-social-publisher':
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#1C1917] border border-[#60A5FA]/30 p-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#FAFAF9]">Auto Social Queue</span>
            <span className="font-mono text-[9px] text-[#60A5FA]">IT · DE · FR · EN</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[8px]">
            <div className="rounded border border-[#292524] bg-[#0C0A09] p-1.5 text-[#FAFAF9]">LinkedIn · Mar</div>
            <div className="rounded border border-[#292524] bg-[#0C0A09] p-1.5 text-[#FAFAF9]">Google · Gio</div>
            <div className="rounded bg-[#60A5FA]/20 p-1.5 text-[#60A5FA]">18 Ready</div>
          </div>
        </div>
      );

    case 'ata-school-scraper':
    default:
      return (
        <div className="space-y-2">
          <div className="rounded-md bg-[#1C1917] border border-[#60A5FA]/30 p-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#FAFAF9]">ATA Notice Monitor</span>
            <span className="font-mono text-[9px] text-[#60A5FA]">1.800+ Istituti</span>
          </div>
          <div className="space-y-1 text-[9px]">
            <div className="flex justify-between rounded border border-[#292524] bg-[#0C0A09] px-2 py-1 text-[#FAFAF9]">
              <span>Bando PDF #412</span>
              <span className="font-mono" style={{ color: accent }}>Estratto</span>
            </div>
            <div className="flex justify-between rounded border border-[#292524] bg-[#0C0A09] px-2 py-1 text-[#FAFAF9]">
              <span>Scadenza &lt; 48h</span>
              <span className="font-mono text-[#FB923C]">7 Alert</span>
            </div>
          </div>
        </div>
      );
  }
}

const IFRAME_ALLOWED_PROJECT_SLUGS = new Set([
  'rankuplist',
  'sititicino-geoboost',
  'karepet',
  'aurora-adv',
  'reverse-editing-shop',
  'aurora-phone',
  'pixasolar',
  'visual-studio-facile',
  'il-vicolo-lugano',
  'dj-magix',
  'aurora-ai',
]);

const SCREENSHOT_API_PROJECT_SLUGS = new Set([
  'swiss-lead-finder',
  'speedyjob',
]);

export function ProjectThumbnail({
  project,
  lang,
}: {
  project: ProjectItem;
  lang: Language;
}) {
  const isAi = project.status === 'ai-division';
  const isSaas = project.engine === 'saas';
  const canRenderIframe = IFRAME_ALLOWED_PROJECT_SLUGS.has(project.slug);
  const canUseScreenshotApi = SCREENSHOT_API_PROJECT_SLUGS.has(project.slug);

  const frameAccent: 'saas' | 'agency' | 'ai' = isAi
    ? 'ai'
    : isSaas
    ? 'saas'
    : 'agency';

  const fallbackUi = (
    <div className="h-full w-full flex flex-col justify-between bg-[#0C0A09] p-2.5">
      <div className="flex items-center justify-between pb-1.5 border-b border-[#292524] text-[8px] text-[#A8A29E]">
        <span className="font-semibold text-[#FAFAF9] truncate max-w-[140px]">
          {project.name}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span>Home</span>
          <span>Info</span>
        </div>
      </div>
      <div className="my-auto pt-1">{renderSiteBodyPreview(project, lang)}</div>
    </div>
  );

  return (
    <BrowserFrame
      url={project.externalUrl}
      domainLabel={project.previewTheme.domainUrl}
      title={project.name}
      allowIframe={canRenderIframe}
      allowScreenshotApi={canUseScreenshotApi}
      accent={frameAccent}
      fallbackContent={fallbackUi}
    />
  );
}

export type ServiceCardKind = 'saas' | 'siti-web' | 'seo-locale' | 'agenti-ai';

export function ServicePreviewThumbnail({
  kind,
  title,
}: {
  kind: ServiceCardKind;
  title: string;
}) {
  const isTeal = kind === 'saas' || kind === 'seo-locale';
  const isBlue = kind === 'agenti-ai';
  const accentHex = isBlue ? '#60A5FA' : isTeal ? '#2DD4BF' : '#FBBF24';

  const domain =
    kind === 'saas'
      ? 'studio.kreativalabgroup.ch'
      : kind === 'siti-web'
      ? 'sititicino.ch'
      : kind === 'seo-locale'
      ? 'geoboost.sititicino.ch'
      : 'voice.auroraai.ch';

  const backdrop = isBlue
    ? 'radial-gradient(circle at 80% 15%, rgba(96, 165, 250, 0.26), rgba(28, 25, 23, 0.96) 65%, rgba(12, 10, 9, 1) 100%)'
    : isTeal
    ? 'radial-gradient(circle at 80% 15%, rgba(45, 212, 191, 0.24), rgba(28, 25, 23, 0.96) 65%, rgba(12, 10, 9, 1) 100%)'
    : 'radial-gradient(circle at 80% 15%, rgba(251, 191, 36, 0.26), rgba(28, 25, 23, 0.96) 65%, rgba(12, 10, 9, 1) 100%)';

  const sheen = isBlue
    ? 'rgba(96, 165, 250, 0.16)'
    : isTeal
    ? 'rgba(45, 212, 191, 0.16)'
    : 'rgba(251, 191, 36, 0.16)';

  return (
    <div
      className="group/thumb relative mb-4 w-full overflow-hidden rounded-xl border border-[#292524] p-2.5 flex flex-col justify-end perspective-midrange transition-colors duration-300 group-hover:border-[#FAFAF9]/20"
      style={{ background: backdrop }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-60 group-hover/thumb:opacity-100"
        style={{
          background: `linear-gradient(125deg, ${sheen} 0%, transparent 45%, rgba(250, 250, 249, 0.05) 100%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full rounded-lg border border-[#292524] bg-[#141210] shadow-xl overflow-hidden transform-3d origin-center transition-all duration-300 ease-out will-change-transform group-hover:scale-[1.02] group-hover:rotate-x-2 group-hover:-rotate-y-1 group-hover/thumb:scale-[1.04] group-hover/thumb:rotate-x-6 group-hover/thumb:-rotate-y-3 group-hover/thumb:-translate-y-1 group-hover/thumb:border-[#FAFAF9]/25">
        <div className="flex items-center justify-between gap-1.5 border-b border-[#292524] bg-[#1C1917] px-2 py-1">
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FB923C]/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#FBBF24]/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]/80" />
          </div>
          <div className="flex-1 truncate rounded bg-[#0C0A09] px-1.5 py-0.5 text-center font-mono text-[8px] text-[#A8A29E]">
            https://{domain}
          </div>
        </div>

        <div className="relative w-full aspect-[16/10] overflow-hidden">
          {kind === 'saas' && (
            <div className="h-full w-full bg-gradient-to-br from-[#0F172A] to-[#0C0A09] p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[9px] border-b border-white/10 pb-1">
                <span className="font-bold text-[#FAFAF9] truncate">{title}</span>
                <span className="rounded bg-[#2DD4BF] px-1.5 py-0.5 font-mono text-[7px] font-bold text-[#0C0A09]">
                  6 Live SaaS
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 my-auto">
                {[
                  { label: 'Pratiko', val: 'QR SIX' },
                  { label: 'RankUp', val: 'SEO AI' },
                  { label: 'Leads', val: 'nLPD' },
                ].map((card) => (
                  <div key={card.label} className="rounded border border-white/10 bg-white/5 p-1.5">
                    <div className="text-[8px] font-bold text-[#FAFAF9]">{card.label}</div>
                    <div className="font-mono text-[7px] text-[#2DD4BF]">{card.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {kind === 'siti-web' && (
            <div className="h-full w-full bg-[#FAFAF9] text-[#0C0A09] p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-stone-200 pb-1 text-[8px]">
                <span className="font-bold">SitiTicino.ch</span>
                <span className="rounded bg-[#FBBF24] px-1.5 py-0.5 font-bold text-[7px]">
                  98 Lighthouse
                </span>
              </div>
              <div className="my-auto space-y-1">
                <div className="text-[10px] font-extrabold leading-tight">
                  Siti Web Veloci in Ticino
                </div>
                <div className="text-[7px] text-stone-600">
                  Design su misura, LCP &lt; 1.8s e conversione mobile.
                </div>
              </div>
              <div className="flex gap-1 text-[7px] font-mono">
                <span className="rounded bg-[#0C0A09] px-1.5 py-0.5 text-white">Preventivo</span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800">CWV Verde</span>
              </div>
            </div>
          )}

          {kind === 'seo-locale' && (
            <div className="h-full w-full bg-[#F8FAFC] text-[#0F172A] p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1 text-[8px]">
                <span className="font-bold text-[#0F172A]">Google Map Pack</span>
                <span className="font-mono font-bold text-[#0D9488]">+185% Organico</span>
              </div>
              <div className="space-y-1 my-auto">
                <div className="flex items-center justify-between rounded border border-slate-200 bg-white px-2 py-1 text-[8px]">
                  <span className="font-semibold">#1 Lugano · Centro</span>
                  <span className="text-amber-500">★★★★★</span>
                </div>
                <div className="flex items-center justify-between rounded border border-slate-200 bg-white px-2 py-1 text-[8px]">
                  <span className="font-semibold">#1 Bellinzona &amp; Locarno</span>
                  <span className="font-mono text-[7px] text-[#0D9488]">NAP 100%</span>
                </div>
              </div>
            </div>
          )}

          {kind === 'agenti-ai' && (
            <div className="h-full w-full bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0C0A09] p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[8px] border-b border-white/10 pb-1">
                <span className="font-bold text-[#FAFAF9]">Voice Receptionist 24/7</span>
                <span className="font-mono" style={{ color: accentHex }}>0.8s</span>
              </div>
              <div className="flex items-end gap-1 h-7 rounded border border-white/10 bg-[#0C0A09]/80 px-2 py-1 my-auto">
                {[35, 70, 50, 90, 65, 85, 45, 75, 55, 80, 60, 92].map((h, idx) => (
                  <span
                    key={idx}
                    className="flex-1 rounded-full bg-[#60A5FA]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[7px] font-mono text-slate-300">
                <span>IT · DE · FR · EN</span>
                <span className="text-[#22C55E]">Prenotazione confermata</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
