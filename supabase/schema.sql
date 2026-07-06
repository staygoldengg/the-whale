create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'staff' check (role in ('admin','teacher','staff')),
  created_at timestamptz not null default now()
);

create table if not exists public.ai_index_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  content text not null,
  tags text[] default '{}',
  age_group text,
  approved boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(title, category)
);

create table if not exists public.theme_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  theme_name text,
  age_group text,
  input jsonb not null default '{}',
  output jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.coloring_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  theme text,
  prompt text not null,
  worksheet_title text,
  skill_focus text,
  created_at timestamptz not null default now()
);

create table if not exists public.parent_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  class_name text,
  message_type text,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  poll_type text not null check (poll_type in ('multiple_choice','short_answer','rating','yes_no')),
  options jsonb not null default '[]',
  created_by uuid references public.profiles(id) on delete set null,
  anonymous boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.poll_responses (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  response jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  staff_name text not null,
  role text,
  classroom text,
  date date not null,
  start_time time not null,
  end_time time not null,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.live_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  update_type text not null default 'general',
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''), 'staff')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.ai_index_items enable row level security;
alter table public.theme_generations enable row level security;
alter table public.coloring_prompts enable row level security;
alter table public.parent_messages enable row level security;
alter table public.polls enable row level security;
alter table public.poll_responses enable row level security;
alter table public.schedules enable row level security;
alter table public.live_updates enable row level security;

create or replace view public.current_user_profile as select * from public.profiles where id = auth.uid();

