'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, Library, Zap } from 'lucide-react';
import { EnhancedLessonPlanner } from '@/components/EnhancedLessonPlanner';
import { ActivityBuilder } from '@/components/ActivityBuilder';
import { FuturisticButton } from '@/components/FuturisticUI';

interface SavedActivity {
  id: string;
  title: string;
  description: string;
  duration: number;
  groupSize: string;
  location: 'indoor' | 'outdoor' | 'both';
  ageRange: string;
  objectives: string[];
  skills: { name: string; icon?: string }[];
  standards: string[];
  suppliesIncluded: string[];
  suppliesNotIncluded: string[];
  teachingTips: string;
  assessmentTips: string;
  savedAt: Date;
}

/**
 * ComprehensiveLessonPlanner: Full lesson planning interface with activity creation
 */
export function ComprehensiveLessonPlanner() {
  const [view, setView] = useState<'planner' | 'activities' | 'builder'>('planner');
  const [savedActivities, setSavedActivities] = useState<SavedActivity[]>([]);

  const handleSaveActivity = (activity: any) => {
    const newActivity: SavedActivity = {
      id: Date.now().toString(),
      ...activity,
      savedAt: new Date()
    };
    setSavedActivities([...savedActivities, newActivity]);
    setView('activities');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-lg relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" />
            <span className="text-sm font-bold uppercase tracking-wide opacity-90">Complete Lesson Planning</span>
          </div>
          <h1 className="text-5xl font-black mb-3">Comprehensive Lesson Builder</h1>
          <p className="text-lg text-blue-100 max-w-2xl">Build engaging lessons with rich pedagogical content, learning standards, and assessment strategies</p>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setView('planner')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
            view === 'planner'
              ? 'bg-blue-600 text-white ring-2 ring-blue-300'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-5 h-5" />
          AI Lesson Planner
        </button>

        <button
          onClick={() => setView('activities')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
            view === 'activities'
              ? 'bg-blue-600 text-white ring-2 ring-blue-300'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Library className="w-5 h-5" />
          Activity Library {savedActivities.length > 0 && `(${savedActivities.length})`}
        </button>

        <button
          onClick={() => setView('builder')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
            view === 'builder'
              ? 'bg-blue-600 text-white ring-2 ring-blue-300'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Plus className="w-5 h-5" />
          Create Activity
        </button>
      </div>

      {/* Content Views */}
      {view === 'planner' && <EnhancedLessonPlanner />}

      {view === 'activities' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-8 border border-slate-200">
            <h2 className="text-3xl font-black text-slate-900 mb-6">Saved Activities</h2>
            
            {savedActivities.length === 0 ? (
              <div className="text-center py-12">
                <Library className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-bold mb-4">No activities saved yet</p>
                <FuturisticButton
                  variant="primary"
                  onClick={() => setView('builder')}
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Activity
                </FuturisticButton>
              </div>
            ) : (
              <div className="space-y-4">
                {savedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-lg bg-white border border-slate-200 p-6 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{activity.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{activity.ageRange}</p>
                      </div>
                      <div className="flex gap-2">
                        {activity.skills.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                            {activity.skills.length} skills
                          </span>
                        )}
                        {activity.standards.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                            {activity.standards.length} standards
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 mb-3">{activity.description}</p>

                    <div className="grid grid-cols-4 gap-4 pt-3 border-t border-slate-200">
                      <div>
                        <p className="text-xs font-bold text-slate-600">DURATION</p>
                        <p className="text-lg font-black text-slate-900">{activity.duration} min</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-600">GROUP SIZE</p>
                        <p className="text-sm font-bold text-slate-900">{activity.groupSize}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-600">LOCATION</p>
                        <p className="text-sm font-bold text-slate-900">{activity.location}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-600">SAVED</p>
                        <p className="text-sm font-bold text-slate-900">{activity.savedAt.toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                      <FuturisticButton
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                      >
                        View Details
                      </FuturisticButton>
                      <button
                        onClick={() => setSavedActivities(
                          savedActivities.filter(a => a.id !== activity.id)
                        )}
                        className="px-4 py-2 text-red-600 font-bold hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'builder' && (
        <div className="rounded-2xl bg-white p-8 border border-slate-200">
          <ActivityBuilder
            onSave={handleSaveActivity}
            onCancel={() => setView('activities')}
          />
        </div>
      )}
    </div>
  );
}
