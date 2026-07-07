'use client';

import React from 'react';
import { ChevronRight, Sparkles, TrendingUp, Calendar, Users, BookOpen, Target } from 'lucide-react';

/**
 * DashboardCard: Reusable card component for dashboard tiles
 */
export function DashboardCard({
  icon: Icon,
  title,
  subtitle,
  value,
  trend,
  onClick,
  className = '',
  children
}: {
  icon?: React.ElementType;
  title: string;
  subtitle?: string;
  value?: string | number;
  trend?: { value: number; label: string; positive: boolean };
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-all cursor-pointer ${className}`}
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative space-y-4">
        {/* Header */}
        {Icon && (
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-sm font-bold ${trend.positive ? 'text-green-600' : 'text-orange-600'}`}>
                <TrendingUp className="w-4 h-4" />
                {trend.value}%
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {children ? (
          children
        ) : (
          <>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
              {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
            </div>
            {value && <p className="text-3xl font-black text-slate-900">{value}</p>}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * StatCard: Simple statistic card
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  color = 'blue'
}: {
  icon?: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
}) {
  const colorMap = {
    blue: 'from-blue-50 to-indigo-50 text-blue-600',
    green: 'from-green-50 to-emerald-50 text-green-600',
    purple: 'from-purple-50 to-pink-50 text-purple-600',
    orange: 'from-orange-50 to-red-50 text-orange-600',
    pink: 'from-pink-50 to-rose-50 text-pink-600',
  };

  return (
    <div className={`rounded-xl bg-gradient-to-br ${colorMap[color].split('text')[0]} p-4`}>
      <div className="flex items-start justify-between">
        {Icon && <Icon className={`w-5 h-5 ${colorMap[color].split(' ')[2]}`} />}
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">{label}</p>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-black text-slate-900">{value}</p>
        {unit && <p className={`text-xs font-bold ${colorMap[color].split(' ')[2]}`}>{unit}</p>}
      </div>
    </div>
  );
}

/**
 * SectionHeader: Consistent section headers
 */
export function SectionHeader({
  icon: Icon,
  title,
  description,
  action,
  onAction
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {Icon && (
          <div className="flex items-center gap-3 mb-3">
            <Icon className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Overview</span>
          </div>
        )}
        <h2 className="text-2xl md:text-3xl font-black text-slate-900">{title}</h2>
        {description && <p className="text-slate-600 mt-2">{description}</p>}
      </div>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition-colors"
        >
          {action}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/**
 * ActivityItem: List item for activities/tasks
 */
export function ActivityItem({
  icon: Icon,
  title,
  subtitle,
  meta,
  status,
  onClick
}: {
  icon?: React.ElementType;
  title: string;
  subtitle?: string;
  meta?: string;
  status?: 'completed' | 'pending' | 'in-progress';
  onClick?: () => void;
}) {
  const statusColor = {
    completed: 'bg-green-100 text-green-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    pending: 'bg-slate-100 text-slate-700'
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl bg-white hover:bg-slate-50 transition-colors cursor-pointer border border-slate-100"
    >
      {Icon && (
        <div className="p-2 rounded-lg bg-blue-50 flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      )}
      <div className="flex-1">
        <p className="font-bold text-slate-900">{title}</p>
        {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
      </div>
      {meta && <p className="text-xs font-bold text-slate-600">{meta}</p>}
      {status && (
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[status]}`}>
          {status === 'completed' ? '✓' : status === 'in-progress' ? '⟳' : '○'} {status}
        </span>
      )}
    </div>
  );
}

/**
 * QuickStats: Dashboard quick statistics grid
 */
export function QuickStats({
  stats
}: {
  stats: Array<{
    label: string;
    value: string | number;
    unit?: string;
    icon?: React.ElementType;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  }>;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <StatCard
          key={idx}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}

/**
 * EmptyState: Empty state placeholder
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  onAction
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className="w-12 h-12 text-slate-400" />
        </div>
      )}
      <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
      {description && <p className="text-slate-600 mt-2">{description}</p>}
      {action && (
        <button
          onClick={onAction}
          className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/**
 * ProgressCard: Card with progress indicator
 */
export function ProgressCard({
  title,
  subtitle,
  current,
  total,
  color = 'blue'
}: {
  title: string;
  subtitle?: string;
  current: number;
  total: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const percentage = (current / total) * 100;
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="rounded-xl bg-white p-4 border border-slate-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-slate-900">{title}</p>
          {subtitle && <p className="text-xs text-slate-600">{subtitle}</p>}
        </div>
        <p className="font-black text-slate-900">{Math.round(percentage)}%</p>
      </div>
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`h-full ${colorMap[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2">{current} of {total} complete</p>
    </div>
  );
}

/**
 * BadgeGroup: Group of status badges
 */
export function BadgeGroup({
  badges
}: {
  badges: Array<{
    label: string;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  }>;
}) {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, idx) => (
        <span
          key={idx}
          className={`text-xs font-bold px-3 py-1 rounded-full ${colorMap[badge.color || 'blue']}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