create policy "profiles read own" on public.profiles for select using (id = auth.uid());
create policy "profiles admin read" on public.profiles for select using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "profiles admin update" on public.profiles for update using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "approved index readable" on public.ai_index_items for select using (approved = true or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "admin index insert" on public.ai_index_items for insert with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "admin index update" on public.ai_index_items for update using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "own generations readable" on public.theme_generations for select using (user_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "own coloring readable" on public.coloring_prompts for select using (user_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "own messages readable" on public.parent_messages for select using (user_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "polls readable" on public.polls for select using (true);
create policy "polls admin write" on public.polls for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "anonymous poll response insert" on public.poll_responses for insert with check (exists(select 1 from public.polls po where po.id = poll_id and po.active = true));
create policy "poll response admin read" on public.poll_responses for select using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "schedules readable" on public.schedules for select using (true);
create policy "schedules admin write" on public.schedules for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "updates readable" on public.live_updates for select using (true);
create policy "updates admin write" on public.live_updates for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create index if not exists idx_ai_index_category on public.ai_index_items(category);
create index if not exists idx_ai_index_tags on public.ai_index_items using gin(tags);
create index if not exists idx_schedules_date on public.schedules(date);
create index if not exists idx_updates_created_at on public.live_updates(created_at desc);

-- v0.2 Operations Safety Layer
create table if not exists public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  preferred_name text,
  email text unique,
  role_title text,
  classroom text,
  pronouns text,
  gender_reference text,
  career_goal text,
  strengths text[] default '{}',
  growth_areas text[] default '{}',
  certifications text[] default '{}',
  tone_preference text,
  do_not_say text[] default '{}',
  notes text,
  active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  content_type text not null default 'general',
  original_content text not null,
  brightwheel_ready_content text not null,
  issues jsonb not null default '[]',
  status text not null default 'needs_review' check (status in ('draft','needs_review','approved','blocked','copied_to_brightwheel','exported_to_google_docs')),
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.google_doc_exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  review_id uuid references public.content_reviews(id) on delete set null,
  title text not null,
  document_id text,
  url text,
  configured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.staff_profiles enable row level security;
alter table public.content_reviews enable row level security;
alter table public.google_doc_exports enable row level security;

create policy "staff profiles readable" on public.staff_profiles for select using (true);
create policy "staff profiles admin write" on public.staff_profiles for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "content reviews own or admin read" on public.content_reviews for select using (user_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "content reviews own insert" on public.content_reviews for insert with check (user_id = auth.uid());
create policy "content reviews admin update" on public.content_reviews for update using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "doc exports own or admin read" on public.google_doc_exports for select using (user_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "doc exports own insert" on public.google_doc_exports for insert with check (user_id = auth.uid());

create index if not exists idx_staff_profiles_classroom on public.staff_profiles(classroom);
create index if not exists idx_staff_profiles_email on public.staff_profiles(email);
create index if not exists idx_content_reviews_status on public.content_reviews(status);
create index if not exists idx_doc_exports_created_at on public.google_doc_exports(created_at desc);

insert into public.ai_index_items (title, category, content, tags, age_group)
values
('Staff name verification rule', 'Staff Profiles', 'Before any parent message or team email is finalized, confirm staff name spelling against the staff profile source of truth. If unsure, use role title instead of guessing.', array['ops','names','review'], 'Staff'),
('Pronoun-safe staff reference rule', 'Staff Profiles', 'Use the pronouns and gender reference stored in the staff profile. If missing, rewrite using the staff member’s name or role title instead of assuming gender.', array['ops','pronouns','review'], 'Staff'),
('Brightwheel companion formatting rule', 'Parent Messages', 'Brightwheel copy should be short, warm, direct, and action-oriented. Use greeting, key update, parent action if needed, and warm closing. Do not claim automatic Brightwheel sync.', array['brightwheel','parent-message'], 'Any'),
('Employee career path coaching format', 'Staff Career Paths', 'Career path instructions should include current role, desired role, strengths to keep using, growth areas, certifications or training steps, one-week action plan, and a 30-day checkpoint.', array['career','staff-development'], 'Staff'),
('Google Docs export rule', 'Staff Emails', 'Long plans, weekly packets, career path notes, and admin reports should be exported to Google Docs. Brightwheel should receive the short parent-facing summary only.', array['google-docs','export'], 'Staff')
on conflict (title, category) do update set content = excluded.content, tags = excluded.tags, age_group = excluded.age_group;

-- v1.0 Production Operations Layer
create table if not exists public.classrooms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  age_group text,
  lead_teacher text,
  daily_rhythm jsonb not null default '{}',
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.school_procedures (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  content text not null,
  approved boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(title, category)
);

create table if not exists public.school_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  start_time time,
  end_time time,
  audience text default 'staff',
  description text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.brightwheel_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  message_type text not null,
  template text not null,
  checklist jsonb not null default '[]',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.classrooms enable row level security;
alter table public.school_procedures enable row level security;
alter table public.school_events enable row level security;
alter table public.brightwheel_templates enable row level security;
alter table public.audit_logs enable row level security;

create policy "classrooms readable" on public.classrooms for select using (true);
create policy "classrooms admin write" on public.classrooms for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "procedures readable" on public.school_procedures for select using (approved = true or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "procedures admin write" on public.school_procedures for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "events readable" on public.school_events for select using (true);
create policy "events admin write" on public.school_events for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "brightwheel templates readable" on public.brightwheel_templates for select using (active = true or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "brightwheel templates admin write" on public.brightwheel_templates for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "audit admin read" on public.audit_logs for select using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "audit system insert" on public.audit_logs for insert with check (true);

create index if not exists idx_classrooms_name on public.classrooms(name);
create index if not exists idx_procedures_category on public.school_procedures(category);
create index if not exists idx_events_date on public.school_events(event_date);
create index if not exists idx_audit_created_at on public.audit_logs(created_at desc);

insert into public.classrooms (name, age_group, lead_teacher, daily_rhythm, notes) values
('Infants', '0-16 months', null, '{"note":"Customize with approved school rhythm."}', 'Default classroom record.'),
('Toddlers', '16-24 months', null, '{"note":"Customize with approved school rhythm."}', 'Default classroom record.'),
('Twos', '2 years', null, '{"note":"Customize with approved school rhythm."}', 'Default classroom record.'),
('Preschool', '3-4 years', null, '{"note":"Customize with approved school rhythm."}', 'Default classroom record.'),
('Pre-K', '4-5 years', null, '{"note":"Customize with approved school rhythm."}', 'Default classroom record.')
on conflict (name) do nothing;

insert into public.brightwheel_templates (name, message_type, template, checklist) values
('Daily Update', 'parent_update', 'Hello families,\n\nToday we focused on [theme/activity]. The children practiced [skill] and enjoyed [activity].\n\nReminder: [parent action if any].\n\nThank you!', '["Confirm classroom", "Confirm date", "Remove private child details"]'),
('Supply Request', 'parent_update', 'Hello families,\n\nOur classroom could use [supplies] for [purpose/date]. If you are able to send any in, we appreciate your support.\n\nThank you!', '["Confirm item", "Confirm date", "Keep tone optional"]'),
('Schedule Change', 'parent_update', 'Hello families,\n\nPlease note that [schedule item] will change on [date/time]. [Short reason or instruction].\n\nThank you for your flexibility.', '["Confirm exact date", "Confirm exact time", "Admin approval"]'),
('Weekly Newsletter', 'newsletter', 'Hello families,\n\nThis week our theme is [theme]. We will explore [topics] through art, music, stories, movement, and classroom play.\n\nKey reminders: [reminders].\n\nThank you!', '["Confirm theme", "Confirm reminders", "Keep preschool-safe"]')
on conflict (name) do update set template = excluded.template, checklist = excluded.checklist;

insert into public.school_procedures (title, category, content) values
('No fake Brightwheel sync', 'Integrations', 'The Whale works alongside Brightwheel. Unless an official integration is configured, staff should use copy-ready text, CSV import/export, or manual review workflows.'),
('Google Docs export purpose', 'Integrations', 'Long weekly plans, staff development notes, and admin reports should be exported to Google Docs. Parent-facing short updates should be copied into Brightwheel after review.'),
('Staff profile source of truth', 'Operations Safety', 'Use staff_profiles for employee names, preferred names, pronouns, classroom, tone preference, do-not-say notes, and career path instructions before generating messages.'),
('Preflight before sending', 'Operations Safety', 'Any parent-facing or staff-wide communication should pass validation for name spelling, pronouns, dates, classroom, privacy, tone, and length before being copied or exported.')
on conflict (title, category) do update set content = excluded.content;

-- v2.0 Administrator + Teacher Optimization Layer
create table if not exists public.lesson_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  classroom text not null,
  age_group text not null,
  theme text not null,
  week_of date,
  developmental_goals text[] default '{}',
  materials text[] default '{}',
  plan jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft','needs_review','approved','exported_to_google_docs','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resource_library_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  age_group text,
  content text not null,
  tags text[] default '{}',
  status text not null default 'pending_review' check (status in ('pending_review','approved','rejected','archived')),
  submitted_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_feedback (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid references public.profiles(id) on delete set null,
  feedback_type text not null check (feedback_type in ('suggestion','concern','appreciation','training_request','supply_request','classroom_improvement')),
  classroom text,
  title text not null,
  body text not null,
  anonymous boolean not null default true,
  status text not null default 'open' check (status in ('open','reviewing','resolved','archived')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ops_tasks (
  id uuid primary key default gen_random_uuid(),
  task_title text not null,
  description text,
  owner_id uuid references public.profiles(id) on delete set null,
  classroom text,
  due_date date,
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  status text not null default 'open' check (status in ('open','in_progress','blocked','done','archived')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_development_items (
  id uuid primary key default gen_random_uuid(),
  staff_profile_id uuid references public.staff_profiles(id) on delete cascade,
  staff_name text,
  item_type text not null default 'training',
  item_title text not null,
  description text,
  due_date date,
  completed_at timestamptz,
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed','waived','archived')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience_role text not null default 'all' check (audience_role in ('admin','teacher','staff','all')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  action_url text,
  resolved boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  event_name text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.lesson_plans enable row level security;
alter table public.resource_library_items enable row level security;
alter table public.staff_feedback enable row level security;
alter table public.ops_tasks enable row level security;
alter table public.staff_development_items enable row level security;
alter table public.notifications enable row level security;
alter table public.analytics_events enable row level security;

create policy "lesson plans own or admin read" on public.lesson_plans for select using (user_id = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "lesson plans teacher insert" on public.lesson_plans for insert with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','teacher')));
create policy "lesson plans admin update" on public.lesson_plans for update using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "approved resources readable" on public.resource_library_items for select using (status = 'approved' or submitted_by = auth.uid() or exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "resources teacher insert" on public.resource_library_items for insert with check (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','teacher')));
create policy "resources admin update" on public.resource_library_items for update using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "feedback admin read" on public.staff_feedback for select using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "feedback staff insert" on public.staff_feedback for insert with check (true);
create policy "feedback admin update" on public.staff_feedback for update using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "tasks visible to staff" on public.ops_tasks for select using (true);
create policy "tasks admin write" on public.ops_tasks for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "development admin read" on public.staff_development_items for select using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "development admin write" on public.staff_development_items for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "notifications role read" on public.notifications for select using (audience_role = 'all' or exists(select 1 from public.profiles p where p.id = auth.uid() and (p.role = audience_role or p.role = 'admin')));
create policy "notifications admin write" on public.notifications for all using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "analytics admin read" on public.analytics_events for select using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "analytics insert" on public.analytics_events for insert with check (true);

create index if not exists idx_lesson_plans_classroom_week on public.lesson_plans(classroom, week_of desc);
create index if not exists idx_resources_status_category on public.resource_library_items(status, category);
create index if not exists idx_feedback_status_type on public.staff_feedback(status, feedback_type);
create index if not exists idx_ops_tasks_status_due on public.ops_tasks(status, due_date);
create index if not exists idx_development_due on public.staff_development_items(due_date, status);
create index if not exists idx_notifications_unresolved on public.notifications(resolved, priority, created_at desc);
create index if not exists idx_analytics_event_name on public.analytics_events(event_name, created_at desc);

insert into public.resource_library_items (title, category, age_group, content, tags, status)
values
('AI privacy first teacher rule', 'AI Governance', 'Staff', 'Never enter personally identifiable student information unless the school has explicitly approved the workflow and safeguards. The teacher remains the professional decision-maker.', array['privacy','teacher-training','ai'], 'approved'),
('Context-first AI planning rule', 'AI Foundations', 'Staff', 'AI outputs improve when staff provide role, classroom, learner age, learning goal, tone, and school-specific context. Missing context is a common cause of mistakes.', array['context','prompting','teacher-training'], 'approved'),
('Governance review loop', 'AI Governance', 'Staff', 'AI workflows should include clear responsibility, review, correction mechanisms, standardized evaluation, and feedback loops for continuous improvement.', array['governance','review','admin'], 'approved'),
('Brightwheel retention workflow', 'Platform Strategy', 'Staff', 'Brightwheel remains the communication platform. The Whale creates reviewed, copy-ready parent messages and stores longer weekly plans in Google Docs.', array['brightwheel','google-docs','retention'], 'approved')
on conflict do nothing;

insert into public.notifications (title, body, audience_role, priority, action_url)
values
('Review pending AI content', 'Admin should review drafts before they are copied into Brightwheel or exported to Google Docs.', 'admin', 'normal', '/dashboard/ops-review'),
('Add staff profiles', 'Complete staff source-of-truth profiles so The Whale can avoid name, pronoun, classroom, and career-path mistakes.', 'admin', 'high', '/dashboard/staff-profiles'),
('Teacher workspace is available', 'Teachers can use the daily workspace for schedule, updates, lesson plans, resources, and parent-message prep.', 'teacher', 'normal', '/dashboard/teacher-workspace')
on conflict do nothing;

insert into public.ops_tasks (task_title, description, priority, status)
values
('Complete first admin review workflow', 'Test draft → review → approved → copied to Brightwheel/exported to Google Docs.', 'high', 'open'),
('Populate School Brain procedures', 'Add handbook, classroom procedures, emergency procedures, and parent communication standards.', 'high', 'open'),
('Seed staff development records', 'Add required training, certifications, and career-path milestones for staff.', 'normal', 'open')
on conflict do nothing;
