-- Kreativalab (www.kreativalab.ch) — Gestione Agenti / Affiliati a Commissione (CO 418a segg.)
-- PostgreSQL / Supabase Migration + RLS Policies + Indici + Trigger First-Touch
-- Valuta: CHF | Commissione default: 20% su netto incassato | Soglia payout: CHF 50.00 | Lead: 90gg

create extension if not exists pgcrypto;

-- 1. Helper updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. Table: affiliates
create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_name text,
  email text not null unique,
  phone text,
  code text not null unique,
  commission_rate numeric(5,4) not null default 0.2000 check (commission_rate >= 0 and commission_rate <= 1),
  status text not null default 'pending_approval' check (status in ('active', 'disabled', 'pending_approval')),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  iban text,
  avs_idi_number text,
  is_vat_registered boolean not null default false,
  vat_number text,
  address text,
  city text,
  postal_code text,
  canton text,
  terms_accepted_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint affiliates_vat_number_required check (
    (is_vat_registered = false) or (vat_number is not null and length(trim(vat_number)) > 0)
  )
);

create index if not exists idx_affiliates_email on public.affiliates (lower(email));
create index if not exists idx_affiliates_code on public.affiliates (upper(code));
create index if not exists idx_affiliates_auth_user_id on public.affiliates (auth_user_id);

drop trigger if exists trg_affiliates_updated_at on public.affiliates;
create trigger trg_affiliates_updated_at
  before update on public.affiliates
  for each row execute function public.set_updated_at();

-- 3. Table: affiliate_applications
create table if not exists public.affiliate_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company_name text,
  canton_or_country text not null,
  website_or_linkedin text,
  experience_and_network text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  terms_accepted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_affiliate_applications_status on public.affiliate_applications (status);
create index if not exists idx_affiliate_applications_email on public.affiliate_applications (lower(email));

drop trigger if exists trg_affiliate_applications_updated_at on public.affiliate_applications;
create trigger trg_affiliate_applications_updated_at
  before update on public.affiliate_applications
  for each row execute function public.set_updated_at();

-- 4. Table: affiliate_leads (90-day exclusivity + first-touch deduplication)
create table if not exists public.affiliate_leads (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  client_name text not null,
  client_company text,
  client_email text,
  client_phone text,
  service_interest text,
  estimated_deal_size numeric(12,2) check (estimated_deal_size is null or estimated_deal_size >= 0),
  status text not null default 'registered' check (status in ('registered', 'in_progress', 'won', 'lost', 'expired')),
  registered_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '90 days'),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_affiliate_leads_affiliate_id on public.affiliate_leads (affiliate_id);
create index if not exists idx_affiliate_leads_status on public.affiliate_leads (status);
create index if not exists idx_affiliate_leads_expires_at on public.affiliate_leads (expires_at);
create index if not exists idx_affiliate_leads_email_norm on public.affiliate_leads (lower(trim(client_email))) where client_email is not null;
create index if not exists idx_affiliate_leads_phone_norm on public.affiliate_leads (regexp_replace(client_phone, '[^0-9+]', '', 'g')) where client_phone is not null;

-- Enforce first-touch exclusivity at database level for active non-expired leads
create or replace function public.enforce_lead_first_touch()
returns trigger
language plpgsql
as $$
declare
  norm_email text := nullif(lower(trim(coalesce(new.client_email, ''))), '');
  norm_phone text := nullif(regexp_replace(coalesce(new.client_phone, ''), '[^0-9]', '', 'g'), '');
  norm_company text := nullif(lower(trim(coalesce(new.client_company, ''))), '');
  conflict_id uuid;
begin
  if new.status in ('lost', 'expired') then
    return new;
  end if;

  if norm_email is not null then
    select id into conflict_id
    from public.affiliate_leads
    where id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
      and lower(trim(coalesce(client_email, ''))) = norm_email
      and status in ('registered', 'in_progress', 'won')
      and (status = 'won' or expires_at > now())
    limit 1;
    if conflict_id is not null then
      raise exception 'Lead duplicato (first-touch): contatto email già registrato ed esclusivo (90gg).' using errcode = '23505';
    end if;
  end if;

  if norm_phone is not null and length(norm_phone) >= 7 then
    select id into conflict_id
    from public.affiliate_leads
    where id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
      and regexp_replace(coalesce(client_phone, ''), '[^0-9]', '', 'g') = norm_phone
      and status in ('registered', 'in_progress', 'won')
      and (status = 'won' or expires_at > now())
    limit 1;
    if conflict_id is not null then
      raise exception 'Lead duplicato (first-touch): numero di telefono già registrato ed esclusivo (90gg).' using errcode = '23505';
    end if;
  end if;

  if norm_company is not null and norm_email is null and norm_phone is null then
    select id into conflict_id
    from public.affiliate_leads
    where id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
      and lower(trim(coalesce(client_company, ''))) = norm_company
      and status in ('registered', 'in_progress', 'won')
      and (status = 'won' or expires_at > now())
    limit 1;
    if conflict_id is not null then
      raise exception 'Lead duplicato (first-touch): azienda già registrata ed esclusiva (90gg).' using errcode = '23505';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_affiliate_leads_first_touch on public.affiliate_leads;
