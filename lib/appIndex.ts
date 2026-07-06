import type { AiIndexItem, WhaleTool } from './types';

export type PromptAutofillOption = {
  id: string;
  label: string;
  values: Record<string, string>;
};

const staticCreatedAt = '2026-01-01T00:00:00.000Z';

export const appBaseIndexItems: AiIndexItem[] = [
  // === EARLY CHILDHOOD (Pre-K to K) ===
  {
    id: 'app-index-01',
    title: 'Warm family communication structure',
    category: 'Parent Messages',
    content: 'Use greeting, classroom highlight, specific reminder, and warm sign-off for every family note. Example: "Hi! Today [child name] learned to tie shoes. Please practice at home. Thanks, [teacher]"',
    tags: ['parents', 'tone', 'communication', 'prek-k'],
    age_group: 'Pre-K',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-02',
    title: 'Weekly plan rhythm for younger learners',
    category: 'Classroom Activities',
    content: 'Monday: Community-building circles. Tuesday-Thursday: Skill focus activities. Friday: Reflection, celebration, and movement play.',
    tags: ['weekly-plan', 'routine', 'prek-k'],
    age_group: 'Pre-K',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-03',
    title: 'Preschool-safe communication guidelines',
    category: 'School Culture',
    content: 'Avoid medical, legal, or disciplinary claims. Keep language age-appropriate and privacy-safe for children and staff. Focus on strengths and growth.',
    tags: ['safety', 'policy', 'prek'],
    age_group: 'Pre-K',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-04',
    title: 'Theme week quality checklist',
    category: 'Theme Weeks',
    content: 'Include: literacy (books), movement (dance/play), SEL (emotions), parent engagement (take-home activities), and materials prep. Example themes: Animals, Colors, Seasons, Family.',
    tags: ['theme-week', 'checklist', 'prek-k'],
    age_group: 'Pre-K',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-05',
    title: 'Coloring page design for fine motor',
    category: 'Coloring Page Prompts',
    content: 'Use bold outlines, low detail density, positive/friendly expressions, one skill target (color recognition, shape tracing). Safe for ages 2-4.',
    tags: ['coloring', 'fine-motor', 'prek'],
    age_group: 'Age 3',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },

  // === ELEMENTARY (K-5) ===
  {
    id: 'app-index-06',
    title: 'Elementary literacy integration',
    category: 'Classroom Activities',
    content: 'Connect theme weeks to read-alouds, guided reading, and creative writing. Include phonics/word study reinforcement. Create take-home reading activities for families.',
    tags: ['literacy', 'elementary', 'k-5'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-07',
    title: 'STEAM integration best practices',
    category: 'Theme Weeks',
    content: 'Science: hands-on experiments, observation journals. Tech: coding games, digital tools. Art: open-ended projects. Math: real-world problem-solving. Engineering: design challenges.',
    tags: ['steam', 'elementary', 'k-5'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-08',
    title: 'Social-Emotional Learning (SEL) routine',
    category: 'School Culture',
    content: 'Daily: feelings check-in (morning circle), gratitude practice (closing). Weekly: conflict resolution role-play, empathy discussions. Monthly: reflection on growth.',
    tags: ['sel', 'social-emotional', 'elementary'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-09',
    title: 'Parent engagement strategies K-5',
    category: 'Parent Messages',
    content: 'Weekly update on learning goals. Monthly: send-home activity packets. Invitations for classroom visits. Photos/video of learning in action. Recognition of home learning contributions.',
    tags: ['parents', 'engagement', 'elementary'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },

  // === MIDDLE SCHOOL (6-8) ===
  {
    id: 'app-index-10',
    title: 'Middle school social-emotional focus',
    category: 'School Culture',
    content: 'Adolescent development: identity, peer relationships, independence. Include: identity exploration activities, peer-led discussions, mentor relationships, goal-setting.',
    tags: ['sel', 'middle-school', 'adolescent'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-11',
    title: 'Project-based learning framework (6-8)',
    category: 'Classroom Activities',
    content: 'Real-world projects with student choice. Include: research, collaboration, iteration, presentation. Integrate multiple subjects. Authentic audiences beyond classroom.',
    tags: ['pbl', 'middle-school', 'project-based'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-12',
    title: 'Adolescent-friendly communication',
    category: 'Parent Messages',
    content: 'Balance privacy with transparency. Focus on student growth/strengths. Celebrate progress publicly. Private messages for concerns. Include student self-reflection.',
    tags: ['parents', 'middle-school', 'communication'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },

  // === HIGH SCHOOL (9-12) ===
  {
    id: 'app-index-13',
    title: 'High school college/career readiness',
    category: 'Theme Weeks',
    content: 'Integrate into curriculum: career exploration, resume/portfolio building, college research, financial literacy, internships. Guest speakers. Field experiences.',
    tags: ['career-readiness', 'high-school', 'college-prep'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-14',
    title: 'High school academic rigor standards',
    category: 'Classroom Activities',
    content: 'Challenging content. Academic vocabulary. Critical thinking/analysis. Evidence-based arguments. Peer review. Revisions. Real-world application.',
    tags: ['rigorous', 'high-school', 'academic'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-15',
    title: 'High school mental health and wellbeing',
    category: 'School Culture',
    content: 'Mental health awareness curriculum. Stress management tools. Peer support. Staff availability. Resource referrals. Normalize seeking help.',
    tags: ['wellness', 'mental-health', 'high-school'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },

  // === UNIVERSAL STANDARDS ===
  {
    id: 'app-index-16',
    title: 'Staff email structure',
    category: 'Staff Emails',
    content: 'Subject line: clear purpose. First line: key action/info. Bullets: specific items with dates. Tone: collaborative and supportive.',
    tags: ['staff', 'email', 'operations'],
    age_group: 'Staff',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-17',
    title: 'Career coaching framework',
    category: 'Staff Career Paths',
    content: 'Format: strengths, growth targets, certifications, weekly action, 30-day checkpoint. Supportive tone. Measurable goals. Regular check-ins.',
    tags: ['career', 'coaching', 'staff-development'],
    age_group: 'Staff',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-18',
    title: 'Prompt engineering standard',
    category: 'Slogans',
    content: 'All prompts should include: goal, audience, constraints, tone, one example output. This ensures AI-generated content is relevant and safe.',
    tags: ['prompting', 'quality', 'best-practices'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-19',
    title: 'Inclusive classroom practices',
    category: 'School Culture',
    content: 'Representation in materials (books, images). Multiple means of engagement, representation, action/expression (UDL). Differentiation for all learners. Accessible design.',
    tags: ['inclusion', 'diversity', 'access'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
  {
    id: 'app-index-20',
    title: 'Growth mindset culture',
    category: 'School Culture',
    content: 'Celebrate effort and strategies, not just outcomes. Use "yet" language ("not there yet"). Model learning from mistakes. Normalize struggle as part of learning.',
    tags: ['growth-mindset', 'resilience', 'culture'],
    age_group: 'Any',
    approved: true,
    created_by: null,
    created_at: staticCreatedAt,
  },
];

const sharedAutofill: PromptAutofillOption[] = [
  // === PRESCHOOL (Pre-K) ===
  { id: 'auto-01', label: '🌙 Ocean Friendship Week (Pre-K)', values: { theme: 'Ocean Friendship Week', ageGroup: 'Pre-K', tone: 'Warm and playful', learningGoals: 'Friendship, turn-taking, ocean vocabulary', details: 'Families share one ocean book title. No live animals needed.', goals: 'Increase family engagement and literacy tie-ins' } },
  { id: 'auto-02', label: '🚔 Community Helpers (Pre-K)', values: { theme: 'Community Helpers', ageGroup: 'Pre-K', tone: 'Playful', goals: 'Transitions, dramatic play routines', details: 'Guest visitor from local community (firefighter, nurse, etc.)' } },
  { id: 'auto-03', label: '🎨 Shapes & Colors (Ages 2-3)', values: { theme: 'Colors and Shapes', ageGroup: 'Age 3', skillFocus: 'Shape recognition', learningGoals: 'Sorting, matching, descriptive language', mustInclude: 'Large circles, triangles, squares with friendly characters' } },

  // === ELEMENTARY (K-5) ===
  { id: 'auto-04', label: '📖 Literacy Focus (K-2)', values: { theme: 'Fairy Tales & Adventures', ageGroup: 'Grades K-2', skillFocus: 'Phonics, sight words, comprehension', tone: 'Playful and engaging', activities: 'Read-aloud, guided reading, creative dramatization, take-home reader', goals: 'Increase reading fluency and family reading time' } },
  { id: 'auto-05', label: '🔬 STEAM Integration (3-5)', values: { theme: 'Water & Weather Science', ageGroup: 'Grades 3-5', skillFocus: 'Scientific observation and prediction', activities: 'Hands-on experiments, observation journals, weather tracking', constraints: 'Safe materials only, simple procedures', goals: 'Build curiosity and scientific thinking' } },
  { id: 'auto-06', label: '💝 SEL: Emotions Unit (Elementary)', values: { theme: 'Understanding Emotions', ageGroup: 'Elementary', activities: 'Feelings chart, emotion cards, conflict resolution skits, gratitude practice', constraints: 'Age-appropriate scenarios', goals: 'Increase emotional vocabulary and empathy' } },
  { id: 'auto-07', label: '🎓 Book Report Creativity (3-5)', values: { genre: 'Picture books or chapter books', ageGroup: 'Grades 3-5', format: 'Creative presentations (poster, puppet show, diorama)', tone: 'Encouraging', mustInclude: 'Character description, plot summary, personal connection', avoid: 'Traditional book reports only' } },

  // === MIDDLE SCHOOL (6-8) ===
  { id: 'auto-08', label: '📱 Digital Citizenship (6-8)', values: { theme: 'Internet Safety & Etiquette', ageGroup: 'Grades 6-8', activities: 'Case studies, discussion circles, digital responsibility contracts', tone: 'Relatable and relevant', goals: 'Develop critical thinking about online behavior' } },
  { id: 'auto-09', label: '🎬 Project-Based Learning (6-8)', values: { title: 'Climate Change Solutions Project', ageGroup: 'Grades 6-8', format: 'Research, poster/presentation, peer feedback', constraints: 'Collaborative, evidence-based', timeline: '3-week cycle' } },
  { id: 'auto-10', label: '🤝 Peer Mentoring Setup (6-8)', values: { program: 'Older students mentor younger grades', ageGroup: 'Grades 6-8', goals: 'Leadership, responsibility, confidence building', structure: 'Weekly 30-min sessions, guided activities', tone: 'Positive and supportive' } },

  // === HIGH SCHOOL (9-12) ===
  { id: 'auto-11', label: '📚 Advanced Essay (9-12)', values: { assignment: 'Argumentative essay', ageGroup: 'Grades 9-12', format: 'Thesis, evidence, counterargument, revision cycles', tone: 'Academic', goals: 'Critical thinking and persuasive writing', length: '1500-2000 words' } },
  { id: 'auto-12', label: '💼 Career Exploration (10-12)', values: { unit: 'Career Pathways & College Prep', ageGroup: 'Grades 10-12', activities: 'Career inventories, informational interviews, college research, portfolio building', constraints: 'Real-world connections', goals: 'Self-awareness and future planning' } },
  { id: 'auto-13', label: '🧠 Mental Health Awareness (9-12)', values: { theme: 'Stress Management & Wellness', ageGroup: 'Grades 9-12', activities: 'Mindfulness practices, peer discussion, resource sharing', tone: 'Supportive and non-judgmental', goals: 'Normalize seeking help' } },

  // === UNIVERSAL TEMPLATES ===
  { id: 'auto-14', label: '👨‍👩‍👧 Family Event Reminder', values: { messageType: 'Event announcement', tone: 'Warm and inviting', details: 'Include date, time, location, what to bring, RSVP info', grade: 'Any K-12' } },
  { id: 'auto-15', label: '📧 Staff Meeting Follow-Up', values: { audience: 'All staff', purpose: 'Action items recap', tone: 'Clear and collaborative', format: 'Key decisions, action items with deadlines, resources' } },
  { id: 'auto-16', label: '🎯 Staff Coaching Conversation', values: { employeeName: '[Teacher name]', currentRole: '[Role]', strengths: '[Specific strength]', growthArea: '[Target skill]', goal: '[SMART goal]', timeline: '30-day checkpoint', tone: 'Encouraging and constructive' } },
];

export function getAutofillOptionsForTool(_tool: WhaleTool): PromptAutofillOption[] {
  return sharedAutofill;
}
