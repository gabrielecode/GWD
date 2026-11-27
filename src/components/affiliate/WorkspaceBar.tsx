import { LogOut, Shield, Users, Wallet, UserCheck } from 'lucide-react';

interface WorkspaceBarProps {
  currentPath: string;
  breadcrumb: string[];
  userEmail?: string | null;
  storageMode?: 'supabase' | 'sqlite';
  onNavigate: (path: string) => void;
  onLogout?: () => void;
}

export function WorkspaceBar({
  currentPath,
  breadcrumb,
  userEmail,
  storageMode,
  onNavigate,
  onLogout,
}: WorkspaceBarProps) {
  const navLinks = [
    { label: 'Admin Agenti', path: '/admin/affiliates', icon: Users },
    { label: 'Admin Payouts', path: '/admin/payouts', icon: Wallet },
    { label: 'Area Agenti', path: '/affiliate', icon: UserCheck },
  ];

  return (
    <div className="border-b border-[#E5E2DC] bg-white/85 dark:border-[#292524] dark:bg-[#1C1917]/75">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#57534E] dark:text-[#A8A29E] min-w-0">
          <Shield className="h-3.5 w-3.5 text-[#0F766E] dark:text-[#2DD4BF] shrink-0" aria-hidden="true" />
          {breadcrumb.map((part, idx) => (
            <span key={part} className="inline-flex items-center gap-2 truncate">
              {idx > 0 && <span aria-hidden="true">/</span>}
              <span className={idx === breadcrumb.length - 1 ? 'text-[#141210] dark:text-[#FAFAF9] font-medium' : ''}>
                {part}
              </span>
            </span>
          ))}
          {storageMode && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px] text-[#57534E] dark:text-[#A8A29E]">
                {storageMode === 'supabase' ? 'Supabase Postgres' : 'SQLite Locale'}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <nav aria-label="Navigazione Portale Affiliati" className="flex items-center gap-1 rounded-lg bg-[#F3F1EC] border border-[#E5E2DC] dark:bg-[#0C0A09] dark:border-[#292524] p-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => onNavigate(item.path)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[34px] ${
                    active
                      ? 'bg-[#2DD4BF] text-[#0C0A09] font-semibold'
                      : 'text-[#57534E] hover:text-[#141210] dark:text-[#A8A29E] dark:hover:text-[#FAFAF9]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {userEmail && onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E2DC] bg-white px-3 py-1.5 text-xs font-medium text-[#57534E] hover:text-[#141210] hover:border-[#D6D3CD] dark:border-[#292524] dark:bg-[#0C0A09] dark:text-[#A8A29E] dark:hover:text-[#FAFAF9] dark:hover:border-[#3A3431] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px]"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Esci ({userEmail})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