create trigger trg_affiliate_leads_first_touch
  before insert or update on public.affiliate_leads
  for each row execute function public.enforce_lead_first_touch();

drop trigger if exists trg_affiliate_leads_updated_at on public.affiliate_leads;
create trigger trg_affiliate_leads_updated_at
  before update on public.affiliate_leads
  for each row execute function public.set_updated_at();

-- 5. Table: referral_customers
create table if not exists public.referral_customers (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  client_name text not null,
  client_company text,
  client_email text,
  first_contract_at timestamptz not null default now(),
  is_recurring boolean not null default false,
  recurring_months_paid integer not null default 0 check (recurring_months_paid >= 0),
  recurring_extended_by_admin boolean not null default false,
  status text not null default 'active' check (status in ('active', 'paused', 'churned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_referral_customers_affiliate_id on public.referral_customers (affiliate_id);

drop trigger if exists trg_referral_customers_updated_at on public.referral_customers;
create trigger trg_referral_customers_updated_at
  before update on public.referral_customers
  for each row execute function public.set_updated_at();

-- 6. Table: affiliate_payouts (Created BEFORE referral_sales for FK reference)
create table if not exists public.affiliate_payouts (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete restrict,
  period_month text not null check (period_month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  total_commissions numeric(12,2) not null default 0,
  deductions numeric(12,2) not null default 0 check (deductions >= 0),
  net_payable numeric(12,2) not null default 0,
  vat_amount numeric(12,2) not null default 0 check (vat_amount >= 0),
  gross_invoice_amount numeric(12,2) not null default 0,
  currency text not null default 'CHF' check (currency = 'CHF'),
  status text not null default 'draft' check (status in ('draft', 'statement_sent', 'invoice_received', 'paid', 'cancelled')),
  agent_invoice_number text,
  agent_invoice_date date,
  payment_due_date date,
  payment_method text,
  payment_reference text,
  statement_sent_at timestamptz,
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_affiliate_payouts_affiliate_id on public.affiliate_payouts (affiliate_id);
create index if not exists idx_affiliate_payouts_period_month on public.affiliate_payouts (period_month);
create index if not exists idx_affiliate_payouts_status on public.affiliate_payouts (status);

drop trigger if exists trg_affiliate_payouts_updated_at on public.affiliate_payouts;
create trigger trg_affiliate_payouts_updated_at
  before update on public.affiliate_payouts
  for each row execute function public.set_updated_at();

-- 7. Table: referral_sales
create table if not exists public.referral_sales (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete restrict,
  customer_id uuid references public.referral_customers(id) on delete set null,
  invoice_number text not null,
  contract_title text not null,
  sale_type text not null check (sale_type in ('one_off', 'recurring')),
  gross_amount numeric(12,2) not null check (gross_amount >= 0),
  vat_amount numeric(12,2) not null default 0 check (vat_amount >= 0),
  discounts_amount numeric(12,2) not null default 0 check (discounts_amount >= 0),
  third_party_costs numeric(12,2) not null default 0 check (third_party_costs >= 0),
  net_amount numeric(12,2) not null check (net_amount >= 0),
  commission_rate numeric(5,4) not null default 0.2000 check (commission_rate >= 0 and commission_rate <= 1),
  commission numeric(12,2) not null default 0,
  currency text not null default 'CHF' check (currency = 'CHF'),
  is_renewal boolean not null default false,
  recurring_month_number integer check (recurring_month_number is null or recurring_month_number >= 1),
  extended_by_admin boolean not null default false,
  contract_concluded boolean not null default true,
  service_delivered boolean not null default true,
  collected_at timestamptz,
  payout_id uuid references public.affiliate_payouts(id) on delete set null,
  paid boolean not null default false,
  paid_at timestamptz,
  is_reversed boolean not null default false,
  reversed_reason text,
  reversed_at timestamptz,
  reversal_compensated_payout_id uuid references public.affiliate_payouts(id) on delete set null,
  package_group_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint referral_sales_reversal_reason check (
    (is_reversed = false) or (reversed_reason is not null and length(trim(reversed_reason)) > 0)
  )
);

create index if not exists idx_referral_sales_affiliate_id on public.referral_sales (affiliate_id);
create index if not exists idx_referral_sales_payout_id on public.referral_sales (payout_id);
create index if not exists idx_referral_sales_collected_at on public.referral_sales (collected_at);
create index if not exists idx_referral_sales_paid on public.referral_sales (paid);
create index if not exists idx_referral_sales_is_reversed on public.referral_sales (is_reversed);

-- Enforce CO 418a server-side calculation on insert/update
create or replace function public.compute_referral_sale_commission()
returns trigger
language plpgsql
as $$
begin
  new.net_amount := greatest(
    0,
    round(coalesce(new.gross_amount, 0) - coalesce(new.vat_amount, 0) - coalesce(new.discounts_amount, 0) - coalesce(new.third_party_costs, 0), 2)
  );

  if not new.contract_concluded or not new.service_delivered or new.collected_at is null then
    new.commission := 0;
  elsif new.sale_type = 'recurring' and coalesce(new.recurring_month_number, 0) > 12 and not new.extended_by_admin then
    new.commission := 0;
  else
    new.commission := round(new.net_amount * new.commission_rate, 2);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_referral_sales_compute on public.referral_sales;
create trigger trg_referral_sales_compute
  before insert or update on public.referral_sales
  for each row execute function public.compute_referral_sale_commission();

drop trigger if exists trg_referral_sales_updated_at on public.referral_sales;
create trigger trg_referral_sales_updated_at
  before update on public.referral_sales
  for each row execute function public.set_updated_at();

-- 8. Row Level Security (RLS) Helpers & Policies
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    nullif(auth.jwt() -> 'app_metadata' ->> 'role', ''),
    nullif(auth.jwt() -> 'user_metadata' ->> 'role', ''),
    ''
  ) = 'admin';
$$;

create or replace function public.current_affiliate_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.affiliates where auth_user_id = auth.uid() limit 1;
$$;

alter table public.affiliates enable row level security;
alter table public.affiliate_applications enable row level security;
alter table public.affiliate_leads enable row level security;
alter table public.referral_customers enable row level security;
alter table public.affiliate_payouts enable row level security;
alter table public.referral_sales enable row level security;

-- Policies: affiliates
drop policy if exists affiliates_admin_all on public.affiliates;
create policy affiliates_admin_all on public.affiliates
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists affiliates_self_select on public.affiliates;
create policy affiliates_self_select on public.affiliates
  for select to authenticated
  using (auth_user_id = auth.uid());

drop policy if exists affiliates_self_update on public.affiliates;
create policy affiliates_self_update on public.affiliates
  for update to authenticated
  using (auth_user_id = auth.uid())
  with check (
    auth_user_id = auth.uid()
    and commission_rate = (select commission_rate from public.affiliates a where a.auth_user_id = auth.uid())
    and status = (select status from public.affiliates a where a.auth_user_id = auth.uid())
  );

-- Policies: affiliate_applications (insert pubblico, select/update admin)
drop policy if exists applications_public_insert on public.affiliate_applications;
create policy applications_public_insert on public.affiliate_applications
  for insert to anon, authenticated
  with check (status = 'pending');

drop policy if exists applications_admin_select on public.affiliate_applications;
create policy applications_admin_select on public.affiliate_applications
  for select to authenticated
  using (public.is_admin());

drop policy if exists applications_admin_update on public.affiliate_applications;
create policy applications_admin_update on public.affiliate_applications
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists applications_admin_delete on public.affiliate_applications;
create policy applications_admin_delete on public.affiliate_applications
  for delete to authenticated
  using (public.is_admin());

-- Policies: affiliate_leads
drop policy if exists leads_admin_all on public.affiliate_leads;
create policy leads_admin_all on public.affiliate_leads
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists leads_affiliate_select on public.affiliate_leads;
create policy leads_affiliate_select on public.affiliate_leads
  for select to authenticated
  using (affiliate_id = public.current_affiliate_id());

drop policy if exists leads_affiliate_insert on public.affiliate_leads;
create policy leads_affiliate_insert on public.affiliate_leads
  for insert to authenticated
  with check (affiliate_id = public.current_affiliate_id());

-- Policies: referral_customers
drop policy if exists customers_admin_all on public.referral_customers;
create policy customers_admin_all on public.referral_customers
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists customers_affiliate_select on public.referral_customers;
create policy customers_affiliate_select on public.referral_customers
  for select to authenticated
  using (affiliate_id = public.current_affiliate_id());

-- Policies: affiliate_payouts
drop policy if exists payouts_admin_all on public.affiliate_payouts;
create policy payouts_admin_all on public.affiliate_payouts
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists payouts_affiliate_select on public.affiliate_payouts;
create policy payouts_affiliate_select on public.affiliate_payouts
  for select to authenticated
  using (affiliate_id = public.current_affiliate_id());

drop policy if exists payouts_affiliate_submit_invoice on public.affiliate_payouts;
create policy payouts_affiliate_submit_invoice on public.affiliate_payouts
  for update to authenticated
  using (
    affiliate_id = public.current_affiliate_id()
    and status in ('statement_sent', 'invoice_received')
  )
  with check (
    affiliate_id = public.current_affiliate_id()
    and status = 'invoice_received'
  );

-- Policies: referral_sales
drop policy if exists sales_admin_all on public.referral_sales;
create policy sales_admin_all on public.referral_sales
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists sales_affiliate_select on public.referral_sales;
create policy sales_affiliate_select on public.referral_sales
  for select to authenticated
  using (affiliate_id = public.current_affiliate_id());
