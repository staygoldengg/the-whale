import { runLocalSafetyReview, brightwheelFormat } from './safety';
import type { StaffProfile, SafetyIssue } from './types';

export type ValidationResult = {
  finalContent: string;
  issues: SafetyIssue[];
  status: 'approved' | 'needs_review' | 'blocked';
  checklist: { label: string; passed: boolean; detail: string }[];
};

export function runValidationPipeline(content: string, staffProfiles: StaffProfile[] = [], required?: { date?: boolean; classroom?: string }) : ValidationResult {
  const finalContent = brightwheelFormat(content);
  const issues = runLocalSafetyReview(finalContent, staffProfiles);
  const lower = finalContent.toLowerCase();
  const checklist = [
    { label: 'Has content', passed: finalContent.trim().length > 0, detail: 'Message is not empty.' },
    { label: 'Brightwheel length', passed: finalContent.length <= 1200, detail: 'Short enough for parent-app use.' },
    { label: 'Date included when required', passed: !required?.date || /\b(mon|tue|wed|thu|fri|sat|sun|\d{1,2}\/\d{1,2}|january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(finalContent), detail: 'Checks for a clear day/date reference.' },
    { label: 'Classroom reference', passed: !required?.classroom || lower.includes(required.classroom.toLowerCase()), detail: required?.classroom ? `Expected classroom: ${required.classroom}.` : 'No classroom required.' },
    { label: 'No blocker wording', passed: !issues.some((i) => i.level === 'blocker'), detail: 'No medical/privacy/legal blocker detected.' }
  ];

  if (checklist.some((c) => !c.passed)) {
    issues.push({ level: 'warning', title: 'Checklist item failed', detail: 'One or more operational checklist items failed.', suggestion: 'Review missing date, classroom, length, or required context before sending.' });
  }

  const status = issues.some((i) => i.level === 'blocker') ? 'blocked' : issues.some((i) => i.level === 'warning') || checklist.some((c) => !c.passed) ? 'needs_review' : 'approved';
  return { finalContent, issues, status, checklist };
}
