'use client';

import { useMemo, useState } from 'react';

const scoreRules = [
  { label: 'Doctorate / PhD', pattern: /\b(doctorate|phd|d\.\s?ph|ed\.\s?d|doctor of|md)\b/i, points: 55 },
  { label: 'Master’s degree', pattern: /\b(master of|m\.?ed|m\.?a|m\.?s|mba|msc|ms|ma)\b/i, points: 40 },
  { label: 'Bachelor’s degree', pattern: /\b(bachelor|b\.?a|b\.?s|bs|ba|b\.?ed|b\.?fa)\b/i, points: 28 },
  { label: 'Associate degree', pattern: /\b(associate|a\.?a|a\.?s)\b/i, points: 18 },
  { label: 'Professional certification', pattern: /\b(certification|certified|certificate|license|licensed|diploma|accredited)\b/i, points: 14 },
  { label: 'Training / workshop', pattern: /\b(workshop|training|course|professional development|pd|seminar|microcredential)\b/i, points: 8 }
];

function computePoints(text: string) {
  const lower = text.trim();
  if (!lower) return { score: 0, badges: [], advice: 'Paste a certification summary or transcript excerpt to see how many professional growth points it earns.' };

  const badges = scoreRules
    .filter((rule) => rule.pattern.test(lower))
    .map((rule) => rule.label);

  let score = scoreRules.reduce((sum, rule) => (rule.pattern.test(lower) ? sum + rule.points : sum), 0);

  if (/\b(honors|distinction|summa cum laude|magna cum laude|with distinction)\b/i.test(lower)) score += 6;
  if (/(\d{4})/.test(lower)) score += 2;
  if (lower.length > 280) score += 4;

  if (score === 0 && lower.length > 10) score = 6;

  const level = score >= 65 ? 'Expert' : score >= 40 ? 'Advanced' : score >= 20 ? 'Growing' : 'Getting started';
  const advice = score >= 65
    ? 'This transcript reflects strong academic achievement and leadership potential.'
    : score >= 40
      ? 'This is a solid professional credential. Degrees weigh more than short training notes.'
      : score >= 20
        ? 'Good progress. A master’s or higher credential would raise the points significantly.'
        : 'Try adding more degree or certification details for higher growth value.';

  return { score, badges, advice, level };
}

export function CertificationPoints() {
  const [transcript, setTranscript] = useState('');

  const result = useMemo(() => computePoints(transcript), [transcript]);

  return (
    <section className="whale-panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-whale-700">Professional Growth</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Certification points tracker</h2>
        </div>
        <div className="rounded-3xl bg-whale-100 px-4 py-3 text-right text-sm font-bold text-whale-900">
          {result.score} pts
          <div className="mt-1 text-xs font-medium text-slate-700">{result.level}</div>
        </div>
      </div>

      <label className="mt-6 block space-y-2">
        <span className="whale-label">Paste a degree, certificate, or transcript summary</span>
        <textarea
          className="whale-input min-h-48"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Example: Master of Education in Early Childhood, Certified Positive Behavior Support Specialist, 2025"
        />
      </label>

      <div className="mt-5 rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-900">How it works</p>
        <p className="mt-2">Higher education and degree programs score more points than single trainings. Transcripts with Master’s, Doctorate, or PhD language are weighted highest.</p>
        {result.badges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {result.badges.map((badge) => (
              <span key={badge} className="rounded-full bg-whale-100 px-3 py-1 font-semibold text-whale-900">{badge}</span>
            ))}
          </div>
        )}
      </div>
      <p className="mt-4 rounded-3xl bg-whale-50 p-4 text-sm text-slate-700">{result.advice}</p>
    </section>
  );
}
