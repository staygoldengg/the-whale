import type { SafetyIssue } from './types';

export function scoreContentQuality(issues: SafetyIssue[], text: string) {
  let score = 100;
  for (const issue of issues) {
    if (issue.level === 'blocker') score -= 35;
    if (issue.level === 'warning') score -= 15;
    if (issue.level === 'info') score -= 4;
  }
  if (text.length < 40) score -= 10;
  if (text.length > 1800) score -= 8;
  if (!/[.!?]$/.test(text.trim())) score -= 3;
  return Math.max(0, Math.min(100, score));
}

export function qualityLabel(score: number) {
  if (score >= 90) return 'Ready after human review';
  if (score >= 75) return 'Good draft';
  if (score >= 55) return 'Needs edits';
  return 'Do not send yet';
}
