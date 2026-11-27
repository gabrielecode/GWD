import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import {
  AdminOverviewData,
  Affiliate,
  AffiliateApplication,
  AffiliateStatus,
  LeadStatus,
} from '../types/affiliate';
import { affiliateApi } from '../lib/affiliateClient';
import {
  calculateCommissionBreakdown,
  formatChf,
  formatIbanDisplay,
  formatPercent,
  generateAffiliateCode,
  getDaysRemaining,
  SWISS_CANTONS,
  validateAvsOrIdi,
  validateIban,
  validateVatNumber,
} from '../lib/affiliateRules';
import { AdminAuthGate } from '../components/affiliate/AdminAuthGate';
import { WorkspaceBar } from '../components/affiliate/WorkspaceBar';

interface AdminAffiliatesViewProps {
  onNavigate: (path: string) => void;
}

type AdminTab = 'affiliates' | 'applications' | 'leads' | 'sales' | 'admins';

const STATUS_LABELS: Record<AffiliateStatus, string> = {
  active: 'Attivo',
  disabled: 'Disabilitato',
  pending_approval: 'In approvazione',
};

const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  registered: 'Registrato',
  in_progress: 'In trattativa',
  won: 'Acquisito',
  lost: 'Perso',
  expired: 'Scaduto (90gg)',
};

export function AdminAffiliatesView({ onNavigate }: AdminAffiliatesViewProps) {
  return (
    <AdminAuthGate
      currentPath="/admin/affiliates"
      breadcrumb={['Kreativalab', 'Admin', 'Agenti & Candidature']}
      onNavigate={onNavigate}
    >
      {({ adminEmail, storageMode, onLogout }) => (
        <AdminAffiliatesDashboard
          adminEmail={adminEmail}
          storageMode={storageMode}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      )}
    </AdminAuthGate>
  );
}

