import { FormEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import { AlertCircle, KeyRound, Loader2, ShieldCheck, UserPlus } from 'lucide-react';
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
  const [authTab, setAuthTab] = useState<'login' | 'create'>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [passcode, setPasscode] = useState('');

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [masterPasscode, setMasterPasscode] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    setChecking(true);
    setError(null);
    try {
      const cfg = await affiliateApi.getAuthStatus();
      setStatus(cfg);
      if (cfg.config_error) {
        setError(cfg.config_error);
      } else if (cfg.needs_admin_setup && !cfg.has_master_passcode) {
        setAuthTab('create');
      }
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

  const handleCreateAdmin = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (newPassword.trim().length < 8) {
      setError('La password deve avere almeno 8 caratteri.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Le due password non coincidono.');
      return;
    }
    setSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      const res = await affiliateApi.createAdminAccount({
        email: newEmail.trim(),
        password: newPassword,
        master_passcode: masterPasscode.trim() || undefined,
      });
      setNewPassword('');
      setConfirmPassword('');
      setMasterPasscode('');
      if (res.token) {
        setAdminEmail(res.email);
      } else {
        setLoginEmail(res.email);
        setAuthTab('login');
        setNotice(`Utente Admin ${res.email} creato! Ora puoi accedere.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Creazione utente Admin non riuscita.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      const res = await affiliateApi.loginAdmin(
        passcode,
        loginEmail.trim() || undefined
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

  const requiresAuthorizationCode =
    !status?.needs_admin_setup || Boolean(status?.has_master_passcode);

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
              {authTab === 'create'
                ? status?.needs_admin_setup
                  ? 'Crea Primo Utente Admin'
                  : 'Nuovo Utente Admin'
                : 'Accesso Console Admin'}
            </h1>
            <p className="text-sm text-[#A8A29E] leading-relaxed">
              {authTab === 'create'
                ? status?.needs_admin_setup && !status?.has_master_passcode
                  ? 'Primo avvio: crea il tuo account amministratore con email e password per accedere alla console.'
                  : 'Crea un nuovo account amministratore autorizzato con il Passcode Master o la password di un Admin.'
                : status?.supabase_configured
                ? 'Accedi con il tuo account amministratore Supabase Auth (claim role = admin).'
                : 'Inserisci email e password oppure il passcode amministratore configurato.'}
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-[#0C0A09] border border-[#292524] p-1">
            <button
              type="button"
              onClick={() => {
                setAuthTab('login');
                setError(null);
                setNotice(null);
              }}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium cursor-pointer ${
                authTab === 'login'
                  ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                  : 'text-[#A8A29E] hover:text-[#FAFAF9]'
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Accedi</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab('create');
                setError(null);
                setNotice(null);
              }}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium cursor-pointer ${
                authTab === 'create'
                  ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                  : 'text-[#A8A29E] hover:text-[#FAFAF9]'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Crea Utente Admin</span>
            </button>
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

          {notice && (
            <div
              role="status"
              className="rounded-lg border border-[#22C55E]/40 bg-[#0C0A09] p-3 text-xs text-[#22C55E]"
            >
              {notice}
            </div>
          )}

          {authTab === 'create' ? (
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label
                  htmlFor="create-admin-email"
                  className="block text-xs font-medium text-[#FAFAF9] mb-1.5"
                >
                  Email Nuovo Admin
                </label>
                <input
                  id="create-admin-email"
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="admin@kreativalab.ch"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3.5 py-2.5 text-sm text-[#FAFAF9] focus:border-[#2DD4BF] focus:outline-none min-h-[42px]"
                />
              </div>

              <div>
                <label
                  htmlFor="create-admin-password"
                  className="block text-xs font-medium text-[#FAFAF9] mb-1.5"
                >
                  Password (min. 8 caratteri)
                </label>
                <input
                  id="create-admin-password"
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3.5 py-2.5 text-sm text-[#FAFAF9] focus:border-[#2DD4BF] focus:outline-none min-h-[42px]"
                />
              </div>

              <div>
                <label
                  htmlFor="create-admin-confirm"
                  className="block text-xs font-medium text-[#FAFAF9] mb-1.5"
                >
                  Conferma Password
                </label>
                <input
                  id="create-admin-confirm"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3.5 py-2.5 text-sm text-[#FAFAF9] focus:border-[#2DD4BF] focus:outline-none min-h-[42px]"
                />
              </div>

              {requiresAuthorizationCode && (
                <div>
                  <label
                    htmlFor="create-admin-master"
                    className="block text-xs font-medium text-[#FAFAF9] mb-1.5"
                  >
                    {status?.has_master_passcode
                      ? 'Passcode Master (ADMIN_PASSCODE)'
                      : 'Password Admin esistente (autorizzazione)'}
                  </label>
                  <input
                    id="create-admin-master"
                    type="password"
                    required
                    value={masterPasscode}
                    onChange={(e) => setMasterPasscode(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3.5 py-2.5 text-sm text-[#FAFAF9] focus:border-[#2DD4BF] focus:outline-none min-h-[42px]"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2DD4BF] px-4 py-2.5 text-sm font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity cursor-pointer min-h-[42px] disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                )}
                <span>Crea Utente Admin</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-supa-email"
                  className="block text-xs font-medium text-[#FAFAF9] mb-1.5"
                >
                  {status?.supabase_configured ? 'Email Admin' : 'Email Admin (opzionale con passcode)'}
                </label>
                <input
                  id="admin-supa-email"
                  type="email"
                  required={Boolean(status?.supabase_configured)}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@kreativalab.ch"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3.5 py-2.5 text-sm text-[#FAFAF9] focus:border-[#2DD4BF] focus:outline-none min-h-[42px]"
                />
              </div>

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
