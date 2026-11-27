import { SaleType } from '../types/affiliate';

export const DEFAULT_COMMISSION_RATE = 0.2;
export const PAYOUT_MIN_THRESHOLD_CHF = 50.0;
export const LEAD_EXCLUSIVITY_DAYS = 90;
export const RECURRING_MAX_MONTHS = 12;
export const PAYMENT_TERMS_DAYS = 30;
export const CH_STANDARD_VAT_RATE = 0.081;

export const SWISS_CANTONS = [
  'TI', 'ZH', 'BE', 'LU', 'UR', 'SZ', 'OW', 'NW', 'GL', 'ZG',
  'FR', 'SO', 'BS', 'BL', 'SH', 'AR', 'AI', 'SG', 'GR', 'AG',
  'TG', 'VD', 'VS', 'NE', 'GE', 'JU', 'ALTRO',
] as const;

const SEPA_IBAN_LENGTHS: Record<string, number> = {
  AL: 28, AD: 24, AT: 20, BE: 16, BG: 22, CH: 21, CY: 28, CZ: 24,
  DE: 22, DK: 18, EE: 20, ES: 24, FI: 18, FR: 27, GB: 22, GI: 23,
  GR: 27, HR: 21, HU: 28, IE: 22, IS: 26, IT: 27, LI: 21, LT: 20,
  LU: 20, LV: 21, MC: 27, MT: 31, NL: 18, NO: 15, PL: 28, PT: 25,
  RO: 24, SE: 24, SI: 19, SK: 24, SM: 27, VA: 22,
};

export function round2(value: number): number {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
}

/**
 * Formats an amount in Swiss format: CHF 1'250.00 or -CHF 125.00
 */
export function formatChf(amount: number | null | undefined): string {
  const num = round2(Number(amount ?? 0));
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);
  const [intPart, decPart] = abs.toFixed(2).split('.');
  const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `${sign}CHF ${groupedInt}.${decPart}`;
}

export function formatPercent(rate: number): string {
  return `${round2(rate * 100)}%`;
}

export function validateEmail(email: string): boolean {
  const clean = email.trim();
  return clean.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
}

export function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  return clean.length > 0 ? clean : null;
}

export function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^0-9]/g, '');
  return digits.length >= 7 ? digits : null;
}

export function normalizeCompany(company: string | null | undefined): string | null {
  if (!company) return null;
  const clean = company.trim().toLowerCase().replace(/\s+/g, ' ');
  return clean.length >= 2 ? clean : null;
}

export function validatePhone(phone: string): boolean {
  const clean = phone.trim();
  if (!clean) return false;
  const digits = clean.replace(/[^0-9]/g, '');
  return digits.length >= 8 && digits.length <= 15 && /^[+0-9\s\-().]+$/.test(clean);
}

export function validatePostalCode(postalCode: string): boolean {
  const clean = postalCode.trim();
  return /^[0-9]{4,5}$/.test(clean);
}

export function normalizeIban(rawIban: string): string {
  return rawIban.replace(/\s+/g, '').toUpperCase();
}

export function formatIbanDisplay(rawIban: string | null | undefined): string {
  if (!rawIban) return '—';
  const clean = normalizeIban(rawIban);
  return clean.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Validates CH / SEPA IBAN using ISO 13616 Mod-97 checksum & country lengths
 */
export function validateIban(rawIban: string): { valid: boolean; normalized: string; error?: string } {
  const normalized = normalizeIban(rawIban);
  if (!normalized) {
    return { valid: false, normalized, error: 'IBAN mancante.' };
  }
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,30}$/.test(normalized)) {
    return { valid: false, normalized, error: 'Formato IBAN non valido.' };
  }
  const country = normalized.slice(0, 2);
  const expectedLength = SEPA_IBAN_LENGTHS[country];
  if (!expectedLength) {
    return { valid: false, normalized, error: `Paese IBAN (${country}) non supportato per bonifici CH/SEPA.` };
  }
  if (normalized.length !== expectedLength) {
    return {
      valid: false,
      normalized,
      error: `IBAN ${country} deve contenere esattamente ${expectedLength} caratteri (trovati ${normalized.length}).`,
    };
  }

  const rearranged = normalized.slice(4) + normalized.slice(0, 4);
  let remainder = 0;
  for (let i = 0; i < rearranged.length; i++) {
    const code = rearranged.charCodeAt(i);
    const expanded = code >= 65 && code <= 90 ? String(code - 55) : rearranged[i];
    for (let j = 0; j < expanded.length; j++) {
      remainder = (remainder * 10 + Number(expanded[j])) % 97;
    }
  }

  if (remainder !== 1) {
    return { valid: false, normalized, error: 'Cifra di controllo IBAN (Mod-97) non valida.' };
  }
  return { valid: true, normalized };
}

/**
 * Validates Swiss AVS (756.XXXX.XXXX.XX) or UID/IDI (CHE-XXX.XXX.XXX)
 */
