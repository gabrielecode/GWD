import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Send,
  Wallet,
  X,
} from 'lucide-react';
import {
  AdminOverviewData,
  Affiliate,
  AffiliatePayout,
  PayoutPreviewItem,
  PayoutStatus,
} from '../types/affiliate';
import { affiliateApi } from '../lib/affiliateClient';
import {
  formatChf,
  formatIbanDisplay,
  getPreviousMonthPeriod,
  PAYOUT_MIN_THRESHOLD_CHF,
} from '../lib/affiliateRules';
import { AdminAuthGate } from '../components/affiliate/AdminAuthGate';
import { WorkspaceBar } from '../components/affiliate/WorkspaceBar';

interface AdminPayoutsViewProps {
  onNavigate: (path: string) => void;
}

const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
  draft: 'Bozza',
  statement_sent: 'Estratto inviato',
  invoice_received: 'Fattura ricevuta',
  paid: 'Pagato su IBAN',
  cancelled: 'Annullato',
};

export function AdminPayoutsView({ onNavigate }: AdminPayoutsViewProps) {
  return (
    <AdminAuthGate
      currentPath="/admin/payouts"
      breadcrumb={['Kreativalab', 'Admin', 'Provvigioni & Payouts']}
      onNavigate={onNavigate}
    >
      {({ adminEmail, storageMode, onLogout }) => (
        <AdminPayoutsDashboard
          adminEmail={adminEmail}
          storageMode={storageMode}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      )}
    </AdminAuthGate>
  );
}

