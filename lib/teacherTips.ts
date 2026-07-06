export type TeacherTip = {
  id: string;
  title: string;
  detail: string;
  href: string;
  cta: string;
};

export const teacherTips: TeacherTip[] = [
  { id: 'tip-01', title: 'Start with a weekly map', detail: 'Use one generated weekly plan as your baseline, then customize by day.', href: '/dashboard/weekly-plan', cta: 'Open weekly planner' },
  { id: 'tip-02', title: 'Keep parent notes short', detail: 'One key classroom win and one action item keeps messages clear and warm.', href: '/dashboard/parent-messages', cta: 'Draft parent message' },
  { id: 'tip-03', title: 'Rotate movement blocks', detail: 'Alternate active and calm activities to support preschool attention spans.', href: '/dashboard/theme-week', cta: 'Build theme week' },
  { id: 'tip-04', title: 'Use index-backed phrasing', detail: 'Store effective wording in AI Index so future drafts stay consistent.', href: '/dashboard/ai-index', cta: 'Update AI Index' },
  { id: 'tip-05', title: 'Run safety review before sending', detail: 'Check names, pronouns, and tone before any family communication goes out.', href: '/dashboard/ops-review', cta: 'Run review' },
  { id: 'tip-06', title: 'Batch your team emails', detail: 'Generate reminders in one session to reduce decision fatigue.', href: '/dashboard/team-email', cta: 'Create team email' },
  { id: 'tip-07', title: 'Keep lesson goals measurable', detail: 'Use one observable outcome per block so reflection is easier later.', href: '/dashboard/lesson-planner', cta: 'Open lesson planner' },
  { id: 'tip-08', title: 'Preview readability', detail: 'Read content aloud once before posting to catch confusing phrasing.', href: '/dashboard/brightwheel-companion', cta: 'Format for Brightwheel' },
  { id: 'tip-09', title: 'Save reusable templates', detail: 'When a message works well, save it to reduce rewriting next week.', href: '/dashboard/resource-library', cta: 'Open resources' },
  { id: 'tip-10', title: 'Use prompts with classroom context', detail: 'Include age group and constraints so AI responses are more relevant.', href: '/dashboard/theme-analysis', cta: 'Analyze theme' },
  { id: 'tip-11', title: 'Keep families in the loop early', detail: 'Send prep reminders 2-3 days before events to increase participation.', href: '/dashboard/parent-messages', cta: 'Draft reminder' },
  { id: 'tip-12', title: 'Pair art with literacy', detail: 'Add a letter or vocabulary focus to each art prompt.', href: '/dashboard/coloring-pages', cta: 'Create coloring prompts' },
  { id: 'tip-13', title: 'Use polls for low-friction feedback', detail: 'Quick anonymous polls reveal issues before they become urgent.', href: '/dashboard/polls', cta: 'Create poll' },
  { id: 'tip-14', title: 'Track recurring schedule pain points', detail: 'If a staffing conflict repeats, convert it into a checklist item.', href: '/dashboard/schedules', cta: 'Review schedules' },
  { id: 'tip-15', title: 'Celebrate small wins in updates', detail: 'A short positive highlight improves parent trust and engagement.', href: '/dashboard/live-updates', cta: 'Post update' },
  { id: 'tip-16', title: 'Write for scanability', detail: 'Keep each paragraph to 1-2 lines for mobile-friendly reading.', href: '/dashboard/brightwheel-companion', cta: 'Format message' },
  { id: 'tip-17', title: 'Archive high-performing content', detail: 'Save top-performing messages as examples for future staff training.', href: '/dashboard/resource-library', cta: 'Save resource' },
  { id: 'tip-18', title: 'Set one theme anchor each week', detail: 'A single anchor concept improves consistency across activities.', href: '/dashboard/theme-week', cta: 'Plan theme anchor' },
  { id: 'tip-19', title: 'Use staff profiles before feedback', detail: 'Reference preferred names and goals to make feedback more useful.', href: '/dashboard/staff-profiles', cta: 'Open profiles' },
  { id: 'tip-20', title: 'Review trend data monthly', detail: 'A monthly analytics check helps tune workloads and priorities.', href: '/dashboard/analytics', cta: 'View analytics' },
  { id: 'tip-21', title: 'Use reminders with specific dates', detail: 'Date-based reminders reduce missed actions for families and staff.', href: '/dashboard/live-updates', cta: 'Add dated reminder' },
  { id: 'tip-22', title: 'Create role-ready scripts', detail: 'Prepare short scripts for transitions and routine moments.', href: '/dashboard/team-email', cta: 'Draft scripts' },
  { id: 'tip-23', title: 'Map content to age milestones', detail: 'Link activities to developmental milestones for stronger planning.', href: '/dashboard/lesson-planner', cta: 'Update milestones' },
  { id: 'tip-24', title: 'Use concise prep lists', detail: 'Keep prep lists under 8 items to stay practical on busy days.', href: '/dashboard/theme-week', cta: 'Generate prep list' },
  { id: 'tip-25', title: 'Keep celebration language inclusive', detail: 'Use inclusive phrasing and alternatives for family traditions.', href: '/dashboard/ops-review', cta: 'Check wording' },
  { id: 'tip-26', title: 'Store policy phrases in School Brain', detail: 'Add policy-safe language so AI can reuse approved phrasing.', href: '/dashboard/school-brain', cta: 'Open School Brain' },
  { id: 'tip-27', title: 'Reduce context switching', detail: 'Group writing tasks and run one combined review session.', href: '/dashboard/ops-console', cta: 'Open ops console' },
  { id: 'tip-28', title: 'Share gratitude with specifics', detail: 'Specific recognition increases team morale and retention.', href: '/dashboard/staff-feedback', cta: 'Share feedback' },
  { id: 'tip-29', title: 'Track career growth signals', detail: 'Document training, certificates, and goals with point tracking.', href: '/dashboard/teacher-tips', cta: 'Open growth tips' },
  { id: 'tip-30', title: 'Use settings for focus comfort', detail: 'Adjust font size, text color, and sound volume for your workflow.', href: '/dashboard/settings', cta: 'Open settings' }
];