export function validateAvsOrIdi(rawValue: string): { valid: boolean; normalized: string; error?: string } {
  const clean = rawValue.trim().toUpperCase();
  if (!clean) {
    return { valid: false, normalized: clean, error: 'Numero AVS o IDI obbligatorio.' };
  }

  const avsDigits = clean.replace(/\./g, '');
  if (/^756[0-9]{10}$/.test(avsDigits)) {
    // EAN-13 check digit verification for Swiss AHV/AVS
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = Number(avsDigits[i]);
      sum += i % 2 === 0 ? digit : digit * 3;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    if (checkDigit !== Number(avsDigits[12])) {
      return { valid: false, normalized: clean, error: 'Numero AVS (756...) con cifra di controllo non valida.' };
    }
    const formatted = `${avsDigits.slice(0, 3)}.${avsDigits.slice(3, 7)}.${avsDigits.slice(7, 11)}.${avsDigits.slice(11)}`;
    return { valid: true, normalized: formatted };
  }

  const idiMatch = clean.match(/^CHE[- ]?([0-9]{3})\.?([0-9]{3})\.?([0-9]{3})$/);
  if (idiMatch) {
    const digits = `${idiMatch[1]}${idiMatch[2]}${idiMatch[3]}`;
    const weights = [5, 4, 3, 2, 7, 6, 5, 4];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += Number(digits[i]) * weights[i];
    }
    const rem = sum % 11;
    const expected = rem === 0 ? 0 : 11 - rem;
    if (expected === 10 || expected !== Number(digits[8])) {
      return { valid: false, normalized: clean, error: 'Numero IDI (CHE-...) non supera il controllo modulo 11.' };
    }
    return { valid: true, normalized: `CHE-${idiMatch[1]}.${idiMatch[2]}.${idiMatch[3]}` };
  }

  return {
    valid: false,
    normalized: clean,
    error: 'Inserire un numero AVS svizzero (756.xxxx.xxxx.xx) o IDI (CHE-xxx.xxx.xxx).',
  };
}

export function validateVatNumber(rawValue: string): { valid: boolean; normalized: string; error?: string } {
  const clean = rawValue.trim().toUpperCase();
  const match = clean.match(/^CHE[- ]?([0-9]{3})\.?([0-9]{3})\.?([0-9]{3})(?:\s*(IVA|MWST|TVA))?$/);
  if (!match) {
    return {
      valid: false,
      normalized: clean,
      error: 'Numero IVA svizzero non valido (es. CHE-123.456.789 IVA).',
    };
  }
  const idiCheck = validateAvsOrIdi(`CHE-${match[1]}.${match[2]}.${match[3]}`);
  if (!idiCheck.valid) {
    return { valid: false, normalized: clean, error: 'Numero IVA CHE non supera la verifica IDI.' };
  }
  const suffix = match[4] || 'IVA';
  return {
    valid: true,
    normalized: `CHE-${match[1]}.${match[2]}.${match[3]} ${suffix}`,
  };
}

export interface CommissionCalculationInput {
  saleType: SaleType;
  grossAmount: number;
  vatAmount: number;
  discountsAmount?: number;
  thirdPartyCosts?: number;
  commissionRate: number;
  contractConcluded: boolean;
  serviceDelivered: boolean;
  collectedAt: string | null | undefined;
  recurringMonthNumber?: number | null;
  extendedByAdmin?: boolean;
}

export interface CommissionCalculationResult {
  netAmount: number;
  commission: number;
  eligible: boolean;
  reason: string | null;
}

export function calculateCommissionBreakdown(
  input: CommissionCalculationInput
): CommissionCalculationResult {
  const gross = round2(Math.max(0, Number(input.grossAmount || 0)));
  const vat = round2(Math.max(0, Number(input.vatAmount || 0)));
  const discounts = round2(Math.max(0, Number(input.discountsAmount || 0)));
  const thirdParty = round2(Math.max(0, Number(input.thirdPartyCosts || 0)));
  const netAmount = round2(Math.max(0, gross - vat - discounts - thirdParty));
  const rate = Math.min(1, Math.max(0, Number(input.commissionRate ?? DEFAULT_COMMISSION_RATE)));

  if (!input.contractConcluded) {
    return {
      netAmount,
      commission: 0,
      eligible: false,
      reason: 'Contratto non ancora concluso (art. 418g CO).',
    };
  }
  if (!input.serviceDelivered) {
    return {
      netAmount,
      commission: 0,
      eligible: false,
      reason: 'Servizio non ancora avviato o erogato.',
    };
  }
  if (!input.collectedAt) {
    return {
      netAmount,
      commission: 0,
      eligible: false,
      reason: 'Incasso effettivo non ancora registrato (maturazione solo su incassato).',
    };
  }

  if (input.saleType === 'recurring') {
    const monthNum = Number(input.recurringMonthNumber ?? 1);
    if (monthNum > RECURRING_MAX_MONTHS && !input.extendedByAdmin) {
      return {
        netAmount,
        commission: 0,
        eligible: false,
        reason: `Mese ricorrente #${monthNum} > 12 mesi da attivazione (non provvigionale senza estensione admin).`,
      };
    }
  }

  const commission = round2(netAmount * rate);
  return {
    netAmount,
    commission,
    eligible: true,
    reason: null,
  };
}

export function generateAffiliateCode(name: string): string {
  const clean = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, 6);
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `KL-${clean || 'AGENT'}-${suffix}`;
}

export function addDaysIsoDate(dateStr: string, days: number): string {
  const base = new Date(`${dateStr.slice(0, 10)}T00:00:00Z`);
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
}

export function getPreviousMonthPeriod(referenceDate = new Date()): string {
  const year = referenceDate.getUTCFullYear();
  const month = referenceDate.getUTCMonth(); // 0-indexed current month -> previous month is month (1-based)
  if (month === 0) {
    return `${year - 1}-12`;
  }
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function getDaysRemaining(expiresAt: string): number {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
