import { AsyncLocalStorage } from 'node:async_hooks';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface RequestAuthContext {
  token?: string;
  role?: 'admin' | 'affiliate';
  email?: string;
  userId?: string;
}

export const requestAuthStorage = new AsyncLocalStorage<RequestAuthContext>();

export interface SqliteStatementLike {
  get: (...params: unknown[]) => unknown;
  all: (...params: unknown[]) => unknown[];
  run: (...params: unknown[]) => unknown;
}

export interface SqliteDatabaseLike {
  exec: (sql: string) => void;
  prepare: (sql: string) => SqliteStatementLike;
}

type SqliteConstructor = new (path: string) => SqliteDatabaseLike;

let sqliteDb: SqliteDatabaseLike | null = null;
let supabaseAdminClient: SupabaseClient | null = null;
let lastServiceRoleKeyUsed = '';

export function getJwtRole(tokenOrKey: string): string | null {
  const clean = (tokenOrKey || '').trim();
  if (!clean) return null;
  if (clean.startsWith('sb_secret_')) return 'service_role';
  if (clean.startsWith('sb_publishable_')) return 'anon';
  const parts = clean.split('.');
  if (parts.length !== 3) return null;
  try {
    const json = Buffer.from(parts[1], 'base64url').toString('utf8');
    const payload = JSON.parse(json) as { role?: string };
    return typeof payload.role === 'string' ? payload.role : null;
  } catch {
    return null;
  }
}

export function getConfiguredAdminEmails(): string[] {
  const raw = (process.env.ADMIN_EMAIL || '').trim();
  if (!raw) return [];
  return Array.from(
    new Set(
      raw
        .split(/[,;\s]+/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.includes('@'))
    )
  );
}

export function isConfiguredAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const norm = email.trim().toLowerCase();
  if (!norm) return false;
  const list = getConfiguredAdminEmails();
  return list.includes(norm);
}

function loadSqliteConstructor(): SqliteConstructor | null {
  try {
    const sqliteSpec = ['node', 'sqlite'].join(':');
    let localRequire: ((id: string) => unknown) | null = null;
    if (typeof require === 'function') {
      localRequire = require;
    } else if (typeof import.meta !== 'undefined' && import.meta.url) {
      localRequire = createRequire(import.meta.url);
    }
    if (!localRequire) return null;
    const mod = localRequire(sqliteSpec) as { DatabaseSync?: SqliteConstructor };
    return mod?.DatabaseSync ?? null;
  } catch {
    return null;
  }
}

export function isSqliteAvailable(): boolean {
  return loadSqliteConstructor() !== null;
}

export function getSupabaseConfig(): {
  url: string;
  serviceRoleKey: string;
  anonKey: string;
  keyRole: string;
  isServiceRole: boolean;
  enabled: boolean;
} {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || '').trim();
  const detectedRole = getJwtRole(serviceRoleKey);
  const isAnonKey =
    detectedRole === 'anon' ||
    (Boolean(anonKey) && Boolean(serviceRoleKey) && anonKey === serviceRoleKey);
  const keyRole = isAnonKey ? 'anon' : detectedRole || (serviceRoleKey ? 'service_role' : 'none');
  return {
    url,
    serviceRoleKey,
    anonKey,
    keyRole,
    isServiceRole: Boolean(serviceRoleKey) && !isAnonKey,
    enabled: Boolean(url && serviceRoleKey),
  };
}

