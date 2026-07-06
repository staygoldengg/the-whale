import { supabaseAdmin } from './supabaseAdmin';
import { HttpError } from './api';

export type DashboardRole = 'admin' | 'teacher' | 'staff';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function inSevenDaysISO() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

export async function getAdminCommandCenter() {
  const today = todayISO();
  const weekEnd = inSevenDaysISO();

  const [staff, schedules, reviews, polls, updates, events, resources, tasks, training, notifications] = await Promise.all([
    supabaseAdmin.from('staff_profiles').select('*').eq('active', true).order('full_name'),
    supabaseAdmin.from('schedules').select('*').gte('date', today).lte('date', weekEnd).order('date').order('start_time'),
    supabaseAdmin.from('content_reviews').select('*').in('status', ['draft', 'needs_review', 'blocked']).order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('polls').select('*').eq('active', true).order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('live_updates').select('*').order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('school_events').select('*').gte('event_date', today).lte('event_date', weekEnd).order('event_date').limit(20),
    supabaseAdmin.from('resource_library_items').select('*').eq('status', 'pending_review').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('ops_tasks').select('*').in('status', ['open', 'in_progress', 'blocked']).order('due_date', { ascending: true }).limit(30),
    supabaseAdmin.from('staff_development_items').select('*').lte('due_date', weekEnd).order('due_date', { ascending: true }).limit(20),
    supabaseAdmin.from('notifications').select('*').eq('resolved', false).order('created_at', { ascending: false }).limit(20)
  ]);

  const responses = [staff, schedules, reviews, polls, updates, events, resources, tasks, training, notifications];
  const failed = responses.find((r) => r.error);
  if (failed?.error) throw new HttpError(500, failed.error.message, 'COMMAND_CENTER_FAILED');

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      activeStaff: staff.data?.length ?? 0,
      schedulesThisWeek: schedules.data?.length ?? 0,
      pendingReviews: reviews.data?.length ?? 0,
      activePolls: polls.data?.length ?? 0,
      upcomingEvents: events.data?.length ?? 0,
      pendingResources: resources.data?.length ?? 0,
      openTasks: tasks.data?.length ?? 0,
      trainingDueSoon: training.data?.length ?? 0,
      unresolvedNotifications: notifications.data?.length ?? 0
    },
    staff: staff.data ?? [],
    schedules: schedules.data ?? [],
    reviews: reviews.data ?? [],
    polls: polls.data ?? [],
    updates: updates.data ?? [],
    events: events.data ?? [],
    pendingResources: resources.data ?? [],
    tasks: tasks.data ?? [],
    trainingDue: training.data ?? [],
    notifications: notifications.data ?? []
  };
}

export async function getTeacherWorkspace(input: { userEmail?: string | null; classroom?: string | null }) {
  const today = todayISO();
  const classroom = input.classroom ?? null;
  let scheduleQuery = supabaseAdmin.from('schedules').select('*').eq('date', today).order('start_time');
  if (classroom) scheduleQuery = scheduleQuery.eq('classroom', classroom);

  const [profile, schedules, plans, updates, events, resources, tasks, notifications] = await Promise.all([
    input.userEmail ? supabaseAdmin.from('staff_profiles').select('*').eq('email', input.userEmail).maybeSingle() : Promise.resolve({ data: null, error: null } as any),
    scheduleQuery,
    classroom ? supabaseAdmin.from('lesson_plans').select('*').eq('classroom', classroom).order('created_at', { ascending: false }).limit(5) : supabaseAdmin.from('lesson_plans').select('*').order('created_at', { ascending: false }).limit(5),
    supabaseAdmin.from('live_updates').select('*').order('created_at', { ascending: false }).limit(8),
    supabaseAdmin.from('school_events').select('*').gte('event_date', today).order('event_date').limit(10),
    supabaseAdmin.from('resource_library_items').select('*').eq('status', 'approved').order('updated_at', { ascending: false }).limit(12),
    supabaseAdmin.from('ops_tasks').select('*').in('status', ['open', 'in_progress']).order('due_date', { ascending: true }).limit(12),
    supabaseAdmin.from('notifications').select('*').eq('resolved', false).order('created_at', { ascending: false }).limit(12)
  ]);

  const responses = [profile, schedules, plans, updates, events, resources, tasks, notifications];
  const failed = responses.find((r) => r.error);
  if (failed?.error) throw new HttpError(500, failed.error.message, 'TEACHER_WORKSPACE_FAILED');

  return {
    generatedAt: new Date().toISOString(),
    staffProfile: profile.data ?? null,
    classroom,
    todaySchedule: schedules.data ?? [],
    recentLessonPlans: plans.data ?? [],
    liveUpdates: updates.data ?? [],
    upcomingEvents: events.data ?? [],
    resources: resources.data ?? [],
    tasks: tasks.data ?? [],
    notifications: notifications.data ?? []
  };
}

export async function recordAnalyticsEvent(input: { actorId?: string | null; eventName: string; entityType?: string; entityId?: string; metadata?: Record<string, unknown> }) {
  const { error } = await supabaseAdmin.from('analytics_events').insert({
    actor_id: input.actorId ?? null,
    event_name: input.eventName,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    metadata: input.metadata ?? {}
  });
  if (error) throw new HttpError(500, error.message, 'ANALYTICS_EVENT_FAILED');
}

export async function getAnalyticsSummary() {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceIso = since.toISOString();
  const [events, reviews, lessonPlans, resources, feedback] = await Promise.all([
    supabaseAdmin.from('analytics_events').select('*').gte('created_at', sinceIso).order('created_at', { ascending: false }).limit(500),
    supabaseAdmin.from('content_reviews').select('status, content_type, created_at').gte('created_at', sinceIso).limit(500),
    supabaseAdmin.from('lesson_plans').select('classroom, age_group, theme, created_at').gte('created_at', sinceIso).limit(500),
    supabaseAdmin.from('resource_library_items').select('category, status, created_at').gte('created_at', sinceIso).limit(500),
    supabaseAdmin.from('staff_feedback').select('feedback_type, status, created_at').gte('created_at', sinceIso).limit(500)
  ]);
  const responses = [events, reviews, lessonPlans, resources, feedback];
  const failed = responses.find((r) => r.error);
  if (failed?.error) throw new HttpError(500, failed.error.message, 'ANALYTICS_SUMMARY_FAILED');

  return {
    windowDays: 30,
    generatedAt: new Date().toISOString(),
    events: events.data ?? [],
    counts: {
      analyticsEvents: events.data?.length ?? 0,
      contentReviews: reviews.data?.length ?? 0,
      lessonPlans: lessonPlans.data?.length ?? 0,
      resources: resources.data?.length ?? 0,
      feedbackItems: feedback.data?.length ?? 0,
      approvedReviews: (reviews.data ?? []).filter((r: any) => r.status === 'approved').length,
      pendingResources: (resources.data ?? []).filter((r: any) => r.status === 'pending_review').length,
      openFeedback: (feedback.data ?? []).filter((r: any) => r.status === 'open').length
    },
    reviews: reviews.data ?? [],
    lessonPlans: lessonPlans.data ?? [],
    resources: resources.data ?? [],
    feedback: feedback.data ?? []
  };
}
