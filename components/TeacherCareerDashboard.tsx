'use client';

import React, { useState } from 'react';
import { useCareerProgression, useAICoach, useTeamCollaboration, useActivityTracking } from '@/lib/teacherCareerHooks';
import { LuxuryCard, LuxuryButton, LuxuryText, LuxuryStat, LuxurySection, LuxuryBadge } from './LuxuryUI';

export function TeacherCareerDashboard() {
  const [teacherId] = useState('teacher_001'); // Would come from auth
  const { stats, recordActivity } = useCareerProgression();
  const { recommendations, insights, nextAction } = useAICoach(teacherId);
  const { teams, collaborations, sharedResources } = useTeamCollaboration();
  const { trackLessonDelivered, trackPeerHelp } = useActivityTracking(teacherId);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Hero Section */}
        <LuxuryCard variant="elevated" className="overflow-hidden">
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="absolute top-0 right-0 opacity-20">
              <svg className="w-64 h-64" viewBox="0 0 200 200" fill="currentColor">
                <circle cx="100" cy="100" r="80" opacity="0.1" />
                <circle cx="100" cy="100" r="60" opacity="0.1" />
              </svg>
            </div>
            <div className="relative z-10">
              <LuxuryText variant="h2" className="text-white mb-2">
                Welcome back, Teacher! 👋
              </LuxuryText>
              <LuxuryText variant="body" className="text-blue-100">
                You're on Level {stats.level} • {stats.yearsOfExperience.toFixed(1)} years of experience
              </LuxuryText>
            </div>
          </div>
        </LuxuryCard>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LuxuryCard variant="default" className="p-4">
            <LuxuryButton 
              variant="primary" 
              className="w-full justify-center"
              onClick={() => trackLessonDelivered(30)}
            >
              ✏️ Log Lesson Delivered
            </LuxuryButton>
            <LuxuryText variant="caption" className="mt-2 text-center text-slate-500">
              +100 XP | Builds your streak
            </LuxuryText>
          </LuxuryCard>

          <LuxuryCard variant="default" className="p-4">
            <LuxuryButton 
              variant="secondary" 
              className="w-full justify-center"
              onClick={() => trackPeerHelp()}
            >
              🤝 Help a Colleague
            </LuxuryButton>
            <LuxuryText variant="caption" className="mt-2 text-center text-slate-500">
              +75 XP | Strengthen team bonds
            </LuxuryText>
          </LuxuryCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Career Progress & Next Action */}
          <div className="lg:col-span-1 space-y-6">
            {/* Next AI-Recommended Action */}
            {nextAction && (
              <LuxurySection
                title="AI Coach Recommendation 🤖"
                subtitle="Your next best step"
              >
                <LuxuryCard variant="glass" className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <LuxuryText variant="label">Predicted Action</LuxuryText>
                        <LuxuryText variant="body" className="font-semibold mt-1">
                          {nextAction.action}
                        </LuxuryText>
                      </div>
                      <div className="text-right">
                        <LuxuryText variant="label">Confidence</LuxuryText>
                        <div className="text-lg font-bold text-green-600">
                          {Math.round(nextAction.confidence)}%
                        </div>
                      </div>
                    </div>
                    <LuxuryButton variant="outline" size="sm" className="w-full">
                      Learn More
                    </LuxuryButton>
                  </div>
                </LuxuryCard>
              </LuxurySection>
            )}

            {/* Active Teams */}
            <LuxurySection
              title="My Teams 👥"
              subtitle={`${teams.length} active team${teams.length !== 1 ? 's' : ''}`}
            >
              <div className="space-y-2">
                {teams.slice(0, 2).map(team => (
                  <LuxuryCard key={team.id} variant="default" className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <LuxuryText variant="label">{team.name}</LuxuryText>
                        <LuxuryText variant="caption" className="text-slate-500">
                          {team.members.length} members
                        </LuxuryText>
                      </div>
                      <LuxuryBadge variant="info">📝 {team.collaborationStats.lessonsCoPlanned}</LuxuryBadge>
                    </div>
                  </LuxuryCard>
                ))}
              </div>
            </LuxurySection>
          </div>

          {/* Center Column: Recommendations & Insights */}
          <div className="lg:col-span-1 space-y-6">
            {/* Top Recommendations */}
            <LuxurySection
              title="Learning Recommendations 📚"
              subtitle="Personalized for you"
            >
              <div className="space-y-3">
                {recommendations.slice(0, 2).map(rec => (
                  <LuxuryCard key={rec.id} variant="default" className="p-3">
                    <div className="flex gap-3">
                      <div className="text-2xl">{rec.icon}</div>
                      <div className="flex-1 min-w-0">
                        <LuxuryText variant="label" className="line-clamp-1">{rec.title}</LuxuryText>
                        <LuxuryText variant="caption" className="text-slate-500 line-clamp-1">
                          {rec.estimatedTimeToComplete} min
                        </LuxuryText>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden mr-2">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-400 to-purple-600"
                              style={{ width: `${rec.relevanceScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-600">{rec.relevanceScore}%</span>
                        </div>
                      </div>
                    </div>
                  </LuxuryCard>
                ))}
              </div>
            </LuxurySection>

            {/* System Insights */}
            <LuxurySection
              title="System Insights 💡"
              subtitle="What the AI discovered"
            >
              <div className="space-y-2">
                {insights.slice(0, 2).map(insight => (
                  <LuxuryCard key={insight.id} variant="glass" className="p-3">
                    <LuxuryText variant="label" className="line-clamp-1">{insight.title}</LuxuryText>
                    <LuxuryText variant="caption" className="text-slate-500 line-clamp-2 mt-1">
                      {insight.description}
                    </LuxuryText>
                  </LuxuryCard>
                ))}
              </div>
            </LuxurySection>
          </div>

          {/* Right Column: Key Metrics & Resources */}
          <div className="lg:col-span-1 space-y-6">
            {/* Key Metrics */}
            <LuxurySection title="Your Impact 🌟" subtitle="This month">
              <div className="space-y-3">
                <LuxuryCard variant="default" className="p-3">
                  <LuxuryStat
                    icon="📝"
                    label="Lessons Planned"
                    value={stats.lessonsPlanned}
                    unit=""
                    trend={12}
                  />
                </LuxuryCard>
                <LuxuryCard variant="default" className="p-3">
                  <LuxuryStat
                    icon="🎓"
                    label="Lessons Delivered"
                    value={stats.lessonsDelivered}
                    unit=""
                    trend={8}
                  />
                </LuxuryCard>
                <LuxuryCard variant="default" className="p-3">
                  <LuxuryStat
                    icon="👥"
                    label="Students Impacted"
                    value={stats.studentsImpacted}
                    unit=""
                    trend={15}
                  />
                </LuxuryCard>
              </div>
            </LuxurySection>

            {/* Shared Resources */}
            <LuxurySection
              title="Team Resources 📚"
              subtitle={`${sharedResources.length} available`}
            >
              <div className="space-y-2">
                {sharedResources.slice(0, 2).map(resource => (
                  <LuxuryCard key={resource.id} variant="default" className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <LuxuryText variant="label" className="line-clamp-1">{resource.title}</LuxuryText>
                        <div className="flex gap-2 mt-1">
                          <LuxuryBadge variant="info" className="text-xs">
                            ⭐ {resource.avgRating.toFixed(1)}
                          </LuxuryBadge>
                          <LuxuryBadge variant="success" className="text-xs">
                            📥 {resource.downloadCount}
                          </LuxuryBadge>
                        </div>
                      </div>
                    </div>
                  </LuxuryCard>
                ))}
              </div>
            </LuxurySection>
          </div>
        </div>

        {/* Collaborations In Progress */}
        <LuxurySection
          title="Active Collaborations 🤝"
          subtitle={`${collaborations.length} ongoing project${collaborations.length !== 1 ? 's' : ''}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collaborations.filter(c => c.status === 'active').map(collab => (
              <LuxuryCard key={collab.id} variant="default" className="p-4">
                <div className="space-y-3">
                  <div>
                    <LuxuryText variant="label">{collab.title}</LuxuryText>
                    <LuxuryText variant="caption" className="text-slate-500 line-clamp-2">
                      {collab.description}
                    </LuxuryText>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold text-slate-600">Progress</span>
                      <span className="text-sm font-bold text-purple-600">{collab.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-600 transition-all"
                        style={{ width: `${collab.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-sm text-slate-600">
                      👥 {collab.participants.length} teachers
                    </span>
                    {collab.deadline && (
                      <span className="text-sm text-slate-600">
                        📅 {new Date(collab.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </LuxurySection>

        {/* Gamification Footer */}
        <LuxuryCard variant="glass" className="p-6 text-center">
          <div className="space-y-3">
            <LuxuryText variant="h3">🎮 Keep Growing!</LuxuryText>
            <LuxuryText variant="body" className="text-slate-600">
              You&apos;re making incredible progress on your teaching journey. 
              {stats.totalXp % 1000 < 100 && ' You&apos;re close to leveling up! '}
            </LuxuryText>
            <div className="flex gap-2 justify-center flex-wrap">
              <LuxuryBadge variant="success">🔥 {stats.communityContributions} contributions</LuxuryBadge>
              <LuxuryBadge variant="info">🏆 {stats.achievementsCount} achievements</LuxuryBadge>
              <LuxuryBadge variant="warning">⭐ Mentoring {stats.menteeCount} teachers</LuxuryBadge>
            </div>
          </div>
        </LuxuryCard>
      </div>
    </div>
  );
}
