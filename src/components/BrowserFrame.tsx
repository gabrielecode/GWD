import { ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Monitor, Smartphone } from 'lucide-react';
import { ThumbnailSkeletonOverlay } from './ProjectCardSkeleton';

export interface BrowserFrameProps {
  url: string;
  domainLabel: string;
  title: string;
  allowScreenshotApi?: boolean;
  accent?: 'saas' | 'agency' | 'ai' | 'neutral';
  previewImage?: string;
  fallbackContent: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function BrowserFrame({
  url,
  domainLabel,
  title,
  allowScreenshotApi = true,
  accent = 'neutral',
  previewImage,
  fallbackContent,
  children,
  className = '',
}: BrowserFrameProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageWidth, setStageWidth] = useState(320);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [screenshotLoaded, setScreenshotLoaded] = useState(false);
  const [screenshotError, setScreenshotError] = useState(false);
  const [fallbackSettled, setFallbackSettled] = useState(false);

  const shouldUseScreenshot = !previewImage && allowScreenshotApi && !screenshotError;
  const isPreviewReady = shouldUseScreenshot ? screenshotLoaded : true;
  const showSkeleton = shouldUseScreenshot && !isPreviewReady && !fallbackSettled;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateWidth = () => {
      const next = el.clientWidth;
      if (next > 0) setStageWidth(next);
    };

