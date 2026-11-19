export function ThumbnailSkeletonOverlay({
  accent = 'neutral',
}: {
  accent?: 'saas' | 'agency' | 'ai' | 'neutral';
}) {
  const pillTint =
    accent === 'saas'
      ? 'bg-[#2DD4BF]/20 border-[#2DD4BF]/25'
      : accent === 'agency'
      ? 'bg-[#FBBF24]/20 border-[#FBBF24]/25'
      : accent === 'ai'
      ? 'bg-[#60A5FA]/20 border-[#60A5FA]/25'
      : 'bg-[#292524]/70 border-[#292524]';

  return (
    <div
      className="h-full w-full bg-[#0C0A09] p-3 flex flex-col justify-between"
      aria-hidden="true"
    >
      {/* Skeleton Navbar inside miniature browser */}
      <div className="flex items-center justify-between border-b border-[#292524] pb-2">
        <div className="skeleton-surface h-2.5 w-20 rounded-md" />
        <div className="flex items-center gap-1.5">
          <div className="skeleton-surface h-2 w-8 rounded" />
          <div className={`h-3 w-12 rounded-full border ${pillTint}`} />
        </div>
      </div>

      {/* Skeleton Hero / Content grid inside miniature browser */}
      <div className="my-auto grid grid-cols-12 gap-2.5 items-center py-1">
        <div className="col-span-7 space-y-2">
          <div className="skeleton-surface h-3 w-11/12 rounded-md" />
          <div className="skeleton-surface h-2.5 w-3/4 rounded-md" />
          <div className="skeleton-surface h-2 w-1/2 rounded-md opacity-75" />
        </div>
        <div className="col-span-5 rounded-lg border border-[#292524] bg-[#1C1917] p-2 space-y-1.5">
          <div className="skeleton-obsidian h-2 w-10 rounded" />
          <div className="skeleton-surface h-3.5 w-14 rounded-md" />
          <div className="skeleton-obsidian h-2 w-full rounded" />
        </div>
      </div>

      {/* Skeleton bottom metrics strip */}
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        <div className="skeleton-surface h-5 rounded-md border border-[#292524]" />
        <div className="skeleton-surface h-5 rounded-md border border-[#292524]" />
        <div className="skeleton-surface h-5 rounded-md border border-[#292524]" />
      </div>
    </div>
  );
}

export function ProjectCardSkeleton({
  accent = 'neutral',
}: {
  accent?: 'saas' | 'agency' | 'ai' | 'neutral';
}) {
  return (
    <div
      className="rounded-2xl border border-[#292524] bg-[#1C1917] p-4 sm:p-5 flex flex-col justify-between"
      aria-hidden="true"
    >
      <div>
        {/* Browser Frame Thumbnail Skeleton */}
        <div className="mb-4 w-full overflow-hidden rounded-xl border border-[#292524] bg-[#0C0A09] p-2.5">
          <div className="w-full rounded-lg border border-[#292524] bg-[#141210] overflow-hidden">
            {/* Window Top Bar */}
            <div className="flex items-center justify-between gap-2 border-b border-[#292524] bg-[#1C1917] px-2.5 py-1.5">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#292524]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#292524]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#292524]" />
              </div>
              <div className="skeleton-obsidian h-3 flex-1 max-w-[160px] rounded" />
              <span className="w-4" />
            </div>

            {/* 16:10 Viewport Skeleton */}
            <div className="w-full aspect-[16/10] overflow-hidden">
              <ThumbnailSkeletonOverlay accent={accent} />
            </div>
          </div>
        </div>

        {/* Category · Sector line */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="skeleton-obsidian h-3 w-24 rounded-full" />
          <span className="h-1 w-1 rounded-full bg-[#292524]" />
          <div className="skeleton-obsidian h-3 w-32 rounded-full" />
        </div>

        {/* Card Title */}
        <div className="skeleton-surface h-6 w-2/3 rounded-lg mb-3" />

        {/* Card Description lines */}
        <div className="space-y-2 mb-5">
          <div className="skeleton-obsidian h-3.5 w-full rounded-md" />
          <div className="skeleton-obsidian h-3.5 w-11/12 rounded-md" />
          <div className="skeleton-obsidian h-3.5 w-3/4 rounded-md" />
        </div>
      </div>

      {/* Footer Divider + Badge + Action Pill Skeleton */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#292524]">
        <div className="skeleton-obsidian h-6 w-24 rounded-full border border-[#292524]" />
        <div className="skeleton-surface h-9 w-28 rounded-full border border-[#292524]" />
      </div>
    </div>
  );
}
