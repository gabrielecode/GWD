import { FormEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import { AlertCircle, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { affiliateApi, AuthConfigStatus } from '../../lib/affiliateClient';
import { WorkspaceBar } from './WorkspaceBar';

interface AdminAuthGateProps {
  currentPath: string;
  breadcrumb: string[];
  onNavigate: (path: string) => void;
  children: (ctx: {
    adminEmail: string;
    storageMode: 'supabase' | 'sqlite';
    onLogout: () => void;
  }) => ReactNode;
}

export function AdminAuthGate({
  currentPath,
  breadcrumb,
  onNavigate,
  children,
}: AdminAuthGateProps) {
  const [status, setStatus] = useState<AuthConfigStatus | null>(null);
  const [checking, setChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [passcode, setPasscode] = useState('');
  const [supabaseEmail, setSupabaseEmail] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    setChecking(true);
    setError(null);
    try {
      const cfg = await affiliateApi.getAuthStatus();
      setStatus(cfg);
      try {
        const me = await affiliateApi.getSessionMe();
        if (me.role === 'admin') {
          setAdminEmail(me.email);
        } else {
          setAdminEmail(null);
        }
      } catch {
        setAdminEmail(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossibile verificare lo stato di autenticazione.');
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  const handleSetupAdmin = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (passcode.trim().length < 8) {
      setError('La password deve avere almeno 8 caratteri.');
      return;
    }
    if (passcode !== confirmPasscode) {
      setError('Le due password non coincidono.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await affiliateApi.setupAdmin(passcode);
      setAdminEmail(res.email);
      setPasscode('');
      setConfirmPasscode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Configurazione Admin non riuscita.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await affiliateApi.loginAdmin(
        passcode,
        status?.supabase_configured ? supabaseEmail : undefined
      );
      setAdminEmail(res.email);
      setPasscode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Accesso non riuscito.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await affiliateApi.logout();
    setAdminEmail(null);
    void checkSession();
  };

  if (checking) {
    return (
      <div className="min-h-[70vh] flex flex-col">
        <WorkspaceBar
          currentPath={currentPath}
          breadcrumb={breadcrumb}
          onNavigate={onNavigate}
        />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="inline-flex items-center gap-2 text-sm text-[#A8A29E]">
            <Loader2 className="h-4 w-4 animate-spin text-[#2DD4BF]" aria-hidden="true" />
            <span>Verifica sessione amministratore...</span>
          </div>
        </div>
      </div>
    );
  }

  if (adminEmail) {
    return (
      <>
        {children({
          adminEmail,
          storageMode: status?.storage_mode || 'sqlite',
          onLogout: handleLogout,
        })}
      </>
    );
  }

  return (
    <div className="min-h-[75vh] flex flex-col">
      <WorkspaceBar
        currentPath={currentPath}
        breadcrumb={breadcrumb}
        storageMode={status?.storage_mode}
        onNavigate={onNavigate}
      />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-[#292524] bg-[#1C1917] p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#2DD4BF]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>Area Riservata Amministrazione</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-[#FAFAF9]">
              {status?.needs_admin_setup
                ? 'Inizializza Password Admin'
                : 'Accesso Console Admin'}
            </h1>
            <p className="text-sm text-[#A8A29E] leading-relaxed">
              {status?.needs_admin_setup
                ? 'Primo avvio locale: imposta la password amministratore per proteggere agenti, candidature e liquidazioni CHF.'
                : status?.supabase_configured
                ? 'Accedi con il tuo account amministratore Supabase Auth (claim role = admin).'
                : 'Inserisci il passcode o la password amministratore configurata per accedere al pannello.'}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-[#FB923C]/40 bg-[#0C0A09] p-3 text-xs text-[#FB923C] flex items-start gap-2"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {status?.needs_admin_setup ? (
            <form onSubmit={handleSetupAdmin} className="space-y-4">
              <div>
                <label
                  htmlFor="setup-admin-password"
                  className="block text-xs font-medium text-[#FAFAF9] mb-1.5"
                >
                  Nuova password Admin (min. 8 caratteri)
                </label>
                <input
                  id="setup-admin-password"
                  type="password"
                  required
                  minLength={8}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3.5 py-2.5 text-sm text-[#FAFAF9] focus:border-[#2DD4BF] focus:outline-none min-h-[42px]"
                />
              </div>
              <div>
                <label
                  htmlFor="setup-admin-confirm"
                  className="block text-xs font-medium text-[#FAFAF9] mb-1.5"
                >
                  Conferma password
                </label>
                <input
                  id="setup-admin-confirm"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3.5 py-2.5 text-sm text-[#FAFAF9] focus:border-[#2DD4BF] focus:outline-none min-h-[42px]"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2DD4BF] px-4 py-2.5 text-sm font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity cursor-pointer min-h-[42px] disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                <span>Attiva Console Admin</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {status?.supabase_configured && (
                <div>
                  <label
                    htmlFor="admin-supa-email"
                    className="block text-xs font-medium text-[#FAFAF9] mb-1.5"
                  >
                    Email Admin
                  </label>
                  <input
                    id="admin-supa-email"
                    type="email"
                    required
                    value={supabaseEmail}
                    onChange={(e) => setSupabaseEmail(e.target.value)}
                    placeholder="admin@kreativalab.ch"
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3.5 py-2.5 text-sm text-[#FAFAF9] focus:border-[#2DD4BF] focus:outline-none min-h-[42px]"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="admin-passcode"
                  className="block text-xs font-medium text-[#FAFAF9] mb-1.5"
                >
                  {status?.supabase_configured ? 'Password' : 'Password / Passcode Admin'}
                </label>
                <input
                  id="admin-passcode"
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3.5 py-2.5 text-sm text-[#FAFAF9] focus:border-[#2DD4BF] focus:outline-none min-h-[42px]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2DD4BF] px-4 py-2.5 text-sm font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity cursor-pointer min-h-[42px] disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <KeyRound className="h-4 w-4" aria-hidden="true" />
                )}
                <span>Accedi</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
