import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-[#57534E] dark:text-[#A8A29E]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="inline-flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-[#57534E]/60 dark:text-[#A8A29E]/60 shrink-0" aria-hidden="true" />
              )}
              {item.path && !isLast ? (
                <button
                  type="button"
                  onClick={() => onNavigate(item.path!)}
                  className="inline-flex items-center gap-1 hover:text-[#141210] dark:hover:text-[#FAFAF9] transition-colors cursor-pointer py-1"
                >
                  {idx === 0 && <Home className="h-3.5 w-3.5 text-[#0F766E] dark:text-[#2DD4BF]" aria-hidden="true" />}
                  <span>{item.label}</span>
                </button>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'text-[#141210] dark:text-[#FAFAF9] font-medium' : ''}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