function AdminAffiliatesDashboard({
  adminEmail,
  storageMode,
  onNavigate,
  onLogout,
}: {
  adminEmail: string;
  storageMode: 'supabase' | 'sqlite';
  onNavigate: (path: string) => void;
  onLogout: () => void;
}) {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [tab, setTab] = useState<AdminTab>('affiliates');
  const [search, setSearch] = useState('');

  // Modal states
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null);
  const [convertingApp, setConvertingApp] = useState<AffiliateApplication | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [copiedSql, setCopiedSql] = useState(false);
  const [reversingSaleId, setReversingSaleId] = useState<string | null>(null);
  const [reverseReason, setReverseReason] = useState('');
  const [busy, setBusy] = useState(false);

  // Affiliate Form state
  const [affForm, setAffForm] = useState({
    name: '',
    company_name: '',
    email: '',
    phone: '',
    code: '',
    commission_percent: '20',
    status: 'active' as AffiliateStatus,
    address: '',
    postal_code: '',
    city: '',
    canton: 'TI',
    iban: '',
    avs_idi_number: '',
    is_vat_registered: false,
    vat_number: '',
    password: '',
    notes: '',
  });

  // Approval conversion form
  const [approveForm, setApproveForm] = useState({
    code: '',
    commission_percent: '20',
    password: '',
    notes: '',
  });

  // Lead Form
  const [leadForm, setLeadForm] = useState({
    affiliate_id: '',
    client_name: '',
    client_company: '',
    client_email: '',
    client_phone: '',
    service_interest: 'Sito Web + SEO Locale',
    estimated_deal_size: '',
    notes: '',
  });

  // Customer Form
  const [custForm, setCustForm] = useState({
    affiliate_id: '',
    client_name: '',
    client_company: '',
    client_email: '',
    is_recurring: true,
    recurring_extended_by_admin: false,
  });

  // Sale Form
  const [saleForm, setSaleForm] = useState({
    affiliate_id: '',
    customer_id: '',
    invoice_number: '',
    contract_title: '',
    mode: 'one_off' as 'one_off' | 'recurring' | 'package',
    gross_amount: '2500',
    vat_amount: '187.30',
    discounts_amount: '0',
    third_party_costs: '0',
    recurring_gross_amount: '350',
    recurring_vat_amount: '26.20',
    recurring_discounts_amount: '0',
    recurring_third_party_costs: '0',
    recurring_month_number: '1',
    extended_by_admin: false,
    is_renewal: false,
    contract_concluded: true,
    service_delivered: true,
    collected_at: new Date().toISOString().slice(0, 10),
  });

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await affiliateApi.getAdminOverview();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento dei dati.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const affiliateById = useMemo(() => {
    const map = new Map<string, Affiliate>();
    for (const a of data?.affiliates ?? []) {
      map.set(a.id, a);
    }
    return map;
  }, [data?.affiliates]);

  const filteredAffiliates = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = data?.affiliates ?? [];
    if (!q) return list;
    return list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        (a.company_name || '').toLowerCase().includes(q)
    );
  }, [data?.affiliates, search]);

  const ibanCheck = useMemo(
    () => (affForm.iban.trim() ? validateIban(affForm.iban) : null),
    [affForm.iban]
  );
  const avsCheck = useMemo(
    () => (affForm.avs_idi_number.trim() ? validateAvsOrIdi(affForm.avs_idi_number) : null),
    [affForm.avs_idi_number]
  );
  const vatCheck = useMemo(
    () => (affForm.vat_number.trim() ? validateVatNumber(affForm.vat_number) : null),
    [affForm.vat_number]
  );

  const selectedSaleAffiliate = affiliateById.get(saleForm.affiliate_id);
  const saleRate = selectedSaleAffiliate ? selectedSaleAffiliate.commission_rate : 0.2;

  const liveSalePreview = useMemo(() => {
    const collected = saleForm.collected_at ? `${saleForm.collected_at}T12:00:00Z` : null;
    const primary = calculateCommissionBreakdown({
      saleType: saleForm.mode === 'recurring' ? 'recurring' : 'one_off',
      grossAmount: Number(saleForm.gross_amount || 0),
      vatAmount: Number(saleForm.vat_amount || 0),
      discountsAmount: Number(saleForm.discounts_amount || 0),
      thirdPartyCosts: Number(saleForm.third_party_costs || 0),
      commissionRate: saleRate,
      contractConcluded: saleForm.contract_concluded,
      serviceDelivered: saleForm.service_delivered,
      collectedAt: collected,
      recurringMonthNumber:
        saleForm.mode === 'recurring' ? Number(saleForm.recurring_month_number || 1) : null,
      extendedByAdmin: saleForm.extended_by_admin,
    });
    const recurringPart =
      saleForm.mode === 'package'
        ? calculateCommissionBreakdown({
            saleType: 'recurring',
            grossAmount: Number(saleForm.recurring_gross_amount || 0),
            vatAmount: Number(saleForm.recurring_vat_amount || 0),
            discountsAmount: Number(saleForm.recurring_discounts_amount || 0),
            thirdPartyCosts: Number(saleForm.recurring_third_party_costs || 0),
            commissionRate: saleRate,
            contractConcluded: saleForm.contract_concluded,
            serviceDelivered: saleForm.service_delivered,
            collectedAt: collected,
            recurringMonthNumber: Number(saleForm.recurring_month_number || 1),
            extendedByAdmin: saleForm.extended_by_admin,
          })
        : null;
    return { primary, recurringPart };
  }, [saleForm, saleRate]);

  const openNewAffiliateModal = () => {
    setEditingAffiliate(null);
    setAffForm({
      name: '',
      company_name: '',
      email: '',
      phone: '',
      code: '',
      commission_percent: '20',
      status: 'active',
      address: '',
      postal_code: '',
      city: '',
      canton: 'TI',
      iban: '',
      avs_idi_number: '',
      is_vat_registered: false,
      vat_number: '',
      password: '',
      notes: '',
    });
    setShowAffiliateModal(true);
  };

  const openEditAffiliateModal = (a: Affiliate) => {
    setEditingAffiliate(a);
    setAffForm({
      name: a.name,
      company_name: a.company_name || '',
      email: a.email,
      phone: a.phone || '',
      code: a.code,
      commission_percent: String(Math.round(a.commission_rate * 10000) / 100),
      status: a.status,
      address: a.address || '',
      postal_code: a.postal_code || '',
      city: a.city || '',
      canton: a.canton || 'TI',
      iban: a.iban || '',
      avs_idi_number: a.avs_idi_number || '',
      is_vat_registered: a.is_vat_registered,
      vat_number: a.vat_number || '',
      password: '',
      notes: a.notes || '',
    });
    setShowAffiliateModal(true);
  };

  const handleSaveAffiliate = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const payload = {
        name: affForm.name,
        company_name: affForm.company_name || null,
        email: affForm.email,
        phone: affForm.phone || null,
        code: affForm.code || undefined,
        commission_rate: Number(affForm.commission_percent) / 100,
        status: affForm.status,
        address: affForm.address || null,
        postal_code: affForm.postal_code || null,
        city: affForm.city || null,
        canton: affForm.canton || null,
        iban: affForm.iban || null,
        avs_idi_number: affForm.avs_idi_number || null,
        is_vat_registered: affForm.is_vat_registered,
        vat_number: affForm.vat_number || null,
        notes: affForm.notes || null,
        ...(affForm.password.trim() ? { password: affForm.password.trim() } : {}),
      };

      if (editingAffiliate) {
        await affiliateApi.updateAffiliate(editingAffiliate.id, payload);
        setNotice(`Anagrafica agente "${affForm.name}" aggiornata.`);
      } else {
        await affiliateApi.createAffiliate(payload);
        setNotice(`Agente "${affForm.name}" creato e attivato.`);
      }
      setShowAffiliateModal(false);
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel salvataggio agente.');
    } finally {
      setBusy(false);
    }
  };

  const handleReviewApplication = async (e: FormEvent) => {
    e.preventDefault();
    if (!convertingApp || busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await affiliateApi.reviewApplication(convertingApp.id, {
        action: 'approve',
        code: approveForm.code,
        commission_rate: Number(approveForm.commission_percent) / 100,
        password: approveForm.password,
        notes: approveForm.notes,
      });
      setConvertingApp(null);
      setNotice(
        `Candidatura approvata e convertita in agente (${res.affiliate?.code || ''}).`
      );
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversione candidatura fallita.');
    } finally {
      setBusy(false);
    }
  };

  const handleRejectApplication = async (id: string) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await affiliateApi.reviewApplication(id, { action: 'reject' });
      setNotice('Candidatura archiviata come rifiutata.');
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel rifiuto candidatura.');
    } finally {
      setBusy(false);
    }
  };

  const handleCreateLead = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await affiliateApi.createAdminLead({
        ...leadForm,
        estimated_deal_size: leadForm.estimated_deal_size
          ? Number(leadForm.estimated_deal_size)
          : null,
      });
      setShowLeadModal(false);
      setNotice('Lead esclusivo 90 giorni registrato con controllo First-Touch superato.');
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrazione lead fallita.');
    } finally {
      setBusy(false);
    }
  };

  const handleLeadStatusChange = async (leadId: string, status: LeadStatus) => {
    setError(null);
    try {
      await affiliateApi.updateLeadStatus(leadId, status);
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Aggiornamento stato lead fallito.');
    }
  };

  const handleCreateCustomer = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await affiliateApi.createCustomer(custForm);
      setShowCustomerModal(false);
      setNotice(`Cliente "${custForm.client_name}" registrato.`);
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Creazione cliente fallita.');
    } finally {
      setBusy(false);
    }
  };

  const handleCreateSale = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await affiliateApi.createSales({
        affiliate_id: saleForm.affiliate_id,
        customer_id: saleForm.customer_id || null,
        invoice_number: saleForm.invoice_number,
        contract_title: saleForm.contract_title,
        mode: saleForm.mode,
        gross_amount: Number(saleForm.gross_amount || 0),
        vat_amount: Number(saleForm.vat_amount || 0),
        discounts_amount: Number(saleForm.discounts_amount || 0),
        third_party_costs: Number(saleForm.third_party_costs || 0),
        recurring_gross_amount: Number(saleForm.recurring_gross_amount || 0),
        recurring_vat_amount: Number(saleForm.recurring_vat_amount || 0),
        recurring_discounts_amount: Number(saleForm.recurring_discounts_amount || 0),
        recurring_third_party_costs: Number(saleForm.recurring_third_party_costs || 0),
        recurring_month_number:
          saleForm.mode !== 'one_off' ? Number(saleForm.recurring_month_number || 1) : null,
        extended_by_admin: saleForm.extended_by_admin,
        is_renewal: saleForm.is_renewal,
        contract_concluded: saleForm.contract_concluded,
        service_delivered: saleForm.service_delivered,
        collected_at: saleForm.collected_at ? `${saleForm.collected_at}T12:00:00Z` : null,
      });
      setShowSaleModal(false);
      setNotice(
        res.sales.length > 1
          ? 'Pacchetto suddiviso e registrato (quota one-off + canone ricorrente separati).'
          : 'Incasso e provvigione CO 418a registrati.'
      );
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrazione vendita fallita.');
    } finally {
      setBusy(false);
    }
  };

  const handleReverseSale = async (e: FormEvent) => {
    e.preventDefault();
    if (!reversingSaleId || busy) return;
    setBusy(true);
    setError(null);
    try {
      await affiliateApi.reverseSale(reversingSaleId, reverseReason);
      setReversingSaleId(null);
      setReverseReason('');
      setNotice('Storno registrato. Se la vendita era già pagata, verrà compensata sul prossimo payout.');
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Storno non riuscito.');
    } finally {
      setBusy(false);
    }
  };

  const handleCreateAdminMember = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (newAdminForm.password.trim().length < 8) {
      setError('La password del nuovo Admin deve contenere almeno 8 caratteri.');
      return;
    }
    if (newAdminForm.password !== newAdminForm.confirmPassword) {
      setError('Le due password non coincidono.');
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await affiliateApi.addAdminByAdmin({
        email: newAdminForm.email.trim(),
        password: newAdminForm.password,
      });
      setShowAdminModal(false);
      setNewAdminForm({ email: '', password: '', confirmPassword: '' });
      setNotice(`Amministratore "${res.admin.email}" aggiunto con pieni permessi.`);
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossibile creare il nuovo Admin.');
    } finally {
      setBusy(false);
    }
  };

  const handleRemoveAdminMember = async (idOrEmail: string, emailLabel: string) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await affiliateApi.removeAdminByAdmin(idOrEmail);
      setNotice(`Permessi amministratore revocati per ${emailLabel}.`);
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rimozione amministratore non riuscita.');
    } finally {
      setBusy(false);
    }
  };

  const handleCopySqlFix = async (sqlText: string) => {
    try {
      await navigator.clipboard.writeText(sqlText);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3500);
    } catch {
      setError('Copia automatica non riuscita: seleziona e copia manualmente il blocco SQL qui sotto.');
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <WorkspaceBar
        currentPath="/admin/affiliates"
        breadcrumb={['Kreativalab', 'Admin', 'Agenti & Provvigioni CO 418a']}
        userEmail={adminEmail}
        storageMode={storageMode}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#FAFAF9]">
              Gestione Agenti &amp; Affiliati (CO 418a segg.)
            </h1>
            <p className="text-sm text-[#A8A29E] max-w-2xl">
              Anagrafiche fiscali e IBAN CH/SEPA, approvazione candidature, attribuzione lead 90 giorni first-touch, calcolo provvigioni sul netto incassato e gestione Multi-Admin.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => void loadOverview()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#292524] bg-[#1C1917] px-3.5 py-2 text-xs font-medium text-[#FAFAF9] hover:border-[#2DD4BF] transition-colors cursor-pointer min-h-[40px]"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>Aggiorna</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/admin/payouts')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#292524] bg-[#1C1917] px-3.5 py-2 text-xs font-medium text-[#FAFAF9] hover:border-[#FBBF24] transition-colors cursor-pointer min-h-[40px]"
            >
              <span>Vai a Payouts Mensili</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setNewAdminForm({ email: '', password: '', confirmPassword: '' });
                setShowAdminModal(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#292524] bg-[#1C1917] px-3.5 py-2 text-xs font-semibold text-[#FAFAF9] hover:border-[#2DD4BF] transition-colors cursor-pointer min-h-[40px]"
            >
              <UserPlus className="h-3.5 w-3.5 text-[#2DD4BF]" aria-hidden="true" />
              <span>Nuovo Admin</span>
            </button>
            <button
              type="button"
              onClick={openNewAffiliateModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2DD4BF] px-4 py-2 text-xs font-semibold text-[#0C0A09] hover:opacity-90 transition-opacity cursor-pointer min-h-[40px]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Nuovo Agente</span>
            </button>
          </div>
        </div>

        {/* Supabase 42501 Permission Denied Quick Repair Box */}
        {data?.db_permission_error && (
          <div
            role="alert"
            className="rounded-xl border border-[#FB923C]/60 bg-[#1C1917] p-5 space-y-3 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-[#FB923C] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="font-semibold text-[#FAFAF9]">
                    Riparazione Permessi Database Supabase ({data.db_permission_error.message})
                  </p>
                  <p className="text-[#A8A29E] leading-relaxed">
                    {data.db_permission_error.is_anon_key
                      ? 'Attenzione: la variabile SUPABASE_SERVICE_ROLE_KEY su Vercel risulta essere una chiave "anon" anziché "service_role". Inoltre le tabelle nello schema public di Supabase richiedono i permessi GRANT.'
                      : 'Le tabelle nello schema public di Supabase non hanno ancora i permessi GRANT per i ruoli service_role / authenticated (errore PostgreSQL 42501).'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void handleCopySqlFix(data.db_permission_error!.sql_fix)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2DD4BF] px-3.5 py-2 text-xs font-semibold text-[#0C0A09] hover:opacity-90 cursor-pointer shrink-0 min-h-[38px]"
              >
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{copiedSql ? 'Script SQL Copiato!' : '1. Copia Script SQL Riparazione'}</span>
              </button>
            </div>
            <p className="text-[#A8A29E]">
              Clicca su <strong className="text-[#FAFAF9]">1. Copia Script SQL Riparazione</strong>, apri la dashboard del tuo progetto <strong className="text-[#FAFAF9]">Supabase &rarr; SQL Editor &rarr; New Query</strong>, incolla lo script e premi <strong className="text-[#FAFAF9]">Run</strong>. Poi clicca su <strong className="text-[#FAFAF9]">Aggiorna</strong> qui sopra.
            </p>
            <pre className="max-h-44 overflow-y-auto rounded-lg border border-[#292524] bg-[#0C0A09] p-3 font-mono text-[11px] text-[#A8A29E] select-all">
              {data.db_permission_error.sql_fix}
            </pre>
          </div>
        )}

        {/* Feedback Banners */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-[#FB923C]/50 bg-[#1C1917] p-4 flex items-start justify-between gap-3 text-xs text-[#FB923C]"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
            <button type="button" onClick={() => setError(null)} className="text-[#A8A29E] hover:text-[#FAFAF9] cursor-pointer">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {notice && (
          <div className="rounded-xl border border-[#22C55E]/40 bg-[#1C1917] p-4 flex items-start justify-between gap-3 text-xs text-[#22C55E]">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{notice}</span>
            </div>
            <button type="button" onClick={() => setNotice(null)} className="text-[#A8A29E] hover:text-[#FAFAF9] cursor-pointer">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* 4-Column KPI Strip */}
        <section aria-label="KPI Principali" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-1">
            <p className="text-xs text-[#A8A29E]">Agenti Attivi / Candidature</p>
            <p className="font-mono text-2xl font-bold text-[#FAFAF9] tabular-nums">
              {data ? `${data.kpis.active_affiliates} / ${data.kpis.pending_applications}` : '—'}
            </p>
            <p className="text-xs text-[#A8A29E]">
              {data ? `${data.kpis.pending_applications} candidature in attesa` : 'Caricamento...'}
            </p>
          </div>

          <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-1">
            <p className="text-xs text-[#A8A29E]">Lead Esclusivi Attivi (90gg)</p>
            <p className="font-mono text-2xl font-bold text-[#2DD4BF] tabular-nums">
              {data ? data.kpis.active_leads_90d : '—'}
            </p>
            <p className="text-xs text-[#A8A29E]">Priorità First-Touch su duplicati</p>
          </div>

          <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-1">
            <p className="text-xs text-[#A8A29E]">Netto Incassato Riferito</p>
            <p className="font-mono text-2xl font-bold text-[#FAFAF9] tabular-nums">
              {data ? formatChf(data.kpis.total_net_collected_chf) : '—'}
            </p>
            <p className="text-xs text-[#A8A29E]">Esclusi IVA, sconti e costi terzi</p>
          </div>

          <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-1">
            <p className="text-xs text-[#A8A29E]">Provvigioni Maturate / Pagate</p>
            <p className="font-mono text-2xl font-bold text-[#FBBF24] tabular-nums">
              {data ? formatChf(data.kpis.accrued_unpaid_commissions_chf) : '—'}
            </p>
            <p className="text-xs text-[#A8A29E] font-mono tabular-nums">
              {data
                ? `Pagate: ${formatChf(data.kpis.paid_commissions_chf)} · Storni: ${formatChf(data.kpis.pending_reversal_credits_chf)}`
                : ''}
            </p>
          </div>
        </section>

        {/* Segmented Tab Controls + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292524] pb-4">
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#1C1917] border border-[#292524] p-1">
            {(
              [
                { id: 'affiliates', label: `Agenti (${data?.affiliates.length ?? 0})` },
                { id: 'applications', label: `Candidature (${data?.applications.length ?? 0})` },
                { id: 'leads', label: `Lead 90gg (${data?.leads.length ?? 0})` },
                { id: 'sales', label: `Clienti & Vendite (${data?.sales.length ?? 0})` },
                { id: 'admins', label: `Team Admin (${data?.admins?.length ?? 1})` },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                  tab === item.id
                    ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                    : 'text-[#A8A29E] hover:text-[#FAFAF9]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              className="h-4 w-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca agente, codice, email..."
              className="w-full rounded-lg border border-[#292524] bg-[#1C1917] pl-9 pr-3 py-2 text-xs text-[#FAFAF9] placeholder:text-[#A8A29E]/60 focus:border-[#2DD4BF] focus:outline-none min-h-[38px]"
            />
          </div>
        </div>

        {/* TAB 1: AFFILIATES */}
        {tab === 'affiliates' && (
          <section className="rounded-xl border border-[#292524] bg-[#1C1917] overflow-hidden">
            {loading && !data ? (
              <div className="p-8 text-center text-sm text-[#A8A29E]">Caricamento agenti...</div>
            ) : filteredAffiliates.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <p className="text-sm font-medium text-[#FAFAF9]">Nessun agente registrato</p>
                <p className="text-xs text-[#A8A29E] max-w-md mx-auto">
                  Crea il primo agente commerciale o approva una candidatura ricevuta dal portale /affiliate.
                </p>
                <button
                  type="button"
                  onClick={openNewAffiliateModal}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#2DD4BF] px-4 py-2 text-xs font-semibold text-[#0C0A09] cursor-pointer min-h-[40px]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>Crea Primo Agente</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#292524] text-[#A8A29E]">
                      <th className="py-3 px-4 font-medium">Agente / Ragione Sociale</th>
                      <th className="py-3 px-4 font-medium">Codice</th>
                      <th className="py-3 px-4 font-medium text-right">Aliquota</th>
                      <th className="py-3 px-4 font-medium">Fiscale / IBAN</th>
                      <th className="py-3 px-4 font-medium">Stato</th>
                      <th className="py-3 px-4 font-medium text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#292524]">
                    {filteredAffiliates.map((aff) => (
                      <tr key={aff.id} className="hover:bg-[#0C0A09]/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-[#FAFAF9]">{aff.name}</div>
                          <div className="text-[#A8A29E] mt-0.5">
                            {aff.company_name ? `${aff.company_name} · ` : ''}
                            {aff.email}
                            {aff.canton ? ` · ${aff.canton}` : ''}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#2DD4BF]">{aff.code}</td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#FAFAF9]">
                          {formatPercent(aff.commission_rate)}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-[#FAFAF9] tabular-nums">
                            {aff.iban ? formatIbanDisplay(aff.iban) : 'IBAN mancante'}
                          </div>
                          <div className="text-[#A8A29E] mt-0.5">
                            {aff.avs_idi_number || 'AVS/IDI n/d'} ·{' '}
                            {aff.is_vat_registered
                              ? `IVA ${aff.vat_number || 'Sì'}`
                              : 'Esente IVA'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-medium ${
                              aff.status === 'active'
                                ? 'text-[#22C55E]'
                                : aff.status === 'pending_approval'
                                ? 'text-[#FBBF24]'
                                : 'text-[#A8A29E]'
                            }`}
                          >
                            {STATUS_LABELS[aff.status]}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => openEditAffiliateModal(aff)}
                            className="rounded-md border border-[#292524] bg-[#0C0A09] px-3 py-1.5 text-xs font-medium text-[#FAFAF9] hover:border-[#2DD4BF] transition-colors cursor-pointer"
                          >
                            Modifica
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* TAB 2: APPLICATIONS */}
        {tab === 'applications' && (
          <section className="rounded-xl border border-[#292524] bg-[#1C1917] overflow-hidden">
            {!data || data.applications.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <p className="text-sm font-medium text-[#FAFAF9]">Nessuna candidatura ricevuta</p>
                <p className="text-xs text-[#A8A29E]">
                  Le candidature inviate dal form pubblico su /affiliate appariranno qui per approvazione e conversione 1-click.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#292524]">
                {data.applications.map((app) => (
                  <div key={app.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#A8A29E]">
                        <span className="text-sm font-semibold text-[#FAFAF9]">{app.name}</span>
                        {app.company_name && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{app.company_name}</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{app.canton_or_country}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            app.status === 'approved'
                              ? 'text-[#22C55E] font-medium'
                              : app.status === 'rejected'
                              ? 'text-[#FB923C] font-medium'
                              : 'text-[#FBBF24] font-medium'
                          }
                        >
                          {app.status === 'pending'
                            ? 'In attesa'
                            : app.status === 'approved'
                            ? 'Approvata'
                            : 'Rifiutata'}
                        </span>
                      </div>
                      <p className="text-xs text-[#A8A29E]">
                        {app.email}
                        {app.phone ? ` · ${app.phone}` : ''}
                        {app.website_or_linkedin ? ` · ${app.website_or_linkedin}` : ''}
                      </p>
                      <p className="text-xs text-[#FAFAF9]/90 leading-relaxed">
                        {app.experience_and_network}
                      </p>
                    </div>

                    {app.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setConvertingApp(app);
                            setApproveForm({
                              code: generateAffiliateCode(app.name),
                              commission_percent: '20',
                              password: '',
                              notes: '',
                            });
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#2DD4BF] px-3.5 py-2 text-xs font-semibold text-[#0C0A09] cursor-pointer min-h-[38px]"
                        >
                          <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Approva e Converti</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleRejectApplication(app.id)}
                          className="rounded-lg border border-[#292524] bg-[#0C0A09] px-3.5 py-2 text-xs font-medium text-[#A8A29E] hover:text-[#FB923C] cursor-pointer min-h-[38px]"
                        >
                          Rifiuta
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: LEADS (90 DAYS + FIRST-TOUCH) */}
        {tab === 'leads' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-[#A8A29E]">
                Esclusiva automatica 90 giorni dalla registrazione. I duplicati (email/telefono/azienda) vengono bloccati con priorità First-Touch.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLeadForm((prev) => ({
                    ...prev,
                    affiliate_id: data?.affiliates[0]?.id || '',
                  }));
                  setShowLeadModal(true);
                }}
                disabled={!data || data.affiliates.length === 0}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2DD4BF] px-3.5 py-2 text-xs font-semibold text-[#0C0A09] cursor-pointer disabled:opacity-40 min-h-[38px] shrink-0"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Registra Lead</span>
              </button>
            </div>

            <div className="rounded-xl border border-[#292524] bg-[#1C1917] overflow-hidden">
              {!data || data.leads.length === 0 ? (
                <div className="p-10 text-center text-xs text-[#A8A29E]">
                  Nessun lead registrato.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#292524] text-[#A8A29E]">
                        <th className="py-3 px-4 font-medium">Cliente / Azienda</th>
                        <th className="py-3 px-4 font-medium">Agente</th>
                        <th className="py-3 px-4 font-medium">Interesse</th>
                        <th className="py-3 px-4 font-medium text-right">Valore stimato</th>
                        <th className="py-3 px-4 font-medium text-right">Scadenza 90gg</th>
                        <th className="py-3 px-4 font-medium">Stato</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#292524]">
                      {data.leads.map((lead) => {
                        const aff = affiliateById.get(lead.affiliate_id);
                        const days = getDaysRemaining(lead.expires_at);
                        return (
                          <tr key={lead.id} className="hover:bg-[#0C0A09]/40">
                            <td className="py-3 px-4">
                              <div className="font-medium text-[#FAFAF9]">{lead.client_name}</div>
                              <div className="text-[#A8A29E]">
                                {lead.client_company ? `${lead.client_company} · ` : ''}
                                {lead.client_email || lead.client_phone}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-[#2DD4BF]">
                              {aff ? `${aff.name} (${aff.code})` : lead.affiliate_id}
                            </td>
                            <td className="py-3 px-4 text-[#A8A29E]">{lead.service_interest || '—'}</td>
                            <td className="py-3 px-4 text-right font-mono tabular-nums text-[#FAFAF9]">
                              {lead.estimated_deal_size ? formatChf(lead.estimated_deal_size) : '—'}
                            </td>
                            <td className="py-3 px-4 text-right font-mono tabular-nums text-[#A8A29E]">
                              {lead.status === 'won'
                                ? 'Chiuso'
                                : days > 0
                                ? `${days}gg (${lead.expires_at.slice(0, 10)})`
                                : 'Scaduto'}
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={lead.status}
                                onChange={(e) =>
                                  void handleLeadStatusChange(lead.id, e.target.value as LeadStatus)
                                }
                                aria-label={`Stato lead ${lead.client_name}`}
                                className="rounded-md border border-[#292524] bg-[#0C0A09] px-2.5 py-1 text-xs text-[#FAFAF9]"
                              >
                                {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((st) => (
                                  <option key={st} value={st}>
                                    {LEAD_STATUS_LABELS[st]}
                                  </option>
                                ))}
                              </select>
                            </td>
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

        {/* TAB 4: CUSTOMERS & SALES (CO 418a) */}
        {tab === 'sales' && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#A8A29E]">
                Matura 20% (o aliquota agente) su netto incassato = Gross − IVA − Sconti − Costi terzi. Ricorrente fino al 12° mese.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCustForm((prev) => ({
                      ...prev,
                      affiliate_id: data?.affiliates[0]?.id || '',
                    }));
                    setShowCustomerModal(true);
                  }}
                  disabled={!data || data.affiliates.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#292524] bg-[#1C1917] px-3.5 py-2 text-xs font-medium text-[#FAFAF9] hover:border-[#2DD4BF] cursor-pointer disabled:opacity-40 min-h-[38px]"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Nuovo Cliente</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const firstAff = data?.affiliates[0];
                    setSaleForm((prev) => ({
                      ...prev,
                      affiliate_id: firstAff?.id || '',
                      customer_id: '',
                    }));
                    setShowSaleModal(true);
                  }}
                  disabled={!data || data.affiliates.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#2DD4BF] px-3.5 py-2 text-xs font-semibold text-[#0C0A09] cursor-pointer disabled:opacity-40 min-h-[38px]"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Registra Incasso / Vendita</span>
                </button>
              </div>
            </div>

            {/* Customers summary */}
            {data && data.customers.length > 0 && (
              <div className="rounded-xl border border-[#292524] bg-[#1C1917] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#292524] text-xs font-semibold text-[#FAFAF9]">
                  Clienti Acquisiti ({data.customers.length})
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#292524] text-[#A8A29E]">
                        <th className="py-2.5 px-4 font-medium">Cliente</th>
                        <th className="py-2.5 px-4 font-medium">Agente</th>
                        <th className="py-2.5 px-4 font-medium">Contratto</th>
                        <th className="py-2.5 px-4 font-medium text-right">Mesi ricorrenti pagati</th>
                        <th className="py-2.5 px-4 font-medium">Estensione &gt;12m</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#292524]">
                      {data.customers.map((c) => {
                        const aff = affiliateById.get(c.affiliate_id);
                        return (
                          <tr key={c.id}>
                            <td className="py-2.5 px-4 font-medium text-[#FAFAF9]">
                              {c.client_name}
                              {c.client_company ? ` (${c.client_company})` : ''}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-[#2DD4BF]">
                              {aff ? aff.code : c.affiliate_id}
                            </td>
                            <td className="py-2.5 px-4 text-[#A8A29E] font-mono">
                              {c.first_contract_at.slice(0, 10)} · {c.is_recurring ? 'Ricorrente' : 'One-off'}
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#FAFAF9]">
                              {c.is_recurring ? `${c.recurring_months_paid} / 12` : '—'}
                            </td>
                            <td className="py-2.5 px-4 text-[#A8A29E]">
                              {c.recurring_extended_by_admin ? 'Sì (Admin)' : 'Standard 12m'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sales ledger */}
            <div className="rounded-xl border border-[#292524] bg-[#1C1917] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#292524] text-xs font-semibold text-[#FAFAF9]">
                Registro Vendite, Rate &amp; Storni ({data?.sales.length ?? 0})
              </div>
              {!data || data.sales.length === 0 ? (
                <div className="p-10 text-center text-xs text-[#A8A29E]">
                  Nessun incasso o vendita registrata. Clicca su &ldquo;Registra Incasso / Vendita&rdquo; per inserire una quota one-off, un canone mensile o un pacchetto misto.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#292524] text-[#A8A29E]">
                        <th className="py-3 px-4 font-medium">Fattura / Contratto</th>
                        <th className="py-3 px-4 font-medium">Agente</th>
                        <th className="py-3 px-4 font-medium">Tipo</th>
                        <th className="py-3 px-4 font-medium text-right">Lordo / Netto</th>
                        <th className="py-3 px-4 font-medium text-right">Provvigione</th>
                        <th className="py-3 px-4 font-medium">Stato</th>
                        <th className="py-3 px-4 font-medium text-right">Azioni</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#292524]">
                      {data.sales.map((s) => {
                        const aff = affiliateById.get(s.affiliate_id);
                        return (
                          <tr key={s.id} className="hover:bg-[#0C0A09]/40">
                            <td className="py-3 px-4">
                              <div className="font-medium text-[#FAFAF9]">
                                {s.invoice_number} · {s.contract_title}
                              </div>
                              <div className="text-[#A8A29E] font-mono text-[11px] mt-0.5">
                                {s.collected_at
                                  ? `Incassato il ${s.collected_at.slice(0, 10)}`
                                  : 'Non ancora incassato'}
                                {s.is_reversed && s.reversed_reason
                                  ? ` · Storno: ${s.reversed_reason}`
                                  : ''}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-[#2DD4BF]">
                              {aff ? aff.code : s.affiliate_id}
                            </td>
                            <td className="py-3 px-4 text-[#A8A29E] font-mono">
                              {s.sale_type === 'one_off'
                                ? 'One-off'
                                : `Ricorrente #${s.recurring_month_number ?? 1}/12`}
                            </td>
                            <td className="py-3 px-4 text-right font-mono tabular-nums">
                              <div className="text-[#A8A29E]">{formatChf(s.gross_amount)}</div>
                              <div className="text-[#FAFAF9]">Netto {formatChf(s.net_amount)}</div>
                            </td>
                            <td className="py-3 px-4 text-right font-mono tabular-nums">
                              <div
                                className={
                                  s.is_reversed
                                    ? 'line-through text-[#FB923C]'
                                    : 'font-semibold text-[#2DD4BF]'
                                }
                              >
                                {formatChf(s.commission)}
                              </div>
                              <div className="text-[11px] text-[#A8A29E]">
                                {formatPercent(s.commission_rate)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {s.is_reversed ? (
                                <span className="text-[#FB923C] font-medium">
                                  {s.paid
                                    ? s.reversal_compensated_payout_id
                                      ? 'Stornata (compensata)'
                                      : 'Stornata (credito KL)'
                                    : 'Stornata'}
                                </span>
                              ) : s.paid ? (
                                <span className="text-[#22C55E] font-medium">Pagata</span>
                              ) : s.payout_id ? (
                                <span className="text-[#FBBF24] font-medium">In Payout</span>
                              ) : s.commission > 0 ? (
                                <span className="text-[#2DD4BF] font-medium">Maturata</span>
                              ) : (
                                <span className="text-[#A8A29E]">Non maturata</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {!s.is_reversed && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReversingSaleId(s.id);
                                    setReverseReason('');
                                  }}
                                  className="inline-flex items-center gap-1 rounded-md border border-[#292524] bg-[#0C0A09] px-2.5 py-1 text-xs text-[#FB923C] hover:border-[#FB923C] cursor-pointer"
                                >
                                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                                  <span>Storna</span>
                                </button>
                              )}
                            </td>
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

        {/* TAB 5: TEAM ADMIN (MULTI-ADMIN MANAGEMENT) */}
        {tab === 'admins' && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-[#FAFAF9] flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#2DD4BF]" aria-hidden="true" />
                  <span>Amministratori Autorizzati ({data?.admins?.length ?? 1})</span>
                </h2>
                <p className="text-xs text-[#A8A29E]">
                  Gli amministratori hanno accesso completo a <span className="font-mono text-[#FAFAF9]">/admin/affiliates</span> e <span className="font-mono text-[#FAFAF9]">/admin/payouts</span>. Gli agenti (<span className="font-mono text-[#FAFAF9]">role = affiliate</span>) sono invece vincolati esclusivamente al portale <span className="font-mono text-[#FAFAF9]">/affiliate</span>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewAdminForm({ email: '', password: '', confirmPassword: '' });
                  setShowAdminModal(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2DD4BF] px-4 py-2 text-xs font-semibold text-[#0C0A09] hover:opacity-90 cursor-pointer shrink-0 min-h-[38px]"
              >
                <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Aggiungi Nuovo Admin</span>
              </button>
            </div>

            <div className="rounded-xl border border-[#292524] bg-[#1C1917] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#292524] text-[#A8A29E]">
                      <th className="py-3 px-4 font-medium">Email Amministratore</th>
                      <th className="py-3 px-4 font-medium">Origine / Permesso</th>
                      <th className="py-3 px-4 font-medium">Data Creazione</th>
                      <th className="py-3 px-4 font-medium text-right">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#292524]">
                    {(data?.admins && data.admins.length > 0
                      ? data.admins
                      : [
                          {
                            id: 'current',
                            email: adminEmail,
                            source: storageMode === 'supabase' ? ('supabase_auth' as const) : ('database' as const),
                            created_at: null,
                            is_removable: false,
                          },
                        ]
                    ).map((adm) => {
                      const isSelf = adm.email.toLowerCase() === adminEmail.toLowerCase();
                      return (
                        <tr key={adm.id} className="hover:bg-[#0C0A09]/40">
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-medium text-[#FAFAF9]">{adm.email}</span>
                              {isSelf && (
                                <span className="rounded bg-[#2DD4BF]/15 px-2 py-0.5 text-[11px] font-medium text-[#2DD4BF]">
                                  Sessione corrente
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[#A8A29E]">
                            {adm.source === 'env'
                              ? 'Variabile Ambiente (ADMIN_EMAIL)'
                              : adm.source === 'supabase_auth'
                              ? 'Supabase Auth (role = admin)'
                              : 'Database Admin'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[#A8A29E]">
                            {adm.created_at ? adm.created_at.slice(0, 10) : '—'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {adm.is_removable && !isSelf ? (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => void handleRemoveAdminMember(adm.id, adm.email)}
                                className="inline-flex items-center gap-1 rounded-md border border-[#292524] bg-[#0C0A09] px-2.5 py-1 text-xs text-[#FB923C] hover:border-[#FB923C] cursor-pointer disabled:opacity-40"
                              >
                                <Trash2 className="h-3 w-3" aria-hidden="true" />
                                <span>Revoca Admin</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#A8A29E]">Protetto</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-4 text-xs text-[#A8A29E] space-y-1">
              <p className="font-medium text-[#FAFAF9]">Suggerimento Multi-Admin via Vercel</p>
              <p>
                Oltre a creare nuovi amministratori con il pulsante <strong className="text-[#FAFAF9]">Aggiungi Nuovo Admin</strong>, puoi anche elencare più email separate da virgola nella variabile d&rsquo;ambiente <span className="font-mono text-[#2DD4BF]">ADMIN_EMAIL</span> su Vercel (es. <span className="font-mono text-[#FAFAF9]">contatto@kreativalab.ch, direzione@kreativalab.ch</span>).
              </p>
            </div>
          </section>
        )}
      </div>

      {/* MODAL: ADD NEW ADMIN */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#292524] bg-[#1C1917] p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#FAFAF9] flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#2DD4BF]" aria-hidden="true" />
                <span>Aggiungi Nuovo Admin</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="text-[#A8A29E] hover:text-[#FAFAF9] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="text-[#A8A29E] leading-relaxed">
              Crea un nuovo account amministratore (o promuovi un account esistente) con accesso completo alle console <span className="font-mono text-[#FAFAF9]">/admin/affiliates</span> e <span className="font-mono text-[#FAFAF9]">/admin/payouts</span>.
            </p>
            <form onSubmit={handleCreateAdminMember} className="space-y-3">
              <div>
                <label className="block text-[#A8A29E] mb-1">Email Nuovo Admin *</label>
                <input
                  type="email"
                  required
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="collega@kreativalab.ch"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Password (min. 8 caratteri) *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newAdminForm.password}
                  onChange={(e) => setNewAdminForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Conferma Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newAdminForm.confirmPassword}
                  onChange={(e) => setNewAdminForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#292524]">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="rounded-lg border border-[#292524] bg-[#0C0A09] px-4 py-2 text-[#A8A29E] cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#2DD4BF] px-4 py-2 font-semibold text-[#0C0A09] cursor-pointer disabled:opacity-50"
                >
                  {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                  <span>Crea Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT AFFILIATE */}
      {showAffiliateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl border border-[#292524] bg-[#1C1917] p-6 space-y-5 my-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#FAFAF9]">
                {editingAffiliate ? `Modifica Agente · ${editingAffiliate.code}` : 'Nuovo Agente (CO 418a)'}
              </h2>
              <button
                type="button"
                onClick={() => setShowAffiliateModal(false)}
                className="text-[#A8A29E] hover:text-[#FAFAF9] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveAffiliate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A8A29E] mb-1">Nome e Cognome *</label>
                  <input
                    required
                    value={affForm.name}
                    onChange={(e) => setAffForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  />
                </div>
                <div>
                  <label className="block text-[#A8A29E] mb-1">Ragione Sociale</label>
                  <input
                    value={affForm.company_name}
                    onChange={(e) => setAffForm((p) => ({ ...p, company_name: e.target.value }))}
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  />
                </div>
                <div>
                  <label className="block text-[#A8A29E] mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={affForm.email}
                    onChange={(e) => setAffForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  />
                </div>
                <div>
                  <label className="block text-[#A8A29E] mb-1">Telefono</label>
                  <input
                    value={affForm.phone}
                    onChange={(e) => setAffForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+41 79 000 00 00"
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  />
                </div>
                <div>
                  <label className="block text-[#A8A29E] mb-1">Codice Referral (auto se vuoto)</label>
                  <input
                    value={affForm.code}
                    onChange={(e) => setAffForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                    placeholder="KL-MARIO-1234"
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#A8A29E] mb-1">Provvigione (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      required
                      value={affForm.commission_percent}
                      onChange={(e) => setAffForm((p) => ({ ...p, commission_percent: e.target.value }))}
                      className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A8A29E] mb-1">Stato</label>
                    <select
                      value={affForm.status}
                      onChange={(e) => setAffForm((p) => ({ ...p, status: e.target.value as AffiliateStatus }))}
                      className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                    >
                      <option value="active">Attivo</option>
                      <option value="pending_approval">In approvazione</option>
                      <option value="disabled">Disabilitato</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-[#292524]">
                <div className="sm:col-span-2">
                  <label className="block text-[#A8A29E] mb-1">Via e N. Civico</label>
                  <input
                    value={affForm.address}
                    onChange={(e) => setAffForm((p) => ({ ...p, address: e.target.value }))}
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  />
                </div>
                <div>
                  <label className="block text-[#A8A29E] mb-1">NPA</label>
                  <input
                    value={affForm.postal_code}
                    onChange={(e) => setAffForm((p) => ({ ...p, postal_code: e.target.value }))}
                    placeholder="6900"
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                  />
                </div>
                <div>
                  <label className="block text-[#A8A29E] mb-1">Cantone</label>
                  <select
                    value={affForm.canton}
                    onChange={(e) => setAffForm((p) => ({ ...p, canton: e.target.value }))}
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  >
                    {SWISS_CANTONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#A8A29E] mb-1">Località</label>
                  <input
                    value={affForm.city}
                    onChange={(e) => setAffForm((p) => ({ ...p, city: e.target.value }))}
                    placeholder="Lugano"
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#A8A29E] mb-1">AVS / IDI</label>
                  <input
                    value={affForm.avs_idi_number}
                    onChange={(e) => setAffForm((p) => ({ ...p, avs_idi_number: e.target.value }))}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A8A29E] mb-1">IBAN CH / SEPA</label>
                  <input
                    value={affForm.iban}
                    onChange={(e) => setAffForm((p) => ({ ...p, iban: e.target.value }))}
                    placeholder="CH93 0076 2011 6238 5295 7"
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                  />
                  {ibanCheck && (
                    <p className={`mt-1 text-[11px] ${ibanCheck.valid ? 'text-[#22C55E]' : 'text-[#FB923C]'}`}>
                      {ibanCheck.valid ? 'IBAN verificato (ISO 13616 Mod-97)' : ibanCheck.error}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#FAFAF9] cursor-pointer pt-5">
                    <input
                      type="checkbox"
                      checked={affForm.is_vat_registered}
                      onChange={(e) =>
                        setAffForm((p) => ({ ...p, is_vat_registered: e.target.checked }))
                      }
                      className="accent-[#2DD4BF]"
                    />
                    <span>Agente assoggettato IVA (8.1%)</span>
                  </label>
                  {affForm.is_vat_registered && (
                    <div>
                      <input
                        value={affForm.vat_number}
                        onChange={(e) => setAffForm((p) => ({ ...p, vat_number: e.target.value }))}
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
              </div>

              <div>
                <label className="block text-[#A8A29E] mb-1">
                  {editingAffiliate
                    ? 'Nuova Password Portale /affiliate (lascia vuoto per mantenere)'
                    : 'Password Portale /affiliate (min. 8 caratteri)'}
                </label>
                <input
                  type="password"
                  minLength={editingAffiliate ? undefined : 8}
                  required={!editingAffiliate}
                  value={affForm.password}
                  onChange={(e) => setAffForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#292524]">
                <button
                  type="button"
                  onClick={() => setShowAffiliateModal(false)}
                  className="rounded-lg border border-[#292524] bg-[#0C0A09] px-4 py-2 text-xs font-medium text-[#A8A29E] cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2DD4BF] px-4 py-2 text-xs font-semibold text-[#0C0A09] cursor-pointer disabled:opacity-50"
                >
                  {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                  <span>Salva Agente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: APPROVE & CONVERT APPLICATION */}
      {convertingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#292524] bg-[#1C1917] p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#FAFAF9]">
                Approva &amp; Converti in Agente
              </h2>
              <button type="button" onClick={() => setConvertingApp(null)} className="text-[#A8A29E] cursor-pointer">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="text-[#A8A29E]">
              Candidato: <strong className="text-[#FAFAF9]">{convertingApp.name}</strong> ({convertingApp.email})
            </p>
            <form onSubmit={handleReviewApplication} className="space-y-3">
              <div>
                <label className="block text-[#A8A29E] mb-1">Codice Referral Univoco</label>
                <input
                  required
                  value={approveForm.code}
                  onChange={(e) => setApproveForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Provvigione Default (%)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  required
                  value={approveForm.commission_percent}
                  onChange={(e) => setApproveForm((p) => ({ ...p, commission_percent: e.target.value }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Password Iniziale Accesso /affiliate (min. 8 caratteri)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={approveForm.password}
                  onChange={(e) => setApproveForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#292524]">
                <button
                  type="button"
                  onClick={() => setConvertingApp(null)}
                  className="rounded-lg border border-[#292524] bg-[#0C0A09] px-4 py-2 text-[#A8A29E] cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-[#2DD4BF] px-4 py-2 font-semibold text-[#0C0A09] cursor-pointer"
                >
                  Conferma Attivazione
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE LEAD */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#292524] bg-[#1C1917] p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#FAFAF9]">
                Registra Lead Esclusivo (90 giorni)
              </h2>
              <button type="button" onClick={() => setShowLeadModal(false)} className="text-[#A8A29E] cursor-pointer">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="block text-[#A8A29E] mb-1">Agente *</label>
                <select
                  required
                  value={leadForm.affiliate_id}
                  onChange={(e) => setLeadForm((p) => ({ ...p, affiliate_id: e.target.value }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                >
                  {(data?.affiliates ?? []).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A8A29E] mb-1">Servizio di Interesse</label>
                  <input
                    value={leadForm.service_interest}
                    onChange={(e) => setLeadForm((p) => ({ ...p, service_interest: e.target.value }))}
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  />
                </div>
                <div>
                  <label className="block text-[#A8A29E] mb-1">Valore stimato (CHF)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={leadForm.estimated_deal_size}
                    onChange={(e) => setLeadForm((p) => ({ ...p, estimated_deal_size: e.target.value }))}
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#292524]">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="rounded-lg border border-[#292524] bg-[#0C0A09] px-4 py-2 text-[#A8A29E] cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-[#2DD4BF] px-4 py-2 font-semibold text-[#0C0A09] cursor-pointer"
                >
                  Verifica First-Touch &amp; Salva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE CUSTOMER */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#292524] bg-[#1C1917] p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#FAFAF9]">Nuovo Cliente Acquisito</h2>
              <button type="button" onClick={() => setShowCustomerModal(false)} className="text-[#A8A29E] cursor-pointer">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-[#A8A29E] mb-1">Agente *</label>
                <select
                  required
                  value={custForm.affiliate_id}
                  onChange={(e) => setCustForm((p) => ({ ...p, affiliate_id: e.target.value }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                >
                  {(data?.affiliates ?? []).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Nome Cliente *</label>
                <input
                  required
                  value={custForm.client_name}
                  onChange={(e) => setCustForm((p) => ({ ...p, client_name: e.target.value }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Azienda</label>
                <input
                  value={custForm.client_company}
                  onChange={(e) => setCustForm((p) => ({ ...p, client_company: e.target.value }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Email</label>
                <input
                  type="email"
                  value={custForm.client_email}
                  onChange={(e) => setCustForm((p) => ({ ...p, client_email: e.target.value }))}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <label className="flex items-center gap-2 text-[#FAFAF9] cursor-pointer">
                <input
                  type="checkbox"
                  checked={custForm.is_recurring}
                  onChange={(e) => setCustForm((p) => ({ ...p, is_recurring: e.target.checked }))}
                  className="accent-[#2DD4BF]"
                />
                <span>Contratto con canone ricorrente (12 mesi)</span>
              </label>
              <label className="flex items-center gap-2 text-[#FAFAF9] cursor-pointer">
                <input
                  type="checkbox"
                  checked={custForm.recurring_extended_by_admin}
                  onChange={(e) =>
                    setCustForm((p) => ({ ...p, recurring_extended_by_admin: e.target.checked }))
                  }
                  className="accent-[#FBBF24]"
                />
                <span>Estensione admin oltre il 12° mese</span>
              </label>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#292524]">
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  className="rounded-lg border border-[#292524] bg-[#0C0A09] px-4 py-2 text-[#A8A29E] cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-[#2DD4BF] px-4 py-2 font-semibold text-[#0C0A09] cursor-pointer"
                >
                  Salva Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SALE / PACKAGE SPLIT */}
      {showSaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl border border-[#292524] bg-[#1C1917] p-6 space-y-4 text-xs my-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#FAFAF9]">
                Registra Incasso / Vendita / Rata (CO 418a)
              </h2>
              <button type="button" onClick={() => setShowSaleModal(false)} className="text-[#A8A29E] cursor-pointer">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A8A29E] mb-1">Agente *</label>
                  <select
                    required
                    value={saleForm.affiliate_id}
                    onChange={(e) =>
                      setSaleForm((p) => ({ ...p, affiliate_id: e.target.value, customer_id: '' }))
                    }
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  >
                    {(data?.affiliates ?? []).map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.code} · {formatPercent(a.commission_rate)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#A8A29E] mb-1">Cliente (opzionale)</label>
                  <select
                    value={saleForm.customer_id}
                    onChange={(e) => setSaleForm((p) => ({ ...p, customer_id: e.target.value }))}
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  >
                    <option value="">— Seleziona cliente —</option>
                    {(data?.customers ?? [])
                      .filter((c) => c.affiliate_id === saleForm.affiliate_id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.client_name} ({c.recurring_months_paid}/12m)
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#A8A29E] mb-1">N. Fattura / Rata *</label>
                  <input
                    required
                    value={saleForm.invoice_number}
                    onChange={(e) => setSaleForm((p) => ({ ...p, invoice_number: e.target.value }))}
                    placeholder="KL-2026-042-R1"
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                  />
                </div>
                <div>
                  <label className="block text-[#A8A29E] mb-1">Titolo Contratto / Progetto *</label>
                  <input
                    required
                    value={saleForm.contract_title}
                    onChange={(e) => setSaleForm((p) => ({ ...p, contract_title: e.target.value }))}
                    placeholder="Sito Web + SEO Locale Lugano"
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                  />
                </div>
              </div>

              {/* Mode Selector */}
              <div className="flex flex-wrap items-center gap-2 border-y border-[#292524] py-3">
                <span className="text-[#A8A29E] mr-2">Struttura:</span>
                {(
                  [
                    { id: 'one_off', label: 'One-Off / Acconto' },
                    { id: 'recurring', label: 'Canone Ricorrente (12m)' },
                    { id: 'package', label: 'Pacchetto (Split One-Off + Ricorrente)' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSaleForm((p) => ({ ...p, mode: m.id }))}
                    className={`rounded-md px-3 py-1.5 font-medium cursor-pointer ${
                      saleForm.mode === m.id
                        ? 'bg-[#2DD4BF] text-[#0C0A09]'
                        : 'bg-[#0C0A09] border border-[#292524] text-[#A8A29E]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Primary Amount Fields */}
              <div className="space-y-2">
                <p className="font-medium text-[#FAFAF9]">
                  {saleForm.mode === 'package'
                    ? '1. Quota One-Off / Setup iniziale (CHF)'
                    : 'Importi Incassati (CHF)'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[#A8A29E] mb-1">Lordo (Gross)</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={saleForm.gross_amount}
                      onChange={(e) => setSaleForm((p) => ({ ...p, gross_amount: e.target.value }))}
                      className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A8A29E] mb-1">IVA (dedotta)</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={saleForm.vat_amount}
                      onChange={(e) => setSaleForm((p) => ({ ...p, vat_amount: e.target.value }))}
                      className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A8A29E] mb-1">Sconti</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={saleForm.discounts_amount}
                      onChange={(e) => setSaleForm((p) => ({ ...p, discounts_amount: e.target.value }))}
                      className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A8A29E] mb-1">Costi terzi/ads/lic.</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={saleForm.third_party_costs}
                      onChange={(e) => setSaleForm((p) => ({ ...p, third_party_costs: e.target.value }))}
                      className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                    />
                  </div>
                </div>
              </div>

              {/* Package Recurring Component */}
              {saleForm.mode === 'package' && (
                <div className="space-y-2 pt-2 border-t border-[#292524]">
                  <p className="font-medium text-[#FAFAF9]">
                    2. Quota Canone Ricorrente separata (CHF)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[#A8A29E] mb-1">Lordo Canone</label>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        value={saleForm.recurring_gross_amount}
                        onChange={(e) =>
                          setSaleForm((p) => ({ ...p, recurring_gross_amount: e.target.value }))
                        }
                        className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A8A29E] mb-1">IVA Canone</label>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        value={saleForm.recurring_vat_amount}
                        onChange={(e) =>
                          setSaleForm((p) => ({ ...p, recurring_vat_amount: e.target.value }))
                        }
                        className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A8A29E] mb-1">Sconti Canone</label>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        value={saleForm.recurring_discounts_amount}
                        onChange={(e) =>
                          setSaleForm((p) => ({ ...p, recurring_discounts_amount: e.target.value }))
                        }
                        className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A8A29E] mb-1">Costi terzi Canone</label>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        value={saleForm.recurring_third_party_costs}
                        onChange={(e) =>
                          setSaleForm((p) => ({ ...p, recurring_third_party_costs: e.target.value }))
                        }
                        className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Recurring month & preconditions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#292524]">
                <div>
                  <label className="block text-[#A8A29E] mb-1">Data Incasso Effettivo</label>
                  <input
                    type="date"
                    value={saleForm.collected_at}
                    onChange={(e) => setSaleForm((p) => ({ ...p, collected_at: e.target.value }))}
                    className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                  />
                </div>
                {saleForm.mode !== 'one_off' && (
                  <div>
                    <label className="block text-[#A8A29E] mb-1">Mese Ricorrenza (1..12 = attivo)</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={saleForm.recurring_month_number}
                      onChange={(e) =>
                        setSaleForm((p) => ({ ...p, recurring_month_number: e.target.value }))
                      }
                      className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                    />
                  </div>
                )}
                <div className="space-y-1.5 pt-2">
                  <label className="flex items-center gap-2 text-[#FAFAF9] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saleForm.contract_concluded}
                      onChange={(e) =>
                        setSaleForm((p) => ({ ...p, contract_concluded: e.target.checked }))
                      }
                      className="accent-[#2DD4BF]"
                    />
                    <span>Contratto concluso</span>
                  </label>
                  <label className="flex items-center gap-2 text-[#FAFAF9] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saleForm.service_delivered}
                      onChange={(e) =>
                        setSaleForm((p) => ({ ...p, service_delivered: e.target.checked }))
                      }
                      className="accent-[#2DD4BF]"
                    />
                    <span>Servizio avviato / erogato</span>
                  </label>
                  {saleForm.mode !== 'one_off' && (
                    <label className="flex items-center gap-2 text-[#FBBF24] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saleForm.extended_by_admin}
                        onChange={(e) =>
                          setSaleForm((p) => ({ ...p, extended_by_admin: e.target.checked }))
                        }
                        className="accent-[#FBBF24]"
                      />
                      <span>Estensione Admin &gt; 12° mese</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Live Calculation Box */}
              <div className="rounded-lg border border-[#292524] bg-[#0C0A09] p-4 space-y-1.5">
                <div className="flex items-center justify-between text-[#A8A29E]">
                  <span>Anteprima Calcolo CO 418a ({formatPercent(saleRate)})</span>
                  <span className="font-mono tabular-nums text-[#FAFAF9]">
                    Netto: {formatChf(liveSalePreview.primary.netAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A8A29E]">
                    {saleForm.mode === 'package' ? 'Provvigione One-Off' : 'Provvigione Maturata'}
                  </span>
                  <span className="font-mono font-bold text-[#2DD4BF] tabular-nums">
                    {formatChf(liveSalePreview.primary.commission)}
                  </span>
                </div>
                {liveSalePreview.primary.reason && (
                  <p className="text-[11px] text-[#FB923C]">{liveSalePreview.primary.reason}</p>
                )}
                {liveSalePreview.recurringPart && (
                  <>
                    <div className="flex items-center justify-between pt-1 border-t border-[#292524]">
                      <span className="text-[#A8A29E]">
                        Provvigione Canone (#{saleForm.recurring_month_number})
                      </span>
                      <span className="font-mono font-bold text-[#2DD4BF] tabular-nums">
                        {formatChf(liveSalePreview.recurringPart.commission)}
                      </span>
                    </div>
                    {liveSalePreview.recurringPart.reason && (
                      <p className="text-[11px] text-[#FB923C]">
                        {liveSalePreview.recurringPart.reason}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaleModal(false)}
                  className="rounded-lg border border-[#292524] bg-[#0C0A09] px-4 py-2 text-[#A8A29E] cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-[#2DD4BF] px-4 py-2 font-semibold text-[#0C0A09] cursor-pointer"
                >
                  Registra Incasso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REVERSE SALE */}
      {reversingSaleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#292524] bg-[#1C1917] p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#FAFAF9]">
                Storno Provvigione
              </h2>
              <button type="button" onClick={() => setReversingSaleId(null)} className="text-[#A8A29E] cursor-pointer">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="text-[#A8A29E] leading-relaxed">
              In caso di annullamento contratto, rimborso o riduzione importo, la provvigione viene stornata. Se già pagata, genererà un saldo negativo compensato automaticamente nel payout successivo (o credito Kreativalab).
            </p>
            <form onSubmit={handleReverseSale} className="space-y-3">
              <div>
                <label className="block text-[#A8A29E] mb-1">Motivo dello storno *</label>
                <textarea
                  required
                  minLength={3}
                  rows={3}
                  value={reverseReason}
                  onChange={(e) => setReverseReason(e.target.value)}
                  placeholder="Es. Recesso cliente prima dell'attivazione / Nota di credito emessa"
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReversingSaleId(null)}
                  className="rounded-lg border border-[#292524] bg-[#0C0A09] px-4 py-2 text-[#A8A29E] cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-[#FB923C] px-4 py-2 font-semibold text-[#0C0A09] cursor-pointer"
                >
                  Conferma Storno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
