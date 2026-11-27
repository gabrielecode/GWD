import crypto from 'node:crypto';
import process from 'node:process';
import {
  AdminOverviewData,
  AdminUserItem,
  Affiliate,
  AffiliateApplication,
  AffiliateLead,
  AffiliatePayout,
  AffiliatePortalData,
  AffiliateStatus,
  ApplicationStatus,
  CustomerStatus,
  DbPermissionDiagnostic,
  LeadStatus,
  PayoutPreviewItem,
  PayoutStatus,
  ReferralCustomer,
  ReferralSale,
} from '../src/types/affiliate.js';
import {
  addDaysIsoDate,
  calculateCommissionBreakdown,
  CH_STANDARD_VAT_RATE,
  DEFAULT_COMMISSION_RATE,
  generateAffiliateCode,
  LEAD_EXCLUSIVITY_DAYS,
  normalizeCompany,
  normalizeEmail,
  normalizePhone,
  PAYMENT_TERMS_DAYS,
  PAYOUT_MIN_THRESHOLD_CHF,
  round2,
  validateAvsOrIdi,
  validateEmail,
  validateIban,
  validatePhone,
  validatePostalCode,
  validateVatNumber,
} from '../src/lib/affiliateRules.js';
import {
  getConfiguredAdminEmails,
  getSqliteDb,
  getSupabaseAdmin,
  getSupabaseBaseAdminClient,
  getSupabaseConfig,
  getSupabaseUserClient,
  isConfiguredAdminEmail,
  requestAuthStorage,
} from './db.js';
import { hashPassword, signSessionToken, timingSafeEqualsText, verifyPassword } from './auth.js';
import { sendAdminEmailNotification } from './emailService.js';

