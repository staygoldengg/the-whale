import { BarChart3, Bell, BookOpen, Brain, CalendarDays, ClipboardCheck, ClipboardList, Database, GraduationCap, Library, Mail, MessageCircle, Palette, Radio, Send, Smartphone, Sparkles, TrendingUp, UserRoundCog, Users, Vote, Lightbulb, Settings } from 'lucide-react';
import { WhaleCard } from '@/components/WhaleCard';

const cards = [
  ['Admin Command Center', 'Admin-first control room for approvals, coverage, alerts, resources, staff feedback, training, and weekly operations.', '/dashboard/admin-command-center', BarChart3],
  ['Teacher Workspace', 'Teacher-first daily view with schedule, lesson plans, updates, resources, and classroom reminders.', '/dashboard/teacher-workspace', GraduationCap],
  ['Guided Lesson Planner', 'Build School Brain-informed weekly lesson plans with quality scoring and saved review data.', '/dashboard/lesson-planner', BookOpen],
  ['Generate Theme Week', 'Build daily activities, slogans, prep lists, parent blurbs, and classroom ideas.', '/dashboard/theme-week', Sparkles],
  ['Theme Analysis', 'Compare a current theme week approach against goals and past examples to sharpen it.', '/dashboard/theme-analysis', TrendingUp],
  ['Coloring Pages', 'Create safe printable prompt packs for thick-outline preschool coloring pages.', '/dashboard/coloring-pages', Palette],
  ['Weekly Plans', 'Create Monday-Friday plans with circle time, art, movement, SEL, and parent notes.', '/dashboard/weekly-plan', CalendarDays],
  ['Parent Messages', 'Generate Brightwheel-ready parent communication in multiple tones.', '/dashboard/parent-messages', MessageCircle],
  ['Brightwheel Companion', 'Format daily updates, reminders, and newsletters into copy-ready Brightwheel text.', '/dashboard/brightwheel-companion', Smartphone],
  ['Anonymous Polls', 'Collect staff feedback without storing responder identity.', '/dashboard/polls', Vote],
  ['Staff Feedback', 'Collect suggestions, concerns, appreciation, training requests, supply requests, and classroom improvement ideas.', '/dashboard/staff-feedback', MessageCircle],
  ['Team Emails', 'Draft staff emails, reminders, and short follow-ups.', '/dashboard/team-email', Mail],
  ['Schedules', 'Manage weekly staff classroom schedules.', '/dashboard/schedules', ClipboardList],
  ['Live Updates', 'Post general, weather, event, reminder, and drill updates.', '/dashboard/live-updates', Radio],
  ['School Brain', 'Search the central knowledge engine every Whale tool consults before generating content.', '/dashboard/school-brain', Brain],
  ['Ops Console', 'Production control center for School Brain, Brightwheel companion mode, reviews, and admin safety checks.', '/dashboard/ops-console', Database],
  ['Ops Review', 'Check spelling, staff references, pronouns, privacy, tone, and Brightwheel formatting before sending.', '/dashboard/ops-review', ClipboardCheck],
  ['Staff Profiles', 'Store correct names, pronouns, classrooms, tone preferences, and career goals as the source of truth.', '/dashboard/staff-profiles', Users],
  ['Career Path Builder', 'Generate employee-specific coaching, certification, and growth instructions.', '/dashboard/career-path', UserRoundCog],
  ['Resource Library', 'Approve classroom-tested materials and feed them back into the School Brain.', '/dashboard/resource-library', Library],
  ['Notification Center', 'View unresolved reminders, approvals, and school operations alerts.', '/dashboard/notification-center', Bell],
  ['Analytics', 'Track adoption, reviews, lesson plans, resources, feedback, and time-saving signals.', '/dashboard/analytics', BarChart3],
  ['AI Index Library', 'Grow the school answer library from approved staff practices.', '/dashboard/ai-index', Send],
  ['Teacher Tips', 'Dedicated tab with 30 rotating recommendations to keep teachers engaged and productive.', '/dashboard/teacher-tips', Lightbulb],
  ['Settings', 'Adjust font size, text color, calm music volume, and subscription plan.', '/dashboard/settings', Settings]
] as const;

import DashboardHome from './dashboard-home';

export default function DashboardPage() {
  return (
    <>
      <DashboardHome />
      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([title, description, href, Icon]) => <WhaleCard key={href} title={title} description={description} href={href} icon={Icon} />)}
      </section>
    </>
  );
}
