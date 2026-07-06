export type DashboardShortcut = {
  id: string;
  title: string;
  href: string;
};

export const dashboardShortcuts: DashboardShortcut[] = [
  { id: 'weekly-plan', title: 'Weekly Plan', href: '/dashboard/weekly-plan' },
  { id: 'theme-week', title: 'Theme Week', href: '/dashboard/theme-week' },
  { id: 'parent-messages', title: 'Parent Messages', href: '/dashboard/parent-messages' },
  { id: 'teacher-tips', title: 'Teacher Tips', href: '/dashboard/teacher-tips' },
  { id: 'brightwheel-companion', title: 'Brightwheel Companion', href: '/dashboard/brightwheel-companion' },
  { id: 'ai-index', title: 'AI Index', href: '/dashboard/ai-index' },
  { id: 'ops-review', title: 'Ops Review', href: '/dashboard/ops-review' },
  { id: 'settings', title: 'Settings', href: '/dashboard/settings' }
];
