-- BetterDesk V4 production schema (Postgres / Supabase). STATUS: BLOCKED — written, NOT applied.
-- No Supabase project or credentials exist for this repo. Apply only to a verified development
-- project after review. Mirrors lib/domain/types.ts; the DEMO workspace runs the same model in the browser.
--
-- Tenant isolation: every row carries org_id. RLS policies resolve membership from auth.uid(),
-- never from a client-supplied org id. Service-role keys stay server-side only.

create extension if not exists pgcrypto;

create type member_role as enum ('owner', 'sales', 'viewer');
create type stage as enum ('new','qualified','outreach-prepared','contacted','in-conversation','walkthrough-scheduled','proposal','won','lost');
create type run_state as enum ('created','queued','running','waiting-approval','paused','blocked','failed','completed','canceled');
create type draft_approval as enum ('pending','approved','rejected');
create type draft_delivery as enum ('not-sent','sent'); -- 'simulated' exists only in DEMO
create type workspace_mode as enum ('SANDBOX','LIVE');

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mode workspace_mode not null default 'SANDBOX',
  service_area_label text not null default '',
  service_zips text[] not null default '{}',
  services text[] not null default '{}',
  target_categories text[] not null default '{}',
  min_sqft int not null default 0,
  sender_name text, sender_title text, sender_email text, sender_postal_address text,
  -- Sending stays off until sender identity, postal address and a connected mailbox exist.
  outbound_email text not null default 'draft-only' check (outbound_email in ('draft-only','approved-send')),
  constraint send_requires_identity check (outbound_email = 'draft-only' or (sender_name is not null and sender_email is not null and sender_postal_address is not null)),
  created_at timestamptz not null default now()
);

create table organization_members (
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role member_role not null default 'sales',
  primary key (org_id, user_id)
);

create or replace function is_member(o uuid) returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from organization_members m where m.org_id = o and m.user_id = auth.uid()) $$;
create or replace function has_role(o uuid, roles member_role[]) returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from organization_members m where m.org_id = o and m.user_id = auth.uid() and m.role = any(roles)) $$;

create table accounts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null, domain text,
  street text, city text, state text, zip text not null,
  category text, sqft int, sqft_source text,
  status text not null default 'prospect' check (status in ('prospect','customer','excluded')),
  source_kind text not null, source_label text not null, source_retrieved_at timestamptz not null,
  dedupe_key text not null,
  created_at timestamptz not null default now(),
  unique (org_id, dedupe_key)
);
create table contacts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  name text not null, role text, email text,
  email_kind text not null check (email_kind in ('business','personal','none'))
);
create table evidence (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  claim text not null, source_kind text not null, source_label text not null, retrieved_at timestamptz not null,
  flagged text check (flagged in ('withheld-instructions'))
);
create table qualifications (
  account_id uuid primary key references accounts(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  score int not null, coverage int not null, tier text not null,
  criteria jsonb not null, missing text[] not null, recommendation text not null,
  needs_human_review boolean not null, rule_version text not null, evaluated_at timestamptz not null
);
create table opportunities (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  stage stage not null default 'new', owner_id uuid references auth.users(id),
  estimated_monthly numeric, -- an estimate; never reported as revenue
  next_action text not null default '', origin text not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table drafts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  contact_id uuid not null references contacts(id),
  subject text not null, body text not null,
  approval draft_approval not null default 'pending',
  delivery draft_delivery not null default 'not-sent',
  approved_by uuid references auth.users(id), approved_at timestamptz,
  body_hash text, -- approval is bound to the exact text; any edit resets approval to pending
  generator text not null, based_on_evidence uuid[] not null default '{}',
  idempotency_key text unique, -- one external send per approved draft
  created_at timestamptz not null default now(),
  constraint approved_has_person check (approval <> 'approved' or (approved_by is not null and approved_at is not null))
);
create table conversations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  channel text not null check (channel in ('email','web-form')), subject text not null
);
create table messages (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  conversation_id uuid not null references conversations(id) on delete cascade,
  direction text not null check (direction in ('inbound','outbound')),
  sender text not null, body text not null, at timestamptz not null default now(),
  provider_message_id text unique, intent text
);
create table appointments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  starts_at timestamptz not null, ends_at timestamptz not null,
  status text not null check (status in ('proposed','confirmed','canceled')),
  provider_event_id text -- 'confirmed' requires the calendar provider's id
  , constraint confirmed_needs_provider check (status <> 'confirmed' or provider_event_id is not null)
);
create table suppressions (
  org_id uuid not null references organizations(id) on delete cascade,
  value text not null, kind text not null check (kind in ('email','domain')),
  reason text not null, at timestamptz not null default now(),
  primary key (org_id, value)
);
create table scout_runs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  actor_id uuid not null references auth.users(id),
  goal text not null, scope jsonb not null, budget jsonb not null,
  state run_state not null default 'created',
  tasks jsonb not null default '[]', account_ids uuid[] not null default '{}', draft_ids uuid[] not null default '{}',
  errors jsonb not null default '[]', retries int not null default 0,
  created_at timestamptz not null default now(), completed_at timestamptz, summary text
);
-- Append-only audit trail / timeline.
create table events (
  id bigint generated always as identity primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  at timestamptz not null default now(),
  actor_kind text not null, actor_id text not null, actor_name text not null,
  type text not null, account_id uuid references accounts(id) on delete set null, subject_id text,
  summary text not null, data jsonb
);
create or replace function forbid_change() returns trigger language plpgsql as $$ begin raise exception 'events are append-only'; end $$;
create trigger events_append_only before update or delete on events for each row execute function forbid_change();

-- Never draft or send to a suppressed address, enforced in the database as well as the app.
create or replace function block_suppressed() returns trigger language plpgsql as $$
declare e text; begin
  select lower(email) into e from contacts where id = new.contact_id;
  if exists (select 1 from suppressions s where s.org_id = new.org_id and (s.value = e or (s.kind = 'domain' and s.value = split_part(e, '@', 2)))) then
    raise exception 'contact is suppressed';
  end if; return new; end $$;
create trigger drafts_block_suppressed before insert or update of approval, delivery on drafts for each row
  when (new.approval = 'approved' or new.delivery = 'sent' or tg_op = 'INSERT') execute function block_suppressed();

-- Row-level security: members read their org; owners/sales write; viewers read only.
do $$ declare t text; begin
  foreach t in array array['accounts','contacts','evidence','qualifications','opportunities','drafts','conversations','messages','appointments','suppressions','scout_runs','events'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy %I on %I for select using (is_member(org_id))', t || '_read', t);
    execute format('create policy %I on %I for insert with check (has_role(org_id, array[''owner'',''sales'']::member_role[]))', t || '_insert', t);
    if t <> 'events' then
      execute format('create policy %I on %I for update using (has_role(org_id, array[''owner'',''sales'']::member_role[]))', t || '_update', t);
    end if;
  end loop;
end $$;
alter table organizations enable row level security;
create policy org_read on organizations for select using (is_member(id));
create policy org_update on organizations for update using (has_role(id, array['owner']::member_role[]));
alter table organization_members enable row level security;
create policy members_read on organization_members for select using (is_member(org_id));
-- Suppressions can be added by sales but only removed by an owner (and removal should itself be audited).
create policy suppressions_delete on suppressions for delete using (has_role(org_id, array['owner']::member_role[]));
