import type { SafetyIssue, StaffProfile } from './types';

const genderedWords: Record<string, string[]> = {
  male: [' he ', ' him ', ' his ', ' mr. ', ' sir '],
  female: [' she ', ' her ', ' hers ', ' ms. ', ' mrs. ', ' ma’am ', ' maam '],
  neutral: [' they ', ' them ', ' their ', ' mx. ']
};

const riskyPhrases = [
  'diagnosed',
  'adhd',
  'autism',
  'medication',
  'unsafe child',
  'bad kid',
  'problem child',
  'punishment',
  'liability',
  'guarantee',
  'promise your child will'
];

export function brightwheelFormat(content: string) {
  return content
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^Subject:/gim, 'Subject:')
    .trim();
}

export function runLocalSafetyReview(content: string, staffProfiles: StaffProfile[] = []): SafetyIssue[] {
  const issues: SafetyIssue[] = [];
  const lower = ` ${content.toLowerCase()} `;

  if (!content.trim()) {
    return [{ level: 'blocker', title: 'Empty content', detail: 'Nothing has been generated or pasted for review.' }];
  }

  for (const phrase of riskyPhrases) {
    if (lower.includes(phrase)) {
      issues.push({
        level: phrase.includes('diagnosed') || phrase.includes('medication') ? 'blocker' : 'warning',
        title: 'Sensitive wording detected',
        detail: `The phrase “${phrase}” can create privacy, medical, or tone issues in school communication.`,
        suggestion: 'Replace with neutral classroom language and route sensitive situations through approved admin process.'
      });
    }
  }

  for (const staff of staffProfiles) {
    const names = [staff.full_name, staff.preferred_name].filter(Boolean) as string[];
    const mentioned = names.some((name) => lower.includes(name.toLowerCase()));
    if (!mentioned) continue;

    const expected = staff.gender_reference?.toLowerCase() ?? '';
    const expectedPronouns = staff.pronouns?.toLowerCase() ?? '';
    const wrongSets = Object.entries(genderedWords).filter(([key]) => !expected.includes(key) && !expectedPronouns.includes(key));

    for (const [group, words] of wrongSets) {
      const bad = words.find((word) => lower.includes(word));
      if (bad) {
        issues.push({
          level: 'warning',
          title: 'Possible wrong gender/pronoun reference',
          detail: `${staff.full_name} was mentioned near language from the ${group} reference set: “${bad.trim()}”.`,
          suggestion: `Check this against the staff profile. Listed pronouns/reference: ${staff.pronouns || staff.gender_reference || 'not set'}.`
        });
      }
    }
  }

  if (!/[.!?]\s*$/.test(content.trim())) {
    issues.push({ level: 'info', title: 'Ending punctuation', detail: 'The message may end abruptly.', suggestion: 'Add clear closing punctuation or a closing line.' });
  }

  if (content.length > 1200) {
    issues.push({ level: 'info', title: 'Brightwheel length check', detail: 'This is long for a parent app message.', suggestion: 'Use the short version for Brightwheel and save the full version to Google Docs.' });
  }

  if (!issues.length) issues.push({ level: 'pass', title: 'Review passed', detail: 'No obvious spelling, privacy, tone, or staff-reference issues were detected by the local review.' });
  return issues;
}
