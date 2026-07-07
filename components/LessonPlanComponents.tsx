'use client';

import React, { useState } from 'react';
import { ChevronDown, Clock, Users, Target, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface LessonActivity {
  id: string;
  title: string;
  description?: string;
  duration?: number; // in minutes
  groupSize?: string;
  objectives?: string[];
  materials?: string[];
  status?: 'completed' | 'in-progress' | 'pending';
}

export interface LessonSection {
  id: string;
  name: string;
  emoji?: string;
  description?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'pink';
  activities: LessonActivity[];
}

/**
 * LessonActivityCard: Display a single lesson activity
 */
export function LessonActivityCard({
  activity,
  onEdit,
  onDelete,
  onStatusChange,
  className = ''
}: {
  activity: LessonActivity;
  onEdit?: (activity: LessonActivity) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: LessonActivity['status']) => void;
  className?: string;
}) {
  return (
    <div className={`rounded-lg bg-white p-4 border border-slate-200 hover:border-blue-300 transition-colors ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-slate-900">{activity.title}</h4>
        {activity.status && (
          <select
            value={activity.status}
            onChange={(e) => onStatusChange?.(activity.id, e.target.value as any)}
            className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 border-0 cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        )}
      </div>

      {activity.description && (
        <p className="text-sm text-slate-600 mb-3">{activity.description}</p>
      )}

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        {activity.duration && (
          <div className="flex items-center gap-1 text-slate-600">
            <Clock className="w-4 h-4" />
            {activity.duration} min
          </div>
        )}
        {activity.groupSize && (
          <div className="flex items-center gap-1 text-slate-600">
            <Users className="w-4 h-4" />
            {activity.groupSize}
          </div>
        )}
      </div>

      {(activity.objectives?.length || 0) > 0 && (
        <div className="mb-3 space-y-1">
          <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Target className="w-3 h-3" /> Objectives
          </p>
          <ul className="text-xs text-slate-600 space-y-0.5">
            {activity.objectives?.map((obj, idx) => (
              <li key={idx} className="ml-4">• {obj}</li>
            ))}
          </ul>
        </div>
      )}

      {(activity.materials?.length || 0) > 0 && (
        <div className="mb-3 space-y-1">
          <p className="text-xs font-bold text-slate-700">Materials</p>
          <div className="flex flex-wrap gap-1">
            {activity.materials?.map((mat, idx) => (
              <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                {mat}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        {onEdit && (
          <button
            onClick={() => onEdit(activity)}
            className="flex-1 text-xs font-bold text-blue-600 hover:text-blue-700 py-1"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(activity.id)}
            className="flex-1 text-xs font-bold text-red-600 hover:text-red-700 py-1"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * LessonSectionCard: Display a lesson section with collapsible activities
 */
export function LessonSectionCard({
  section,
  onActivityEdit,
  onActivityDelete,
  onActivityStatusChange,
  className = ''
}: {
  section: LessonSection;
  onActivityEdit?: (activity: LessonActivity) => void;
  onActivityDelete?: (id: string) => void;
  onActivityStatusChange?: (id: string, status: LessonActivity['status']) => void;
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 hover:border-blue-300',
    green: 'bg-green-50 border-green-200 hover:border-green-300',
    orange: 'bg-orange-50 border-orange-200 hover:border-orange-300',
    purple: 'bg-purple-50 border-purple-200 hover:border-purple-300',
    pink: 'bg-pink-50 border-pink-200 hover:border-pink-300'
  };

  const headerColorMap = {
    blue: 'bg-blue-100 text-blue-900',
    green: 'bg-green-100 text-green-900',
    orange: 'bg-orange-100 text-orange-900',
    purple: 'bg-purple-100 text-purple-900',
    pink: 'bg-pink-100 text-pink-900'
  };

  const color = section.color || 'blue';

  return (
    <div className={`rounded-xl border ${colorMap[color]} transition-all ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-6 py-4 ${headerColorMap[color]} font-bold rounded-t-lg`}
      >
        <div className="flex items-center gap-3">
          {section.emoji && <span className="text-2xl">{section.emoji}</span>}
          <div className="text-left">
            <h3>{section.name}</h3>
            {section.description && <p className="text-xs font-normal opacity-75 mt-0.5">{section.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/30 px-2 py-1 rounded">
            {section.activities.length} {section.activities.length === 1 ? 'activity' : 'activities'}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 py-4 space-y-3">
          {section.activities.length === 0 ? (
            <p className="text-sm text-slate-600 italic">No activities added yet</p>
          ) : (
            section.activities.map((activity) => (
              <LessonActivityCard
                key={activity.id}
                activity={activity}
                onEdit={onActivityEdit}
                onDelete={onActivityDelete}
                onStatusChange={onActivityStatusChange}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

/**
 * DailyLessonPlan: Complete daily lesson plan display
 */
export function DailyLessonPlan({
  date,
  theme,
  sections,
  quality,
  onActivityEdit,
  onActivityDelete,
  onActivityStatusChange
}: {
  date: string;
  theme: string;
  sections: LessonSection[];
  quality?: number;
  onActivityEdit?: (activity: LessonActivity) => void;
  onActivityDelete?: (id: string) => void;
  onActivityStatusChange?: (id: string, status: LessonActivity['status']) => void;
}) {
  const totalActivities = sections.reduce((sum, s) => sum + s.activities.length, 0);
  const completedActivities = sections.reduce(
    (sum, s) => sum + s.activities.filter(a => a.status === 'completed').length,
    0
  );
  const progressPercent = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black">{theme}</h2>
            <p className="text-blue-100 mt-1">{date}</p>
          </div>
          {quality !== undefined && (
            <div className="text-right">
              <div className="text-3xl font-black">{quality}%</div>
              <p className="text-xs font-bold text-blue-100 mt-1">Quality Score</p>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Daily Progress</span>
            <span className="font-bold">{completedActivities}/{totalActivities}</span>
          </div>
          <div className="h-2 rounded-full bg-white/30">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section) => (
          <LessonSectionCard
            key={section.id}
            section={section}
            onActivityEdit={onActivityEdit}
            onActivityDelete={onActivityDelete}
            onActivityStatusChange={onActivityStatusChange}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * WeeklyLessonOverview: Show all 5 days of the week
 */
export function WeeklyLessonOverview({
  weekOf,
  theme,
  days
}: {
  weekOf: string;
  theme: string;
  days: Array<{
    date: string;
    dayName: string;
    sections: LessonSection[];
    quality?: number;
  }>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase text-slate-600">Weekly Theme</p>
        <h2 className="text-3xl font-black text-slate-900">{theme}</h2>
        <p className="text-slate-600 mt-1">Week of {weekOf}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {days.map((day, idx) => (
          <div key={idx} className="rounded-xl bg-white border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-slate-900">{day.dayName}</h3>
            <p className="text-sm text-slate-600">{day.date}</p>
            
            {day.quality !== undefined && (
              <div className="mt-3 p-3 rounded-lg bg-blue-50">
                <p className="text-xs font-bold text-slate-600">Quality</p>
                <p className="text-2xl font-black text-blue-600">{day.quality}%</p>
              </div>
            )}

            <div className="mt-4 space-y-2">
              {day.sections.map((section) => (
                <div key={section.id} className="text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    {section.emoji} {section.name}
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    {section.activities.length} {section.activities.length === 1 ? 'activity' : 'activities'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
