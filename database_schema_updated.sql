-- Enable Row Level Security
alter table if exists public.profiles enable row level security;
alter table if exists public.study_groups enable row level security;
alter table if exists public.group_members enable row level security;
alter table if exists public.tags enable row level security;

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  name text not null,
  course text not null,
  year_level text not null,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create social_contacts table (NEW)
create table if not exists public.social_contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  platform text not null check (platform in ('WhatsApp', 'Instagram', 'Facebook', 'Messenger')),
  username text not null,
  url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, platform, username)
);

-- Create study_groups table
create table if not exists public.study_groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  subject text not null,
  description text not null,
  frequency text not null,
  platform text not null,
  schedule text not null,
  max_members integer not null default 10,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create group_members table
create table if not exists public.group_members (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.study_groups(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(group_id, user_id)
);

-- Create tags table
create table if not exists public.tags (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  group_id uuid references public.study_groups(id) on delete cascade not null
);

-- Enable RLS for social_contacts
alter table public.social_contacts enable row level security;

-- Row Level Security Policies

-- Profiles: Users can read all profiles, but only update their own
create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Social Contacts: Users can read all, but only manage their own
create policy "Social contacts are viewable by everyone" on public.social_contacts
  for select using (true);

create policy "Users can manage own social contacts" on public.social_contacts
  for all using (auth.uid() = user_id);

-- Study Groups: Everyone can read, only authenticated users can create
create policy "Study groups are viewable by everyone" on public.study_groups
  for select using (true);

create policy "Authenticated users can create study groups" on public.study_groups
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update own study groups" on public.study_groups
  for update using (auth.uid() = creator_id);

create policy "Users can delete own study groups" on public.study_groups
  for delete using (auth.uid() = creator_id);

-- Group Members: Users can see all members, join groups, and leave groups
create policy "Group members are viewable by everyone" on public.group_members
  for select using (true);

create policy "Authenticated users can join groups" on public.group_members
  for insert with check (auth.role() = 'authenticated');

create policy "Users can leave groups" on public.group_members
  for delete using (auth.uid() = user_id);

-- Tags: Everyone can read, only group creators can manage
create policy "Tags are viewable by everyone" on public.tags
  for select using (true);

create policy "Group creators can manage tags" on public.tags
  for all using (
    auth.uid() in (
      select creator_id from public.study_groups where id = group_id
    )
  );

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at before update on public.study_groups
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at_social_contacts before update on public.social_contacts
  for each row execute function public.handle_updated_at();

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, course, year_level)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', 'New User'),
    coalesce(new.raw_user_meta_data->>'course', ''),
    coalesce(new.raw_user_meta_data->>'yearLevel', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
