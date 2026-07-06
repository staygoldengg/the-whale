-- Use this AFTER your first admin signs up with email auth.
-- Replace the email below, then run in Supabase SQL Editor.
update public.profiles
set role = 'admin', full_name = coalesce(nullif(full_name, ''), 'The Whale Admin')
where email = 'YOUR_ADMIN_EMAIL@example.com';

select id, email, full_name, role
from public.profiles
where email = 'YOUR_ADMIN_EMAIL@example.com';
