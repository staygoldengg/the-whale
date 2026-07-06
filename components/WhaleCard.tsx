import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export function WhaleCard({ title, description, href, icon: Icon }: { title: string; description: string; href: string; icon: LucideIcon }) {
  return (
    <Link href={href} className="whale-panel group block p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-whale-100 text-whale-800">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <p className="mt-5 text-sm font-semibold text-whale-700 group-hover:text-whale-900">Open tool →</p>
    </Link>
  );
}
