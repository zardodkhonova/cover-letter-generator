-- Supabase schema for authenticated user drafts and cover letters.
create table if not exists public.cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  full_name text not null default '',
  email text not null default '',
  job_title text not null default '',
  company_name text not null default '',
  tone text not null default 'Professional',
  template_id text not null default 'general',
  job_description text not null default '',
  letter_text text not null default '',
  opening text not null default '',
  body text not null default '',
  closing text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cover_letters_user_idx on public.cover_letters(user_id);
create index if not exists cover_letters_updated_idx on public.cover_letters(updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_cover_letters_updated_at on public.cover_letters;
create trigger trg_cover_letters_updated_at
before update on public.cover_letters
for each row execute function public.set_updated_at();
