-- RLS Policies for users table
-- Users can view all users (for user search/listing)
create policy "Users can view all users"
on users for select
to authenticated
using (true);

-- Users can update their own profile
create policy "Users can update their own profile"
on users for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- RLS Policies for events table
-- Anyone can view public events
create policy "Public events are viewable by everyone"
on events for select
to anon, authenticated
using (is_public = true);

-- Authenticated users can view their own events (public or private)
create policy "Users can view their own events"
on events for select
to authenticated
using (auth.uid() = created_by);

-- Authenticated users can create events
create policy "Users can create events"
on events for insert
to authenticated
with check (auth.uid() = created_by);

-- Users can update their own events
create policy "Users can update their own events"
on events for update
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

-- Users can delete their own events
create policy "Users can delete their own events"
on events for delete
to authenticated
using (auth.uid() = created_by);

-- RLS Policies for rsvps table
-- Users can view RSVPs for events they can see
create policy "Users can view RSVPs for events they can see"
on rsvps for select
to authenticated
using (
  exists (
    select 1 from events 
    where events.id = rsvps.event_id 
    and (events.is_public = true or events.created_by = auth.uid())
  )
  or auth.uid() = user_id
);

-- Users can create/update their own RSVPs
create policy "Users can manage their own RSVPs"
on rsvps for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Event creators can delete RSVPs for their events
create policy "Event creators can delete RSVPs for their events"
on rsvps for delete
to authenticated
using (
  exists (
    select 1 from events 
    where events.id = rsvps.event_id 
    and events.created_by = auth.uid()
  )
);

-- Create a function to check if a user is attending an event
create or replace function is_attending(event_id uuid, user_id uuid)
returns boolean as $$
  select exists (
    select 1 from rsvps 
    where rsvps.event_id = $1 
    and rsvps.user_id = $2 
    and status = 'going'
  );
$$ language sql security definer;
