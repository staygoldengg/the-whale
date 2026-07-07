'use client';

import React, { useState } from 'react';
import { ChevronDown, Clock, Users, Target, AlertCircle, CheckCircle2, Lightbulb, BookOpen, Zap } from 'lucide-react';

export interface LessonActivity {
  id: string;
  title: string;
  description?: string;
  duration?: number; // in minutes
  groupSize?: string;
  objectives?: string[];
  materials?: { included: string[]; notIncluded: string[] };
  standards?: string[]; // KDI or learning standards
  skills?: { name: string; icon?: string }[];
  status?: 'completed' | 'in-progress' | 'pending';
  location?: 'indoor' | 'outdoor' | 'both';
  ageRange?: string;
  teachingTips?: string;
  assessmentTips?: string;
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
 * LessonActivityCard: Display a single lesson activity with rich pedagogical content
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'teaching' | 'assessing'>('teaching');

  return (
    <div className={`rounded-xl bg-white border border-slate-200 overflow-hidden hover:shadow-md transition-all ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 hover:bg-slate-50 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 text-lg">{activity.title}</h4>
            {activity.ageRange && (
              <p className="text-xs text-slate-600 mt-1">{activity.ageRange}</p>
            )}
          </div>
          {activity.status && (
            <select
              onClick={(e) => e.stopPropagation()}
              value={activity.status}
              onChange={(e) => onStatusChange?.(activity.id, e.target.value as any)}
              className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 border-0 cursor-pointer"
            >
              <option value="pending">○ Pending</option>
              <option value="in-progress">⟳ In Progress</option>
              <option value="completed">✓ Completed</option>
            </select>
          )}
        </div>

        {/* Quick Info Row */}
        <div className="flex flex-wrap gap-4 text-sm">
          {activity.duration && (
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Clock className="w-4 h-4 text-orange-600" />
              {activity.duration} min
            </div>
          )}
          {activity.groupSize && (
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Users className="w-4 h-4 text-purple-600" />
              {activity.groupSize}
            </div>
          )}
          {activity.location && (
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              📍 {activity.location === 'both' ? 'Indoor/Outdoor' : activity.location}
            </div>
          )}
        </div>

        {activity.description && (
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">{activity.description}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            {activity.skills && activity.skills.length > 0 && (
              <div className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold">
                {activity.skills.length} skills
              </div>
            )}
            {activity.standards && activity.standards.length > 0 && (
              <div className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-bold">
                {activity.standards.length} standards
              </div>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-0">
          {/* Supplies Section */}
          {activity.materials && (activity.materials.included.length > 0 || activity.materials.notIncluded.length > 0) && (
            <div className="px-4 py-4 border-t border-slate-200 bg-slate-50">
              <h5 className="font-bold text-slate-900 mb-3">Supplies</h5>
              <div className="grid grid-cols-2 gap-4">
                {activity.materials.included.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-green-700 mb-2">Included in subscription box</p>
                    <ul className="space-y-1">
                      {activity.materials.included.map((mat, idx) => (
                        <li key={idx} className="text-sm text-slate-700">• {mat}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {activity.materials.notIncluded.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-2">Not included</p>
                    <ul className="space-y-1">
                      {activity.materials.notIncluded.map((mat, idx) => (
                        <li key={idx} className="text-sm text-slate-700">• {mat}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Teaching/Assessing Tabs */}
          {(activity.teachingTips || activity.assessmentTips) && (
            <div className="px-4 py-4 border-t border-slate-200">
              <div className="flex gap-4 mb-4 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('teaching')}
                  className={`pb-2 font-bold text-sm transition-colors ${
                    activeTab === 'teaching'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Teaching
                </button>
                <button
                  onClick={() => setActiveTab('assessing')}
                  className={`pb-2 font-bold text-sm transition-colors ${
                    activeTab === 'assessing'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Assessing
                </button>
              </div>

              {activeTab === 'teaching' && activity.teachingTips && (
                <div className="space-y-2">
                  <h6 className="font-bold text-slate-900 text-sm">Play Together</h6>
                  <p className="text-sm text-slate-700 leading-relaxed">{activity.teachingTips}</p>
                </div>
              )}

              {activeTab === 'assessing' && activity.assessmentTips && (
                <div className="space-y-2">
                  <h6 className="font-bold text-slate-900 text-sm">Observe</h6>
                  <ul className="space-y-1.5">
                    {activity.assessmentTips.split('\n').map((tip, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex gap-2">
                        <span className="text-slate-400">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Skills Section */}
          {activity.skills && activity.skills.length > 0 && (
            <div className="px-4 py-4 border-t border-slate-200 bg-slate-50">
              <h5 className="font-bold text-slate-900 mb-3">Skills</h5>
              <div className="flex flex-wrap gap-2">
                {activity.skills.map((skill, idx) => (
                  <div key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-base">{skill.icon || '✓'}</span>
                    <span className="text-sm font-semibold text-slate-700">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Standards/KDI Section */}
          {activity.standards && activity.standards.length > 0 && (
            <div className="px-4 py-4 border-t border-slate-200">
              <h5 className="font-bold text-slate-900 mb-3">Learning Standards</h5>
              <ul className="space-y-2">
                {activity.standards.map((standard, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-blue-600 font-bold">KDI</span>
                    <span>{standard}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Objectives Section */}
          {activity.objectives && activity.objectives.length > 0 && (
            <div className="px-4 py-4 border-t border-slate-200 bg-slate-50">
              <h5 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" /> Learning Objectives
              </h5>
              <ul className="space-y-1.5">
                {activity.objectives.map((obj, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 p-4 border-t border-slate-200 bg-slate-50">
            {onEdit && (
              <button
                onClick={() => onEdit(activity)}
                className="flex-1 text-sm font-bold text-blue-600 hover:text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                ✎ Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(activity.id)}
                className="flex-1 text-sm font-bold text-red-600 hover:text-red-700 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors"
              >
                ✕ Delete
              </button>
            )}
          </div>
        </div>
      )}
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