export class ServiceError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function mapSqliteAffiliate(row: Record<string, unknown>): Affiliate {
  return {
    id: String(row.id),
    name: String(row.name),
    company_name: row.company_name ? String(row.company_name) : null,
    email: String(row.email),
    phone: row.phone ? String(row.phone) : null,
    code: String(row.code),
    commission_rate: Number(row.commission_rate ?? 0.2),
    status: row.status as AffiliateStatus,
    auth_user_id: row.auth_user_id ? String(row.auth_user_id) : null,
    iban: row.iban ? String(row.iban) : null,
    avs_idi_number: row.avs_idi_number ? String(row.avs_idi_number) : null,
    is_vat_registered: Boolean(Number(row.is_vat_registered ?? 0)),
    vat_number: row.vat_number ? String(row.vat_number) : null,
    address: row.address ? String(row.address) : null,
    city: row.city ? String(row.city) : null,
    postal_code: row.postal_code ? String(row.postal_code) : null,
    canton: row.canton ? String(row.canton) : null,
    terms_accepted_at: row.terms_accepted_at ? String(row.terms_accepted_at) : null,
    notes: row.notes ? String(row.notes) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapSqliteCustomer(row: Record<string, unknown>): ReferralCustomer {
  return {
    id: String(row.id),
    affiliate_id: String(row.affiliate_id),
    client_name: String(row.client_name),
    client_company: row.client_company ? String(row.client_company) : null,
    client_email: row.client_email ? String(row.client_email) : null,
    first_contract_at: String(row.first_contract_at),
    is_recurring: Boolean(Number(row.is_recurring ?? 0)),
    recurring_months_paid: Number(row.recurring_months_paid ?? 0),
    recurring_extended_by_admin: Boolean(Number(row.recurring_extended_by_admin ?? 0)),
    status: row.status as CustomerStatus,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapSqliteSale(row: Record<string, unknown>): ReferralSale {
  return {
    id: String(row.id),
    affiliate_id: String(row.affiliate_id),
    customer_id: row.customer_id ? String(row.customer_id) : null,
    invoice_number: String(row.invoice_number),
    contract_title: String(row.contract_title),
    sale_type: row.sale_type as 'one_off' | 'recurring',
    gross_amount: Number(row.gross_amount ?? 0),
    vat_amount: Number(row.vat_amount ?? 0),
    discounts_amount: Number(row.discounts_amount ?? 0),
    third_party_costs: Number(row.third_party_costs ?? 0),
    net_amount: Number(row.net_amount ?? 0),
    commission_rate: Number(row.commission_rate ?? 0.2),
    commission: Number(row.commission ?? 0),
    currency: 'CHF',
    is_renewal: Boolean(Number(row.is_renewal ?? 0)),
    recurring_month_number:
      row.recurring_month_number !== null && row.recurring_month_number !== undefined
        ? Number(row.recurring_month_number)
        : null,
    extended_by_admin: Boolean(Number(row.extended_by_admin ?? 0)),
    contract_concluded: Boolean(Number(row.contract_concluded ?? 1)),
    service_delivered: Boolean(Number(row.service_delivered ?? 1)),
    collected_at: row.collected_at ? String(row.collected_at) : null,
    payout_id: row.payout_id ? String(row.payout_id) : null,
    paid: Boolean(Number(row.paid ?? 0)),
    paid_at: row.paid_at ? String(row.paid_at) : null,
    is_reversed: Boolean(Number(row.is_reversed ?? 0)),
    reversed_reason: row.reversed_reason ? String(row.reversed_reason) : null,
    reversed_at: row.reversed_at ? String(row.reversed_at) : null,
    reversal_compensated_payout_id: row.reversal_compensated_payout_id
      ? String(row.reversal_compensated_payout_id)
      : null,
    package_group_id: row.package_group_id ? String(row.package_group_id) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapSupabaseNumbers<T extends Record<string, unknown>>(row: T): T {
  const numericFields = [
    'commission_rate',
    'estimated_deal_size',
    'gross_amount',
    'vat_amount',
    'discounts_amount',
    'third_party_costs',
    'net_amount',
    'commission',
    'total_commissions',
    'deductions',
    'net_payable',
    'gross_invoice_amount',
    'recurring_month_number',
    'recurring_months_paid',
  ];
  const copy: Record<string, unknown> = { ...row };
  for (const field of numericFields) {
    if (copy[field] !== null && copy[field] !== undefined) {
      copy[field] = Number(copy[field]);
    }
  }
  return copy as T;
}

// ---------- SUPABASE SQL PERMISSION DIAGNOSTIC & MULTI-ADMIN ----------

export function buildSupabasePermissionFixSql(extraEmails: string[] = []): string {
  const emailSet = new Set<string>([
    'contatto@kreativalab.ch',
    'admin@kreativalab.ch',
    ...getConfiguredAdminEmails(),
    ...extraEmails.map((e) => e.trim().toLowerCase()).filter((e) => e.includes('@')),
  ]);
  const reqEmail = requestAuthStorage.getStore()?.email?.trim().toLowerCase();
  if (reqEmail && reqEmail.includes('@')) {
    emailSet.add(reqEmail);
  }
  const sqlEmails = Array.from(emailSet)
    .map((e) => `'${e.replace(/'/g, "''")}'`)
    .join(', ');

  return `-- Kreativalab: Riparazione Permessi Tabella Affiliates & Multi-Admin (Esegui in Supabase -> SQL Editor -> Run)

-- 1. Tabella admin_users per gestione Multi-Admin
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_by text,
  created_at timestamptz not null default now()
);

-- 2. Normalizza eventuali utenti in auth.users e assegna claim app_metadata.role = 'admin'
update auth.users
set
  raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb,
  role = 'authenticated'
where role = 'admin'
   or lower(email) in (${sqlEmails})
   or (raw_user_meta_data ->> 'role') = 'admin'
   or (raw_app_meta_data ->> 'role') = 'admin';

-- 3. Concedi tutti i permessi (GRANT) su schema, tabelle, sequenze e funzioni (risolve "permission denied for table affiliates")
grant usage on schema public to postgres, anon, authenticated, service_role;

grant all privileges on table public.admin_users to postgres, authenticated, service_role;
grant all privileges on table public.affiliates to postgres, anon, authenticated, service_role;
grant all privileges on table public.affiliate_applications to postgres, anon, authenticated, service_role;
grant all privileges on table public.affiliate_leads to postgres, anon, authenticated, service_role;
grant all privileges on table public.referral_customers to postgres, anon, authenticated, service_role;
grant all privileges on table public.affiliate_payouts to postgres, anon, authenticated, service_role;
grant all privileges on table public.referral_sales to postgres, anon, authenticated, service_role;

grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;
grant execute on all functions in schema public to postgres, anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant execute on functions to postgres, anon, authenticated, service_role;

-- 4. Aggiorna funzione RLS public.is_admin() per supportare Multi-Admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select (
    coalesce(
      nullif(auth.jwt() -> 'app_metadata' ->> 'role', ''),
      nullif(auth.jwt() -> 'user_metadata' ->> 'role', ''),
      ''
    ) = 'admin'
    or lower(coalesce(auth.jwt() ->> 'email', '')) in (${sqlEmails})
    or exists (
      select 1 from public.admin_users au
      where lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );
$$;`;
}

// ---------- AUTH & BOOTSTRAP ----------

export async function getAuthConfigStatus(): Promise<{
  storage_mode: 'supabase' | 'sqlite';
  supabase_configured: boolean;
  needs_admin_setup: boolean;
  has_master_passcode: boolean;
  config_error?: string;
}> {
  const hasMasterPasscode = Boolean(process.env.ADMIN_PASSCODE?.trim());
  const supaCfg = getSupabaseConfig();
  if (supaCfg.enabled) {
    let hasAnyAdmin = getConfiguredAdminEmails().length > 0;
    let supaError: string | null = null;
    try {
      const supabase = getSupabaseBaseAdminClient();
      if (supabase && supaCfg.isServiceRole) {
        const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
        if (error) {
          supaError = error.message;
        } else {
          const users = data?.users ?? [];
          if (
            users.some((u) => {
              const appRole =
                (u.app_metadata?.role as string | undefined) ||
                (u.user_metadata?.role as string | undefined);
              return appRole === 'admin' || isConfiguredAdminEmail(u.email);
            })
          ) {
            hasAnyAdmin = true;
          }
        }
      } else if (supabase && !supaCfg.isServiceRole) {
        // Anon key configured in SUPABASE_SERVICE_ROLE_KEY: keep Supabase Auth enabled on frontend
        hasAnyAdmin = true;
      }
    } catch (err) {
      supaError = err instanceof Error ? err.message : 'Errore Supabase';
    }

    if (supaError && /not allowed|not_admin/i.test(supaError)) {
      // SUPABASE_SERVICE_ROLE_KEY is an anon key, so auth.admin.listUsers is not allowed,
      // but Supabase Auth login still works with VITE_SUPABASE_ANON_KEY.
      return {
        storage_mode: 'supabase',
        supabase_configured: true,
        needs_admin_setup: false,
        has_master_passcode: hasMasterPasscode,
      };
    }

    if (supaError && /bearer|token|apikey|unauthorized|invalid/i.test(supaError)) {
      try {
        const db = getSqliteDb();
        const row = db
          .prepare('SELECT value FROM app_settings WHERE key = ?')
          .get('admin_password_hash') as { value?: string } | undefined;
        const adminCountRow = db
          .prepare('SELECT COUNT(*) as cnt FROM admin_users')
          .get() as { cnt?: number } | undefined;
        const hasLocalAdmin = Boolean(row?.value) || Number(adminCountRow?.cnt ?? 0) > 0;
        return {
          storage_mode: 'sqlite',
          supabase_configured: false,
          needs_admin_setup: !hasMasterPasscode && !hasLocalAdmin,
          has_master_passcode: hasMasterPasscode,
          config_error:
            'Attenzione: la chiave SUPABASE_SERVICE_ROLE_KEY su Vercel non è valida. Il sistema sta operando in modalità SQLite locale.',
        };
      } catch {
        return {
          storage_mode: 'supabase',
          supabase_configured: true,
          needs_admin_setup: false,
          has_master_passcode: hasMasterPasscode,
          config_error: `Errore Supabase Auth (${supaError}): controlla che SUPABASE_SERVICE_ROLE_KEY sia la service_role secret key corretta.`,
        };
      }
    }

    return {
      storage_mode: 'supabase',
      supabase_configured: true,
      needs_admin_setup: !hasAnyAdmin,
      has_master_passcode: hasMasterPasscode,
    };
  }
  try {
    const db = getSqliteDb();
    const row = db
      .prepare('SELECT value FROM app_settings WHERE key = ?')
      .get('admin_password_hash') as { value?: string } | undefined;
    const adminCountRow = db
      .prepare('SELECT COUNT(*) as cnt FROM admin_users')
      .get() as { cnt?: number } | undefined;
    const hasLocalAdmin = Boolean(row?.value) || Number(adminCountRow?.cnt ?? 0) > 0;
    return {
      storage_mode: 'sqlite',
      supabase_configured: false,
      needs_admin_setup: !hasMasterPasscode && !hasLocalAdmin,
      has_master_passcode: hasMasterPasscode,
    };
  } catch {
    return {
      storage_mode: 'supabase',
      supabase_configured: false,
      needs_admin_setup: false,
      has_master_passcode: hasMasterPasscode,
      config_error:
        'Database non configurato su Vercel: aggiungi SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nelle Environment Variables di Vercel e riesegui il deploy.',
    };
  }
}

export function setupInitialAdminPassword(password: string): { token: string; email: string } {
  if (!process.env.ADMIN_PASSCODE?.trim()) {
    throw new ServiceError(
      403,
      'Configura ADMIN_PASSCODE nelle variabili ambiente per creare il primo admin.'
    );
  }
  if (getSupabaseConfig().enabled) {
    throw new ServiceError(400, 'Con Supabase attivo, crea l’utente Admin dal tab "Crea Utente Admin".');
  }
  if (process.env.ADMIN_PASSCODE?.trim()) {
    throw new ServiceError(409, 'Passcode Admin già configurato tramite variabili ambiente.');
  }
  const clean = password.trim();
  if (clean.length < 8) {
    throw new ServiceError(400, 'La password Admin deve contenere almeno 8 caratteri.');
  }
  const db = getSqliteDb();
  const existing = db
    .prepare('SELECT value FROM app_settings WHERE key = ?')
    .get('admin_password_hash') as { value?: string } | undefined;
  if (existing?.value) {
    throw new ServiceError(409, 'Account Admin già inizializzato. Effettua il login.');
  }
  const hash = hashPassword(clean);
  db.prepare('INSERT INTO app_settings (key, value, updated_at) VALUES (?, ?, ?)').run(
    'admin_password_hash',
    hash,
    nowIso()
  );
  const envEmails = getConfiguredAdminEmails();
  const email = envEmails[0] || 'admin@kreativalab.ch';
  return {
    token: signSessionToken({ role: 'admin', email }),
    email,
  };
}

export async function listAdminAccounts(currentAdminEmail?: string): Promise<AdminUserItem[]> {
  const byEmail = new Map<string, AdminUserItem>();
  const envEmails = getConfiguredAdminEmails();

  for (const email of envEmails) {
    byEmail.set(email, {
      id: `env:${email}`,
      email,
      source: 'env',
      created_at: null,
      is_removable: false,
    });
  }

  const supaCfg = getSupabaseConfig();
  if (supaCfg.enabled) {
    const baseClient = getSupabaseBaseAdminClient();
    if (baseClient && supaCfg.isServiceRole) {
      try {
        const { data } = await baseClient.auth.admin.listUsers({ page: 1, perPage: 200 });
        for (const u of data?.users ?? []) {
          const email = (u.email || '').trim().toLowerCase();
          if (!email) continue;
          const appRole =
            (u.app_metadata?.role as string | undefined) ||
            (u.user_metadata?.role as string | undefined);
          if (appRole === 'admin' || isConfiguredAdminEmail(email)) {
            const isEnv = envEmails.includes(email);
            byEmail.set(email, {
              id: u.id,
              email,
              source: isEnv ? 'env' : 'supabase_auth',
              created_at: u.created_at || null,
              is_removable: !isEnv,
            });
          }
        }
      } catch {
        // ignore listUsers error if service_role is restricted
      }
    }

    const activeClient = getSupabaseAdmin();
    if (activeClient) {
      try {
        const { data: tableAdmins } = await activeClient
          .from('admin_users')
          .select('*')
          .order('created_at', { ascending: false });
        for (const row of (tableAdmins ?? []) as Array<Record<string, unknown>>) {
          const email = String(row.email || '').trim().toLowerCase();
          if (!email || byEmail.has(email)) continue;
          const isEnv = envEmails.includes(email);
          byEmail.set(email, {
            id: String(row.id || email),
            email,
            source: isEnv ? 'env' : 'database',
            created_at: row.created_at ? String(row.created_at) : null,
            is_removable: !isEnv,
          });
        }
      } catch {
        // admin_users table might not exist yet in Supabase before running migration
      }
    }
  }

  try {
    const db = getSqliteDb();
    const rows = db
      .prepare('SELECT id, email, created_at FROM admin_users ORDER BY created_at DESC')
      .all() as Array<{ id?: string; email?: string; created_at?: string }>;
    for (const r of rows) {
      const email = (r.email || '').trim().toLowerCase();
      if (!email || byEmail.has(email)) continue;
      const isEnv = envEmails.includes(email);
      byEmail.set(email, {
        id: String(r.id || email),
        email,
        source: isEnv ? 'env' : 'database',
        created_at: r.created_at || null,
        is_removable: !isEnv,
      });
    }
  } catch {
    // SQLite may not be available on serverless runtime
  }

  const activeEmail = (currentAdminEmail || requestAuthStorage.getStore()?.email || '')
    .trim()
    .toLowerCase();
  if (activeEmail && !byEmail.has(activeEmail)) {
    byEmail.set(activeEmail, {
      id: `active:${activeEmail}`,
      email: activeEmail,
      source: supaCfg.enabled ? 'supabase_auth' : 'database',
      created_at: null,
      is_removable: false,
    });
  }

  return Array.from(byEmail.values()).map((item) => ({
    ...item,
    is_removable: item.is_removable && item.email.toLowerCase() !== activeEmail,
  }));
}

export async function removeAdminAccount(
  idOrEmail: string,
  currentAdminEmail?: string
): Promise<{ removed: string }> {
  const target = (idOrEmail || '').trim();
  if (!target) {
    throw new ServiceError(400, 'Specifica l’amministratore da rimuovere.');
  }
  const activeEmail = (currentAdminEmail || requestAuthStorage.getStore()?.email || '')
    .trim()
    .toLowerCase();

  const allAdmins = await listAdminAccounts(activeEmail);
  const found = allAdmins.find(
    (a) => a.id === target || a.email.toLowerCase() === target.toLowerCase()
  );
  const targetEmail = (found?.email || target).trim().toLowerCase();

  if (activeEmail && targetEmail === activeEmail) {
    throw new ServiceError(400, 'Non puoi rimuovere il tuo stesso account Admin attualmente connesso.');
  }
  if (isConfiguredAdminEmail(targetEmail)) {
    throw new ServiceError(
      400,
      `L'account ${targetEmail} è configurato nella variabile d'ambiente ADMIN_EMAIL su Vercel e non può essere rimosso da qui.`
    );
  }
  if (allAdmins.length <= 1) {
    throw new ServiceError(400, 'Impossibile rimuovere l’unico amministratore rimasto nel sistema.');
  }

  const supaCfg = getSupabaseConfig();
  if (supaCfg.enabled) {
    const activeClient = getSupabaseAdmin();
    if (activeClient) {
      try {
        await activeClient.from('admin_users').delete().ilike('email', targetEmail);
      } catch {
        // ignore if admin_users table doesn't exist
      }
    }
    const baseClient = getSupabaseBaseAdminClient();
    if (baseClient && supaCfg.isServiceRole) {
      try {
        const { data } = await baseClient.auth.admin.listUsers({ page: 1, perPage: 200 });
        const matched = (data?.users ?? []).find(
          (u) => (u.email || '').trim().toLowerCase() === targetEmail || u.id === target
        );
        if (matched) {
          await baseClient.auth.admin.updateUserById(matched.id, {
            app_metadata: { ...(matched.app_metadata || {}), role: 'revoked' },
            user_metadata: { ...(matched.user_metadata || {}), role: 'revoked' },
          });
        }
      } catch {
        // ignore if listUsers fails
      }
    }
  }

  try {
    const db = getSqliteDb();
    db.prepare('DELETE FROM admin_users WHERE id = ? OR lower(email) = ?').run(target, targetEmail);
  } catch {
    // ignore if SQLite unavailable
  }

  return { removed: targetEmail };
}

export async function createAdminAccount(input: {
  email: string;
  password: string;
  master_passcode?: string;
  requester_is_admin?: boolean;
}): Promise<{ email: string; token?: string }> {
  const email = normalizeEmail(input.email);
  if (!email || !validateEmail(email)) {
    throw new ServiceError(400, 'Inserisci un indirizzo email Admin valido.');
  }
  const password = (input.password || '').trim();
  if (password.length < 8) {
    throw new ServiceError(400, 'La password Admin deve contenere almeno 8 caratteri.');
  }

  const status = await getAuthConfigStatus();
  if (status.config_error && status.storage_mode === 'supabase' && status.supabase_configured) {
    throw new ServiceError(503, status.config_error);
  }

  const envPass = process.env.ADMIN_PASSCODE?.trim();
  const providedPasscode = (input.master_passcode || '').trim();

  let authorized = Boolean(input.requester_is_admin);
  if (!authorized) {
    if (!envPass) {
      throw new ServiceError(
        403,
        'Configura ADMIN_PASSCODE nelle variabili ambiente per creare il primo admin.'
      );
    }
    if (providedPasscode && timingSafeEqualsText(providedPasscode, envPass)) {
      authorized = true;
    }
  }

  if (!authorized) {
    throw new ServiceError(
      403,
      'Autorizzazione negata: inserisci il Passcode Master (ADMIN_PASSCODE) corretto.'
    );
  }

  // Save in local SQLite admin_users as well if available (supports multi-admin & hybrid fallback)
  try {
    const db = getSqliteDb();
    const existingSqlite = db
      .prepare('SELECT id FROM admin_users WHERE lower(email) = ?')
      .get(email) as { id?: string } | undefined;
    const hash = hashPassword(password);
    if (existingSqlite?.id) {
      db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(hash, existingSqlite.id);
    } else {
      db.prepare('INSERT INTO admin_users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)').run(
        crypto.randomUUID(),
        email,
        hash,
        nowIso()
      );
    }
  } catch {
    // ignore if SQLite is not available on Vercel
  }

  const supaCfg = getSupabaseConfig();
  if (status.storage_mode === 'supabase' && supaCfg.enabled) {
    const baseClient = getSupabaseBaseAdminClient();
    const activeClient = getSupabaseAdmin();

    // Record in public.admin_users table if present
    if (activeClient) {
      try {
        await activeClient.from('admin_users').upsert(
          {
            email,
            created_by: requestAuthStorage.getStore()?.email || 'admin',
          },
          { onConflict: 'email' }
        );
      } catch {
        // ignore if public.admin_users table not yet migrated
      }
    }

    if (baseClient) {
      const { data, error } = await baseClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { role: 'admin' },
        user_metadata: { role: 'admin' },
      });

      if (!error && data?.user) {
        return { email: data.user.email || email };
      }

      const msg = error?.message || 'Impossibile creare l’utente Admin su Supabase.';

      // If user already exists in Supabase Auth, promote them to role='admin' and update password!
      if (/already|registered|exists/i.test(msg)) {
        const { data: listData } = await baseClient.auth.admin.listUsers({ page: 1, perPage: 200 });
        const existingUser = (listData?.users ?? []).find(
          (u) => (u.email || '').trim().toLowerCase() === email
        );
        if (existingUser) {
          const { error: upErr } = await baseClient.auth.admin.updateUserById(existingUser.id, {
            password,
            email_confirm: true,
            app_metadata: { ...(existingUser.app_metadata || {}), role: 'admin' },
            user_metadata: { ...(existingUser.user_metadata || {}), role: 'admin' },
          });
          if (!upErr) {
            return { email };
          }
        }
        throw new ServiceError(409, 'Esiste già un utente Supabase registrato con questa email.');
      }

      // If SUPABASE_SERVICE_ROLE_KEY on Vercel is an anon key (GoTrue returns "User not allowed"),
      // fallback to standard signUp with user_metadata.role = 'admin' so multi-admin creation still succeeds!
      if (/not allowed|not_admin|bearer|token|apikey|unauthorized|invalid/i.test(msg)) {
        const { data: signUpData, error: signUpErr } = await baseClient.auth.signUp({
          email,
          password,
          options: {
            data: { role: 'admin' },
          },
        });
        if (!signUpErr && signUpData?.user) {
          return {
            email: signUpData.user.email || email,
            token: signUpData.session?.access_token,
          };
        }
        if (signUpErr && /already|registered/i.test(signUpErr.message)) {
          return { email };
        }
        throw new ServiceError(
          400,
          signUpErr?.message ||
            'Errore Supabase Auth: verifica che SUPABASE_SERVICE_ROLE_KEY su Vercel sia la chiave service_role.'
        );
      }

      throw new ServiceError(400, msg);
    }
  }

  return {
    email,
    token: signSessionToken({ role: 'admin', email }),
  };
}

export function loginAdminLocal(passcode: string, emailInput?: string): { token: string; email: string } {
  const clean = passcode.trim();
  if (!clean) {
    throw new ServiceError(400, 'Inserisci il passcode o la password Admin.');
  }
  const envPass = process.env.ADMIN_PASSCODE?.trim();
  const envEmails = getConfiguredAdminEmails();
  const defaultEmail = envEmails[0] || 'admin@kreativalab.ch';
  const normEmail = normalizeEmail(emailInput);

  if (envPass && timingSafeEqualsText(clean, envPass)) {
    const email = normEmail || defaultEmail;
    return { token: signSessionToken({ role: 'admin', email }), email };
  }

  const db = getSqliteDb();
  if (normEmail) {
    const adminRow = db
      .prepare('SELECT email, password_hash FROM admin_users WHERE lower(email) = ?')
      .get(normEmail) as { email?: string; password_hash?: string } | undefined;
    if (adminRow?.password_hash && verifyPassword(clean, adminRow.password_hash)) {
      const resolvedEmail = adminRow.email || normEmail;
      return { token: signSessionToken({ role: 'admin', email: resolvedEmail }), email: resolvedEmail };
    }
  } else {
    const admins = db
      .prepare('SELECT email, password_hash FROM admin_users')
      .all() as Array<{ email?: string; password_hash?: string }>;
    const matched = admins.find((a) => a.password_hash && verifyPassword(clean, a.password_hash));
    if (matched?.email) {
      return { token: signSessionToken({ role: 'admin', email: matched.email }), email: matched.email };
    }
  }

  const row = db
    .prepare('SELECT value FROM app_settings WHERE key = ?')
    .get('admin_password_hash') as { value?: string } | undefined;

  if (row?.value && verifyPassword(clean, row.value)) {
    return { token: signSessionToken({ role: 'admin', email: normEmail || defaultEmail }), email: normEmail || defaultEmail };
  }

  if (!envPass && !row?.value) {
    const adminCountRow = db
      .prepare('SELECT COUNT(*) as cnt FROM admin_users')
      .get() as { cnt?: number } | undefined;
    if (Number(adminCountRow?.cnt ?? 0) === 0) {
      throw new ServiceError(412, 'Primo avvio: crea prima un utente Admin.');
    }
  }

  throw new ServiceError(401, 'Credenziali Admin non valide.');
}

export async function registerAffiliateAccount(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  company_name?: string;
  canton?: string;
  accept_terms: boolean;
}): Promise<{ affiliate: Affiliate; pending_approval: boolean }> {
  const password = (input.password || '').trim();
  if (password.length < 8) {
    throw new ServiceError(400, 'La password deve contenere almeno 8 caratteri.');
  }
  if (!input.accept_terms) {
    throw new ServiceError(400, 'Devi accettare le condizioni del mandato di agenzia (CO 418a segg.).');
  }
  const canton = (input.canton || '').trim();
  if (canton.length < 2) {
    throw new ServiceError(400, 'Indica Cantone o Paese.');
  }

  const email = normalizeEmail(input.email);
  if (!email || !validateEmail(email)) {
    throw new ServiceError(400, 'Indirizzo email non valido.');
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data: existingAff } = await supabase
      .from('affiliates')
      .select('id')
      .ilike('email', email)
      .maybeSingle();
    if (existingAff) {
      throw new ServiceError(409, 'Esiste già un account agente con questa email. Prova ad accedere.');
    }
  }

  const affiliate = await createAffiliate({
    name: input.name,
    email,
    phone: input.phone || null,
    company_name: input.company_name || null,
    canton,
    status: 'pending_approval',
    password,
    notes: 'Registrazione self-service dal portale /affiliate.',
  });

  return { affiliate, pending_approval: true };
}

export async function loginAffiliateLocal(
  emailInput: string,
  passwordInput: string
): Promise<{ token: string; affiliate: Affiliate }> {
  const normEmail = normalizeEmail(emailInput);
  if (!normEmail || !validateEmail(normEmail)) {
    throw new ServiceError(400, 'Indirizzo email non valido.');
  }
  if (!passwordInput) {
    throw new ServiceError(400, 'Inserisci la password.');
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    throw new ServiceError(
      400,
      'Con Supabase Auth attivo, usa il login Supabase dal portale agenti.'
    );
  }

  const db = getSqliteDb();
  const row = db
    .prepare('SELECT * FROM affiliates WHERE lower(email) = ?')
    .get(normEmail) as Record<string, unknown> | undefined;

  if (!row) {
    throw new ServiceError(401, 'Credenziali agente non valide.');
  }
  const hash = row.password_hash ? String(row.password_hash) : '';
  if (!hash || !verifyPassword(passwordInput, hash)) {
    throw new ServiceError(401, 'Credenziali agente non valide.');
  }
  const affiliate = mapSqliteAffiliate(row);
  if (affiliate.status !== 'active') {
    throw new ServiceError(
      403,
      affiliate.status === 'pending_approval'
        ? 'Account in attesa di approvazione da Kreativalab.'
        : 'Account agente disabilitato. Contatta Kreativalab.'
    );
  }
  const token = signSessionToken({
    role: 'affiliate',
    affiliateId: affiliate.id,
    email: affiliate.email,
  });
  return { token, affiliate };
}

// ---------- SHARED DATA FETCHERS ----------

async function queryAllSupabaseTables(client: NonNullable<ReturnType<typeof getSupabaseAdmin>>) {
  return Promise.all([
    client.from('affiliates').select('*').order('created_at', { ascending: false }),
    client.from('affiliate_applications').select('*').order('created_at', { ascending: false }),
    client.from('affiliate_leads').select('*').order('registered_at', { ascending: false }),
    client.from('referral_customers').select('*').order('created_at', { ascending: false }),
    client.from('referral_sales').select('*').order('created_at', { ascending: false }),
    client.from('affiliate_payouts').select('*').order('period_month', { ascending: false }),
  ]);
}

async function fetchAllCollections(options?: {
  allowPermissionErrorFallback?: boolean;
}): Promise<{
  storage_mode: 'supabase' | 'sqlite';
  affiliates: Affiliate[];
  applications: AffiliateApplication[];
  leads: AffiliateLead[];
  customers: ReferralCustomer[];
  sales: ReferralSale[];
  payouts: AffiliatePayout[];
  db_permission_error?: DbPermissionDiagnostic | null;
}> {
  const supaCfg = getSupabaseConfig();
  const primaryClient = getSupabaseAdmin();
  if (primaryClient) {
    let results = await queryAllSupabaseTables(primaryClient);
    let firstError = results.find((r) => r.error)?.error ?? null;

    // If primary client hit a permission error (e.g. 42501), try the alternate client
    // (either user JWT client or base service_role client)
    if (firstError) {
      const alternateClient = supaCfg.isServiceRole
        ? getSupabaseUserClient()
        : getSupabaseBaseAdminClient();
      if (alternateClient && alternateClient !== primaryClient) {
        const retryResults = await queryAllSupabaseTables(alternateClient);
        const retryError = retryResults.find((r) => r.error)?.error ?? null;
        if (!retryError) {
          results = retryResults;
          firstError = null;
        }
      }
    }

    if (firstError) {
      const isPermDenied =
        firstError.code === '42501' ||
        /permission denied/i.test(firstError.message || '');

      if (isPermDenied) {
        const diagnostic: DbPermissionDiagnostic = {
          message: firstError.message,
          key_role: supaCfg.keyRole,
          is_anon_key: !supaCfg.isServiceRole,
          sql_fix: buildSupabasePermissionFixSql(),
        };

        if (options?.allowPermissionErrorFallback) {
          const [affRes, appRes, leadRes, custRes, saleRes, payRes] = results;
          return {
            storage_mode: 'supabase',
            affiliates: ((affRes.data ?? []) as Record<string, unknown>[]).map(mapSupabaseNumbers) as unknown as Affiliate[],
            applications: ((appRes.data ?? []) as Record<string, unknown>[]).map(mapSupabaseNumbers) as unknown as AffiliateApplication[],
            leads: ((leadRes.data ?? []) as Record<string, unknown>[]).map(mapSupabaseNumbers) as unknown as AffiliateLead[],
            customers: ((custRes.data ?? []) as Record<string, unknown>[]).map(mapSupabaseNumbers) as unknown as ReferralCustomer[],
            sales: ((saleRes.data ?? []) as Record<string, unknown>[]).map(mapSupabaseNumbers) as unknown as ReferralSale[],
            payouts: ((payRes.data ?? []) as Record<string, unknown>[]).map(mapSupabaseNumbers) as unknown as AffiliatePayout[],
            db_permission_error: diagnostic,
          };
        }

        throw new ServiceError(
          403,
          `Permessi database Supabase mancanti (${firstError.message}). Copia ed esegui lo script SQL di riparazione mostrato nel banner in alto nella Console Admin.`
        );
      }

      throw new ServiceError(500, firstError.message);
    }

    const [affRes, appRes, leadRes, custRes, saleRes, payRes] = results;
    return {
      storage_mode: 'supabase',
      affiliates: (affRes.data ?? []).map(mapSupabaseNumbers) as Affiliate[],
      applications: (appRes.data ?? []).map(mapSupabaseNumbers) as AffiliateApplication[],
      leads: (leadRes.data ?? []).map(mapSupabaseNumbers) as AffiliateLead[],
      customers: (custRes.data ?? []).map(mapSupabaseNumbers) as ReferralCustomer[],
      sales: (saleRes.data ?? []).map(mapSupabaseNumbers) as ReferralSale[],
      payouts: (payRes.data ?? []).map(mapSupabaseNumbers) as AffiliatePayout[],
      db_permission_error: null,
    };
  }

  const db = getSqliteDb();
  const affiliates = (db.prepare('SELECT * FROM affiliates ORDER BY created_at DESC').all() as Record<string, unknown>[]).map(mapSqliteAffiliate);
  const applications = db
    .prepare('SELECT * FROM affiliate_applications ORDER BY created_at DESC')
    .all() as unknown as AffiliateApplication[];
  const leads = db
    .prepare('SELECT * FROM affiliate_leads ORDER BY registered_at DESC')
    .all() as unknown as AffiliateLead[];
  const customers = (db.prepare('SELECT * FROM referral_customers ORDER BY created_at DESC').all() as Record<string, unknown>[]).map(mapSqliteCustomer);
  const sales = (db.prepare('SELECT * FROM referral_sales ORDER BY created_at DESC').all() as Record<string, unknown>[]).map(mapSqliteSale);
  const payouts = db
    .prepare('SELECT * FROM affiliate_payouts ORDER BY period_month DESC, created_at DESC')
    .all() as unknown as AffiliatePayout[];

  return {
    storage_mode: 'sqlite',
    affiliates,
    applications,
    leads,
    customers,
    sales,
    payouts,
    db_permission_error: null,
  };
}

async function expireStaleLeadsInternal(): Promise<void> {
  const now = nowIso();
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      await supabase
        .from('affiliate_leads')
        .update({ status: 'expired' })
        .in('status', ['registered', 'in_progress'])
        .lt('expires_at', now);
    } catch {
      // ignore if table permissions are not yet applied
    }
    return;
  }
  const db = getSqliteDb();
  db.prepare(
    `UPDATE affiliate_leads SET status = 'expired', updated_at = ?
     WHERE status IN ('registered', 'in_progress') AND expires_at < ?`
  ).run(now, now);
}

