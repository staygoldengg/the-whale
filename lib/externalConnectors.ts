import type { AiIndexItem } from './types';

const createdAt = '2026-07-06T00:00:00.000Z';

export type ExternalConnector = {
  id: string;
  name: string;
  category: 'Vocabulary' | 'Reading' | 'Daily Operations' | 'Communication' | 'Documents' | 'Calendar' | 'Roster' | 'Automation';
  status: 'ready' | 'configured' | 'needs_credentials' | 'manual_review';
  sourceUrl?: string;
  description: string;
  recommendedUse: string;
  syncModes: Array<'manual' | 'copy_paste' | 'csv' | 'browser_extension' | 'oauth' | 'webhook' | 'scheduled_job'>;
  safetyRules: string[];
};

export const externalConnectors: ExternalConnector[] = [
  {
    id: 'brightwheel-companion',
    name: 'Brightwheel Companion Bridge',
    category: 'Roster',
    status: 'ready',
    description: 'Imports visible roster, report, or billing data from Brightwheel browser session into review batches.',
    recommendedUse: 'Use for roster imports and copy-ready parent messages. Require admin review before integration.',
    syncModes: ['browser_extension', 'csv', 'manual'],
    safetyRules: ['Import only center-authorized data.', 'Show preview and redaction before sending.', 'Store as review batches.', 'Never scrape credentials.']
  },
  {
    id: 'google-docs-drive',
    name: 'Google Docs + Drive',
    category: 'Documents',
    status: 'needs_credentials',
    description: 'Exports lesson plans, parent drafts, and staff notes into shared Google Docs/Drive folders.',
    recommendedUse: 'Use OAuth to create documents in school-controlled folders with version history.',
    syncModes: ['oauth', 'manual'],
    safetyRules: ['Never export unapproved drafts by default.', 'Share only with intended staff.', 'Keep review ID attached to exports.']
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    category: 'Calendar',
    status: 'needs_credentials',
    description: 'Creates calendar reminders for field trips, closures, meetings, and planning checkpoints.',
    recommendedUse: 'Use for school-wide events after admin approval.',
    syncModes: ['oauth', 'scheduled_job'],
    safetyRules: ['Validate title/date/time.', 'Flag conflicts with closure days.', 'Audit every created event.']
  },
  {
    id: 'gmail-staff-email',
    name: 'Gmail Staff Email',
    category: 'Communication',
    status: 'needs_credentials',
    description: 'Drafts staff emails and newsletters in Gmail (draft-first, no auto-send).',
    recommendedUse: 'Use draft-first so admins review recipient list and tone.',
    syncModes: ['oauth', 'manual'],
    safetyRules: ['Default to draft creation.', 'Require approval for broad distribution.', 'Validate names and attachments.']
  },
  {
    id: 'excellent-esl-school-vocabulary',
    name: 'ESL School Vocabulary Connector',
    category: 'Vocabulary',
    status: 'ready',
    sourceUrl: 'https://www.excellentesl4u.com/esl-school-vocabulary.html',
    description: 'Curated school vocabulary with pronunciation, flashcards, and exercises.',
    recommendedUse: 'Use as inspiration for ESL-friendly language and vocabulary activities.',
    syncModes: ['manual'],
    safetyRules: ['Do not mirror copyrighted pages.', 'Store curated terms and teacher activities.', 'Link to source where appropriate.']
  },
  {
    id: 'starfall-books',
    name: 'Starfall Books Connector',
    category: 'Reading',
    status: 'ready',
    sourceUrl: 'https://teach.starfall.com/books',
    description: 'Book discovery with phonics alignment and early literacy planning.',
    recommendedUse: 'Recommend reading resources and guide to external books.',
    syncModes: ['manual'],
    safetyRules: ['Do not copy full PDFs.', 'Store metadata, links, and teacher prompts.', 'Require teacher review before use.']
  }
];

export const connectorIndexItems: AiIndexItem[] = externalConnectors.map((conn) => ({
  id: `connector-${conn.id}`,
  title: `Integration: ${conn.name}`,
  category: 'School Culture',
  content: `${conn.description} Recommended use: ${conn.recommendedUse} Safety rules: ${conn.safetyRules.join('; ')}`,
  tags: [conn.category.toLowerCase(), 'integration'],
  age_group: 'Staff',
  approved: true,
  created_by: null,
  created_at: createdAt,
}));

export function getConnectorByStatus(status: ExternalConnector['status']): ExternalConnector[] {
  return externalConnectors.filter((c) => c.status === status);
}
