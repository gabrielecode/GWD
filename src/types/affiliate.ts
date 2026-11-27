export type AffiliateStatus = 'active' | 'disabled' | 'pending_approval';
export type LeadStatus = 'registered' | 'in_progress' | 'won' | 'lost' | 'expired';
export type CustomerStatus = 'active' | 'paused' | 'churned';
export type SaleType = 'one_off' | 'recurring';
export type PayoutStatus =
  | 'draft'
  | 'statement_sent'
  | 'invoice_received'
  | 'paid'
  | 'cancelled';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Affiliate {
  id: string;
  name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  code: string;
  commission_rate: number;
  status: AffiliateStatus;
  auth_user_id: string | null;
  iban: string | null;
  avs_idi_number: string | null;
  is_vat_registered: boolean;
  vat_number: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  canton: string | null;
  terms_accepted_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AffiliateApplication {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  canton_or_country: string;
  website_or_linkedin: string | null;
  experience_and_network: string;
  status: ApplicationStatus;
  terms_accepted_at: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliateLead {
  id: string;
  affiliate_id: string;
  client_name: string;
  client_company: string | null;
  client_email: string | null;
  client_phone: string | null;
  service_interest: string | null;
  estimated_deal_size: number | null;
  status: LeadStatus;
  registered_at: string;
  expires_at: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReferralCustomer {
  id: string;
  affiliate_id: string;
  client_name: string;
  client_company: string | null;
  client_email: string | null;
  first_contract_at: string;
  is_recurring: boolean;
  recurring_months_paid: number;
  recurring_extended_by_admin: boolean;
  status: CustomerStatus;
  created_at: string;
  updated_at: string;
}

export interface ReferralSale {
  id: string;
  affiliate_id: string;
  customer_id: string | null;
  invoice_number: string;
  contract_title: string;
  sale_type: SaleType;
  gross_amount: number;
  vat_amount: number;
  discounts_amount: number;
  third_party_costs: number;
  net_amount: number;
  commission_rate: number;
  commission: number;
  currency: 'CHF';
  is_renewal: boolean;
  recurring_month_number: number | null;
  extended_by_admin: boolean;
  contract_concluded: boolean;
  service_delivered: boolean;
  collected_at: string | null;
  payout_id: string | null;
  paid: boolean;
  paid_at: string | null;
  is_reversed: boolean;
  reversed_reason: string | null;
  reversed_at: string | null;
  reversal_compensated_payout_id: string | null;
  package_group_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AffiliatePayout {
  id: string;
  affiliate_id: string;
  period_month: string;
  total_commissions: number;
  deductions: number;
  net_payable: number;
  vat_amount: number;
  gross_invoice_amount: number;
  currency: 'CHF';
  status: PayoutStatus;
  agent_invoice_number: string | null;
  agent_invoice_date: string | null;
  payment_due_date: string | null;
  payment_method: string | null;
  payment_reference: string | null;
  statement_sent_at: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PayoutPreviewItem {
  affiliate: Affiliate;
  period_month: string;
  eligible_sales: ReferralSale[];
  uncompensated_reversals: ReferralSale[];
  total_commissions: number;
  deductions: number;
  net_payable: number;
  meets_threshold: boolean;
  rollover_reason: string | null;
  vat_amount: number;
  gross_invoice_amount: number;
  already_generated_payout_id: string | null;
}

export interface AdminUserItem {
  id: string;
  email: string;
  source: 'supabase_auth' | 'database' | 'env';
  created_at: string | null;
  is_removable: boolean;
}

export interface DbPermissionDiagnostic {
  message: string;
  key_role: string;
  is_anon_key: boolean;
  sql_fix: string;
}

export interface AdminOverviewData {
  storage_mode: 'supabase' | 'sqlite';
  kpis: {
    active_affiliates: number;
    pending_applications: number;
    active_leads_90d: number;
    total_net_collected_chf: number;
    accrued_unpaid_commissions_chf: number;
    paid_commissions_chf: number;
    pending_reversal_credits_chf: number;
  };
  affiliates: Affiliate[];
  applications: AffiliateApplication[];
  leads: AffiliateLead[];
  customers: ReferralCustomer[];
  sales: ReferralSale[];
  payouts: AffiliatePayout[];
  admins?: AdminUserItem[];
  db_permission_error?: DbPermissionDiagnostic | null;
}

export interface AffiliatePortalData {
  storage_mode: 'supabase' | 'sqlite';
  affiliate: Affiliate;
  kpis: {
    accrued_unpaid_chf: number;
    total_paid_chf: number;
    pending_reversal_debt_chf: number;
    active_leads_count: number;
    active_customers_count: number;
    below_threshold_rollover: boolean;
  };
  leads: AffiliateLead[];
  customers: ReferralCustomer[];
  sales: ReferralSale[];
  payouts: AffiliatePayout[];
}
