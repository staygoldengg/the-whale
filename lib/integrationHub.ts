import { externalConnectors, type ExternalConnector } from './externalConnectors';

export type IntegrationAction = {
  id: string;
  connectorId: string;
  title: string;
  description: string;
  actionType: 'import' | 'export' | 'draft' | 'schedule' | 'review' | 'link';
  endpoint?: string;
  requiredRole: 'admin' | 'teacher' | 'staff';
  defaultStatus: 'available' | 'needs_setup' | 'review_first';
};

export const integrationActions: IntegrationAction[] = [
  {
    id: 'brightwheel-import-visible-table',
    connectorId: 'brightwheel-companion',
    title: 'Import Brightwheel roster/reports',
    description: 'Use browser extension to preview, redact, and send roster/report tables into review queue.',
    actionType: 'import',
    endpoint: '/api/brightwheel/ingest',
    requiredRole: 'admin',
    defaultStatus: 'review_first'
  },
  {
    id: 'brightwheel-copy-parent-message',
    connectorId: 'brightwheel-companion',
    title: 'Copy message to Brightwheel',
    description: 'Generate a message, run preflight checks, copy into Brightwheel manually.',
    actionType: 'review',
    endpoint: '/dashboard/brightwheel-companion',
    requiredRole: 'teacher',
    defaultStatus: 'review_first'
  },
  {
    id: 'google-docs-export-plan',
    connectorId: 'google-docs-drive',
    title: 'Export lesson plan to Google Docs',
    description: 'Send approved lesson plans into school Drive with review metadata.',
    actionType: 'export',
    endpoint: '/api/google/docs',
    requiredRole: 'teacher',
    defaultStatus: 'needs_setup'
  },
  {
    id: 'google-calendar-field-trip',
    connectorId: 'google-calendar',
    title: 'Create calendar reminders',
    description: 'Add field trips, closures, events, and staff reminders to Google Calendar.',
    actionType: 'schedule',
    endpoint: '/api/integrations/calendar-action',
    requiredRole: 'admin',
    defaultStatus: 'needs_setup'
  },
  {
    id: 'gmail-create-staff-draft',
    connectorId: 'gmail-staff-email',
    title: 'Create Gmail staff email draft',
    description: 'Generate staff emails as drafts for admin review before sending.',
    actionType: 'draft',
    endpoint: '/api/integrations/gmail-draft',
    requiredRole: 'admin',
    defaultStatus: 'needs_setup'
  },
  {
    id: 'esl-vocabulary-pack',
    connectorId: 'excellent-esl-school-vocabulary',
    title: 'Build vocabulary mini-pack',
    description: 'Create ESL-friendly vocabulary cards and activity prompts.',
    actionType: 'review',
    endpoint: '/api/integrations/vocabulary-pack',
    requiredRole: 'teacher',
    defaultStatus: 'available'
  },
  {
    id: 'starfall-book-planner',
    connectorId: 'starfall-books',
    title: 'Plan around book resources',
    description: 'Create book-aligned literacy prompts and link to external resources.',
    actionType: 'link',
    endpoint: '/api/integrations/reading-pack',
    requiredRole: 'teacher',
    defaultStatus: 'available'
  }
];

export function getIntegrationHub() {
  return externalConnectors.map((connector: ExternalConnector) => ({
    ...connector,
    actions: integrationActions.filter((action) => action.connectorId === connector.id)
  }));
}

export function buildIntegrationChecklist() {
  return [
    'Connect Supabase and run migration for integration schema.',
    'Create admin-owned Google OAuth credentials for Docs/Drive/Calendar/Gmail.',
    'Install Brightwheel Bridge extension only for authorized admins.',
    'Keep imported data in review batches until admin approval.',
    'Use vocabulary and reading connectors for metadata/linking, not wholesale mirroring.'
  ];
}
