import { TopNav } from '@/components/TopNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="whale-shell"><TopNav /><main className="mx-auto max-w-7xl px-5 py-8">{children}</main></div>;
}
