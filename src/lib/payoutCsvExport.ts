import {
  Affiliate,
  AffiliatePayout,
  PayoutStatus,
  ReferralSale,
} from '../types/affiliate';

export const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
  draft: 'Bozza',
  statement_sent: 'Estratto inviato',
  invoice_received: 'Fattura ricevuta',
  paid: 'Pagato su IBAN',
  cancelled: 'Annullato',
};

function escapeCsvCell(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

function triggerCsvDownload(csvContent: string, filename: string): void {
  // Include UTF-8 BOM (\uFEFF) so Excel, Banana Contabilità, Bexio and Abacus decode UTF-8 characters properly
  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportPayoutsToCsv(params: {
  payouts: AffiliatePayout[];
  affiliatesById: Map<string, Affiliate>;
  sales?: ReferralSale[];
  filenameSuffix?: string;
}): number {
  const { payouts, affiliatesById, sales = [], filenameSuffix } = params;

  const headers = [
    'ID Payout',
    'Periodo',
    'Data Creazione',
    'Stato Payout',
    'Codice Stato',
    'Codice Agente',
    'Nome Agente',
    'Azienda / Ragione Sociale',
    'Email Agente',
    'Telefono Agente',
    'Indirizzo',
    'CAP',
    'Città',
    'Cantone',
    'N. AVS / IDI',
    'Soggetto IVA',
    'Partita IVA (CHE)',
    'IBAN Beneficiario',
    'Valuta',
    'N. Vendite Incluse',
    'Totale Provvigioni CHF',
    'Deduzioni Storni CHF',
    'Imponibile Netto CHF',
    'Aliquota IVA %',
    'Importo IVA CHF',
    'Totale Fattura (IVA incl.) CHF',
    'N. Fattura Agente',
    'Data Fattura Agente',
    'Scadenza Pagamento (30gg)',
    'Data Invio Estratto',
    'Data Pagamento Effettivo',
    'Metodo Pagamento',
    'Riferimento Bonifico / CRO',
    'Fatture Clienti Collegate',
    'Note',
  ];

  const dataRows = payouts.map((p) => {
    const aff = affiliatesById.get(p.affiliate_id);
    const linkedSales = sales.filter(
      (s) => s.payout_id === p.id || s.reversal_compensated_payout_id === p.id
    );
    const invoiceList = linkedSales.map((s) => s.invoice_number).join('; ');
    const vatRateLabel = p.vat_amount > 0 ? '8.10' : '0.00';

    return [
      p.id,
      p.period_month,
      p.created_at ? p.created_at.slice(0, 10) : '',
      PAYOUT_STATUS_LABELS[p.status] || p.status,
      p.status,
      aff?.code || '',
      aff?.name || p.affiliate_id,
      aff?.company_name || '',
      aff?.email || '',
      aff?.phone || '',
      aff?.address || '',
      aff?.postal_code || '',
      aff?.city || '',
      aff?.canton || '',
      aff?.avs_idi_number || '',
      aff?.is_vat_registered ? 'SI' : 'NO',
      aff?.vat_number || '',
      aff?.iban || '',
      p.currency || 'CHF',
      linkedSales.length,
      p.total_commissions.toFixed(2),
      p.deductions.toFixed(2),
      p.net_payable.toFixed(2),
      vatRateLabel,
      p.vat_amount.toFixed(2),
      p.gross_invoice_amount.toFixed(2),
      p.agent_invoice_number || '',
      p.agent_invoice_date || '',
      p.payment_due_date || '',
      p.statement_sent_at ? p.statement_sent_at.slice(0, 10) : '',
      p.paid_at ? p.paid_at.slice(0, 10) : '',
      p.payment_method || '',
      p.payment_reference || '',
      invoiceList,
      p.notes || '',
    ];
  });

  const csvLines = [headers, ...dataRows].map((row) =>
    row.map(escapeCsvCell).join(',')
  );

  const dateTag = filenameSuffix || new Date().toISOString().slice(0, 10);
  triggerCsvDownload(csvLines.join('\r\n'), `kreativalab-payouts-contabilita-${dateTag}.csv`);
  return payouts.length;
}

export function exportSinglePayoutStatementToCsv(params: {
  payout: AffiliatePayout;
  affiliate?: Affiliate;
  sales: ReferralSale[];
}): void {
  const { payout, affiliate, sales } = params;
  const linkedSales = sales.filter(
    (s) =>
      s.payout_id === payout.id ||
      s.reversal_compensated_payout_id === payout.id
  );

  const headers = [
    'ID Payout',
    'Periodo',
    'Codice Agente',
    'Nome Agente',
    'IBAN',
    'Tipo Movimento',
    'N. Fattura Cliente',
    'Contratto / Servizio',
    'Data Incasso',
    'Imponibile Vendita CHF',
    'Aliquota Provvigione %',
    'Importo Provvigione CHF',
    'Motivo Storno',
  ];

  const rows = linkedSales.map((s) => {
    const isReversal = s.reversal_compensated_payout_id === payout.id;
    return [
      payout.id,
      payout.period_month,
      affiliate?.code || '',
      affiliate?.name || payout.affiliate_id,
      affiliate?.iban || '',
      isReversal ? 'STORNO COMPENSATO' : 'PROVVIGIONE MATURATA',
      s.invoice_number,
      s.contract_title,
      s.collected_at ? s.collected_at.slice(0, 10) : '',
      s.net_amount.toFixed(2),
      (s.commission_rate * 100).toFixed(2),
      isReversal ? (-s.commission).toFixed(2) : s.commission.toFixed(2),
      isReversal ? s.reversed_reason || '' : '',
    ];
  });

  // Summary rows at the bottom for accounting reconciliation
  rows.push(
    [
      payout.id,
      payout.period_month,
      affiliate?.code || '',
      affiliate?.name || payout.affiliate_id,
      affiliate?.iban || '',
      'RIEPILOGO NETTO IMPONIBILE',
      payout.agent_invoice_number || '',
      `Totale Provvigioni: CHF ${payout.total_commissions.toFixed(2)} | Storni: -CHF ${payout.deductions.toFixed(2)}`,
      payout.agent_invoice_date || '',
      '',
      '',
      payout.net_payable.toFixed(2),
      '',
    ],
    [
      payout.id,
      payout.period_month,
      affiliate?.code || '',
      affiliate?.name || payout.affiliate_id,
      affiliate?.iban || '',
      'TOTALE FATTURA (IVA 8.1% INCL.)',
      payout.agent_invoice_number || '',
      `IVA: CHF ${payout.vat_amount.toFixed(2)}`,
      payout.paid_at ? payout.paid_at.slice(0, 10) : payout.payment_due_date || '',
      '',
      '',
      payout.gross_invoice_amount.toFixed(2),
      payout.payment_reference || '',
    ]
  );

  const csvLines = [headers, ...rows].map((row) =>
    row.map(escapeCsvCell).join(',')
  );
  const codeSlug = (affiliate?.code || payout.affiliate_id).toLowerCase();
  triggerCsvDownload(
    csvLines.join('\r\n'),
    `kreativalab-estratto-${payout.period_month}-${codeSlug}.csv`
  );
}
