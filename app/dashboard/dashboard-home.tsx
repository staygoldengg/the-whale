'use client';

import { SchoolDashboard } from '@/components/SchoolFullDashboard';
import { useAppSettings } from '@/components/AppSettingsProvider';

export default function DashboardHome() {
  const { settings } = useAppSettings();

  return (
    <div className="space-y-0">
      <SchoolDashboard />
    </div>
  );
}
