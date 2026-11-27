import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  KeyRound,
  Loader2,
  Plus,
  UserPlus,
} from 'lucide-react';
import { AffiliatePortalData, PayoutStatus } from '../types/affiliate';
import { affiliateApi } from '../lib/affiliateClient';
import {
  CH_STANDARD_VAT_RATE,
  formatChf,
  formatIbanDisplay,
  formatPercent,
  getDaysRemaining,
  PAYOUT_MIN_THRESHOLD_CHF,
  round2,
  SWISS_CANTONS,
  validateAvsOrIdi,
  validateIban,
  validateVatNumber,
} from '../lib/affiliateRules';
import { WorkspaceBar } from '../components/affiliate/WorkspaceBar';

interface AffiliatePortalViewProps {
  onNavigate: (path: string) => void;
}

type PortalTab = 'sales' | 'leads' | 'customers' | 'payouts' | 'profile';

const PAYOUT_LABELS: Record<PayoutStatus, string> = {
  draft: 'In preparazione',
  statement_sent: 'Estratto ricevuto — Invia fattura',
  invoice_received: 'Fattura inviata — Pagamento entro 30gg',
  paid: 'Pagato su IBAN',
  cancelled: 'Annullato',
};

export function AffiliatePortalView({ onNavigate }: AffiliatePortalViewProps) {
  const [checking, setChecking] = useState(true);
  const [portalData, setPortalData] = useState<AffiliatePortalData | null>(null);
  const [authTab, setAuthTab] = useState<'login' | 'apply'>('login');
  const [portalTab, setPortalTab] = useState<PortalTab>('sales');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Public application form
  const [appForm, setAppForm] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    canton_or_country: 'Ticino (CH)',
    website_or_linkedin: '',
    experience_and_network: '',
    accept_terms: false,
  });
  const [appSuccess, setAppSuccess] = useState(false);

  // Portal Lead Form
  const [leadForm, setLeadForm] = useState({
    client_name: '',
    client_company: '',
    client_email: '',
    client_phone: '',
    service_interest: 'Sito Web + SEO Locale',
    estimated_deal_size: '',
    notes: '',
  });

  // Portal Invoice Submission Form
  const [invoiceTargetId, setInvoiceTargetId] = useState<string | null>(null);
  const [invoiceNum, setInvoiceNum] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Portal Profile Form
  const [profileForm, setProfileForm] = useState({
    name: '',
    company_name: '',
    phone: '',
    address: '',
    postal_code: '',
    city: '',
    canton: 'TI',
    iban: '',
    avs_idi_number: '',
    is_vat_registered: false,
    vat_number: '',
  });

  const [copiedRef, setCopiedRef] = useState(false);

  const hydrateProfileForm = (data: AffiliatePortalData) => {
    const a = data.affiliate;
    setProfileForm({
      name: a.name,
      company_name: a.company_name || '',
      phone: a.phone || '',
      address: a.address || '',
      postal_code: a.postal_code || '',
      city: a.city || '',
      canton: a.canton || 'TI',
      iban: a.iban || '',
      avs_idi_number: a.avs_idi_number || '',
      is_vat_registered: a.is_vat_registered,
      vat_number: a.vat_number || '',
    });
  };

  const loadPortal = useCallback(async () => {
    setChecking(true);
    try {
      const me = await affiliateApi.getSessionMe();
      if (me.role === 'affiliate') {
        const data = await affiliateApi.getPortalData();
        setPortalData(data);
        hydrateProfileForm(data);
      } else {
        setPortalData(null);
      }
    } catch {
      setPortalData(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void loadPortal();
  }, [loadPortal]);

  const ibanCheck = useMemo(
    () => (profileForm.iban.trim() ? validateIban(profileForm.iban) : null),
    [profileForm.iban]
  );
  const avsCheck = useMemo(
    () => (profileForm.avs_idi_number.trim() ? validateAvsOrIdi(profileForm.avs_idi_number) : null),
    [profileForm.avs_idi_number]
  );
  const vatCheck = useMemo(
    () => (profileForm.vat_number.trim() ? validateVatNumber(profileForm.vat_number) : null),
    [profileForm.vat_number]
  );

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (authBusy) return;
    setAuthBusy(true);
    setError(null);
    try {
      await affiliateApi.loginAffiliate(loginEmail, loginPassword);
      setLoginPassword('');
      await loadPortal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Accesso non riuscito.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleApply = async (e: FormEvent) => {
    e.preventDefault();
    if (authBusy) return;
    setAuthBusy(true);
    setError(null);
    try {
      await affiliateApi.submitApplication(appForm);
      setAppSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invio candidatura fallito.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    await affiliateApi.logout();
    setPortalData(null);
  };

  const handleRegisterLead = async (e: FormEvent) => {
    e.preventDefault();
    if (authBusy) return;
    setAuthBusy(true);
    setError(null);
    setNotice(null);
    try {
      await affiliateApi.registerPortalLead({
        ...leadForm,
        estimated_deal_size: leadForm.estimated_deal_size
          ? Number(leadForm.estimated_deal_size)
          : null,
      });
      setLeadForm({
        client_name: '',
        client_company: '',
        client_email: '',
        client_phone: '',
        service_interest: 'Sito Web + SEO Locale',
        estimated_deal_size: '',
        notes: '',
      });
      setNotice('Lead registrato in esclusiva per 90 giorni (First-Touch confermato).');
      await loadPortal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrazione lead fallita.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSubmitInvoice = async (e: FormEvent) => {
    e.preventDefault();
    if (!invoiceTargetId || authBusy) return;
    setAuthBusy(true);
    setError(null);
    setNotice(null);
    try {
      await affiliateApi.submitPortalInvoice(invoiceTargetId, {
        agent_invoice_number: invoiceNum,
        agent_invoice_date: invoiceDate,
      });
      setInvoiceTargetId(null);
      setInvoiceNum('');
      setNotice('Fattura trasmessa a Kreativalab. Pagamento su IBAN entro 30 giorni.');
      await loadPortal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invio fattura fallito.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (authBusy) return;
    setAuthBusy(true);
    setError(null);
    setNotice(null);
    try {
      await affiliateApi.updatePortalProfile(profileForm);
      setNotice('Dati anagrafici, fiscali e IBAN aggiornati e verificati.');
      await loadPortal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Aggiornamento dati non riuscito.');
    } finally {
      setAuthBusy(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-[70vh] flex flex-col">
        <WorkspaceBar
          currentPath="/affiliate"
          breadcrumb={['Kreativalab', 'Portale Agenti CO 418a']}
          onNavigate={onNavigate}
        />
        <div className="flex-1 flex items-center justify-center p-8 text-sm text-[#A8A29E] gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-[#2DD4BF]" aria-hidden="true" />
          <span>Caricamento area agenti...</span>
        </div>
      </div>
    );
  }

  // PRE-LOGIN VIEW (Login + Public Application Form)
  if (!portalData) {
    return (
      <div className="min-h-screen pb-16">
        <WorkspaceBar
          currentPath="/affiliate"
          breadcrumb={['Kreativalab', 'Programma Agenti & Affiliati']}
          onNavigate={onNavigate}
        />

        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: CO 418a Transparent Terms Summary */}
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-mono text-[#2DD4BF]">
                  Mandato di Agenzia Commerciale · CO Art. 418a segg.
                </p>
                <h1 className="font-display text-3xl font-bold text-[#FAFAF9]">
                  Portale Agenti &amp; Partner Kreativalab
                </h1>
                <p className="text-sm text-[#A8A29E] leading-relaxed">
                  Collabora con Kreativalab in Ticino e Svizzera promuovendo piattaforme SaaS, siti web ad alte prestazioni, SEO locale e agenti vocali AI.
                </p>
              </div>

              <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-3 text-xs">
                <h2 className="font-display text-sm font-semibold text-[#FAFAF9]">
                  Condizioni Economiche &amp; Regole Chiave
                </h2>
                <ul className="space-y-2 text-[#A8A29E]">
                  <li>
                    <strong className="text-[#FAFAF9]">Provvigione 20%:</strong> calcolata sul netto incassato (Lordo − IVA − sconti − costi terzi/licenze/ads/hosting).
                  </li>
                  <li>
                    <strong className="text-[#FAFAF9]">Ricorrenze 12 mesi:</strong> 20% sui canoni incassati nei primi 12 mesi dall’attivazione; pacchetti calcolati separatamente tra quota one-off e canone.
                  </li>
                  <li>
                    <strong className="text-[#FAFAF9]">Esclusiva Lead 90 giorni:</strong> priorità First-Touch garantita sui lead registrati in piattaforma.
                  </li>
                  <li>
                    <strong className="text-[#FAFAF9]">Estratti &amp; Pagamenti:</strong> estratto emesso entro il 5 del mese successivo (soglia minima CHF 50.00 con rollover automatico); pagamento entro 30 giorni dalla fattura su IBAN CH/SEPA.
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Login / Application Tabs */}
            <div className="lg:col-span-7 rounded-xl border border-[#292524] bg-[#1C1917] p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-1 rounded-lg bg-[#0C0A09] border border-[#292524] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login');
                    setError(null);
                  }}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium cursor-pointer ${
                    authTab === 'login'
                      ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                      : 'text-[#A8A29E] hover:text-[#FAFAF9]'
                  }`}
                >
                  <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Accedi Area Agenti</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('apply');
                    setError(null);
                  }}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium cursor-pointer ${
                    authTab === 'apply'
                      ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                      : 'text-[#A8A29E] hover:text-[#FAFAF9]'
                  }`}
                >
                  <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Candidatura Nuovo Agente</span>
                </button>
              </div>

              {error && (
                <div role="alert" className="rounded-lg border border-[#FB923C]/50 bg-[#0C0A09] p-3 text-xs text-[#FB923C] flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              {authTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4 text-xs">
                  <div>
                    <label htmlFor="aff-login-email" className="block text-[#FAFAF9] font-medium mb-1.5">
                      Email Agente
                    </label>
                    <input
                      id="aff-login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="nome@azienda.ch"
                      className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3.5 py-2.5 text-sm text-[#FAFAF9] min-h-[42px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="aff-login-password" className="block text-[#FAFAF9] font-medium mb-1.5">
                      Password
                    </label>
                    <input
                      id="aff-login-password"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3.5 py-2.5 text-sm text-[#FAFAF9] min-h-[42px]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={authBusy}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2DD4BF] px-4 py-3 text-sm font-semibold text-[#0C0A09] cursor-pointer disabled:opacity-50 min-h-[44px]"
                  >
                    {authBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    <span>Entra nel Portale Agenti</span>
                  </button>
                </form>
              ) : appSuccess ? (
                <div className="rounded-lg border border-[#22C55E]/40 bg-[#0C0A09] p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[#22C55E] font-semibold text-sm">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    <span>Candidatura inviata con successo</span>
                  </div>
                  <p className="text-xs text-[#A8A29E] leading-relaxed">
                    Il team Kreativalab verificherà la tua candidatura. Una volta approvata, riceverai il tuo codice referral univoco e le credenziali di accesso all’area agenti.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAppSuccess(false);
                      setAuthTab('login');
                    }}
                    className="rounded-lg border border-[#292524] bg-[#1C1917] px-4 py-2 text-xs text-[#FAFAF9] cursor-pointer"
                  >
                    Torna al Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#A8A29E] mb-1">Nome e Cognome *</label>
                      <input
                        required
                        value={appForm.name}
                        onChange={(e) => setAppForm((p) => ({ ...p, name: e.target.value }))}
                        className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A8A29E] mb-1">Ragione Sociale / Ditta</label>
                      <input
                        value={appForm.company_name}
                        onChange={(e) => setAppForm((p) => ({ ...p, company_name: e.target.value }))}
                        className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A8A29E] mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={appForm.email}
                        onChange={(e) => setAppForm((p) => ({ ...p, email: e.target.value }))}
                        className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A8A29E] mb-1">Telefono</label>
                      <input
                        value={appForm.phone}
                        onChange={(e) => setAppForm((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+41 79 000 00 00"
                        className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A8A29E] mb-1">Cantone / Paese *</label>
                      <input
                        required
                        value={appForm.canton_or_country}
                        onChange={(e) =>
                          setAppForm((p) => ({ ...p, canton_or_country: e.target.value }))
                        }
                        className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A8A29E] mb-1">Sito Web o LinkedIn</label>
                      <input
                        value={appForm.website_or_linkedin}
                        onChange={(e) =>
                          setAppForm((p) => ({ ...p, website_or_linkedin: e.target.value }))
                        }
                        placeholder="https://linkedin.com/in/..."
                        className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#A8A29E] mb-1">
                      Esperienza B2B &amp; Network Commerciale *
                    </label>
                    <textarea
                      required
                      minLength={15}
                      rows={3}
                      value={appForm.experience_and_network}
                      onChange={(e) =>
                        setAppForm((p) => ({ ...p, experience_and_network: e.target.value }))
                      }
                      placeholder="Descrivi brevemente i settori PMI / Ticino in cui operi e i contatti commerciali."
                      className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                    />
                  </div>
                  <label className="flex items-start gap-2.5 text-[#A8A29E] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appForm.accept_terms}
                      onChange={(e) =>
                        setAppForm((p) => ({ ...p, accept_terms: e.target.checked }))
                      }
                      className="mt-0.5 accent-[#2DD4BF]"
                    />
                    <span>
                      Accetto le condizioni di collaborazione commerciale ai sensi dell’art. 418a segg. CO (commissione sul netto incassato, esclusiva lead 90gg, soglia payout CHF 50.00).
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={authBusy}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2DD4BF] px-4 py-3 text-sm font-semibold text-[#0C0A09] cursor-pointer disabled:opacity-50 min-h-[44px]"
                  >
                    {authBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    <span>Invia Candidatura Agente</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED AFFILIATE DASHBOARD
  const aff = portalData.affiliate;
  const referralLink = `https://www.kreativalab.ch/?ref=${aff.code}`;

  return (
    <div className="min-h-screen pb-16">
      <WorkspaceBar
        currentPath="/affiliate"
        breadcrumb={['Kreativalab', 'Portale Agenti', aff.name]}
        userEmail={aff.email}
        storageMode={portalData.storage_mode}
        onNavigate={onNavigate}
        onLogout={handleLogout}
      />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Agent Header & Referral Link */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-[#292524] bg-[#1C1917] p-5 sm:p-6">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#A8A29E]">
              <span className="font-mono text-[#2DD4BF] font-semibold">{aff.code}</span>
              <span aria-hidden="true">·</span>
              <span>Aliquota {formatPercent(aff.commission_rate)}</span>
              <span aria-hidden="true">·</span>
              <span>{aff.is_vat_registered ? `IVA ${aff.vat_number}` : 'Non assoggettato IVA'}</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-[#FAFAF9]">
              Benvenuto, {aff.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-xs text-[#A8A29E] truncate max-w-full sm:max-w-xs">
              {referralLink}
            </div>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(referralLink);
                setCopiedRef(true);
                setTimeout(() => setCopiedRef(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2DD4BF] px-3.5 py-2 text-xs font-semibold text-[#0C0A09] cursor-pointer min-h-[38px]"
            >
              {copiedRef ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
              <span>{copiedRef ? 'Copiato' : 'Copia Link'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-[#FB923C]/50 bg-[#1C1917] p-4 text-xs text-[#FB923C] flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {notice && (
          <div className="rounded-xl border border-[#22C55E]/40 bg-[#1C1917] p-4 text-xs text-[#22C55E] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{notice}</span>
          </div>
        )}

        {/* 4-column KPI Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-1">
            <p className="text-xs text-[#A8A29E]">Provvigioni Maturate (Da Liquidare)</p>
            <p className="font-mono text-2xl font-bold text-[#2DD4BF] tabular-nums">
              {formatChf(portalData.kpis.accrued_unpaid_chf)}
            </p>
            <p className="text-xs text-[#A8A29E]">
              {portalData.kpis.below_threshold_rollover
                ? `Sotto soglia CHF ${PAYOUT_MIN_THRESHOLD_CHF.toFixed(2)}: rollover mese successivo`
                : 'Idoneo al prossimo estratto mensile'}
            </p>
          </div>

          <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-1">
            <p className="text-xs text-[#A8A29E]">Totale Liquidato su IBAN</p>
            <p className="font-mono text-2xl font-bold text-[#22C55E] tabular-nums">
              {formatChf(portalData.kpis.total_paid_chf)}
            </p>
            <p className="text-xs text-[#A8A29E]">Pagamenti confermati</p>
          </div>

          <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-1">
            <p className="text-xs text-[#A8A29E]">Saldo Storni da Compensare</p>
            <p className="font-mono text-2xl font-bold text-[#FB923C] tabular-nums">
              {formatChf(portalData.kpis.pending_reversal_debt_chf)}
            </p>
            <p className="text-xs text-[#A8A29E]">Compensato sul prossimo payout</p>
          </div>

          <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-1">
            <p className="text-xs text-[#A8A29E]">Lead Attivi (90gg) / Clienti</p>
            <p className="font-mono text-2xl font-bold text-[#FAFAF9] tabular-nums">
              {portalData.kpis.active_leads_count} / {portalData.kpis.active_customers_count}
            </p>
            <p className="text-xs text-[#A8A29E]">Protezione First-Touch attiva</p>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#1C1917] border border-[#292524] p-1 w-fit">
          {(
            [
              { id: 'sales', label: `Vendite & Provvigioni (${portalData.sales.length})` },
              { id: 'leads', label: `Lead 90gg (${portalData.leads.length})` },
              { id: 'customers', label: `Clienti (${portalData.customers.length})` },
              { id: 'payouts', label: `Estratti & Fatture (${portalData.payouts.length})` },
              { id: 'profile', label: 'Dati Fiscali & IBAN' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setPortalTab(t.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-md cursor-pointer ${
                portalTab === t.id
                  ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                  : 'text-[#A8A29E] hover:text-[#FAFAF9]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* PORTAL TAB 1: SALES */}
        {portalTab === 'sales' && (
          <section className="rounded-xl border border-[#292524] bg-[#1C1917] overflow-hidden">
            {portalData.sales.length === 0 ? (
              <div className="p-10 text-center text-xs text-[#A8A29E]">
                Nessuna vendita incassata registrata finora. Registra i tuoi lead nella sezione &ldquo;Lead 90gg&rdquo;.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#292524] text-[#A8A29E]">
                      <th className="py-3 px-4 font-medium">Contratto / Fattura</th>
                      <th className="py-3 px-4 font-medium">Tipo</th>
                      <th className="py-3 px-4 font-medium text-right">Netto Incassato</th>
                      <th className="py-3 px-4 font-medium text-right">Provvigione</th>
                      <th className="py-3 px-4 font-medium">Stato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#292524]">
                    {portalData.sales.map((s) => (
                      <tr key={s.id}>
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#FAFAF9]">
                            {s.invoice_number} · {s.contract_title}
                          </div>
                          <div className="text-[#A8A29E] font-mono text-[11px]">
                            Lordo {formatChf(s.gross_amount)} − IVA {formatChf(s.vat_amount)} − Sconti/Terzi{' '}
                            {formatChf(s.discounts_amount + s.third_party_costs)}
                            {s.collected_at ? ` · Incasso ${s.collected_at.slice(0, 10)}` : ''}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[#A8A29E]">
                          {s.sale_type === 'one_off'
                            ? 'One-off'
                            : `Ricorrente #${s.recurring_month_number ?? 1}/12`}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-[#FAFAF9]">
                          {formatChf(s.net_amount)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-[#2DD4BF]">
                          {formatChf(s.commission)}
                        </td>
                        <td className="py-3 px-4">
                          {s.is_reversed ? (
                            <span className="text-[#FB923C]">Stornata ({s.reversed_reason})</span>
                          ) : s.paid ? (
                            <span className="text-[#22C55E]">Pagata</span>
                          ) : s.payout_id ? (
                            <span className="text-[#FBBF24]">In Estratto</span>
                          ) : (
                            <span className="text-[#2DD4BF]">Maturata</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* PORTAL TAB 2: LEADS 90 DAYS */}
        {portalTab === 'leads' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleRegisterLead}
              className="lg:col-span-5 rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-3 text-xs"
            >
              <h2 className="font-display text-base font-semibold text-[#FAFAF9]">
                Registra Nuovo Lead (Esclusiva 90gg)
              </h2>
              <p className="text-[#A8A29E]">
                Il sistema verifica automaticamente eventuali duplicati con priorità First-Touch.
              </p>
              <div>
                <label className="block text-[#A8A29E] mb-1">Nome Referente *</label>
                <input
                  required
                  value={leadForm.client_name}
                  onChange={(e) => setLeadForm((p) => ({ ...p, client_name: e.target.value }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Azienda</label>
                <input
                  value={leadForm.client_company}
                  onChange={(e) => setLeadForm((p) => ({ ...p, client_company: e.target.value }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#A8A29E] mb-1">Email Cliente</label>
                  <input
                    type="email"
                    value={leadForm.client_email}
                    onChange={(e) => setLeadForm((p) => ({ ...p, client_email: e.target.value }))}
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  />
                </div>
                <div>
                  <label className="block text-[#A8A29E] mb-1">Telefono Cliente</label>
                  <input
                    value={leadForm.client_phone}
                    onChange={(e) => setLeadForm((p) => ({ ...p, client_phone: e.target.value }))}
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#A8A29E] mb-1">Servizio</label>
                  <input
                    value={leadForm.service_interest}
                    onChange={(e) =>
                      setLeadForm((p) => ({ ...p, service_interest: e.target.value }))
                    }
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  />
                </div>
                <div>
                  <label className="block text-[#A8A29E] mb-1">Valore Stimato (CHF)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={leadForm.estimated_deal_size}
                    onChange={(e) =>
                      setLeadForm((p) => ({ ...p, estimated_deal_size: e.target.value }))
                    }
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={authBusy}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2DD4BF] px-4 py-2.5 font-semibold text-[#0C0A09] cursor-pointer"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Registra Lead Esclusivo</span>
              </button>
            </form>

            <div className="lg:col-span-7 rounded-xl border border-[#292524] bg-[#1C1917] overflow-hidden">
              {portalData.leads.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#A8A29E]">
                  Nessun lead registrato al momento.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#292524] text-[#A8A29E]">
                        <th className="py-3 px-4 font-medium">Cliente</th>
                        <th className="py-3 px-4 font-medium">Servizio</th>
                        <th className="py-3 px-4 font-medium text-right">Scadenza 90gg</th>
                        <th className="py-3 px-4 font-medium">Stato</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#292524]">
                      {portalData.leads.map((l) => {
                        const days = getDaysRemaining(l.expires_at);
                        return (
                          <tr key={l.id}>
                            <td className="py-3 px-4">
                              <div className="font-medium text-[#FAFAF9]">{l.client_name}</div>
                              <div className="text-[#A8A29E]">{l.client_company || l.client_email}</div>
                            </td>
                            <td className="py-3 px-4 text-[#A8A29E]">{l.service_interest || '—'}</td>
                            <td className="py-3 px-4 text-right font-mono tabular-nums text-[#A8A29E]">
                              {l.status === 'won' ? 'Acquisito' : days > 0 ? `${days}gg` : 'Scaduto'}
                            </td>
                            <td className="py-3 px-4 font-medium text-[#FAFAF9]">{l.status}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* PORTAL TAB 3: CUSTOMERS */}
        {portalTab === 'customers' && (
          <section className="rounded-xl border border-[#292524] bg-[#1C1917] overflow-hidden">
            {portalData.customers.length === 0 ? (
              <div className="p-10 text-center text-xs text-[#A8A29E]">
                Nessun cliente attribuito finora.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#292524] text-[#A8A29E]">
                      <th className="py-3 px-4 font-medium">Cliente</th>
                      <th className="py-3 px-4 font-medium">Primo Contratto</th>
                      <th className="py-3 px-4 font-medium">Tipologia</th>
                      <th className="py-3 px-4 font-medium text-right">Mesi Ricorrenti</th>
                      <th className="py-3 px-4 font-medium">Stato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#292524]">
                    {portalData.customers.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3 px-4 font-medium text-[#FAFAF9]">
                          {c.client_name}
                          {c.client_company ? ` (${c.client_company})` : ''}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#A8A29E]">
                          {c.first_contract_at.slice(0, 10)}
                        </td>
                        <td className="py-3 px-4 text-[#A8A29E]">
                          {c.is_recurring ? 'Ricorrente (12m)' : 'One-off'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-[#FAFAF9]">
                          {c.is_recurring ? `${c.recurring_months_paid} / 12` : '—'}
                        </td>
                        <td className="py-3 px-4 text-[#22C55E]">{c.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* PORTAL TAB 4: PAYOUTS & INVOICE SUBMISSION */}
        {portalTab === 'payouts' && (
          <section className="space-y-4">
            <div className="rounded-xl border border-[#292524] bg-[#1C1917] overflow-hidden">
              {portalData.payouts.length === 0 ? (
                <div className="p-10 text-center text-xs text-[#A8A29E]">
                  Nessun estratto conto mensile generato finora (gli estratti vengono emessi entro il 5 del mese successivo al raggiungimento di CHF 50.00).
                </div>
              ) : (
                <div className="divide-y divide-[#292524]">
                  {portalData.payouts.map((p) => {
                    const computedVat = aff.is_vat_registered
                      ? round2(p.net_payable * CH_STANDARD_VAT_RATE)
                      : 0;
                    const computedGross = round2(p.net_payable + computedVat);
                    return (
                      <div key={p.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-sm font-bold text-[#2DD4BF]">
                              Periodo {p.period_month}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium text-[#FAFAF9]">
                              {PAYOUT_LABELS[p.status]}
                            </span>
                          </div>
                          <p className="text-[#A8A29E] font-mono tabular-nums">
                            Provvigioni {formatChf(p.total_commissions)} − Storni {formatChf(p.deductions)} = Imponibile{' '}
                            <strong className="text-[#FAFAF9]">{formatChf(p.net_payable)}</strong>
                            {aff.is_vat_registered
                              ? ` + IVA 8.1% (${formatChf(computedVat)}) = Totale Fattura ${formatChf(computedGross)}`
                              : ' (Esente IVA)'}
                          </p>
                          {p.agent_invoice_number && (
                            <p className="text-[#A8A29E] font-mono">
                              Fattura {p.agent_invoice_number} del {p.agent_invoice_date} · Scadenza 30gg: {p.payment_due_date}
                              {p.paid_at ? ` · Pagato il ${p.paid_at.slice(0, 10)} (${p.payment_reference})` : ''}
                            </p>
                          )}
                        </div>

                        {p.status === 'statement_sent' && (
                          <button
                            type="button"
                            onClick={() => {
                              setInvoiceTargetId(p.id);
                              setInvoiceNum('');
                              setInvoiceDate(new Date().toISOString().slice(0, 10));
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2DD4BF] px-4 py-2 font-semibold text-[#0C0A09] cursor-pointer shrink-0"
                          >
                            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Invia Dati Fattura</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {invoiceTargetId && (
              <form
                onSubmit={handleSubmitInvoice}
                className="rounded-xl border border-[#2DD4BF]/50 bg-[#1C1917] p-5 space-y-3 text-xs max-w-lg"
              >
                <h3 className="font-display text-base font-semibold text-[#FAFAF9]">
                  Trasmetti Fattura per Liquidazione su IBAN
                </h3>
                <p className="text-[#A8A29E]">
                  Accredito previsto su IBAN:{' '}
                  <span className="font-mono text-[#FAFAF9]">
                    {aff.iban ? formatIbanDisplay(aff.iban) : 'Completa prima il tuo IBAN in Dati Fiscali'}
                  </span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#A8A29E] mb-1">Numero Fattura *</label>
                    <input
                      required
                      value={invoiceNum}
                      onChange={(e) => setInvoiceNum(e.target.value)}
                      placeholder="2026-014"
                      className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A8A29E] mb-1">Data Fattura *</label>
                    <input
                      type="date"
                      required
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={authBusy}
                    className="rounded-lg bg-[#2DD4BF] px-4 py-2 font-semibold text-[#0C0A09] cursor-pointer"
                  >
                    Conferma Invio Fattura
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvoiceTargetId(null)}
                    className="rounded-lg border border-[#292524] bg-[#0C0A09] px-4 py-2 text-[#A8A29E] cursor-pointer"
                  >
                    Annulla
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {/* PORTAL TAB 5: FISCAL & BANKING PROFILE */}
        {portalTab === 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            className="rounded-xl border border-[#292524] bg-[#1C1917] p-6 space-y-5 text-xs max-w-3xl"
          >
            <div className="space-y-1 border-b border-[#292524] pb-3">
              <h2 className="font-display text-lg font-semibold text-[#FAFAF9]">
                Anagrafica Fiscale &amp; Coordinate Bancarie IBAN
              </h2>
              <p className="text-[#A8A29E]">
                Dati obbligatori per la conformità amministrativa svizzera (AVS/IDI, IVA, indirizzo completo e IBAN CH/SEPA validato).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A8A29E] mb-1">Nome / Referente *</label>
                <input
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Ragione Sociale</label>
                <input
                  value={profileForm.company_name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, company_name: e.target.value }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Telefono *</label>
                <input
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Via e N. Civico *</label>
                <input
                  required
                  value={profileForm.address}
                  onChange={(e) => setProfileForm((p) => ({ ...p, address: e.target.value }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#A8A29E] mb-1">NPA *</label>
                <input
                  required
                  value={profileForm.postal_code}
                  onChange={(e) => setProfileForm((p) => ({ ...p, postal_code: e.target.value }))}
                  placeholder="6900"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Località *</label>
                <input
                  required
                  value={profileForm.city}
                  onChange={(e) => setProfileForm((p) => ({ ...p, city: e.target.value }))}
                  placeholder="Lugano"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Cantone *</label>
                <select
                  value={profileForm.canton}
                  onChange={(e) => setProfileForm((p) => ({ ...p, canton: e.target.value }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                >
                  {SWISS_CANTONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#292524]">
              <div>
                <label className="block text-[#A8A29E] mb-1">IBAN CH / SEPA *</label>
                <input
                  required
                  value={profileForm.iban}
                  onChange={(e) => setProfileForm((p) => ({ ...p, iban: e.target.value }))}
                  placeholder="CH93 0076 2011 6238 5295 7"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                />
                {ibanCheck && (
                  <p className={`mt-1 text-[11px] ${ibanCheck.valid ? 'text-[#22C55E]' : 'text-[#FB923C]'}`}>
                    {ibanCheck.valid ? 'IBAN verificato (ISO 13616 Mod-97)' : ibanCheck.error}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Numero AVS o IDI *</label>
                <input
                  required
                  value={profileForm.avs_idi_number}
                  onChange={(e) => setProfileForm((p) => ({ ...p, avs_idi_number: e.target.value }))}
                  placeholder="756.XXXX.XXXX.XX o CHE-XXX.XXX.XXX"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                />
                {avsCheck && (
                  <p className={`mt-1 text-[11px] ${avsCheck.valid ? 'text-[#22C55E]' : 'text-[#FB923C]'}`}>
                    {avsCheck.valid ? `Valido: ${avsCheck.normalized}` : avsCheck.error}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#FAFAF9] cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileForm.is_vat_registered}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, is_vat_registered: e.target.checked }))
                  }
                  className="accent-[#2DD4BF]"
                />
                <span>Sono assoggettato all’IVA svizzera (8.1%)</span>
              </label>
              {profileForm.is_vat_registered && (
                <div className="max-w-sm">
                  <label className="block text-[#A8A29E] mb-1">Numero IVA (CHE-xxx.xxx.xxx IVA) *</label>
                  <input
                    required
                    value={profileForm.vat_number}
                    onChange={(e) => setProfileForm((p) => ({ ...p, vat_number: e.target.value }))}
                    placeholder="CHE-123.456.789 IVA"
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                  />
                  {vatCheck && (
                    <p className={`mt-1 text-[11px] ${vatCheck.valid ? 'text-[#22C55E]' : 'text-[#FB923C]'}`}>
                      {vatCheck.valid ? `Valido: ${vatCheck.normalized}` : vatCheck.error}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#292524]">
              <button
                type="submit"
                disabled={authBusy}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2DD4BF] px-5 py-2.5 font-semibold text-[#0C0A09] cursor-pointer"
              >
                {authBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                <span>Salva Dati Fiscali &amp; IBAN</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