// ---------- PUBLIC APPLICATION ----------

export async function submitApplication(input: {
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  canton_or_country: string;
  website_or_linkedin?: string;
  experience_and_network: string;
  accept_terms: boolean;
}): Promise<AffiliateApplication> {
  const name = (input.name || '').trim();
  const email = (input.email || '').trim().toLowerCase();
  const phone = (input.phone || '').trim() || null;
  const company_name = (input.company_name || '').trim() || null;
  const canton_or_country = (input.canton_or_country || '').trim();
  const website_or_linkedin = (input.website_or_linkedin || '').trim() || null;
  const experience_and_network = (input.experience_and_network || '').trim();

  if (name.length < 2) throw new ServiceError(400, 'Nome e cognome obbligatori.');
  if (!validateEmail(email)) throw new ServiceError(400, 'Email non valida.');
  if (phone && !validatePhone(phone)) throw new ServiceError(400, 'Numero di telefono non valido.');
  if (canton_or_country.length < 2) throw new ServiceError(400, 'Indica Cantone o Paese.');
  if (experience_and_network.length < 15) {
    throw new ServiceError(400, 'Descrivi brevemente esperienza e network commerciale (min. 15 caratteri).');
  }
  if (!input.accept_terms) {
    throw new ServiceError(400, 'Devi accettare le condizioni del mandato di agenzia (CO 418a segg.).');
  }

  const now = nowIso();
  const record: AffiliateApplication = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
    company_name,
    canton_or_country,
    website_or_linkedin,
    experience_and_network,
    status: 'pending',
    terms_accepted_at: now,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from('affiliate_applications')
      .insert(record)
      .select()
      .single();
    if (error) throw new ServiceError(500, error.message);
    return data as AffiliateApplication;
  }

  const db = getSqliteDb();
  db.prepare(
    `INSERT INTO affiliate_applications
     (id, name, email, phone, company_name, canton_or_country, website_or_linkedin, experience_and_network, status, terms_accepted_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    record.id,
    record.name,
    record.email,
    record.phone,
    record.company_name,
    record.canton_or_country,
    record.website_or_linkedin,
    record.experience_and_network,
    record.status,
    record.terms_accepted_at,
    record.created_at,
    record.updated_at
  );

  void sendAdminEmailNotification(
    `Nuova Candidatura Agente: ${record.name} (${record.canton_or_country})`,
    `<div style="font-family:sans-serif;padding:20px;color:#141210;">
       <h2>Nuova Candidatura Agente Commerciale (CO 418a)</h2>
       <p><b>Nome:</b> ${record.name}</p>
       <p><b>Email:</b> ${record.email}</p>
       <p><b>Cantone / Paese:</b> ${record.canton_or_country}</p>
       <p><b>Azienda:</b> ${record.company_name || 'N/D'}</p>
       <p><b>Esperienza & Network:</b> ${record.experience_and_network}</p>
       <p><a href="https://www.kreativalab.ch/admin/affiliates" style="background:#2DD4BF;color:#0C0A09;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">Accedi alla Console Admin</a></p>
     </div>`
  ).catch(() => {});

  return record;
}

// ---------- ADMIN OVERVIEW ----------

export async function getAdminOverview(currentAdminEmail?: string): Promise<AdminOverviewData> {
  await expireStaleLeadsInternal();
  const [data, admins] = await Promise.all([
    fetchAllCollections({ allowPermissionErrorFallback: true }),
    listAdminAccounts(currentAdminEmail),
  ]);
  const nowMs = Date.now();

  const activeAffiliates = data.affiliates.filter((a) => a.status === 'active').length;
  const pendingApplications = data.applications.filter((a) => a.status === 'pending').length;
  const activeLeads90d = data.leads.filter(
    (l) => (l.status === 'registered' || l.status === 'in_progress') && new Date(l.expires_at).getTime() > nowMs
  ).length;

  let totalNetCollected = 0;
  let accruedUnpaid = 0;
  let paidCommissions = 0;
  let pendingReversalCredits = 0;

  for (const s of data.sales) {
    if (!s.is_reversed && s.collected_at) {
      totalNetCollected = round2(totalNetCollected + s.net_amount);
    }
    if (s.is_reversed) {
      if (s.paid && !s.reversal_compensated_payout_id) {
        pendingReversalCredits = round2(pendingReversalCredits + s.commission);
      }
    } else if (s.paid) {
      paidCommissions = round2(paidCommissions + s.commission);
    } else if (s.commission > 0) {
      accruedUnpaid = round2(accruedUnpaid + s.commission);
    }
  }

  return {
    ...data,
    admins,
    kpis: {
      active_affiliates: activeAffiliates,
      pending_applications: pendingApplications,
      active_leads_90d: activeLeads90d,
      total_net_collected_chf: totalNetCollected,
      accrued_unpaid_commissions_chf: accruedUnpaid,
      paid_commissions_chf: paidCommissions,
      pending_reversal_credits_chf: pendingReversalCredits,
    },
  };
}

// ---------- AFFILIATE CRUD & VALIDATION ----------

function validateAffiliateProfileFields(input: {
  name?: string;
  email?: string;
  phone?: string | null;
  iban?: string | null;
  avs_idi_number?: string | null;
  is_vat_registered?: boolean;
  vat_number?: string | null;
  postal_code?: string | null;
  commission_rate?: number;
}): {
  iban: string | null;
  avs_idi_number: string | null;
  vat_number: string | null;
} {
  if (input.email !== undefined && !validateEmail(input.email)) {
    throw new ServiceError(400, 'Email agente non valida.');
  }
  if (input.phone && !validatePhone(input.phone)) {
    throw new ServiceError(400, 'Numero di telefono non valido.');
  }
  if (input.postal_code && !validatePostalCode(input.postal_code)) {
    throw new ServiceError(400, 'NPA (CAP) svizzero non valido (4-5 cifre).');
  }
  if (input.commission_rate !== undefined) {
    if (Number.isNaN(input.commission_rate) || input.commission_rate < 0 || input.commission_rate > 1) {
      throw new ServiceError(400, 'Aliquota provvigione deve essere compresa tra 0% e 100%.');
    }
  }

  let normalizedIban: string | null = null;
  if (input.iban && input.iban.trim().length > 0) {
    const ibanRes = validateIban(input.iban);
    if (!ibanRes.valid) throw new ServiceError(400, ibanRes.error || 'IBAN non valido.');
    normalizedIban = ibanRes.normalized;
  }

  let normalizedAvs: string | null = null;
  if (input.avs_idi_number && input.avs_idi_number.trim().length > 0) {
    const avsRes = validateAvsOrIdi(input.avs_idi_number);
    if (!avsRes.valid) throw new ServiceError(400, avsRes.error || 'Numero AVS/IDI non valido.');
    normalizedAvs = avsRes.normalized;
  }

  let normalizedVat: string | null = null;
  if (input.is_vat_registered) {
    if (!input.vat_number || !input.vat_number.trim()) {
      throw new ServiceError(400, 'Numero IVA obbligatorio per agenti assoggettati IVA.');
    }
    const vatRes = validateVatNumber(input.vat_number);
    if (!vatRes.valid) throw new ServiceError(400, vatRes.error || 'Numero IVA non valido.');
    normalizedVat = vatRes.normalized;
  } else if (input.vat_number && input.vat_number.trim()) {
    const vatRes = validateVatNumber(input.vat_number);
    if (!vatRes.valid) throw new ServiceError(400, vatRes.error || 'Numero IVA non valido.');
    normalizedVat = vatRes.normalized;
  }

  return {
    iban: normalizedIban,
    avs_idi_number: normalizedAvs,
    vat_number: normalizedVat,
  };
}

export async function createAffiliate(input: {
  name: string;
  company_name?: string | null;
  email: string;
  phone?: string | null;
  code?: string;
  commission_rate?: number;
  status?: AffiliateStatus;
  iban?: string | null;
  avs_idi_number?: string | null;
  is_vat_registered?: boolean;
  vat_number?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  canton?: string | null;
  notes?: string | null;
  password?: string;
}): Promise<Affiliate> {
  const name = (input.name || '').trim();
  const email = (input.email || '').trim().toLowerCase();
  if (name.length < 2) throw new ServiceError(400, 'Nome agente obbligatorio.');

  const rate = input.commission_rate !== undefined ? Number(input.commission_rate) : DEFAULT_COMMISSION_RATE;
  const validated = validateAffiliateProfileFields({
    ...input,
    email,
    commission_rate: rate,
  });

  const code = (input.code?.trim().toUpperCase() || generateAffiliateCode(name)).replace(/[^A-Z0-9-]/g, '');
  const now = nowIso();
  const passwordHash = input.password && input.password.trim().length >= 8
    ? hashPassword(input.password.trim())
    : null;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    let authUserId: string | null = null;
    if (input.password && input.password.trim().length >= 8) {
      const { data: createdUser, error: userErr } = await supabase.auth.admin.createUser({
        email,
        password: input.password.trim(),
        email_confirm: true,
        app_metadata: { role: 'affiliate' },
      });
      if (!userErr && createdUser?.user) {
        authUserId = createdUser.user.id;
      }
    }

    const payload = {
      name,
      company_name: input.company_name?.trim() || null,
      email,
      phone: input.phone?.trim() || null,
      code,
      commission_rate: rate,
      status: input.status || 'active',
      auth_user_id: authUserId,
      iban: validated.iban,
      avs_idi_number: validated.avs_idi_number,
      is_vat_registered: Boolean(input.is_vat_registered),
      vat_number: validated.vat_number,
      address: input.address?.trim() || null,
      city: input.city?.trim() || null,
      postal_code: input.postal_code?.trim() || null,
      canton: input.canton?.trim() || null,
      terms_accepted_at: now,
      notes: input.notes?.trim() || null,
    };

    const { data, error } = await supabase.from('affiliates').insert(payload).select().single();
    if (error) {
      if (error.code === '23505') throw new ServiceError(409, 'Email o codice agente già esistente.');
      throw new ServiceError(500, error.message);
    }
    return mapSupabaseNumbers(data) as Affiliate;
  }

  const db = getSqliteDb();
  const dup = db
    .prepare('SELECT id FROM affiliates WHERE lower(email) = ? OR upper(code) = ?')
    .get(email, code) as { id?: string } | undefined;
  if (dup) {
    throw new ServiceError(409, 'Email o codice agente già esistente.');
  }

  const id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO affiliates (
      id, name, company_name, email, phone, code, commission_rate, status,
      auth_user_id, password_hash, iban, avs_idi_number, is_vat_registered, vat_number,
      address, city, postal_code, canton, terms_accepted_at, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    name,
    input.company_name?.trim() || null,
    email,
    input.phone?.trim() || null,
    code,
    rate,
    input.status || 'active',
    null,
    passwordHash,
    validated.iban,
    validated.avs_idi_number,
    input.is_vat_registered ? 1 : 0,
    validated.vat_number,
    input.address?.trim() || null,
    input.city?.trim() || null,
    input.postal_code?.trim() || null,
    input.canton?.trim() || null,
    now,
    input.notes?.trim() || null,
    now,
    now
  );

  const created = db.prepare('SELECT * FROM affiliates WHERE id = ?').get(id) as Record<string, unknown>;
  return mapSqliteAffiliate(created);
}

export async function updateAffiliate(
  affiliateId: string,
  input: Partial<{
    name: string;
    company_name: string | null;
    email: string;
    phone: string | null;
    code: string;
    commission_rate: number;
    status: AffiliateStatus;
    iban: string | null;
    avs_idi_number: string | null;
    is_vat_registered: boolean;
    vat_number: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    canton: string | null;
    notes: string | null;
    password: string;
  }>,
  isAdminAction = true
): Promise<Affiliate> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data: current, error: fetchErr } = await supabase
      .from('affiliates')
      .select('*')
      .eq('id', affiliateId)
      .single();
    if (fetchErr || !current) throw new ServiceError(404, 'Agente non trovato.');

    const mergedVatReg =
      input.is_vat_registered !== undefined ? input.is_vat_registered : Boolean(current.is_vat_registered);
    const mergedVatNum = input.vat_number !== undefined ? input.vat_number : current.vat_number;

    const validated = validateAffiliateProfileFields({
      email: input.email ?? current.email,
      phone: input.phone !== undefined ? input.phone : current.phone,
      iban: input.iban !== undefined ? input.iban : current.iban,
      avs_idi_number: input.avs_idi_number !== undefined ? input.avs_idi_number : current.avs_idi_number,
      is_vat_registered: mergedVatReg,
      vat_number: mergedVatNum,
      postal_code: input.postal_code !== undefined ? input.postal_code : current.postal_code,
      commission_rate: isAdminAction && input.commission_rate !== undefined
        ? Number(input.commission_rate)
        : Number(current.commission_rate),
    });

    const updates: Record<string, unknown> = {
      name: input.name?.trim() || current.name,
      company_name: input.company_name !== undefined ? input.company_name?.trim() || null : current.company_name,
      phone: input.phone !== undefined ? input.phone?.trim() || null : current.phone,
      iban: validated.iban,
      avs_idi_number: validated.avs_idi_number,
      is_vat_registered: mergedVatReg,
      vat_number: validated.vat_number,
      address: input.address !== undefined ? input.address?.trim() || null : current.address,
      city: input.city !== undefined ? input.city?.trim() || null : current.city,
      postal_code: input.postal_code !== undefined ? input.postal_code?.trim() || null : current.postal_code,
      canton: input.canton !== undefined ? input.canton?.trim() || null : current.canton,
    };

    if (isAdminAction) {
      if (input.email) updates.email = input.email.trim().toLowerCase();
      if (input.code) updates.code = input.code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
      if (input.commission_rate !== undefined) updates.commission_rate = Number(input.commission_rate);
      if (input.status) updates.status = input.status;
      if (input.notes !== undefined) updates.notes = input.notes?.trim() || null;
    }

    const { data, error } = await supabase
      .from('affiliates')
      .update(updates)
      .eq('id', affiliateId)
      .select()
      .single();
    if (error) throw new ServiceError(400, error.message);
    return mapSupabaseNumbers(data) as Affiliate;
  }

  const db = getSqliteDb();
  const row = db.prepare('SELECT * FROM affiliates WHERE id = ?').get(affiliateId) as Record<string, unknown> | undefined;
  if (!row) throw new ServiceError(404, 'Agente non trovato.');
  const current = mapSqliteAffiliate(row);

  const mergedVatReg =
    input.is_vat_registered !== undefined ? input.is_vat_registered : current.is_vat_registered;
  const mergedVatNum = input.vat_number !== undefined ? input.vat_number : current.vat_number;

  const validated = validateAffiliateProfileFields({
    email: input.email ?? current.email,
    phone: input.phone !== undefined ? input.phone : current.phone,
    iban: input.iban !== undefined ? input.iban : current.iban,
    avs_idi_number: input.avs_idi_number !== undefined ? input.avs_idi_number : current.avs_idi_number,
    is_vat_registered: mergedVatReg,
    vat_number: mergedVatNum,
    postal_code: input.postal_code !== undefined ? input.postal_code : current.postal_code,
    commission_rate: isAdminAction && input.commission_rate !== undefined
      ? Number(input.commission_rate)
      : current.commission_rate,
  });

  const nextPasswordHash =
    isAdminAction && input.password && input.password.trim().length >= 8
      ? hashPassword(input.password.trim())
      : (row.password_hash ? String(row.password_hash) : null);

  db.prepare(
    `UPDATE affiliates SET
      name = ?, company_name = ?, email = ?, phone = ?, code = ?,
      commission_rate = ?, status = ?, password_hash = ?, iban = ?,
      avs_idi_number = ?, is_vat_registered = ?, vat_number = ?,
      address = ?, city = ?, postal_code = ?, canton = ?, notes = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    input.name?.trim() || current.name,
    input.company_name !== undefined ? input.company_name?.trim() || null : current.company_name,
    isAdminAction && input.email ? input.email.trim().toLowerCase() : current.email,
    input.phone !== undefined ? input.phone?.trim() || null : current.phone,
    isAdminAction && input.code ? input.code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '') : current.code,
    isAdminAction && input.commission_rate !== undefined ? Number(input.commission_rate) : current.commission_rate,
    isAdminAction && input.status ? input.status : current.status,
    nextPasswordHash,
    validated.iban,
    validated.avs_idi_number,
    mergedVatReg ? 1 : 0,
    validated.vat_number,
    input.address !== undefined ? input.address?.trim() || null : current.address,
    input.city !== undefined ? input.city?.trim() || null : current.city,
    input.postal_code !== undefined ? input.postal_code?.trim() || null : current.postal_code,
    input.canton !== undefined ? input.canton?.trim() || null : current.canton,
    isAdminAction && input.notes !== undefined ? input.notes?.trim() || null : current.notes,
    nowIso(),
    affiliateId
  );

  const updated = db.prepare('SELECT * FROM affiliates WHERE id = ?').get(affiliateId) as Record<string, unknown>;
  return mapSqliteAffiliate(updated);
}

