export type Role = 'admin' | 'teacher' | 'staff';

export type WhaleTool =
  | 'theme-week'
  | 'coloring-page'
  | 'weekly-plan'
  | 'parent-message'
  | 'team-email'
  | 'theme-analysis'
  | 'career-path'
  | 'ops-review';

export type AiIndexItem = {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[] | null;
  age_group: string | null;
  approved: boolean;
  created_by: string | null;
  created_at: string;
};

export type StaffProfile = {
  id: string;
  full_name: string;
  preferred_name: string | null;
  email: string | null;
  role_title: string | null;
  classroom: string | null;
  pronouns: string | null;
  gender_reference: string | null;
  career_goal: string | null;
  strengths: string[] | null;
  growth_areas: string[] | null;
  certifications: string[] | null;
  tone_preference: string | null;
  do_not_say: string[] | null;
  notes: string | null;
};

export type SafetyIssue = {
  level: 'pass' | 'info' | 'warning' | 'blocker';
  title: string;
  detail: string;
  suggestion?: string;
};

export type LessonPlan = {
  id: string;
  user_id: string | null;
  classroom: string;
  age_group: string;
  theme: string;
  week_of: string | null;
  developmental_goals: string[] | null;
  materials: string[] | null;
  plan: Record<string, unknown>;
  status: 'draft' | 'needs_review' | 'approved' | 'exported_to_google_docs' | 'archived';
  created_at: string;
  updated_at: string;
};

export type ResourceLibraryItem = {
  id: string;
  title: string;
  category: string;
  age_group: string | null;
  content: string;
  tags: string[] | null;
  status: 'pending_review' | 'approved' | 'rejected' | 'archived';
  submitted_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type StaffFeedback = {
  id: string;
  submitted_by: string | null;
  feedback_type: 'suggestion' | 'concern' | 'appreciation' | 'training_request' | 'supply_request' | 'classroom_improvement';
  classroom: string | null;
  title: string;
  body: string;
  anonymous: boolean;
  status: 'open' | 'reviewing' | 'resolved' | 'archived';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};
