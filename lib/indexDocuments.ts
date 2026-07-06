import type { AiIndexItem } from './types';

/**
 * Custom document templates for adding to AI index.
 * Add new documents here to expand AI knowledge base without API calls.
 * 
 * Each document becomes searchable context for all AI generation tools.
 */

export const customIndexDocuments: AiIndexItem[] = [
  // Example: uncomment and modify to add your own documents
  /*
  {
    id: 'custom-doc-001',
    title: 'Your Document Title',
    category: 'School Culture', // Must match existing categories
    content: 'Your content here. Be specific and detailed.',
    tags: ['tag1', 'tag2'],
    age_group: 'Pre-K',
    approved: true,
    created_by: null,
    created_at: new Date().toISOString(),
  },
  */
];

/**
 * How to add documents:
 * 
 * 1. Add entries to customIndexDocuments array above
 * 2. Use category from: 'Theme Weeks', 'Classroom Activities', 'Slogans', 
 *    'School Culture', 'Parent Messages', 'Staff Emails', 'SEL Activities',
 *    'Coloring Page Prompts', 'Staff Career Paths', 'Safety Updates', 
 *    'Staff Profiles', 'Schedule Notes'
 * 3. Age groups: 'Pre-K', 'Age 2', 'Age 3', 'Mixed preschool', 'Staff', 'Any'
 * 4. Save this file - documents will auto-load in AI context
 * 
 * Example Document:
 * {
 *   id: 'wds-handbook-2026-001',
 *   title: 'Transition Strategies from Handbook',
 *   category: 'School Culture',
 *   content: 'Smooth transitions happen with 5-minute warnings, visual schedules, 
 *            and consistent closure activities. Use transitions to teach time awareness.',
 *   tags: ['transitions', 'classroom-management', 'daily-routine'],
 *   age_group: 'Pre-K',
 *   approved: true,
 *   created_by: null,
 *   created_at: new Date().toISOString(),
 * }
 */