function AdminPayoutsDashboard({
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
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [periodMonth, setPeriodMonth] = useState(() => getPreviousMonthPeriod());
  const [previews, setPreviews] = useState<PayoutPreviewItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Modals
  const [invoicePayout, setInvoicePayout] = useState<AffiliatePayout | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [payPayout, setPayPayout] = useState<AffiliatePayout | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Bonifico SEPA/SIC su IBAN');
  const [paymentReference, setPaymentReference] = useState('');

  const [detailPayout, setDetailPayout] = useState<AffiliatePayout | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await affiliateApi.getAdminOverview();
      setOverview(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore caricamento payouts.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPreview = useCallback(async (period: string) => {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period)) return;
    setPreviewLoading(true);
    try {
      const res = await affiliateApi.previewPayouts(period);
      setPreviews(res.previews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore anteprima payout mensile.');
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    void loadPreview(periodMonth);
  }, [periodMonth, loadPreview]);

  const affiliateMap = useMemo(() => {
    const m = new Map<string, Affiliate>();
    for (const a of overview?.affiliates ?? []) m.set(a.id, a);
    return m;
  }, [overview?.affiliates]);

  const filteredPayouts = useMemo(() => {
    const list = overview?.payouts ?? [];
    if (statusFilter === 'all') return list;
    return list.filter((p) => p.status === statusFilter);
  }, [overview?.payouts, statusFilter]);

  const payoutStats = useMemo(() => {
    const list = overview?.payouts ?? [];
    let awaitingInvoiceOrPay = 0;
    let paidTotal = 0;
    for (const p of list) {
      if (p.status === 'paid') paidTotal += p.net_payable;
      else if (p.status !== 'cancelled') awaitingInvoiceOrPay += p.net_payable;
    }
    return {
      awaitingInvoiceOrPay,
      paidTotal,
    };
  }, [overview?.payouts]);

  const handleGenerateMonthly = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await affiliateApi.generatePayouts(periodMonth);
      setNotice(
        `Generati ${res.created.length} estratti in bozza per ${periodMonth}. ${res.skipped_rollover.length} agenti sotto soglia CHF ${PAYOUT_MIN_THRESHOLD_CHF.toFixed(2)} riportati al mese successivo.`
      );
      await Promise.all([loadAll(), loadPreview(periodMonth)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generazione estratti fallita.');
    } finally {
      setBusy(false);
    }
  };

  const handleSendStatement = async (payoutId: string) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await affiliateApi.updatePayoutStatus(payoutId, { status: 'statement_sent' });
      setNotice('Estratto conto marcato come inviato all’agente (in attesa di fattura).');
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Aggiornamento stato fallito.');
    } finally {
      setBusy(false);
    }
  };

  const handleSubmitInvoice = async (e: FormEvent) => {
    e.preventDefault();
    if (!invoicePayout || busy) return;
    setBusy(true);
    setError(null);
    try {
      await affiliateApi.updatePayoutStatus(invoicePayout.id, {
        status: 'invoice_received',
        agent_invoice_number: invoiceNumber,
        agent_invoice_date: invoiceDate,
      });
      setInvoicePayout(null);
      setNotice('Fattura agente registrata. Scadenza pagamento impostata a 30 giorni.');
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrazione fattura fallita.');
    } finally {
      setBusy(false);
    }
  };

  const handleMarkPaid = async (e: FormEvent) => {
    e.preventDefault();
    if (!payPayout || busy) return;
    setBusy(true);
    setError(null);
    try {
      await affiliateApi.updatePayoutStatus(payPayout.id, {
        status: 'paid',
        payment_method: paymentMethod,
        payment_reference: paymentReference,
      });
      setPayPayout(null);
      setPaymentReference('');
      setNotice('Pagamento registrato su IBAN e vendite collegate marcate come pagate.');
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrazione pagamento fallita.');
    } finally {
      setBusy(false);
    }
  };

  const handleCancelPayout = async (payoutId: string) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await affiliateApi.updatePayoutStatus(payoutId, { status: 'cancelled' });
      setNotice('Payout annullato: le provvigioni collegate tornano nel pool maturato.');
      await Promise.all([loadAll(), loadPreview(periodMonth)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Annullamento fallito.');
    } finally {
      setBusy(false);
    }
  };

  const handleExportCsv = () => {
    const rows = [
      [
        'Periodo',
        'Agente',
        'Codice',
        'IBAN',
        'Totale Provvigioni CHF',
        'Deduzioni Storni CHF',
        'Netto Imponibile CHF',
        'IVA 8.1% CHF',
        'Totale Fattura CHF',
        'Stato',
        'N. Fattura Agente',
        'Scadenza 30gg',
        'Rif. Pagamento',
      ],
      ...filteredPayouts.map((p) => {
        const aff = affiliateMap.get(p.affiliate_id);
        return [
          p.period_month,
          aff?.name || p.affiliate_id,
          aff?.code || '',
          aff?.iban || '',
          p.total_commissions.toFixed(2),
          p.deductions.toFixed(2),
          p.net_payable.toFixed(2),
          p.vat_amount.toFixed(2),
          p.gross_invoice_amount.toFixed(2),
          PAYOUT_STATUS_LABELS[p.status],
          p.agent_invoice_number || '',
          p.payment_due_date || '',
          p.payment_reference || '',
        ];
      }),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kreativalab-payouts-${periodMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pb-16">
      <WorkspaceBar
        currentPath="/admin/payouts"
        breadcrumb={['Kreativalab', 'Admin', 'Provvigioni & Payouts Mensili']}
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
              Liquidazioni &amp; Payouts Mensili (CO 418a segg.)
            </h1>
            <p className="text-sm text-[#A8A29E] max-w-2xl">
              Generazione estratti entro il 5 del mese successivo, soglia minima CHF 50.00 con rollover automatico, compensazione storni, fatturazione con IVA 8.1% e bonifico entro 30 giorni.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/admin/affiliates')}
              className="rounded-lg border border-[#292524] bg-[#1C1917] px-3.5 py-2 text-xs font-medium text-[#FAFAF9] hover:border-[#2DD4BF] cursor-pointer min-h-[40px]"
            >
              Gestione Agenti &amp; Vendite
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#292524] bg-[#1C1917] px-3.5 py-2 text-xs font-medium text-[#FAFAF9] hover:border-[#2DD4BF] cursor-pointer min-h-[40px]"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Esporta CSV</span>
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-[#FB923C]/50 bg-[#1C1917] p-4 flex items-center justify-between text-xs text-[#FB923C]">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
            <button type="button" onClick={() => setError(null)} className="cursor-pointer">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {notice && (
          <div className="rounded-xl border border-[#22C55E]/40 bg-[#1C1917] p-4 flex items-center justify-between text-xs text-[#22C55E]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{notice}</span>
            </div>
            <button type="button" onClick={() => setNotice(null)} className="cursor-pointer">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* 4-column KPI Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-1">
            <p className="text-xs text-[#A8A29E]">Maturato Non Liquidato</p>
            <p className="font-mono text-2xl font-bold text-[#2DD4BF] tabular-nums">
              {overview ? formatChf(overview.kpis.accrued_unpaid_commissions_chf) : '—'}
            </p>
            <p className="text-xs text-[#A8A29E]">Soglia minima liquidazione: CHF 50.00</p>
          </div>

          <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-1">
            <p className="text-xs text-[#A8A29E]">Payout in Corso (Attesa / Fattura)</p>
            <p className="font-mono text-2xl font-bold text-[#FBBF24] tabular-nums">
              {overview ? formatChf(payoutStats.awaitingInvoiceOrPay) : '—'}
            </p>
            <p className="text-xs text-[#A8A29E]">Scadenza 30gg dalla fattura agente</p>
          </div>

          <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-1">
            <p className="text-xs text-[#A8A29E]">Storico Pagato su IBAN</p>
            <p className="font-mono text-2xl font-bold text-[#22C55E] tabular-nums">
              {overview ? formatChf(payoutStats.paidTotal) : '—'}
            </p>
            <p className="text-xs text-[#A8A29E]">Netto liquidato agli agenti</p>
          </div>

          <div className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 space-y-1">
            <p className="text-xs text-[#A8A29E]">Crediti Storno da Compensare</p>
            <p className="font-mono text-2xl font-bold text-[#FB923C] tabular-nums">
              {overview ? formatChf(overview.kpis.pending_reversal_credits_chf) : '—'}
            </p>
            <p className="text-xs text-[#A8A29E]">Dedotti automaticamente nei prossimi estratti</p>
          </div>
        </section>

        {/* Monthly Statement Generator */}
        <section className="rounded-xl border border-[#292524] bg-[#1C1917] p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292524] pb-4">
            <div className="space-y-1">
              <h2 className="font-display text-lg font-semibold text-[#FAFAF9]">
                Chiusura Mensile &amp; Generazione Estratti (entro il 5 del mese)
              </h2>
              <p className="text-xs text-[#A8A29E]">
                Anteprima delle provvigioni incassate fino alla fine del mese selezionato, al netto di eventuali storni.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="payout-period-month" className="text-xs text-[#A8A29E]">
                Periodo:
              </label>
              <input
                id="payout-period-month"
                type="month"
                value={periodMonth}
                onChange={(e) => setPeriodMonth(e.target.value)}
                className="rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-xs text-[#FAFAF9]"
              />
              <button
                type="button"
                disabled={busy || previews.filter((p) => p.meets_threshold && !p.already_generated_payout_id).length === 0}
                onClick={() => void handleGenerateMonthly()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2DD4BF] px-4 py-2 text-xs font-semibold text-[#0C0A09] cursor-pointer disabled:opacity-40 min-h-[38px]"
              >
                {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                <span>Genera Estratti Idonei</span>
              </button>
            </div>
          </div>

          {previewLoading ? (
            <div className="py-6 text-center text-xs text-[#A8A29E]">Calcolo anteprima periodo...</div>
          ) : previews.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#A8A29E]">
              Nessuna provvigione maturata o storno pendente per {periodMonth}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#292524] text-[#A8A29E]">
                    <th className="py-2.5 px-3 font-medium">Agente</th>
                    <th className="py-2.5 px-3 font-medium text-right">Vendite</th>
                    <th className="py-2.5 px-3 font-medium text-right">Provvigioni</th>
                    <th className="py-2.5 px-3 font-medium text-right">Storni</th>
                    <th className="py-2.5 px-3 font-medium text-right">Netto Pagabile</th>
                    <th className="py-2.5 px-3 font-medium">Esito Soglia CHF 50.00</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292524]">
                  {previews.map((item) => (
                    <tr key={item.affiliate.id}>
                      <td className="py-3 px-3">
                        <div className="font-medium text-[#FAFAF9]">{item.affiliate.name}</div>
                        <div className="text-[#A8A29E] font-mono text-[11px]">
                          {item.affiliate.code} · {item.affiliate.is_vat_registered ? 'IVA 8.1%' : 'Esente IVA'}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-[#FAFAF9]">
                        {item.eligible_sales.length}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-[#FAFAF9]">
                        {formatChf(item.total_commissions)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-[#FB923C]">
                        {item.deductions > 0 ? `-${formatChf(item.deductions)}` : 'CHF 0.00'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-[#2DD4BF]">
                        {formatChf(item.net_payable)}
                      </td>
                      <td className="py-3 px-3">
                        {item.already_generated_payout_id ? (
                          <span className="text-[#A8A29E]">Estratto già generato</span>
                        ) : item.meets_threshold ? (
                          <span className="text-[#22C55E] font-medium">
                            Idoneo (Fattura {formatChf(item.gross_invoice_amount)})
                          </span>
                        ) : (
                          <span className="text-[#FBBF24]">{item.rollover_reason}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Payouts History & Workflow */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-[#FAFAF9]">
              Storico Estratti &amp; Pagamenti ({filteredPayouts.length})
            </h2>
            <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#1C1917] border border-[#292524] p-1">
              {(
                [
                  { id: 'all', label: 'Tutti' },
                  { id: 'draft', label: 'Bozza' },
                  { id: 'statement_sent', label: 'Estratto Inviato' },
                  { id: 'invoice_received', label: 'Fattura Ricevuta' },
                  { id: 'paid', label: 'Pagato' },
                  { id: 'cancelled', label: 'Annullato' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                      : 'text-[#A8A29E] hover:text-[#FAFAF9]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#292524] bg-[#1C1917] overflow-hidden">
            {loading && !overview ? (
              <div className="p-8 text-center text-xs text-[#A8A29E]">Caricamento storico payouts...</div>
            ) : filteredPayouts.length === 0 ? (
              <div className="p-10 text-center text-xs text-[#A8A29E]">
                Nessun payout presente per questo filtro.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#292524] text-[#A8A29E]">
                      <th className="py-3 px-4 font-medium">Periodo &amp; Agente</th>
                      <th className="py-3 px-4 font-medium text-right">Netto / Fattura</th>
                      <th className="py-3 px-4 font-medium">Fattura &amp; Scadenza 30gg</th>
                      <th className="py-3 px-4 font-medium">Stato</th>
                      <th className="py-3 px-4 font-medium text-right">Azioni Workflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#292524]">
                    {filteredPayouts.map((p) => {
                      const aff = affiliateMap.get(p.affiliate_id);
                      return (
                        <tr key={p.id} className="hover:bg-[#0C0A09]/40">
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-[#FAFAF9]">
                              <span className="font-mono text-[#2DD4BF]">{p.period_month}</span> ·{' '}
                              {aff?.name || p.affiliate_id}
                            </div>
                            <div className="text-[#A8A29E] font-mono text-[11px] mt-0.5">
                              {aff?.iban ? formatIbanDisplay(aff.iban) : 'IBAN mancante'}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                            <div className="font-semibold text-[#FAFAF9]">{formatChf(p.net_payable)}</div>
                            <div className="text-[11px] text-[#A8A29E]">
                              {p.vat_amount > 0
                                ? `IVA ${formatChf(p.vat_amount)} → ${formatChf(p.gross_invoice_amount)}`
                                : 'Esente IVA'}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#A8A29E]">
                            {p.agent_invoice_number ? (
                              <div>
                                <div className="text-[#FAFAF9]">
                                  Fatt. {p.agent_invoice_number} ({p.agent_invoice_date})
                                </div>
                                <div>
                                  {p.paid_at
                                    ? `Pagato il ${p.paid_at.slice(0, 10)} · ${p.payment_reference}`
                                    : `Scadenza: ${p.payment_due_date}`}
                                </div>
                              </div>
                            ) : (
                              <span>In attesa fattura agente</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`font-medium ${
                                p.status === 'paid'
                                  ? 'text-[#22C55E]'
                                  : p.status === 'invoice_received'
                                  ? 'text-[#2DD4BF]'
                                  : p.status === 'statement_sent'
                                  ? 'text-[#FBBF24]'
                                  : p.status === 'cancelled'
                                  ? 'text-[#FB923C]'
                                  : 'text-[#A8A29E]'
                              }`}
                            >
                              {PAYOUT_STATUS_LABELS[p.status]}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setDetailPayout(p)}
                                className="rounded-md border border-[#292524] bg-[#0C0A09] px-2.5 py-1.5 text-[#A8A29E] hover:text-[#FAFAF9] cursor-pointer"
                              >
                                Dettaglio
                              </button>

                              {p.status === 'draft' && (
                                <button
                                  type="button"
                                  onClick={() => void handleSendStatement(p.id)}
                                  className="inline-flex items-center gap-1 rounded-md bg-[#FBBF24] px-2.5 py-1.5 font-semibold text-[#0C0A09] cursor-pointer"
                                >
                                  <Send className="h-3 w-3" aria-hidden="true" />
                                  <span>Invia Estratto</span>
                                </button>
                              )}

                              {(p.status === 'statement_sent' || p.status === 'draft') && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInvoicePayout(p);
                                    setInvoiceNumber(p.agent_invoice_number || '');
                                    setInvoiceDate(new Date().toISOString().slice(0, 10));
                                  }}
                                  className="inline-flex items-center gap-1 rounded-md border border-[#2DD4BF]/50 bg-[#0C0A09] px-2.5 py-1.5 text-[#2DD4BF] cursor-pointer"
                                >
                                  <FileText className="h-3 w-3" aria-hidden="true" />
                                  <span>Registra Fattura</span>
                                </button>
                              )}

                              {p.status === 'invoice_received' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPayPayout(p);
                                    setPaymentReference(`KL-${p.period_month}-${aff?.code || 'PAY'}`);
                                  }}
                                  className="inline-flex items-center gap-1 rounded-md bg-[#22C55E] px-2.5 py-1.5 font-semibold text-[#0C0A09] cursor-pointer"
                                >
                                  <Wallet className="h-3 w-3" aria-hidden="true" />
                                  <span>Paga su IBAN</span>
                                </button>
                              )}

                              {p.status !== 'paid' && p.status !== 'cancelled' && (
                                <button
                                  type="button"
                                  onClick={() => void handleCancelPayout(p.id)}
                                  className="rounded-md border border-[#292524] bg-[#0C0A09] px-2.5 py-1.5 text-[#FB923C] cursor-pointer"
                                >
                                  Annulla
                                </button>
                              )}
                            </div>
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
      </div>

      {/* MODAL: RECORD AGENT INVOICE */}
      {invoicePayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#292524] bg-[#1C1917] p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#FAFAF9]">
                Registra Fattura Agente ({invoicePayout.period_month})
              </h2>
              <button type="button" onClick={() => setInvoicePayout(null)} className="text-[#A8A29E] cursor-pointer">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="text-[#A8A29E]">
              Imponibile netto: <strong className="font-mono text-[#FAFAF9]">{formatChf(invoicePayout.net_payable)}</strong>. La scadenza pagamento sarà calcolata automaticamente a +30 giorni dalla data fattura.
            </p>
            <form onSubmit={handleSubmitInvoice} className="space-y-3">
              <div>
                <label className="block text-[#A8A29E] mb-1">Numero Fattura Agente *</label>
                <input
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="FAT-2026-008"
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
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInvoicePayout(null)}
                  className="rounded-lg border border-[#292524] bg-[#0C0A09] px-4 py-2 text-[#A8A29E] cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-[#2DD4BF] px-4 py-2 font-semibold text-[#0C0A09] cursor-pointer"
                >
                  Conferma Fattura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD IBAN PAYMENT */}
      {payPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#292524] bg-[#1C1917] p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#FAFAF9]">
                Registra Pagamento su IBAN
              </h2>
              <button type="button" onClick={() => setPayPayout(null)} className="text-[#A8A29E] cursor-pointer">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="rounded-lg border border-[#292524] bg-[#0C0A09] p-3 space-y-1 font-mono">
              <div className="text-[#A8A29E]">
                IBAN: <span className="text-[#FAFAF9]">{formatIbanDisplay(affiliateMap.get(payPayout.affiliate_id)?.iban)}</span>
              </div>
              <div className="text-[#A8A29E]">
                Importo da bonificare:{' '}
                <span className="text-[#22C55E] font-bold">
                  {formatChf(payPayout.gross_invoice_amount || payPayout.net_payable)}
                </span>
              </div>
            </div>
            <form onSubmit={handleMarkPaid} className="space-y-3">
              <div>
                <label className="block text-[#A8A29E] mb-1">Metodo Pagamento</label>
                <input
                  required
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 text-[#FAFAF9]"
                />
              </div>
              <div>
                <label className="block text-[#A8A29E] mb-1">Riferimento Bonifico / CRO *</label>
                <input
                  required
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full rounded-lg border border-[#292524] bg-[#0C0A09] px-3 py-2 font-mono text-[#FAFAF9]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayPayout(null)}
                  className="rounded-lg border border-[#292524] bg-[#0C0A09] px-4 py-2 text-[#A8A29E] cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-[#22C55E] px-4 py-2 font-semibold text-[#0C0A09] cursor-pointer"
                >
                  Conferma Pagamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PAYOUT DETAIL */}
      {detailPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl border border-[#292524] bg-[#1C1917] p-6 space-y-4 text-xs my-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#FAFAF9]">
                Estratto Provvigioni · {detailPayout.period_month}
              </h2>
              <button type="button" onClick={() => setDetailPayout(null)} className="text-[#A8A29E] cursor-pointer">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg border border-[#292524] bg-[#0C0A09] p-3 font-mono tabular-nums">
              <div>
                <div className="text-[#A8A29E]">Provvigioni</div>
                <div className="text-[#FAFAF9] font-semibold">{formatChf(detailPayout.total_commissions)}</div>
              </div>
              <div>
                <div className="text-[#A8A29E]">Deduzioni Storni</div>
                <div className="text-[#FB923C] font-semibold">-{formatChf(detailPayout.deductions)}</div>
              </div>
              <div>
                <div className="text-[#A8A29E]">Imponibile Netto</div>
                <div className="text-[#2DD4BF] font-semibold">{formatChf(detailPayout.net_payable)}</div>
              </div>
              <div>
                <div className="text-[#A8A29E]">Totale c/IVA</div>
                <div className="text-[#FAFAF9] font-semibold">{formatChf(detailPayout.gross_invoice_amount)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-[#FAFAF9]">Vendite &amp; Storni collegati</p>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#292524] rounded-lg border border-[#292524]">
                {(overview?.sales ?? [])
                  .filter(
                    (s) =>
                      s.payout_id === detailPayout.id ||
                      s.reversal_compensated_payout_id === detailPayout.id
                  )
                  .map((s) => (
                    <div key={s.id} className="p-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium text-[#FAFAF9]">
                          {s.invoice_number} · {s.contract_title}
                        </div>
                        <div className="text-[#A8A29E] font-mono text-[11px]">
                          Netto incassato {formatChf(s.net_amount)}
                          {s.reversal_compensated_payout_id === detailPayout.id
                            ? ` · Storno compensato (${s.reversed_reason})`
                            : ''}
                        </div>
                      </div>
                      <div
                        className={`font-mono tabular-nums font-semibold ${
                          s.reversal_compensated_payout_id === detailPayout.id
                            ? 'text-[#FB923C]'
                            : 'text-[#2DD4BF]'
                        }`}
                      >
                        {s.reversal_compensated_payout_id === detailPayout.id
                          ? `-${formatChf(s.commission)}`
                          : formatChf(s.commission)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
