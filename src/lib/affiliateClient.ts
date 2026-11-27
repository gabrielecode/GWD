import {
  AdminOverviewData,
  AdminUserItem,
  Affiliate,
  AffiliateApplication,
  AffiliateLead,
  AffiliatePayout,
  AffiliatePortalData,
  LeadStatus,
  PayoutPreviewItem,
  PayoutStatus,
  ReferralCustomer,
  ReferralSale,
} from '../types/affiliate';
import { getSupabaseBrowserClient } from './supabaseClient';

export interface AuthConfigStatus {
  storage_mode: 'supabase' | 'sqlite';
  supabase_configured: boolean;
  needs_admin_setup: boolean;
  has_master_passcode?: boolean;
  config_error?: string;
}

export interface SessionInfo {
  role: 'admin' | 'affiliate';
  email: string;
  affiliateId: string | null;
}

// Keep Bearer tokens strictly in JS memory (never localStorage/sessionStorage)
let memoryToken: string | null = null;

export function getMemoryToken(): string | null {
  return memoryToken;
}

export function setMemoryToken(token: string | null): void {
  memoryToken = token;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (memoryToken) {
    headers.set('Authorization', `Bearer ${memoryToken}`);
  }

  const res = await fetch(`/api/affiliate${path}`, {
    ...options,
    headers,
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      payload && typeof payload.error === 'string'
        ? payload.error
        : `Errore HTTP ${res.status}`;
    throw new Error(message);
  }
  return payload as T;
}

export const affiliateApi = {
  getAuthStatus(): Promise<AuthConfigStatus> {
    return apiFetch<AuthConfigStatus>('/auth/status');
  },

  async setupAdmin(password: string): Promise<{ token: string; email: string }> {
    const res = await apiFetch<{ token: string; email: string }>('/auth/setup-admin', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    setMemoryToken(res.token);
    return res;
  },

  async createAdminAccount(body: {
    email: string;
    password: string;
    master_passcode?: string;
  }): Promise<{ email: string; token?: string }> {
    const res = await apiFetch<{ email: string; token?: string }>('/auth/create-admin', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (res.token) {
      setMemoryToken(res.token);
      return res;
    }
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: body.email.trim(),
        password: body.password.trim(),
      });
      if (!error && data.session?.access_token) {
        setMemoryToken(data.session.access_token);
        return { email: data.user.email || res.email, token: data.session.access_token };
      }
    }
    return res;
  },

  async loginAdmin(passcode: string, email?: string): Promise<{ token: string; email: string }> {
    const supabase = getSupabaseBrowserClient();
    if (supabase && email) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: passcode,
      });
      if (error || !data.session?.access_token) {
        throw new Error(error?.message || 'Accesso Supabase Admin non riuscito.');
      }
      setMemoryToken(data.session.access_token);
      return { token: data.session.access_token, email: data.user.email || email };
    }

    const res = await apiFetch<{ token: string; email: string }>('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ passcode, email }),
    });
    setMemoryToken(res.token);
    return res;
  },

  async registerAffiliate(body: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    company_name?: string;
    canton: string;
    accept_terms: boolean;
  }): Promise<{ affiliate: Affiliate; pending_approval: boolean }> {
    return apiFetch<{ affiliate: Affiliate; pending_approval: boolean }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async loginAffiliate(email: string, password: string): Promise<{ token: string; affiliate?: Affiliate }> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error || !data.session?.access_token) {
        throw new Error(error?.message || 'Credenziali Supabase non valide.');
      }
      setMemoryToken(data.session.access_token);
      return { token: data.session.access_token };
    }

    const res = await apiFetch<{ token: string; affiliate: Affiliate }>('/auth/affiliate-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setMemoryToken(res.token);
    return res;
  },

  async logout(): Promise<void> {
    setMemoryToken(null);
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut().catch(() => undefined);
    }
  },

  getSessionMe(): Promise<SessionInfo> {
    return apiFetch<SessionInfo>('/auth/me');
  },

  submitApplication(body: {
    name: string;
    email: string;
    phone?: string;
    company_name?: string;
    canton_or_country: string;
    website_or_linkedin?: string;
    experience_and_network: string;
    accept_terms: boolean;
  }): Promise<{ application: AffiliateApplication }> {
    return apiFetch<{ application: AffiliateApplication }>('/applications', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // Admin endpoints
  getAdminOverview(): Promise<AdminOverviewData> {
    return apiFetch<AdminOverviewData>('/admin/overview');
  },

  listAdmins(): Promise<{ admins: AdminUserItem[] }> {
    return apiFetch<{ admins: AdminUserItem[] }>('/admin/admins');
  },

  addAdminByAdmin(body: {
    email: string;
    password: string;
  }): Promise<{ admin: { email: string }; admins: AdminUserItem[] }> {
    return apiFetch<{ admin: { email: string }; admins: AdminUserItem[] }>('/admin/admins', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  removeAdminByAdmin(idOrEmail: string): Promise<{ removed: string; admins: AdminUserItem[] }> {
    return apiFetch<{ removed: string; admins: AdminUserItem[] }>(
      `/admin/admins/${encodeURIComponent(idOrEmail)}`,
      {
        method: 'DELETE',
      }
    );
  },

  createAffiliate(body: Record<string, unknown>): Promise<{ affiliate: Affiliate }> {
    return apiFetch<{ affiliate: Affiliate }>('/admin/affiliates', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  updateAffiliate(id: string, body: Record<string, unknown>): Promise<{ affiliate: Affiliate }> {
    return apiFetch<{ affiliate: Affiliate }>(`/admin/affiliates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  reviewApplication(
    id: string,
    body: {
      action: 'approve' | 'reject';
      commission_rate?: number;
      code?: string;
      password?: string;
      notes?: string;
    }
  ): Promise<{ application: AffiliateApplication; affiliate: Affiliate | null }> {
    return apiFetch(`/admin/applications/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  createAdminLead(body: Record<string, unknown>): Promise<{ lead: AffiliateLead }> {
    return apiFetch<{ lead: AffiliateLead }>('/admin/leads', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  updateLeadStatus(id: string, status: LeadStatus, notes?: string | null): Promise<{ lead: AffiliateLead }> {
    return apiFetch<{ lead: AffiliateLead }>(`/admin/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  createCustomer(body: Record<string, unknown>): Promise<{ customer: ReferralCustomer }> {
    return apiFetch<{ customer: ReferralCustomer }>('/admin/customers', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  createSales(body: Record<string, unknown>): Promise<{ sales: ReferralSale[] }> {
    return apiFetch<{ sales: ReferralSale[] }>('/admin/sales', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  reverseSale(id: string, reversed_reason: string): Promise<{ sale: ReferralSale }> {
    return apiFetch<{ sale: ReferralSale }>(`/admin/sales/${id}/reverse`, {
      method: 'POST',
      body: JSON.stringify({ reversed_reason }),
    });
  },

  previewPayouts(periodMonth: string): Promise<{ previews: PayoutPreviewItem[] }> {
    return apiFetch<{ previews: PayoutPreviewItem[] }>(
      `/admin/payouts/preview?period=${encodeURIComponent(periodMonth)}`
    );
  },

  generatePayouts(periodMonth: string): Promise<{
    created: AffiliatePayout[];
    skipped_rollover: PayoutPreviewItem[];
  }> {
    return apiFetch('/admin/payouts/generate', {
      method: 'POST',
      body: JSON.stringify({ period_month: periodMonth }),
    });
  },

  updatePayoutStatus(
    id: string,
    body: {
      status: PayoutStatus;
      agent_invoice_number?: string;
      agent_invoice_date?: string;
      payment_method?: string;
      payment_reference?: string;
      notes?: string;
    }
  ): Promise<{ payout: AffiliatePayout }> {
    return apiFetch<{ payout: AffiliatePayout }>(`/admin/payouts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  // Affiliate self-service endpoints
  getPortalData(): Promise<AffiliatePortalData> {
    return apiFetch<AffiliatePortalData>('/portal/me');
  },

  updatePortalProfile(body: Record<string, unknown>): Promise<{ affiliate: Affiliate }> {
    return apiFetch<{ affiliate: Affiliate }>('/portal/profile', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  registerPortalLead(body: Record<string, unknown>): Promise<{ lead: AffiliateLead }> {
    return apiFetch<{ lead: AffiliateLead }>('/portal/leads', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  submitPortalInvoice(
    payoutId: string,
    body: { agent_invoice_number: string; agent_invoice_date: string }
  ): Promise<{ payout: AffiliatePayout }> {
    return apiFetch<{ payout: AffiliatePayout }>(`/portal/payouts/${payoutId}/invoice`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
