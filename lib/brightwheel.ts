import { brightwheelFormat } from './safety';
import type { SafetyIssue } from './types';

export type BrightwheelCompanionResult = {
  formatted: string;
  checklist: { label: string; passed: boolean; detail: string }[];
  copyInstructions: string[];
  issues: SafetyIssue[];
};

const templateLabels: Record<string, string> = {
  parent_update: 'Parent update',
  supply_request: 'Supply request',
  schedule_change: 'Schedule change',
  newsletter: 'Weekly newsletter',
  incident_follow_up: 'Incident follow-up draft'
};

export function formatForBrightwheel(input: {
  content: string;
  templateType?: string;
  classroom?: string;
  requireDate?: boolean;
  validationIssues?: SafetyIssue[];
}): BrightwheelCompanionResult {
  const formatted = brightwheelFormat(input.content);
  const hasGreeting = /^hello|^good morning|^good afternoon|^hi families/i.test(formatted.trim());
  const hasClassroom = !input.classroom || formatted.toLowerCase().includes(input.classroom.toLowerCase());
  const hasDate = !input.requireDate || /\b(mon|tue|wed|thu|fri|sat|sun|\d{1,2}\/\d{1,2}|january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(formatted);
  const safeLength = formatted.length <= 1200;
  const hasFakeSync = /sent through brightwheel|synced to brightwheel|posted automatically/i.test(formatted);

  const checklist = [
    { label: 'Brightwheel companion wording', passed: !hasFakeSync, detail: 'Does not claim direct Brightwheel sync.' },
    { label: 'Friendly greeting', passed: hasGreeting, detail: 'Starts like a parent-ready message.' },
    { label: 'Classroom verified', passed: hasClassroom, detail: input.classroom ? `Mentions ${input.classroom}.` : 'No classroom required.' },
    { label: 'Date verified', passed: hasDate, detail: 'Has a day/date when required.' },
    { label: 'Short enough', passed: safeLength, detail: 'Fits a quick parent app message.' }
  ];

  const issues: SafetyIssue[] = [...(input.validationIssues ?? [])];
  if (hasFakeSync) issues.push({ level: 'blocker', title: 'Fake integration wording', detail: 'The message implies direct Brightwheel sync.', suggestion: 'Say “copy into Brightwheel” instead.' });
  if (!hasGreeting) issues.push({ level: 'info', title: 'Add parent greeting', detail: 'A greeting makes it feel more natural for families.' });
  if (!safeLength) issues.push({ level: 'warning', title: 'Message is long', detail: 'Brightwheel updates should be short.', suggestion: 'Export the long version to Google Docs and copy only the summary.' });

  return {
    formatted,
    checklist,
    issues,
    copyInstructions: [
      `Open Brightwheel and choose the ${templateLabels[input.templateType ?? 'parent_update'] ?? 'message'} flow.`,
      'Paste the reviewed text into the message box.',
      'Confirm classroom, date, names, and parent action.',
      'Send only after the status is Approved or reviewed by an admin.'
    ]
  };
}
