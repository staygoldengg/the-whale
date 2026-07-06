import type { AiIndexItem, WhaleTool } from './types';

export type PromptAutofillOption = {
  id: string;
  label: string;
  values: Record<string, string>;
};

const staticCreatedAt = '2026-01-01T00:00:00.000Z';

export const appBaseIndexItems: AiIndexItem[] = [
  {
    id: 'app-index-01',
    title: 'Warm family communication structure',
    category: 'Parent Messages',
    content: 'Use greeting, classroom highlight, specific reminder, and warm sign-off for every family note.',
    tags: ['parents', 'tone', 'communication'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-02',
    title: 'Weekly plan rhythm',
    category: 'Classroom Activities',
    content: 'Start week with community-building, place high-focus tasks midweek, and end with reflection and celebration.',
    tags: ['weekly-plan', 'routine', 'planning'],
    age_group: 'Pre-K',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-03',
    title: 'Preschool-safe prompt policy',
    category: 'School Culture',
    content: 'Avoid medical, legal, or disciplinary claims. Keep language age-appropriate and privacy-safe for children and staff.',
    tags: ['safety', 'policy'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-04',
    title: 'Theme week quality checklist',
    category: 'Theme Weeks',
    content: 'Each theme week should include literacy, movement, SEL, parent engagement, and prep list clarity.',
    tags: ['theme-week', 'checklist'],
    age_group: 'Mixed preschool',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-05',
    title: 'Coloring page clarity rules',
    category: 'Coloring Page Prompts',
    content: 'Use bold outlines, low detail density, positive expressions, and one clear skill target.',
    tags: ['coloring', 'fine-motor'],
    age_group: 'Age 3',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-06',
    title: 'Staff email structure',
    category: 'Staff Emails',
    content: 'State purpose in first line, include bullet actions with dates, and close with support-oriented tone.',
    tags: ['staff', 'email', 'operations'],
    age_group: 'Staff',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-07',
    title: 'Career path coaching cadence',
    category: 'Staff Career Paths',
    content: 'Use strengths, growth targets, certifications, weekly action, and 30-day checkpoint format.',
    tags: ['career', 'coaching'],
    age_group: 'Staff',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-08',
    title: 'Prompt grounding standard',
    category: 'Slogans',
    content: 'All prompts should include goal, audience, constraints, tone, and one example output style.',
    tags: ['prompting', 'quality'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
];

const sharedAutofill: PromptAutofillOption[] = [
  { id: 'auto-01', label: 'Ocean Friendship Week', values: { theme: 'Ocean Friendship Week', ageGroup: 'Pre-K', tone: 'Warm and playful', learningGoals: 'Friendship, turn-taking, ocean vocabulary', details: 'Families are invited to share one ocean book title.', goals: 'Increase family engagement and literacy tie-ins' } },
  { id: 'auto-02', label: 'Community Helpers Week', values: { theme: 'Community Helpers', ageGroup: 'Mixed preschool', tone: 'Professional', goals: 'Better transitions and role-play routines', details: 'Guest reader from local community on Thursday.' } },
  { id: 'auto-03', label: 'Color & Shapes Focus', values: { theme: 'Colors and Shapes', ageGroup: 'Age 3', skillFocus: 'Shapes', learningGoals: 'Sorting, matching, descriptive language', mustInclude: 'Large circles, triangles, and squares with friendly classroom objects' } },
  { id: 'auto-04', label: 'Family Event Reminder', values: { messageType: 'Event announcement', className: 'Pre-K', tone: 'Warm', details: 'Family literacy night is Friday at 5:30 PM. Bring a favorite storybook.' } },
  { id: 'auto-05', label: 'Supply Request Draft', values: { messageType: 'Supply request', className: 'Blue Room', tone: 'Extra friendly', details: 'Please send labeled glue sticks and crayons by Wednesday.' } },
  { id: 'auto-06', label: 'Staff Meeting Follow-Up', values: { audience: 'All staff', purpose: 'Staff meeting follow-up', tone: 'Direct', keyPoints: 'Submit classroom goals by Monday; update attendance logs daily; confirm Friday coverage.' } },
  { id: 'auto-07', label: 'Theme Analysis Improve Plan', values: { theme: 'Kindness Week', approach: 'Morning circle, art station, daily affirmation cards', goals: 'More measurable outcomes and stronger family communication', comparison: 'Best practices and prior successful WDS examples' } },
  { id: 'auto-08', label: 'Career Coaching Plan', values: { employeeName: 'Jordan Lee', currentRole: 'Assistant teacher', desiredRole: 'Lead teacher', strengths: 'Parent communication, calm transitions', growthAreas: 'Documentation and classroom pacing', certifications: 'CDA in progress, CPR renewal', tone: 'Encouraging' } },
  { id: 'auto-09', label: 'Printable Coloring Prompt', values: { theme: 'Garden Helpers', ageGroup: 'Age 2', skillFocus: 'Fine motor', mustInclude: 'Big flowers, watering can, smiling whale mascot', avoid: 'Tiny patterns and heavy shading' } },
  { id: 'auto-10', label: 'Weekly Plan Starter', values: { theme: 'All About Me', ageGroup: 'Pre-K', goals: 'Name recognition, emotions, classroom routines', constraints: 'No glitter activities this week', parentNote: 'Encourage families to ask children about their favorite classroom center.' } },
];

export function getAutofillOptionsForTool(_tool: WhaleTool): PromptAutofillOption[] {
  return sharedAutofill;
}
