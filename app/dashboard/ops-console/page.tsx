import { ClipboardCheck, Database, FileText, Mail, ShieldCheck } from 'lucide-react';
import { WhaleCard } from '@/components/WhaleCard';

const ops = [
  ['School Brain', 'Search the central source-of-truth used by AI tools.', '/dashboard/school-brain', Database],
  ['Brightwheel Companion', 'Format and review copy-ready parent-app messages.', '/dashboard/brightwheel-companion', Mail],
  ['Ops Review', 'Run mistake checks for names, pronouns, tone, length, and privacy.', '/dashboard/ops-review', ClipboardCheck],
  ['AI Index Library', 'Approve school examples and staff practice templates.', '/dashboard/ai-index', FileText],
  ['Staff Profiles', 'Maintain employee name spelling, pronouns, classrooms, and career goals.', '/dashboard/staff-profiles', ShieldCheck]
] as const;

export default function OpsConsolePage() {
  return <><section className="mb-8 whale-panel p-7"><p className="text-sm font-bold uppercase tracking-wide text-whale-700">The Whale Operations Console</p><h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Production control center.</h1><p className="mt-3 max-w-3xl text-slate-600">Use this area to manage the safety systems that prevent misspellings, wrong staff references, missing dates, policy conflicts, and unclear Brightwheel messages.</p></section><section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{ops.map(([title, description, href, Icon]) => <WhaleCard key={href} title={title} description={description} href={href} icon={Icon} />)}</section></>;
}