// ---------- APPLICATIONS APPROVAL & CONVERSION ----------

export async function reviewApplication(
  applicationId: string,
  action: 'approve' | 'reject',
  options?: {
    commission_rate?: number;
    code?: string;
    password?: string;
    notes?: string;
  }
): Promise<{ application: AffiliateApplication; affiliate: Affiliate | null }> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data: app, error } = await supabase
      .from('affiliate_applications')
      .select('*')
      .eq('id', applicationId)
      .single();
    if (error || !app) throw new ServiceError(404, 'Candidatura non trovata.');
    const application = app as AffiliateApplication;

    if (action === 'reject') {
      const { data: updated, error: upErr } = await supabase
        .from('affiliate_applications')
        .update({ status: 'rejected' as ApplicationStatus })
        .eq('id', applicationId)
        .select()
        .single();
      if (upErr) throw new ServiceError(500, upErr.message);
      return { application: updated as AffiliateApplication, affiliate: null };
    }

    const { data: existingAff } = await supabase
      .from('affiliates')
      .select('*')
      .ilike('email', application.email)
      .maybeSingle();

    const affiliate = existingAff
      ? (mapSupabaseNumbers(existingAff) as Affiliate)
      : await createAffiliate({
          name: application.name,
          company_name: application.company_name,
          email: application.email,
          phone: application.phone,
          code: options?.code,
          commission_rate: options?.commission_rate ?? DEFAULT_COMMISSION_RATE,
          status: 'active',
          canton: application.canton_or_country,
          notes: options?.notes || `Convertito da candidatura (${application.website_or_linkedin || 'senza link'}).`,
          password: options?.password,
        });

    const { data: updated, error: upErr } = await supabase
      .from('affiliate_applications')
      .update({ status: 'approved' as ApplicationStatus })
      .eq('id', applicationId)
      .select()
      .single();
    if (upErr) throw new ServiceError(500, upErr.message);
    return { application: updated as AffiliateApplication, affiliate };
  }

  const db = getSqliteDb();
  const app = db
    .prepare('SELECT * FROM affiliate_applications WHERE id = ?')
    .get(applicationId) as AffiliateApplication | undefined;
  if (!app) throw new ServiceError(404, 'Candidatura non trovata.');

  if (action === 'reject') {
    const now = nowIso();
    db.prepare('UPDATE affiliate_applications SET status = ?, updated_at = ? WHERE id = ?').run(
      'rejected',
      now,
      applicationId
    );
    const updated = db
      .prepare('SELECT * FROM affiliate_applications WHERE id = ?')
      .get(applicationId) as unknown as AffiliateApplication;
    return { application: updated, affiliate: null };
  }

  if (!options?.password || options.password.trim().length < 8) {
    throw new ServiceError(400, 'Imposta una password iniziale di almeno 8 caratteri per attivare l’accesso agente.');
  }

  const existingRow = db
    .prepare('SELECT * FROM affiliates WHERE lower(email) = ?')
    .get(app.email.toLowerCase()) as Record<string, unknown> | undefined;

  const affiliate = existingRow
    ? mapSqliteAffiliate(existingRow)
    : await createAffiliate({
        name: app.name,
        company_name: app.company_name,
        email: app.email,
        phone: app.phone,
        code: options?.code,
        commission_rate: options?.commission_rate ?? DEFAULT_COMMISSION_RATE,
        status: 'active',
        canton: app.canton_or_country,
        notes: options?.notes || `Convertito da candidatura (${app.website_or_linkedin || 'senza link'}).`,
        password: options.password,
      });

  db.prepare('UPDATE affiliate_applications SET status = ?, updated_at = ? WHERE id = ?').run(
    'approved',
    nowIso(),
    applicationId
  );
  const updated = db
    .prepare('SELECT * FROM affiliate_applications WHERE id = ?')
    .get(applicationId) as unknown as AffiliateApplication;
  return { application: updated, affiliate };
}