export function getSupabaseBaseAdminClient(): SupabaseClient | null {
  const cfg = getSupabaseConfig();
  if (!cfg.enabled) return null;
  if (!supabaseAdminClient || lastServiceRoleKeyUsed !== cfg.serviceRoleKey) {
    lastServiceRoleKeyUsed = cfg.serviceRoleKey;
    supabaseAdminClient = createClient(cfg.url, cfg.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabaseAdminClient;
}

export function getSupabaseUserClient(explicitToken?: string): SupabaseClient | null {
  const cfg = getSupabaseConfig();
  if (!cfg.enabled) return null;
  const token = explicitToken || requestAuthStorage.getStore()?.token;
  if (!token || token.split('.').length !== 3) return null;
  const apiKey = cfg.anonKey || cfg.serviceRoleKey;
  return createClient(cfg.url, apiKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const cfg = getSupabaseConfig();
  if (!cfg.enabled) return null;

  // If SUPABASE_SERVICE_ROLE_KEY is actually an anon key and we have an authenticated user JWT in context,
  // forward the user's JWT so PostgREST executes queries as 'authenticated' instead of 'anon'.
  if (!cfg.isServiceRole) {
    const userClient = getSupabaseUserClient();
    if (userClient) return userClient;
  }

  return getSupabaseBaseAdminClient();
}

export function getSqliteDb(): SqliteDatabaseLike {
  if (sqliteDb) return sqliteDb;

  const DatabaseSync = loadSqliteConstructor();
  if (!DatabaseSync) {
    throw new Error(
      'SQLite non disponibile in questo runtime. Configura SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nelle Environment Variables di Vercel.'
    );
  }

  const dataDir = process.env.VERCEL
    ? '/tmp/kreativalab-data'
    : path.resolve(process.cwd(), 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, 'kreativalab_affiliates.db');
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA journal_mode = WAL;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS affiliates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company_name TEXT,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      code TEXT NOT NULL UNIQUE,
      commission_rate REAL NOT NULL DEFAULT 0.20,
      status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('active', 'disabled', 'pending_approval')),
      auth_user_id TEXT UNIQUE,
      password_hash TEXT,
      iban TEXT,
      avs_idi_number TEXT,
      is_vat_registered INTEGER NOT NULL DEFAULT 0,
      vat_number TEXT,
      address TEXT,
      city TEXT,
      postal_code TEXT,
      canton TEXT,
      terms_accepted_at TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_affiliates_email ON affiliates (email);
    CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates (code);

    CREATE TABLE IF NOT EXISTS affiliate_applications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company_name TEXT,
      canton_or_country TEXT NOT NULL,
      website_or_linkedin TEXT,
      experience_and_network TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      terms_accepted_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_applications_status ON affiliate_applications (status);

    CREATE TABLE IF NOT EXISTS affiliate_leads (
      id TEXT PRIMARY KEY,
      affiliate_id TEXT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
      client_name TEXT NOT NULL,
      client_company TEXT,
      client_email TEXT,
      client_phone TEXT,
      service_interest TEXT,
      estimated_deal_size REAL,
      status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'in_progress', 'won', 'lost', 'expired')),
      registered_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_leads_affiliate ON affiliate_leads (affiliate_id);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON affiliate_leads (status);
    CREATE INDEX IF NOT EXISTS idx_leads_expires ON affiliate_leads (expires_at);

    CREATE TABLE IF NOT EXISTS referral_customers (
      id TEXT PRIMARY KEY,
      affiliate_id TEXT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
      client_name TEXT NOT NULL,
      client_company TEXT,
      client_email TEXT,
      first_contract_at TEXT NOT NULL,
      is_recurring INTEGER NOT NULL DEFAULT 0,
      recurring_months_paid INTEGER NOT NULL DEFAULT 0,
      recurring_extended_by_admin INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'churned')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_customers_affiliate ON referral_customers (affiliate_id);

    CREATE TABLE IF NOT EXISTS affiliate_payouts (
      id TEXT PRIMARY KEY,
      affiliate_id TEXT NOT NULL REFERENCES affiliates(id) ON DELETE RESTRICT,
      period_month TEXT NOT NULL,
      total_commissions REAL NOT NULL DEFAULT 0,
      deductions REAL NOT NULL DEFAULT 0,
      net_payable REAL NOT NULL DEFAULT 0,
      vat_amount REAL NOT NULL DEFAULT 0,
      gross_invoice_amount REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'CHF',
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'statement_sent', 'invoice_received', 'paid', 'cancelled')),
      agent_invoice_number TEXT,
      agent_invoice_date TEXT,
      payment_due_date TEXT,
      payment_method TEXT,
      payment_reference TEXT,
      statement_sent_at TEXT,
      paid_at TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_payouts_affiliate ON affiliate_payouts (affiliate_id);
    CREATE INDEX IF NOT EXISTS idx_payouts_period ON affiliate_payouts (period_month);
    CREATE INDEX IF NOT EXISTS idx_payouts_status ON affiliate_payouts (status);

    CREATE TABLE IF NOT EXISTS referral_sales (
      id TEXT PRIMARY KEY,
      affiliate_id TEXT NOT NULL REFERENCES affiliates(id) ON DELETE RESTRICT,
      customer_id TEXT REFERENCES referral_customers(id) ON DELETE SET NULL,
      invoice_number TEXT NOT NULL,
      contract_title TEXT NOT NULL,
      sale_type TEXT NOT NULL CHECK (sale_type IN ('one_off', 'recurring')),
      gross_amount REAL NOT NULL,
      vat_amount REAL NOT NULL DEFAULT 0,
      discounts_amount REAL NOT NULL DEFAULT 0,
      third_party_costs REAL NOT NULL DEFAULT 0,
      net_amount REAL NOT NULL,
      commission_rate REAL NOT NULL DEFAULT 0.20,
      commission REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'CHF',
      is_renewal INTEGER NOT NULL DEFAULT 0,
      recurring_month_number INTEGER,
      extended_by_admin INTEGER NOT NULL DEFAULT 0,
      contract_concluded INTEGER NOT NULL DEFAULT 1,
      service_delivered INTEGER NOT NULL DEFAULT 1,
      collected_at TEXT,
      payout_id TEXT REFERENCES affiliate_payouts(id) ON DELETE SET NULL,
      paid INTEGER NOT NULL DEFAULT 0,
      paid_at TEXT,
      is_reversed INTEGER NOT NULL DEFAULT 0,
      reversed_reason TEXT,
      reversed_at TEXT,
      reversal_compensated_payout_id TEXT REFERENCES affiliate_payouts(id) ON DELETE SET NULL,
      package_group_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sales_affiliate ON referral_sales (affiliate_id);
    CREATE INDEX IF NOT EXISTS idx_sales_payout ON referral_sales (payout_id);
    CREATE INDEX IF NOT EXISTS idx_sales_collected ON referral_sales (collected_at);
    CREATE INDEX IF NOT EXISTS idx_sales_paid ON referral_sales (paid);
    CREATE INDEX IF NOT EXISTS idx_sales_reversed ON referral_sales (is_reversed);
  `);

  sqliteDb = db;
  return sqliteDb;
}
