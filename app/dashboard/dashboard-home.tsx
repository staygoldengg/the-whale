'use client';

import Link from 'next/link';
import { BookOpen, Zap, Star, Clock, Users, CheckCircle2, Brain } from 'lucide-react';
import { AiRecommendationToast } from '@/components/AiRecommendationToast';
import { CertificationPoints } from '@/components/CertificationPoints';
import { useAppSettings } from '@/components/AppSettingsProvider';
import { dashboardShortcuts } from '@/lib/dashboardShortcuts';
import { DashboardCard, QuickStats, SectionHeader } from '@/components/ModernDashboardUI';
import { FuturisticButton } from '@/components/FuturisticUI';

export default function DashboardHome() {
  const { settings } = useAppSettings();
  const pinned = dashboardShortcuts.filter((item) => settings.pinnedShortcutIds.includes(item.id));

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-10 text-white shadow-lg relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-7 h-7" />
            <span className="text-sm font-bold uppercase tracking-wide opacity-90">AI Companion</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Welcome, {settings.dashboardDisplayName}! 👋</h1>
          <p className="text-lg text-blue-100 max-w-2xl mb-6">{settings.dashboardSubtitle}</p>
          
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-bold border border-white/30">
              ✨ Guest mode enabled
            </div>
            <Link href="/dashboard/lesson-planner">
              <FuturisticButton variant="primary" size="md" className="!bg-white !text-blue-600">
                <Zap className="w-4 h-4" />
                Plan Lesson
              </FuturisticButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={[
        { label: 'Tools Available', value: '25+', icon: Zap, color: 'blue' },
        { label: 'Lesson Plans', value: '0', icon: BookOpen, color: 'green' },
        { label: 'Time Saved', value: '12h', unit: 'this month', icon: Clock, color: 'purple' },
        { label: 'Tips Viewed', value: '8', icon: Star, color: 'orange' }
      ]} />

      {/* Pinned Shortcuts */}
      {pinned.length > 0 && (
        <div className="space-y-4">
          <SectionHeader
            icon={CheckCircle2}
            title="Quick Access"
            description={`${pinned.length} pinned shortcuts for faster navigation`}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pinned.map((item) => (
              <Link key={item.id} href={item.href}>
                <div className="h-full p-4 rounded-xl bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer text-center">
                  <p className="font-bold text-sm text-slate-900 line-clamp-2">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Cards */}
      <AiRecommendationToast />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.6fr]">
        {/* Lesson Planner Promo */}
        <DashboardCard
          title="AI-Powered Lesson Planning"
          subtitle="Generate comprehensive lesson plans with quality scoring"
          onClick={() => window.location.href = '/dashboard/lesson-planner'}
          className="md:col-span-1 group cursor-pointer"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">Guided Lesson Planner</h3>
                <p className="text-sm text-slate-600 mt-1">Build School Brain-informed weekly plans with automatic quality checks</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">AI-Powered</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Quality Scoring</span>
            </div>
            <FuturisticButton
              variant="primary"
              size="sm"
              className="w-full mt-2"
              onClick={() => window.location.href = '/dashboard/lesson-planner'}
            >
              <Zap className="w-4 h-4" />
              Start Planning
            </FuturisticButton>
          </div>
        </DashboardCard>

        {/* Certification Points */}
        <CertificationPoints />
      </div>

      {/* Teacher Tips Section */}
      <DashboardCard
        icon={Star}
        title="Teacher Tips Rotation"
        subtitle="30 rotating recommendations for classroom excellence"
        className="cursor-pointer"
        onClick={() => window.location.href = '/dashboard/teacher-tips'}
      >
        <div className="space-y-4">
          <p className="text-slate-600">Your dedicated Teacher Tips tab cycles through practical advice for communication, lesson design, and school operations. Explore anytime for fresh ideas.</p>
          <FuturisticButton
            variant="secondary"
            size="md"
            onClick={() => window.location.href = '/dashboard/teacher-tips'}
          >
            View Teacher Tips
          </FuturisticButton>
        </div>
      </DashboardCard>
    </div>
  );
}