// ---------- LEADS (90-DAY EXCLUSIVITY + FIRST-TOUCH DEDUPLICATION) ----------

export async function createLead(input: {
  affiliate_id: string;
  client_name: string;
  client_company?: string | null;
  client_email?: string | null;
  client_phone?: string | null;
  service_interest?: string | null;
  estimated_deal_size?: number | null;
  notes?: string | null;
}): Promise<AffiliateLead> {
  await expireStaleLeadsInternal();

  const client_name = (input.client_name || '').trim();
  if (client_name.length < 2) throw new ServiceError(400, 'Nome referente cliente obbligatorio.');

  const client_email = input.client_email?.trim() || null;
  const client_phone = input.client_phone?.trim() || null;
  const client_company = input.client_company?.trim() || null;

  if (!client_email && !client_phone) {
    throw new ServiceError(400, 'Inserisci almeno un recapito valido (email o telefono) per garantire l’attribuzione first-touch.');
  }
  if (client_email && !validateEmail(client_email)) {
    throw new ServiceError(400, 'Email cliente non valida.');
  }
  if (client_phone && !validatePhone(client_phone)) {
    throw new ServiceError(400, 'Telefono cliente non valido.');
  }

  const normEmail = normalizeEmail(client_email);
  const normPhone = normalizePhone(client_phone);
  const normCompany = normalizeCompany(client_company);

  const allData = await fetchAllCollections();
  const nowMs = Date.now();

  // First-touch rule: active non-expired or already won leads win over duplicates
  const duplicateLead = allData.leads.find((lead) => {
    if (lead.status === 'lost' || lead.status === 'expired') return false;
    const isActiveWindow = lead.status === 'won' || new Date(lead.expires_at).getTime() > nowMs;
    if (!isActiveWindow) return false;

    if (normEmail && normalizeEmail(lead.client_email) === normEmail) return true;
    if (normPhone && normalizePhone(lead.client_phone) === normPhone) return true;
    if (!normEmail && !normPhone && normCompany && normalizeCompany(lead.client_company) === normCompany) return true;
    return false;
  });

  if (duplicateLead) {
    throw new ServiceError(
      409,
      'Lead già presente in esclusiva attiva (regola First-Touch 90 giorni). Duplicato non ammesso.'
    );
  }

  // Also check already acquired referral customers
  const existingCustomer = allData.customers.find((c) => {
    if (normEmail && normalizeEmail(c.client_email) === normEmail) return true;
    if (normCompany && normalizeCompany(c.client_company) === normCompany) return true;
    return false;
  });
  if (existingCustomer) {
    throw new ServiceError(
      409,
      'Cliente già acquisito nel portafoglio Kreativalab (priorità First-Touch esistente).'
    );
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + LEAD_EXCLUSIVITY_DAYS * 24 * 60 * 60 * 1000);
  const lead: AffiliateLead = {
    id: crypto.randomUUID(),
    affiliate_id: input.affiliate_id,
    client_name,
    client_company,
    client_email: normEmail,
    client_phone,
    service_interest: input.service_interest?.trim() || null,
    estimated_deal_size:
      input.estimated_deal_size !== undefined && input.estimated_deal_size !== null
        ? round2(Math.max(0, Number(input.estimated_deal_size)))
        : null,
    status: 'registered',
    registered_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    notes: input.notes?.trim() || null,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from('affiliate_leads').insert(lead).select().single();
    if (error) {
      if (error.code === '23505') throw new ServiceError(409, error.message);
      throw new ServiceError(400, error.message);
    }
    return mapSupabaseNumbers(data) as AffiliateLead;
  }

  const db = getSqliteDb();
  db.prepare(
    `INSERT INTO affiliate_leads
     (id, affiliate_id, client_name, client_company, client_email, client_phone, service_interest, estimated_deal_size, status, registered_at, expires_at, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    lead.id,
    lead.affiliate_id,
    lead.client_name,
    lead.client_company,
    lead.client_email,
    lead.client_phone,
    lead.service_interest,
    lead.estimated_deal_size,
    lead.status,
    lead.registered_at,
    lead.expires_at,
    lead.notes,
    lead.created_at,
    lead.updated_at
  );
  return lead;
}

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  notes?: string | null
): Promise<AffiliateLead> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const updates: Record<string, unknown> = { status };
    if (notes !== undefined) updates.notes = notes;
    const { data, error } = await supabase
      .from('affiliate_leads')
      .update(updates)
      .eq('id', leadId)
      .select()
      .single();
    if (error) throw new ServiceError(400, error.message);
    return mapSupabaseNumbers(data) as AffiliateLead;
  }

  const db = getSqliteDb();
  const row = db.prepare('SELECT * FROM affiliate_leads WHERE id = ?').get(leadId) as AffiliateLead | undefined;
  if (!row) throw new ServiceError(404, 'Lead non trovato.');
  db.prepare('UPDATE affiliate_leads SET status = ?, notes = ?, updated_at = ? WHERE id = ?').run(
    status,
    notes !== undefined ? notes : row.notes,
    nowIso(),
    leadId
  );
  return db.prepare('SELECT * FROM affiliate_leads WHERE id = ?').get(leadId) as unknown as AffiliateLead;
}

// ---------- CUSTOMERS ----------

export async function createCustomer(input: {
  affiliate_id: string;
  client_name: string;
  client_company?: string | null;
  client_email?: string | null;
  first_contract_at?: string;
  is_recurring?: boolean;
  recurring_extended_by_admin?: boolean;
}): Promise<ReferralCustomer> {
  const client_name = (input.client_name || '').trim();
  if (client_name.length < 2) throw new ServiceError(400, 'Nome cliente obbligatorio.');
  if (input.client_email && !validateEmail(input.client_email)) {
    throw new ServiceError(400, 'Email cliente non valida.');
  }

  const now = nowIso();
  const customer: ReferralCustomer = {
    id: crypto.randomUUID(),
    affiliate_id: input.affiliate_id,
    client_name,
    client_company: input.client_company?.trim() || null,
    client_email: normalizeEmail(input.client_email),
    first_contract_at: input.first_contract_at || now,
    is_recurring: Boolean(input.is_recurring),
    recurring_months_paid: 0,
    recurring_extended_by_admin: Boolean(input.recurring_extended_by_admin),
    status: 'active',
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from('referral_customers').insert(customer).select().single();
    if (error) throw new ServiceError(400, error.message);
    return mapSupabaseNumbers(data) as ReferralCustomer;
  }

  const db = getSqliteDb();
  db.prepare(
    `INSERT INTO referral_customers
     (id, affiliate_id, client_name, client_company, client_email, first_contract_at, is_recurring, recurring_months_paid, recurring_extended_by_admin, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    customer.id,
    customer.affiliate_id,
    customer.client_name,
    customer.client_company,
    customer.client_email,
    customer.first_contract_at,
    customer.is_recurring ? 1 : 0,
    customer.recurring_months_paid,
    customer.recurring_extended_by_admin ? 1 : 0,
    customer.status,
    customer.created_at,
    customer.updated_at
  );
  return customer;
}

// ---------- SALES & CO 418a COMMISSION ACCRUAL ----------

export interface CreateSaleComponentInput {
  affiliate_id: string;
  customer_id?: string | null;
  invoice_number: string;
  contract_title: string;
  mode: 'one_off' | 'recurring' | 'package';
  // One-off or single amounts
  gross_amount: number;
  vat_amount: number;
  discounts_amount?: number;
  third_party_costs?: number;
  // Optional recurring component when mode === 'package'
  recurring_gross_amount?: number;
  recurring_vat_amount?: number;
  recurring_discounts_amount?: number;
  recurring_third_party_costs?: number;
  is_renewal?: boolean;
  recurring_month_number?: number | null;
  extended_by_admin?: boolean;
  contract_concluded: boolean;
  service_delivered: boolean;
  collected_at?: string | null;
  commission_rate_override?: number;
}

export async function createSalesFromEntry(input: CreateSaleComponentInput): Promise<ReferralSale[]> {
  if (!input.invoice_number?.trim()) throw new ServiceError(400, 'Numero fattura/riferimento obbligatorio.');
  if (!input.contract_title?.trim()) throw new ServiceError(400, 'Titolo contratto/servizio obbligatorio.');

  const all = await fetchAllCollections();
  const affiliate = all.affiliates.find((a) => a.id === input.affiliate_id);
  if (!affiliate) throw new ServiceError(404, 'Agente non trovato.');

  const customer = input.customer_id
    ? all.customers.find((c) => c.id === input.customer_id && c.affiliate_id === affiliate.id)
    : null;
  if (input.customer_id && !customer) {
    throw new ServiceError(400, 'Cliente non valido per questo agente.');
  }

  const rate =
    input.commission_rate_override !== undefined
      ? Number(input.commission_rate_override)
      : affiliate.commission_rate;

  const packageGroupId = input.mode === 'package' ? crypto.randomUUID() : null;
  const rowsToInsert: ReferralSale[] = [];
  const now = nowIso();
  const collectedIso = input.collected_at ? new Date(input.collected_at).toISOString() : null;

  const buildRow = (params: {
    saleType: 'one_off' | 'recurring';
    invoiceSuffix: string;
    titleSuffix: string;
    gross: number;
    vat: number;
    discounts: number;
    thirdParty: number;
    recurringMonth: number | null;
  }): ReferralSale => {
    const extended = Boolean(input.extended_by_admin || customer?.recurring_extended_by_admin);
    const calc = calculateCommissionBreakdown({
      saleType: params.saleType,
      grossAmount: params.gross,
      vatAmount: params.vat,
      discountsAmount: params.discounts,
      thirdPartyCosts: params.thirdParty,
      commissionRate: rate,
      contractConcluded: input.contract_concluded,
      serviceDelivered: input.service_delivered,
      collectedAt: collectedIso,
      recurringMonthNumber: params.recurringMonth,
      extendedByAdmin: extended,
    });

    return {
      id: crypto.randomUUID(),
      affiliate_id: affiliate.id,
      customer_id: customer?.id || null,
      invoice_number: `${input.invoice_number.trim()}${params.invoiceSuffix}`,
      contract_title: `${input.contract_title.trim()}${params.titleSuffix}`,
      sale_type: params.saleType,
      gross_amount: round2(params.gross),
      vat_amount: round2(params.vat),
      discounts_amount: round2(params.discounts),
      third_party_costs: round2(params.thirdParty),
      net_amount: calc.netAmount,
      commission_rate: rate,
      commission: calc.commission,
      currency: 'CHF',
      is_renewal: Boolean(input.is_renewal || (params.saleType === 'recurring' && (params.recurringMonth ?? 1) > 1)),
      recurring_month_number: params.recurringMonth,
      extended_by_admin: extended,
      contract_concluded: input.contract_concluded,
      service_delivered: input.service_delivered,
      collected_at: collectedIso,
      payout_id: null,
      paid: false,
      paid_at: null,
      is_reversed: false,
      reversed_reason: null,
      reversed_at: null,
      reversal_compensated_payout_id: null,
      package_group_id: packageGroupId,
      created_at: now,
      updated_at: now,
    };
  };

  if (input.mode === 'one_off') {
    rowsToInsert.push(
      buildRow({
        saleType: 'one_off',
        invoiceSuffix: '',
        titleSuffix: '',
        gross: input.gross_amount,
        vat: input.vat_amount,
        discounts: input.discounts_amount ?? 0,
        thirdParty: input.third_party_costs ?? 0,
        recurringMonth: null,
      })
    );
  } else if (input.mode === 'recurring') {
    const monthNum = Math.max(1, Number(input.recurring_month_number ?? (customer ? customer.recurring_months_paid + 1 : 1)));
    rowsToInsert.push(
      buildRow({
        saleType: 'recurring',
        invoiceSuffix: '',
        titleSuffix: ` (Canone Mese #${monthNum})`,
        gross: input.gross_amount,
        vat: input.vat_amount,
        discounts: input.discounts_amount ?? 0,
        thirdParty: input.third_party_costs ?? 0,
        recurringMonth: monthNum,
      })
    );
  } else {
    // Package: split one-off setup + recurring fee separately
    const monthNum = Math.max(1, Number(input.recurring_month_number ?? (customer ? customer.recurring_months_paid + 1 : 1)));
    if (Number(input.gross_amount) > 0) {
      rowsToInsert.push(
        buildRow({
          saleType: 'one_off',
          invoiceSuffix: '-ONEOFF',
          titleSuffix: ' · Quota Setup One-Off',
          gross: input.gross_amount,
          vat: input.vat_amount,
          discounts: input.discounts_amount ?? 0,
          thirdParty: input.third_party_costs ?? 0,
          recurringMonth: null,
        })
      );
    }
    if (Number(input.recurring_gross_amount ?? 0) > 0) {
      rowsToInsert.push(
        buildRow({
          saleType: 'recurring',
          invoiceSuffix: '-REC',
          titleSuffix: ` · Canone Ricorrente Mese #${monthNum}`,
          gross: Number(input.recurring_gross_amount ?? 0),
          vat: Number(input.recurring_vat_amount ?? 0),
          discounts: Number(input.recurring_discounts_amount ?? 0),
          thirdParty: Number(input.recurring_third_party_costs ?? 0),
          recurringMonth: monthNum,
        })
      );
    }
    if (rowsToInsert.length === 0) {
      throw new ServiceError(400, 'Inserisci almeno un importo one-off o ricorrente per il pacchetto.');
    }
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from('referral_sales').insert(rowsToInsert).select();
    if (error) throw new ServiceError(400, error.message);

    // Update customer recurring counter if applicable
    const recRow = rowsToInsert.find((r) => r.sale_type === 'recurring' && r.collected_at);
    if (customer && recRow && recRow.recurring_month_number) {
      await supabase
        .from('referral_customers')
        .update({
          is_recurring: true,
          recurring_months_paid: Math.max(customer.recurring_months_paid, recRow.recurring_month_number),
        })
        .eq('id', customer.id);
    }

    return (data ?? []).map(mapSupabaseNumbers) as ReferralSale[];
  }

  const db = getSqliteDb();
  const stmt = db.prepare(
    `INSERT INTO referral_sales (
      id, affiliate_id, customer_id, invoice_number, contract_title, sale_type,
      gross_amount, vat_amount, discounts_amount, third_party_costs, net_amount,
      commission_rate, commission, currency, is_renewal, recurring_month_number,
      extended_by_admin, contract_concluded, service_delivered, collected_at,
      payout_id, paid, paid_at, is_reversed, reversed_reason, reversed_at,
      reversal_compensated_payout_id, package_group_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  for (const r of rowsToInsert) {
    stmt.run(
      r.id,
      r.affiliate_id,
      r.customer_id,
      r.invoice_number,
      r.contract_title,
      r.sale_type,
      r.gross_amount,
      r.vat_amount,
      r.discounts_amount,
      r.third_party_costs,
      r.net_amount,
      r.commission_rate,
      r.commission,
      r.currency,
      r.is_renewal ? 1 : 0,
      r.recurring_month_number,
      r.extended_by_admin ? 1 : 0,
      r.contract_concluded ? 1 : 0,
      r.service_delivered ? 1 : 0,
      r.collected_at,
      r.payout_id,
      r.paid ? 1 : 0,
      r.paid_at,
      r.is_reversed ? 1 : 0,
      r.reversed_reason,
      r.reversed_at,
      r.reversal_compensated_payout_id,
      r.package_group_id,
      r.created_at,
      r.updated_at
    );
  }

  const recRow = rowsToInsert.find((r) => r.sale_type === 'recurring' && r.collected_at);
  if (customer && recRow && recRow.recurring_month_number) {
    db.prepare(
      'UPDATE referral_customers SET is_recurring = 1, recurring_months_paid = ?, updated_at = ? WHERE id = ?'
    ).run(Math.max(customer.recurring_months_paid, recRow.recurring_month_number), now, customer.id);
  }

  return rowsToInsert;
}

export async function reverseSale(saleId: string, reason: string): Promise<ReferralSale> {
  const cleanReason = (reason || '').trim();
  if (cleanReason.length < 3) {
    throw new ServiceError(400, 'Specifica il motivo dello storno (annullamento, rimborso o riduzione).');
  }
  const now = nowIso();

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data: current, error: fErr } = await supabase
      .from('referral_sales')
      .select('*')
      .eq('id', saleId)
      .single();
    if (fErr || !current) throw new ServiceError(404, 'Vendita non trovata.');
    if (current.is_reversed) throw new ServiceError(409, 'Vendita già stornata.');

    const { data, error } = await supabase
      .from('referral_sales')
      .update({
        is_reversed: true,
        reversed_reason: cleanReason,
        reversed_at: now,
        // If linked to an unpaid draft payout, unlink it so draft can be regenerated cleanly
        payout_id: current.paid ? current.payout_id : null,
      })
      .eq('id', saleId)
      .select()
      .single();
    if (error) throw new ServiceError(400, error.message);
    return mapSupabaseNumbers(data) as ReferralSale;
  }

  const db = getSqliteDb();
  const row = db.prepare('SELECT * FROM referral_sales WHERE id = ?').get(saleId) as Record<string, unknown> | undefined;
  if (!row) throw new ServiceError(404, 'Vendita non trovata.');
  const current = mapSqliteSale(row);
  if (current.is_reversed) throw new ServiceError(409, 'Vendita già stornata.');

  db.prepare(
    `UPDATE referral_sales
     SET is_reversed = 1, reversed_reason = ?, reversed_at = ?, payout_id = ?, updated_at = ?
     WHERE id = ?`
  ).run(cleanReason, now, current.paid ? current.payout_id : null, now, saleId);

  const updated = db.prepare('SELECT * FROM referral_sales WHERE id = ?').get(saleId) as Record<string, unknown>;
  return mapSqliteSale(updated);
}

// ---------- MONTHLY PAYOUTS (CHF 50 THRESHOLD + ROLLOVER + REVERSAL COMPENSATION) ----------

function getPeriodCutoffIso(periodMonth: string): string {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(periodMonth)) {
    throw new ServiceError(400, 'Formato mese non valido (usa YYYY-MM).');
  }
  const [yStr, mStr] = periodMonth.split('-');
  const year = Number(yStr);
  const month = Number(mStr); // 1..12
  const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  return endOfMonth.toISOString();
}

export async function previewMonthlyPayouts(periodMonth: string): Promise<PayoutPreviewItem[]> {
  const cutoffIso = getPeriodCutoffIso(periodMonth);
  const cutoffMs = new Date(cutoffIso).getTime();
  const data = await fetchAllCollections();

  const items: PayoutPreviewItem[] = [];
  for (const affiliate of data.affiliates) {
    const existingPayout = data.payouts.find(
      (p) => p.affiliate_id === affiliate.id && p.period_month === periodMonth && p.status !== 'cancelled'
    );

    // Eligible accrued sales collected on or before end of periodMonth, not yet assigned to a payout
    const eligibleSales = data.sales.filter(
      (s) =>
        s.affiliate_id === affiliate.id &&
        !s.is_reversed &&
        !s.paid &&
        !s.payout_id &&
        s.commission > 0 &&
        s.collected_at !== null &&
        new Date(s.collected_at).getTime() <= cutoffMs
    );

    // Paid sales that were later reversed and haven't been compensated yet
    const uncompensatedReversals = data.sales.filter(
      (s) =>
        s.affiliate_id === affiliate.id &&
        s.is_reversed &&
        s.paid &&
        !s.reversal_compensated_payout_id &&
        s.commission > 0
    );

    if (eligibleSales.length === 0 && uncompensatedReversals.length === 0 && !existingPayout) {
      continue;
    }

    const totalCommissions = round2(eligibleSales.reduce((acc, s) => acc + s.commission, 0));
    const deductions = round2(uncompensatedReversals.reduce((acc, s) => acc + s.commission, 0));
    const netPayable = round2(totalCommissions - deductions);
    const meetsThreshold = netPayable >= PAYOUT_MIN_THRESHOLD_CHF;
    const vatAmount =
      meetsThreshold && affiliate.is_vat_registered ? round2(netPayable * CH_STANDARD_VAT_RATE) : 0;
    const grossInvoice = meetsThreshold ? round2(netPayable + vatAmount) : 0;

    let rolloverReason: string | null = null;
    if (netPayable < 0) {
      rolloverReason = `Saldo negativo (${netPayable.toFixed(2)} CHF): credito Kreativalab da compensare sul mese successivo.`;
    } else if (!meetsThreshold) {
      rolloverReason = `Sotto soglia minima CHF 50.00: rollover automatico al mese successivo.`;
    }

    items.push({
      affiliate,
      period_month: periodMonth,
      eligible_sales: eligibleSales,
      uncompensated_reversals: uncompensatedReversals,
      total_commissions: totalCommissions,
      deductions,
      net_payable: netPayable,
      meets_threshold: meetsThreshold,
      rollover_reason: rolloverReason,
      vat_amount: vatAmount,
      gross_invoice_amount: grossInvoice,
      already_generated_payout_id: existingPayout?.id || null,
    });
  }

  return items;
}

export async function generateMonthlyPayouts(periodMonth: string): Promise<{
  created: AffiliatePayout[];
  skipped_rollover: PayoutPreviewItem[];
}> {
  const previews = await previewMonthlyPayouts(periodMonth);
  const created: AffiliatePayout[] = [];
  const skippedRollover: PayoutPreviewItem[] = [];
  const now = nowIso();

  for (const item of previews) {
    if (item.already_generated_payout_id) continue;
    if (!item.meets_threshold) {
      skippedRollover.push(item);
      continue;
    }

    const payout: AffiliatePayout = {
      id: crypto.randomUUID(),
      affiliate_id: item.affiliate.id,
      period_month: periodMonth,
      total_commissions: item.total_commissions,
      deductions: item.deductions,
      net_payable: item.net_payable,
      vat_amount: item.vat_amount,
      gross_invoice_amount: item.gross_invoice_amount,
      currency: 'CHF',
      status: 'draft',
      agent_invoice_number: null,
      agent_invoice_date: null,
      payment_due_date: null,
      payment_method: 'Bonifico IBAN',
      payment_reference: null,
      statement_sent_at: null,
      paid_at: null,
      notes: item.deductions > 0
        ? `Compensati ${item.uncompensated_reversals.length} storni per CHF ${item.deductions.toFixed(2)}.`
        : null,
      created_at: now,
      updated_at: now,
    };

    const saleIds = item.eligible_sales.map((s) => s.id);
    const reversalIds = item.uncompensated_reversals.map((r) => r.id);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data: inserted, error } = await supabase
        .from('affiliate_payouts')
        .insert(payout)
        .select()
        .single();
      if (error) throw new ServiceError(400, error.message);
      if (saleIds.length > 0) {
        await supabase.from('referral_sales').update({ payout_id: payout.id }).in('id', saleIds);
      }
      if (reversalIds.length > 0) {
        await supabase
          .from('referral_sales')
          .update({ reversal_compensated_payout_id: payout.id })
          .in('id', reversalIds);
      }
      created.push(mapSupabaseNumbers(inserted) as AffiliatePayout);
    } else {
      const db = getSqliteDb();
      db.prepare(
        `INSERT INTO affiliate_payouts (
          id, affiliate_id, period_month, total_commissions, deductions, net_payable,
          vat_amount, gross_invoice_amount, currency, status, agent_invoice_number,
          agent_invoice_date, payment_due_date, payment_method, payment_reference,
          statement_sent_at, paid_at, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        payout.id,
        payout.affiliate_id,
        payout.period_month,
        payout.total_commissions,
        payout.deductions,
        payout.net_payable,
        payout.vat_amount,
        payout.gross_invoice_amount,
        payout.currency,
        payout.status,
        payout.agent_invoice_number,
        payout.agent_invoice_date,
        payout.payment_due_date,
        payout.payment_method,
        payout.payment_reference,
        payout.statement_sent_at,
        payout.paid_at,
        payout.notes,
        payout.created_at,
        payout.updated_at
      );
      for (const sid of saleIds) {
        db.prepare('UPDATE referral_sales SET payout_id = ?, updated_at = ? WHERE id = ?').run(payout.id, now, sid);
      }
      for (const rid of reversalIds) {
        db.prepare(
          'UPDATE referral_sales SET reversal_compensated_payout_id = ?, updated_at = ? WHERE id = ?'
        ).run(payout.id, now, rid);
      }
      created.push(payout);
    }
  }

  if (created.length > 0) {
    const totalPayableSum = created.reduce((acc, p) => acc + p.net_payable, 0);
    void sendAdminEmailNotification(
      `Nuovo Payout Mensile Generato (${periodMonth}): ${created.length} estratti per CHF ${totalPayableSum.toFixed(2)}`,
      `<div style="font-family:sans-serif;padding:20px;color:#141210;">
         <h2>Generazione Payout Mensili (${periodMonth})</h2>
         <p>Sono stati generati <b>${created.length}</b> estratti conto provvigionali per un totale di <b>CHF ${totalPayableSum.toFixed(2)}</b>.</p>
         <p><a href="https://www.kreativalab.ch/admin/payouts" style="background:#FBBF24;color:#0C0A09;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">Visualizza Payouts & Estratti Conto</a></p>
       </div>`
    ).catch(() => {});
  }

  return { created, skipped_rollover: skippedRollover };
}