    updateWidth();
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect.width > 0) {
        setStageWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setScreenshotLoaded(false);
    setScreenshotError(false);
    setFallbackSettled(false);
  }, [url, viewportMode]);

  useEffect(() => {
    if (!shouldUseScreenshot || isPreviewReady) return;
    const timer = window.setTimeout(() => setFallbackSettled(true), 2200);
    return () => window.clearTimeout(timer);
  }, [shouldUseScreenshot, isPreviewReady, viewportMode]);

  const backdrop =
    accent === 'ai'
      ? 'radial-gradient(circle at 80% 15%, rgba(96, 165, 250, 0.24), rgba(28, 25, 23, 0.96) 65%, rgba(12, 10, 9, 1) 100%)'
      : accent === 'saas'
      ? 'radial-gradient(circle at 80% 15%, rgba(45, 212, 191, 0.22), rgba(28, 25, 23, 0.96) 65%, rgba(12, 10, 9, 1) 100%)'
      : accent === 'agency'
      ? 'radial-gradient(circle at 80% 15%, rgba(251, 191, 36, 0.24), rgba(28, 25, 23, 0.96) 65%, rgba(12, 10, 9, 1) 100%)'
      : 'radial-gradient(circle at 80% 15%, rgba(168, 162, 158, 0.16), rgba(28, 25, 23, 0.96) 65%, rgba(12, 10, 9, 1) 100%)';

  const sheenColor =
    accent === 'ai'
      ? 'rgba(96, 165, 250, 0.16)'
      : accent === 'saas'
      ? 'rgba(45, 212, 191, 0.16)'
      : accent === 'agency'
      ? 'rgba(251, 191, 36, 0.16)'
      : 'rgba(250, 250, 249, 0.1)';

  const mobilePhoneBoxWidth = Math.min(stageWidth * 0.44, 154);

  const screenshotApiUrl = `https://api.microlink.io/?url=${encodeURIComponent(
    url
  )}&screenshot=true&meta=false&embed=screenshot.url${
    viewportMode === 'mobile' ? '&viewport.isMobile=true&viewport.width=390&viewport.height=720' : '&viewport.width=1280&viewport.height=800'
  }`;

  return (
    <div
      className={`group/thumb relative w-full overflow-hidden rounded-xl border border-[#292524] p-2 sm:p-2.5 flex flex-col justify-end perspective-midrange transition-colors duration-300 group-hover:border-[#FAFAF9]/20 ${className}`}
      style={{ background: backdrop }}
    >
      {/* Subtle diagonal glass sheen revealed on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-60 group-hover/thumb:opacity-100"
        style={{
          background: `linear-gradient(125deg, ${sheenColor} 0%, transparent 45%, rgba(250, 250, 249, 0.05) 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Top-right slot (e.g. external arrow or badge overlay inside card header) */}
      {children}

      {/* Elevated 3D Tilt Browser Shell */}
      <div className="relative z-10 w-full rounded-lg border border-[#292524] bg-[#141210] shadow-2xl overflow-hidden transform-3d origin-center transition-all duration-300 ease-out will-change-transform group-hover:scale-[1.015] group-hover:rotate-x-2 group-hover:-rotate-y-1 group-hover/thumb:scale-[1.03] group-hover/thumb:rotate-x-4 group-hover/thumb:-rotate-y-2 group-hover/thumb:-translate-y-0.5 group-hover/thumb:border-[#FAFAF9]/25 group-hover/thumb:shadow-[0_22px_40px_-12px_rgba(0,0,0,0.85)]">
        {/* Chrome Toolbar: Traffic Lights + Clickable Address Bar + Responsive Desktop/Mobile Toggle */}
        <div className="flex items-center justify-between gap-1.5 border-b border-[#292524] bg-[#1C1917] px-2 sm:px-2.5 py-1.5">
          <div className="hidden sm:flex items-center gap-1 shrink-0" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FB923C]/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#FBBF24]/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]/80" />
          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} — ${domainLabel}`}
            className="flex-1 min-w-0 flex items-center justify-center gap-1 rounded bg-[#0C0A09] px-2 py-0.5 font-mono text-[9px] text-[#A8A29E] hover:text-[#FAFAF9] transition-colors"
          >
            <span className="truncate">https://{domainLabel}</span>
            <ArrowUpRight className="h-2.5 w-2.5 shrink-0 opacity-70" aria-hidden="true" />
          </a>

          <div
            className="inline-flex items-center rounded-md border border-[#292524] bg-[#0C0A09] p-0.5 shrink-0"
            role="group"
            aria-label={`Viewport ${title}`}
          >
            <button
              type="button"
              onClick={() => setViewportMode('desktop')}
              aria-pressed={viewportMode === 'desktop'}
              title="Vista Desktop"
              className={`flex h-7 w-7 sm:h-5 sm:w-5 items-center justify-center rounded transition-colors cursor-pointer touch-manipulation ${
                viewportMode === 'desktop'
                  ? 'bg-[#FAFAF9] text-[#0C0A09]'
                  : 'text-[#A8A29E] hover:text-[#FAFAF9]'
              }`}
            >
              <Monitor className="h-3 w-3 sm:h-2.5 sm:w-2.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('mobile')}
              aria-pressed={viewportMode === 'mobile'}
              title="Vista Mobile"
              className={`flex h-7 w-7 sm:h-5 sm:w-5 items-center justify-center rounded transition-colors cursor-pointer touch-manipulation ${
                viewportMode === 'mobile'
                  ? 'bg-[#FAFAF9] text-[#0C0A09]'
                  : 'text-[#A8A29E] hover:text-[#FAFAF9]'
              }`}
            >
              <Smartphone className="h-3 w-3 sm:h-2.5 sm:w-2.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Interactive Clickable Viewport Wrapping the Website Link */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Apri anteprima live di ${title} su ${domainLabel}`}
          className="block relative w-full aspect-video overflow-hidden bg-[#0C0A09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4BF]"
        >
          <div ref={stageRef} className="relative h-full w-full overflow-hidden flex items-center justify-center bg-[#0C0A09]">
            {viewportMode === 'desktop' ? (
              <>
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt={`Anteprima desktop della piattaforma ${title} (${domainLabel})`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain object-center"
                  />
                ) : (
                  <>
                    {/* Crisp Miniature UI Fallback Always Available Underneath */}
                    <div className="absolute inset-0 z-0 h-full w-full">
                      {fallbackContent}
                    </div>

                    {/* Obsidian/Surface Skeleton Overlay While Static Screenshot Loads */}
                    <div
                      className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-400 ${
                        showSkeleton ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <ThumbnailSkeletonOverlay accent={accent} />
                    </div>

                    {/* Static URL Screenshot API Thumbnail */}
                    {shouldUseScreenshot && (
                      <img
                        src={screenshotApiUrl}
                        alt={`Anteprima desktop della piattaforma ${title} (${domainLabel})`}
                        width={1280}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setScreenshotLoaded(true)}
                        onError={() => setScreenshotError(true)}
                        className={`pointer-events-none absolute inset-0 z-20 h-full w-full object-contain object-center transition-opacity duration-500 ${
                          screenshotLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              /* Responsive Mobile Device Stage Centered inside BrowserFrame */
              <div className="h-full w-full bg-gradient-to-b from-[#171412] to-[#0C0A09] flex items-center justify-center p-2">
                <div
                  className="relative h-full rounded-[14px] border-2 border-[#292524] bg-[#0C0A09] shadow-2xl overflow-hidden flex flex-col"
                  style={{ width: `${Math.round(mobilePhoneBoxWidth)}px` }}
                >
                  {/* Smartphone Notch Chrome */}
                  <div className="flex items-center justify-center bg-[#1C1917] py-1 border-b border-[#292524] shrink-0">
                    <span className="h-1 w-6 rounded-full bg-[#292524]" aria-hidden="true" />
                  </div>

                  <div className="relative flex-1 w-full overflow-hidden">
                    <div className="absolute inset-0 z-0 h-full w-full scale-[0.88] origin-top">
                      {fallbackContent}
                    </div>

                    <div
                      className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-400 ${
                        showSkeleton ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <ThumbnailSkeletonOverlay accent={accent} />
                    </div>

                    {shouldUseScreenshot && (
                      <img
                        src={screenshotApiUrl}
                        alt={`Anteprima mobile della piattaforma ${title} (${domainLabel})`}
                        width={390}
                        height={720}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setScreenshotLoaded(true)}
                        onError={() => setScreenshotError(true)}
                        className={`pointer-events-none absolute inset-0 z-20 h-full w-full object-contain object-top transition-opacity duration-500 ${
                          screenshotLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </a>
      </div>
    </div>
  );
}
