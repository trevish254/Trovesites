-- Keep a verified, user-facing billing read model in Supabase.
-- Dodo remains the payment authority; the webhook is the only writer.

create table if not exists public.billing_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  dodo_customer_id text,
  dodo_subscription_id text unique,
  dodo_product_id text,
  plan text not null default 'free',
  status text not null default 'free',
  amount numeric(12, 2),
  currency text not null default 'USD',
  interval text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists billing_subscriptions_customer_idx
  on public.billing_subscriptions (dodo_customer_id);

create table if not exists public.billing_invoices (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  dodo_invoice_id text not null unique,
  dodo_subscription_id text,
  amount numeric(12, 2),
  currency text not null default 'USD',
  status text,
  invoice_url text,
  issued_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists billing_invoices_user_idx
  on public.billing_invoices (user_id, issued_at desc);

create table if not exists public.dodo_webhook_events (
  webhook_id text primary key,
  event_type text,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

alter table public.billing_subscriptions enable row level security;
alter table public.billing_invoices enable row level security;
alter table public.dodo_webhook_events enable row level security;

grant select on public.billing_subscriptions, public.billing_invoices to authenticated;

drop policy if exists "Users can view their billing subscription" on public.billing_subscriptions;
create policy "Users can view their billing subscription"
  on public.billing_subscriptions for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can view their billing invoices" on public.billing_invoices;
create policy "Users can view their billing invoices"
  on public.billing_invoices for select to authenticated
  using (auth.uid() = user_id);
