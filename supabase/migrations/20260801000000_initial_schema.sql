-- Enable required extensions
create extension if not exists pgcrypto;

-- Create custom enum types
create type public.app_role as enum ('admin', 'viewer');
create type public.competition_type as enum ('report', 'photo', 'passport');
create type public.submission_status as enum (
  'new', 'under_review', 'accepted', 'rejected', 'completed', 'pending_receipt', 'received'
);

-- Profiles table (linked to auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'viewer',
  created_at timestamptz not null default now()
);

-- Universities table
create table public.universities (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null unique,
  name_en text,
  slug text not null unique,
  logo_path text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Submissions table
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique default upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 10)),
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null check (char_length(phone) between 7 and 30),
  university_id uuid references public.universities(id) on delete restrict,
  university_other_name text check (university_other_name is null or char_length(university_other_name) between 2 and 150),
  competition_type public.competition_type not null,
  drive_url text,
  submitter_role text,
  passport_delivered boolean not null default false,
  terms_accepted_at timestamptz not null,
  photo_single_item_confirmed boolean not null default false,
  read_at timestamptz,
  read_by uuid references auth.users(id),
  status public.submission_status not null default 'new',
  receipt_confirmed_at timestamptz,
  receipt_confirmed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint one_university_source check (
    (university_id is not null and university_other_name is null) or
    (university_id is null and university_other_name is not null)
  ),
  constraint competition_payload check (
    (competition_type in ('report','photo') and drive_url is not null and passport_delivered = false)
    or
    (competition_type = 'passport' and drive_url is null and passport_delivered = true)
  ),
  constraint photo_affirmation check (
    (competition_type = 'photo' and photo_single_item_confirmed = true) or
    (competition_type <> 'photo' and photo_single_item_confirmed = false)
  ),
  constraint receipt_only_for_passport check (
    (competition_type = 'passport') or
    (receipt_confirmed_at is null and receipt_confirmed_by is null)
  )
);

-- Audit log for submissions
create table public.submission_activity (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  actor_id uuid references auth.users(id),
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Optional app settings table
create table public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- Performance Indexes
create index submissions_created_at_idx on public.submissions (created_at desc) where deleted_at is null;
create index submissions_competition_idx on public.submissions (competition_type) where deleted_at is null;
create index submissions_university_idx on public.submissions (university_id) where deleted_at is null;
create index submissions_status_idx on public.submissions (status) where deleted_at is null;
create index activity_submission_idx on public.submission_activity (submission_id, created_at desc);

-- Helper function: Is Admin Check
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Touch updated_at trigger function
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

create trigger universities_touch before update on public.universities for each row execute function public.touch_updated_at();
create trigger submissions_touch before update on public.submissions for each row execute function public.touch_updated_at();

-- Auto-create profile trigger on auth.users signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'viewer')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.universities enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_activity enable row level security;
alter table public.app_settings enable row level security;

-- Profiles Policies
create policy "users read own profile or admins read all" on public.profiles
  for select to authenticated using (auth.uid() = id or public.is_admin());
create policy "admins manage profiles" on public.profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Universities Policies
create policy "public reads active universities" on public.universities
  for select to anon, authenticated using (is_active = true or public.is_admin());
create policy "admins manage universities" on public.universities
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Submissions Policies (NO ANON INSERT allowed directly, submissions go through Server Action / API with Service Role)
create policy "admins read submissions" on public.submissions
  for select to authenticated using (public.is_admin());
create policy "admins update submissions" on public.submissions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins insert submissions" on public.submissions
  for insert to authenticated with check (public.is_admin());

-- Activity Policies
create policy "admins read activity" on public.submission_activity
  for select to authenticated using (public.is_admin());
create policy "admins write activity" on public.submission_activity
  for insert to authenticated with check (public.is_admin());

-- App Settings Policies
create policy "public reads settings" on public.app_settings
  for select to anon, authenticated using (true);
create policy "admins manage settings" on public.app_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
