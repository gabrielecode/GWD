import { Cpu, Globe, Layers } from 'lucide-react';
import { Language, StatusBadgeType } from '../types/showcase';
import { TRANSLATIONS } from '../data/translations';

interface StatusBadgeProps {
  status: StatusBadgeType;
  lang: Language;
}

export function StatusBadge({ status, lang }: StatusBadgeProps) {
  const label = TRANSLATIONS[lang].badges[status];

  const styles: Record<StatusBadgeType, string> = {
    'live-saas':
      'bg-[#22C55E]/12 text-[#15803D] border-[#22C55E]/35 dark:bg-[#22C55E]/15 dark:text-[#22C55E] dark:border-[#22C55E]/35',
    'client-work':
      'bg-[#FB923C]/12 text-[#C2410C] border-[#FB923C]/35 dark:bg-[#FB923C]/15 dark:text-[#FB923C] dark:border-[#FB923C]/35',
    'ai-division':
      'bg-[#60A5FA]/12 text-[#1D4ED8] border-[#60A5FA]/35 dark:bg-[#60A5FA]/15 dark:text-[#60A5FA] dark:border-[#60A5FA]/35',
  };

  const Icon =
    status === 'live-saas'
      ? Layers
      : status === 'client-work'
      ? Globe
      : Cpu;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium tracking-wide whitespace-nowrap shrink-0 ${styles[status]}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