export async function updatePayoutStatus(
  payoutId: string,
  payload: {
    status: PayoutStatus;
    agent_invoice_number?: string;
    agent_invoice_date?: string;
    payment_method?: string;
    payment_reference?: string;
    notes?: string;
  }
): Promise<AffiliatePayout> {
  const data = await fetchAllCollections();
  const payout = data.payouts.find((p) => p.id === payoutId);
  if (!payout) throw new ServiceError(404, 'Payout non trovato.');
  const affiliate = data.affiliates.find((a) => a.id === payout.affiliate_id);
  if (!affiliate) throw new ServiceError(404, 'Agente associato non trovato.');

  const now = nowIso();
  const nextStatus = payload.status;

  let statement_sent_at = payout.statement_sent_at;
  let agent_invoice_number = payout.agent_invoice_number;
  let agent_invoice_date = payout.agent_invoice_date;
  let payment_due_date = payout.payment_due_date;
  let vat_amount = payout.vat_amount;
  let gross_invoice_amount = payout.gross_invoice_amount;
  let paid_at = payout.paid_at;
  let payment_method = payload.payment_method?.trim() || payout.payment_method;
  let payment_reference = payload.payment_reference?.trim() || payout.payment_reference;

  if (nextStatus === 'statement_sent') {
    statement_sent_at = statement_sent_at || now;
  }

  if (nextStatus === 'invoice_received') {
    const invNum = (payload.agent_invoice_number ?? payout.agent_invoice_number ?? '').trim();
    const invDate = (payload.agent_invoice_date ?? payout.agent_invoice_date ?? '').trim();
    if (!invNum) throw new ServiceError(400, 'Inserisci il numero della fattura agente.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(invDate)) {
      throw new ServiceError(400, 'Inserisci la data fattura valida (YYYY-MM-DD).');
    }
    agent_invoice_number = invNum;
    agent_invoice_date = invDate;
    payment_due_date = addDaysIsoDate(invDate, PAYMENT_TERMS_DAYS);
    vat_amount = affiliate.is_vat_registered ? round2(payout.net_payable * CH_STANDARD_VAT_RATE) : 0;
    gross_invoice_amount = round2(payout.net_payable + vat_amount);
  }

  if (nextStatus === 'paid') {
    if (!affiliate.iban) {
      throw new ServiceError(400, 'IBAN agente mancante o non validato: impossibile registrare il pagamento.');
    }
    const ibanCheck = validateIban(affiliate.iban);
    if (!ibanCheck.valid) {
      throw new ServiceError(400, `IBAN agente non valido: ${ibanCheck.error}`);
    }
    if (!payment_reference) {
      throw new ServiceError(400, 'Inserisci il riferimento bonifico / CRO per registrare il pagamento.');
    }
    paid_at = now;
    payment_method = payment_method || 'Bonifico SEPA/SIC su IBAN';
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data: updated, error } = await supabase
      .from('affiliate_payouts')
      .update({
        status: nextStatus,
        statement_sent_at,
        agent_invoice_number,
        agent_invoice_date,
        payment_due_date,
        vat_amount,
        gross_invoice_amount,
        paid_at,
        payment_method,
        payment_reference,
        notes: payload.notes !== undefined ? payload.notes : payout.notes,
      })
      .eq('id', payoutId)
      .select()
      .single();
    if (error) throw new ServiceError(400, error.message);

    if (nextStatus === 'paid') {
      await supabase
        .from('referral_sales')
        .update({ paid: true, paid_at: paid_at })
        .eq('payout_id', payoutId);
    } else if (nextStatus === 'cancelled') {
      await supabase.from('referral_sales').update({ payout_id: null }).eq('payout_id', payoutId);
      await supabase
        .from('referral_sales')
        .update({ reversal_compensated_payout_id: null })
        .eq('reversal_compensated_payout_id', payoutId);
    }
    return mapSupabaseNumbers(updated) as AffiliatePayout;
  }

  const db = getSqliteDb();
  db.prepare(
    `UPDATE affiliate_payouts SET
      status = ?, statement_sent_at = ?, agent_invoice_number = ?, agent_invoice_date = ?,
      payment_due_date = ?, vat_amount = ?, gross_invoice_amount = ?, paid_at = ?,
      payment_method = ?, payment_reference = ?, notes = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    nextStatus,
    statement_sent_at,
    agent_invoice_number,
    agent_invoice_date,
    payment_due_date,
    vat_amount,
    gross_invoice_amount,
    paid_at,
    payment_method,
    payment_reference,
    payload.notes !== undefined ? payload.notes : payout.notes,
    now,
    payoutId
  );

  if (nextStatus === 'paid') {
    db.prepare('UPDATE referral_sales SET paid = 1, paid_at = ?, updated_at = ? WHERE payout_id = ?').run(
      paid_at,
      now,
      payoutId
    );
  } else if (nextStatus === 'cancelled') {
    db.prepare('UPDATE referral_sales SET payout_id = NULL, updated_at = ? WHERE payout_id = ?').run(now, payoutId);
    db.prepare(
      'UPDATE referral_sales SET reversal_compensated_payout_id = NULL, updated_at = ? WHERE reversal_compensated_payout_id = ?'
    ).run(now, payoutId);
  }

  return db.prepare('SELECT * FROM affiliate_payouts WHERE id = ?').get(payoutId) as unknown as AffiliatePayout;
}

// ---------- AFFILIATE PORTAL DATA & SELF-SERVICE ----------

export async function getAffiliatePortalData(affiliateId: string): Promise<AffiliatePortalData> {
  await expireStaleLeadsInternal();
  const data = await fetchAllCollections();
  const affiliate = data.affiliates.find((a) => a.id === affiliateId);
  if (!affiliate) throw new ServiceError(404, 'Profilo agente non trovato.');

  const leads = data.leads.filter((l) => l.affiliate_id === affiliateId);
  const customers = data.customers.filter((c) => c.affiliate_id === affiliateId);
  const sales = data.sales.filter((s) => s.affiliate_id === affiliateId);
  const payouts = data.payouts.filter((p) => p.affiliate_id === affiliateId);

  let accruedUnpaid = 0;
  let totalPaid = 0;
  let reversalDebt = 0;

  for (const s of sales) {
    if (s.is_reversed) {
      if (s.paid && !s.reversal_compensated_payout_id) {
        reversalDebt = round2(reversalDebt + s.commission);
      }
    } else if (s.paid) {
      totalPaid = round2(totalPaid + s.commission);
    } else if (s.commission > 0) {
      accruedUnpaid = round2(accruedUnpaid + s.commission);
    }
  }

  const netAccruedAfterDebt = round2(accruedUnpaid - reversalDebt);
  const nowMs = Date.now();
  const activeLeadsCount = leads.filter(
    (l) => (l.status === 'registered' || l.status === 'in_progress') && new Date(l.expires_at).getTime() > nowMs
  ).length;
  const activeCustomersCount = customers.filter((c) => c.status === 'active').length;

  return {
    storage_mode: data.storage_mode,
    affiliate,
    kpis: {
      accrued_unpaid_chf: accruedUnpaid,
      total_paid_chf: totalPaid,
      pending_reversal_debt_chf: reversalDebt,
      active_leads_count: activeLeadsCount,
      active_customers_count: activeCustomersCount,
      below_threshold_rollover: netAccruedAfterDebt > 0 && netAccruedAfterDebt < PAYOUT_MIN_THRESHOLD_CHF,
    },
    leads,
    customers,
    sales,
    payouts,
  };
}

export async function submitAffiliateInvoice(
  affiliateId: string,
  payoutId: string,
  input: { agent_invoice_number: string; agent_invoice_date: string }
): Promise<AffiliatePayout> {
  const data = await fetchAllCollections();
  const payout = data.payouts.find((p) => p.id === payoutId && p.affiliate_id === affiliateId);
  if (!payout) throw new ServiceError(404, 'Estratto conto non trovato.');
  if (payout.status !== 'statement_sent' && payout.status !== 'invoice_received') {
    throw new ServiceError(400, 'La fattura può essere inviata solo per estratti in stato "Estratto inviato".');
  }
  return updatePayoutStatus(payoutId, {
    status: 'invoice_received',
    agent_invoice_number: input.agent_invoice_number,
    agent_invoice_date: input.agent_invoice_date,
  });
}

export async function findAffiliateByAuthUser(authUserId: string, email?: string): Promise<Affiliate | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data: byAuth } = await supabase
    .from('affiliates')
    .select('*')
    .eq('auth_user_id', authUserId)
    .maybeSingle();
  if (byAuth) return mapSupabaseNumbers(byAuth) as Affiliate;

  if (email) {
    const { data: byEmail } = await supabase
      .from('affiliates')
      .select('*')
      .ilike('email', email)
      .maybeSingle();
    if (byEmail) {
      await supabase
        .from('affiliates')
        .update({ auth_user_id: authUserId })
        .eq('id', byEmail.id);
      return mapSupabaseNumbers({ ...byEmail, auth_user_id: authUserId }) as Affiliate;
    }
  }
  return null;
}
