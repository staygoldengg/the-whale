'use client';

import React, { useState } from 'react';
import { BookOpen, Users, Target, TrendingUp, Calendar, Bell } from 'lucide-react';
import { FuturisticBackground, PulsingOrb } from './FuturisticUI';
import {
  WeatherPlaygroundRater,
  AttendanceGamification,
  NutritionDashboard,
  ScheduleTimings,
} from './SchoolCenteredDashboard';
import {
  LearningPathways,
  LessonPlanIdeas,
  GlobalEarlyLearningTrends,
} from './LearningPathwaysAndTrends';
import { WDSEducationalVideoPlayer } from './WDSEducationalVideoPlayer';

/**
 * SchoolDashboard Component
 * 
 * Comprehensive school-centered dashboard bringing together:
 * - Learning pathways & progress
 * - Lesson planning ideas
 * - Global learning trends
 * - Weather & playground suitability
 * - Nutrition tracking
 * - Schedule management
 * - Gamified attendance
 */
export function SchoolDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'learning' | 'professional' | 'daily' | 'trends'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🎓' },
    { id: 'learning', label: 'Learning', icon: '📚' },
    { id: 'professional', label: 'Professional Growth', icon: '🎓' },
    { id: 'daily', label: 'Daily', icon: '📅' },
    { id: 'trends', label: 'Trends', icon: '🌍' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-lg">
        <FuturisticBackground variant="gradient" />
        <PulsingOrb className="absolute top-8 right-12 opacity-20" />
        <PulsingOrb size="lg" className="absolute -bottom-20 -left-20 opacity-10" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" />
            <span className="text-sm font-bold uppercase tracking-wide opacity-90">School Hub</span>
          </div>
          <h1 className="text-5xl font-black mb-3">Welcome Back! 🎉</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Explore learning pathways, plan engaging lessons, and create a wonderful day for every child
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 p-6 border-2 border-blue-200">
              <p className="text-sm font-bold text-blue-700 uppercase">Children Present</p>
              <p className="text-4xl font-black text-slate-900">18</p>
              <p className="text-xs text-slate-600">of 22 enrolled</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-100 to-green-50 p-6 border-2 border-green-200">
              <p className="text-sm font-bold text-green-700 uppercase">Avg Nutrition Score</p>
              <p className="text-4xl font-black text-slate-900">85%</p>
              <p className="text-xs text-slate-600">Excellent intake</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 p-6 border-2 border-purple-200">
              <p className="text-sm font-bold text-purple-700 uppercase">Learning Progress</p>
              <p className="text-4xl font-black text-slate-900">72%</p>
              <p className="text-xs text-slate-600">Class average</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 p-6 border-2 border-orange-200">
              <p className="text-sm font-bold text-orange-700 uppercase">Playground Ready</p>
              <p className="text-4xl font-black text-green-600">✓</p>
              <p className="text-xs text-slate-600">Perfect conditions</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherPlaygroundRater />
            <AttendanceGamification />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NutritionDashboard />
            <ScheduleTimings />
          </div>
        </div>
      )}

      {/* Learning Pathways Tab */}
      {activeTab === 'learning' && (
        <div className="space-y-8">
          <LearningPathways />
          <LessonPlanIdeas />
        </div>
      )}

      {/* Professional Growth Tab */}
      {activeTab === 'professional' && (
        <div className="space-y-8">
          <WDSEducationalVideoPlayer />
        </div>
      )}

      {/* Daily Tab */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ScheduleTimings />
            </div>
            <div>
              <WeatherPlaygroundRater />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NutritionDashboard />
            <AttendanceGamification />
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div>
          <GlobalEarlyLearningTrends />
        </div>
      )}

      {/* Quick Access Section */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 border-2 border-slate-200">
        <h3 className="font-bold text-2xl text-slate-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="rounded-xl p-4 bg-white border-2 border-slate-200 hover:border-blue-300 transition-all text-center hover:shadow-lg">
            <span className="text-3xl block mb-2">📋</span>
            <p className="font-bold text-slate-900">New Lesson</p>
            <p className="text-xs text-slate-600">Create activity</p>
          </button>
          <button className="rounded-xl p-4 bg-white border-2 border-slate-200 hover:border-blue-300 transition-all text-center hover:shadow-lg">
            <span className="text-3xl block mb-2">📸</span>
            <p className="font-bold text-slate-900">Observations</p>
            <p className="text-xs text-slate-600">Log moment</p>
          </button>
          <button className="rounded-xl p-4 bg-white border-2 border-slate-200 hover:border-blue-300 transition-all text-center hover:shadow-lg">
            <span className="text-3xl block mb-2">👥</span>
            <p className="font-bold text-slate-900">Parent Chat</p>
            <p className="text-xs text-slate-600">Send update</p>
          </button>
          <button className="rounded-xl p-4 bg-white border-2 border-slate-200 hover:border-blue-300 transition-all text-center hover:shadow-lg">
            <span className="text-3xl block mb-2">📊</span>
            <p className="font-bold text-slate-900">Reports</p>
            <p className="text-xs text-slate-600">View progress</p>
          </button>
        </div>
      </div>
    </div>
  );
}
