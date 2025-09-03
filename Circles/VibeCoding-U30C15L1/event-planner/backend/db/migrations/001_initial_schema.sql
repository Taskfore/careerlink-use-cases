-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table to store user information
create table if not exists users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security for users table
alter table users enable row level security;

-- Events table to store event information
create table if not exists events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  location text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  is_public boolean default true,
  category text,
  max_attendees integer,
  created_by uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint end_time_after_start_time check (end_time > start_time)
);

-- Enable Row Level Security for events table
alter table events enable row level security;

-- RSVPs table to track event attendance
create table if not exists rsvps (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text check (status in ('going', 'not_going', 'maybe')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(event_id, user_id)
);

-- Enable Row Level Security for rsvps table
alter table rsvps enable row level security;

-- Indexes for better query performance
create index if not exists idx_events_created_by on events(created_by);
create index if not exists idx_events_start_time on events(start_time);
create index if not exists idx_rsvps_event_id on rsvps(event_id);
create index if not exists idx_rsvps_user_id on rsvps(user_id);

-- Function to automatically update the updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

-- Triggers to update updated_at columns
create or replace trigger update_users_updated_at
before update on users
for each row
execute function update_updated_at_column();

create or replace trigger update_events_updated_at
before update on events
for each row
execute function update_updated_at_column();

create or replace trigger update_rsvps_updated_at
before update on rsvps
for each row
execute function update_updated_at_column();
