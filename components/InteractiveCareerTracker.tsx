'use client';

import React, { useState, useEffect } from 'react';
import { careerManager, TeacherLevel, CareerStats } from '@/lib/careerProgressionManager';
import { aiLearningEngine, AIRecommendation } from '@/lib/reinforcementLearningAI';
import { teamManager, Team, Collaboration } from '@/lib/teamCollaborationManager';
import { LuxuryCard, LuxuryButton, LuxuryText, LuxuryStat, LuxurySection, LuxuryBadge, LuxuryGradientBg } from './LuxuryUI';

interface CareerMilestoneUI {
  level: TeacherLevel;
  emoji: string;
  title: string;
  subtitle: string;
  yearsRange: string;
  color: string;
}

const CAREER_MILESTONES: Record<TeacherLevel, CareerMilestoneUI> = {
  rookie: {
    level: 'rookie',
    emoji: '🌱',
    title: 'Rookie',
    subtitle: 'Just Starting',
    yearsRange: 'Year 0-2',
    color: 'from-blue-400 to-blue-600'
  },
  novice: {
    level: 'novice',
    emoji: '🚀',
    title: 'Novice',
    subtitle: 'Learning Basics',
    yearsRange: 'Year 2-4',
    color: 'from-cyan-400 to-cyan-600'
  },
  apprentice: {
    level: 'apprentice',
    emoji: '📚',
    title: 'Apprentice',
    subtitle: 'Building Confidence',
    yearsRange: 'Year 4-6',
    color: 'from-purple-400 to-purple-600'
  },
  practitioner: {
    level: 'practitioner',
    emoji: '⭐',
    title: 'Practitioner',
    subtitle: 'Skilled Professional',
    yearsRange: 'Year 6-9',
    color: 'from-pink-400 to-pink-600'
  },
  expert: {
    level: 'expert',
    emoji: '🏆',
    title: 'Expert',
    subtitle: 'Mastery Level',
    yearsRange: 'Year 9-12',
    color: 'from-orange-400 to-orange-600'
  },
  master: {
    level: 'master',
    emoji: '👑',
    title: 'Master',
    subtitle: 'Wise Mentor',
    yearsRange: 'Year 12-15',
    color: 'from-red-400 to-red-600'
  },
  master_2: {
    level: 'master_2',
    emoji: '👑',
    title: 'Master Educator',
    subtitle: 'Advanced Mentor',
    yearsRange: 'Year 15-18',
    color: 'from-red-500 to-rose-600'
  },
  master_3: {
    level: 'master_3',
    emoji: '👑👑',
    title: 'Senior Master',
    subtitle: 'Transformational Leader',
    yearsRange: 'Year 18-21',
    color: 'from-rose-500 to-pink-600'
  },
  master_4: {
    level: 'master_4',
    emoji: '💎',
    title: 'Master IV',
    subtitle: 'System Change Agent',
    yearsRange: 'Year 21-24',
    color: 'from-indigo-400 to-indigo-600'
  },
  master_5: {
    level: 'master_5',
    emoji: '💎',
    title: 'Master V',
    subtitle: 'Education Innovator',
    yearsRange: 'Year 24-27',
    color: 'from-violet-400 to-violet-600'
  },
  master_6: {
    level: 'master_6',
    emoji: '✨',
    title: 'Master VI',
    subtitle: 'Teaching Legend',
    yearsRange: 'Year 27-30',
    color: 'from-yellow-400 to-yellow-600'
  },
  legendary_master: {
    level: 'legendary_master',
    emoji: '🌟',
    title: 'Legendary Master',
    subtitle: 'Hall of Fame Educator',
    yearsRange: 'Year 30+',
    color: 'from-yellow-300 via-orange-300 to-red-300'
  }
};

const SKILL_CATEGORIES = [
  { name: 'Classroom Management', icon: '🎯', color: 'bg-blue-100' },
  { name: 'Student Engagement', icon: '🎨', color: 'bg-purple-100' },
  { name: 'Curriculum Design', icon: '📖', color: 'bg-green-100' },
  { name: 'Assessment & Feedback', icon: '📊', color: 'bg-orange-100' },
  { name: 'Parent Communication', icon: '💬', color: 'bg-pink-100' },
  { name: 'Professional Growth', icon: '🌟', color: 'bg-yellow-100' }
];

export function InteractiveCareerTracker() {
  const [stats, setStats] = useState<CareerStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'achievements' | 'ai-coach' | 'team' | 'brightwheel'>('overview');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const unsubscribe = careerManager.subscribe(() => {
      setStats(careerManager.getStats());
    });

    // Initial load
    setStats(careerManager.getStats());
    setRecommendations(aiLearningEngine.getRecommendations());
    setTeams(teamManager.getTeams());

    return unsubscribe;
  }, []);

  if (!stats) return null;

  const milestone = CAREER_MILESTONES[stats.currentTeacherLevel];
  const skills = careerManager.getSkills();
  const achievements = careerManager.getAchievements();
  const streaks = careerManager.getStreaks();

  const progressToNextLevel = (stats.level % 10) * 10; // 0-100%

  return (
    <LuxuryGradientBg variant="luxury">
      <div className="min-h-screen p-6 space-y-8">
        {/* Header with Career Level */}
        <div className="relative">
          <LuxuryCard variant="elevated" className="overflow-hidden">
            <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 p-8">
              {/* Animated background */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
              </div>

              <div className="relative z-10 flex items-center justify-between h-full">
                <div className="space-y-3">
                  <div className="text-6xl">{milestone.emoji}</div>
                  <div>
                    <LuxuryText variant="h2" className="text-white">{milestone.title} Teacher</LuxuryText>
                    <LuxuryText variant="body" className="text-slate-300">{milestone.yearsRange}</LuxuryText>
                  </div>
                </div>

                <div className="text-right space-y-4">
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                    <div className="text-4xl font-bold text-white">{stats.level}</div>
                    <LuxuryText variant="label" className="text-slate-300">Current Level</LuxuryText>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">{stats.totalXp.toLocaleString()}</div>
                    <LuxuryText variant="label" className="text-slate-300">Total XP</LuxuryText>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                <div 
                  className={`h-full bg-gradient-to-r ${milestone.color} transition-all duration-500`}
                  style={{ width: `${progressToNextLevel}%` }}
                />
              </div>
            </div>
          </LuxuryCard>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LuxuryCard variant="default" className="p-4 text-center">
            <div className="text-3xl mb-2">📝</div>
            <LuxuryStat
              icon="📝"
              label="Lessons Planned"
              value={stats.lessonsPlanned}
              unit=""
              trend={5}
            />
          </LuxuryCard>

          <LuxuryCard variant="default" className="p-4 text-center">
            <div className="text-3xl mb-2">🎓</div>
            <LuxuryStat
              icon="🎓"
              label="Lessons Delivered"
              value={stats.lessonsDelivered}
              unit=""
              trend={3}
            />
          </LuxuryCard>

          <LuxuryCard variant="default" className="p-4 text-center">
            <div className="text-3xl mb-2">👥</div>
            <LuxuryStat
              icon="👥"
              label="Students Impacted"
              value={stats.studentsImpacted}
              unit=""
              trend={8}
            />
          </LuxuryCard>

          <LuxuryCard variant="default" className="p-4 text-center">
            <div className="text-3xl mb-2">🤝</div>
            <LuxuryStat
              icon="🤝"
              label="Peers Helped"
              value={stats.peersHelped}
              unit=""
              trend={4}
            />
          </LuxuryCard>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 flex-wrap">
          {(['overview', 'skills', 'achievements', 'ai-coach', 'team', 'brightwheel'] as const).map(tab => (
            <LuxuryButton
              key={tab}
              variant={activeTab === tab ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'skills' && '🎯 Skills'}
              {tab === 'achievements' && '🏆 Achievements'}
              {tab === 'ai-coach' && '🤖 AI Coach'}
              {tab === 'team' && '👥 Team'}
              {tab === 'brightwheel' && '🌟 Brightwheel'}
            </LuxuryButton>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <LuxurySection
              title="Active Streaks 🔥"
              subtitle="Keep the momentum going!"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {streaks.map(streak => (
                  <LuxuryCard key={streak.id} variant="default" className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <LuxuryText variant="label">{streak.activity.replace(/_/g, ' ')}</LuxuryText>
                        <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-pink-600 bg-clip-text">
                          {streak.currentCount} day streak
                        </div>
                        <LuxuryText variant="caption" className="text-slate-500">
                          Max: {streak.maxCount} days • {(streak.xpMultiplier).toFixed(1)}x XP
                        </LuxuryText>
                      </div>
                      <div className="text-4xl">🔥</div>
                    </div>
                  </LuxuryCard>
                ))}
              </div>
            </LuxurySection>

            {/* Next Milestone */}
            <LuxurySection
              title="Path to Next Level 🚀"
              subtitle={`${Math.round(progressToNextLevel)}% progress to Level ${stats.level + 1}`}
            >
              <LuxuryCard variant="glass" className="p-6">
                <div className="space-y-4">
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-600 transition-all duration-500"
                      style={{ width: `${progressToNextLevel}%` }}
                    />
                  </div>
                  <LuxuryText variant="body">
                    {Math.round((stats.level + 1 - stats.level) * 1000 - (stats.totalXp % 1000))} XP until next level
                  </LuxuryText>
                </div>
              </LuxuryCard>
            </LuxurySection>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">
            <LuxurySection
              title="Skill Development 🎯"
              subtitle={`${skills.length} skills unlocked`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SKILL_CATEGORIES.map((category, idx) => {
                  const skill = skills[idx] || {
                    name: category.name,
                    level: 0,
                    maxLevel: 10,
                    proficiency: 0
                  };

                  return (
                    <LuxuryCard key={category.name} variant="default" className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{category.icon}</span>
                          <LuxuryText variant="label">{category.name}</LuxuryText>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Level {skill.level || 0}</span>
                            <span className="text-sm font-bold text-purple-600">{Math.round(skill.proficiency || 0)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-400 to-pink-600 rounded-full transition-all"
                              style={{ width: `${skill.proficiency || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </LuxuryCard>
                  );
                })}
              </div>
            </LuxurySection>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <LuxurySection
              title="Achievements 🏆"
              subtitle={`${achievements.length} achievements unlocked`}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements.map(achievement => (
                  <LuxuryCard key={achievement.id} variant="default" className="p-4 text-center">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <LuxuryText variant="label" className="line-clamp-2">{achievement.title}</LuxuryText>
                    <LuxuryBadge variant="success" className="mt-2 text-xs">
                      +{achievement.xpReward} XP
                    </LuxuryBadge>
                  </LuxuryCard>
                ))}
              </div>
            </LuxurySection>
          </div>
        )}

        {activeTab === 'ai-coach' && (
          <div className="space-y-6">
            <LuxurySection
              title="AI-Powered Recommendations 🤖"
              subtitle="Personalized insights based on your teaching journey"
            >
              <div className="space-y-4">
                {recommendations.slice(0, 3).map(rec => (
                  <LuxuryCard key={rec.id} variant="glass" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-4xl mb-2">{rec.icon}</div>
                        <LuxuryText variant="h3" className="mb-2">{rec.title}</LuxuryText>
                        <LuxuryText variant="body" className="text-slate-600">{rec.description}</LuxuryText>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <LuxuryText variant="label" className="text-slate-600">Relevance</LuxuryText>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-400 to-blue-600" style={{ width: `${rec.relevanceScore}%` }}/>
                            </div>
                            <span className="font-bold text-sm">{rec.relevanceScore}%</span>
                          </div>
                        </div>
                        <div>
                          <LuxuryText variant="label" className="text-slate-600">Difficulty</LuxuryText>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div 
                                key={i} 
                                className={`h-2 w-2 rounded-full ${i < rec.difficulty ? 'bg-orange-500' : 'bg-slate-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <LuxuryText variant="label" className="text-slate-600">Estimated Time</LuxuryText>
                          <LuxuryText variant="h3" className="text-blue-600">{rec.estimatedTimeToComplete} min</LuxuryText>
                        </div>
                        <LuxuryButton variant="primary" size="sm">
                          Start Learning
                        </LuxuryButton>
                      </div>
                    </div>
                  </LuxuryCard>
                ))}
              </div>
            </LuxurySection>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <LuxurySection
              title="Team Collaborations 👥"
              subtitle={`${teams.length} active team${teams.length !== 1 ? 's' : ''}`}
            >
              <div className="space-y-4">
                {teams.map(team => (
                  <LuxuryCard key={team.id} variant="default" className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <LuxuryText variant="h3">{team.name}</LuxuryText>
                        <LuxuryText variant="body" className="text-slate-600">{team.members.length} members</LuxuryText>
                        <div className="flex gap-2 flex-wrap mt-2">
                          <LuxuryBadge variant="info">
                            📝 {team.collaborationStats.lessonsCoPlanned} co-planned
                          </LuxuryBadge>
                          <LuxuryBadge variant="success">
                            📚 {team.collaborationStats.resourcesShared} shared
                          </LuxuryBadge>
                        </div>
                      </div>
                      <LuxuryButton variant="outline" size="sm">
                        View Team
                      </LuxuryButton>
                    </div>
                  </LuxuryCard>
                ))}
              </div>
            </LuxurySection>
          </div>
        )}

        {activeTab === 'brightwheel' && (
          <div className="space-y-6">
            <LuxurySection
              title="Brightwheel Professional Development 🌟"
              subtitle="Track your certifications and continuing education"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <LuxuryCard variant="default" className="p-4">
                  <LuxuryStat
                    icon="📚"
                    label="Courses Completed"
                    value={25}
                    unit=""
                    trend={3}
                  />
                </LuxuryCard>
                <LuxuryCard variant="default" className="p-4">
                  <LuxuryStat
                    icon="🎓"
                    label="CEUs Earned"
                    value={5.3}
                    unit=""
                    trend={0.5}
                  />
                </LuxuryCard>
                <LuxuryCard variant="default" className="p-4">
                  <LuxuryStat
                    icon="⏱️"
                    label="Hours Completed"
                    value={53.5}
                    unit=""
                    trend={8}
                  />
                </LuxuryCard>
                <LuxuryCard variant="default" className="p-4">
                  <LuxuryStat
                    icon="🏆"
                    label="Certifications"
                    value={6}
                    unit=""
                    trend={1}
                  />
                </LuxuryCard>
              </div>

              <LuxurySection title="Recent Courses" subtitle="Completed learning activities">
                <div className="space-y-3">
                  {[
                    { title: 'Using Observation and Assessment to Inform Practice', status: 'In progress', hours: 1, ceus: 0.1 },
                    { title: 'CDA Preparing to Apply', status: 'In progress', hours: 1, ceus: 0.1 },
                    { title: 'Experience Assessment Reliability Course', status: 'Completed', hours: 1, ceus: 0.1 },
                    { title: 'Using Little Learners with Experience Curriculum', status: 'Completed', hours: 1, ceus: 0.1 },
                    { title: 'Building a Passion for Early Childhood Education', status: 'Completed', hours: 1, ceus: 0.1 }
                  ].map((course, idx) => (
                    <LuxuryCard key={idx} variant="glass" className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <LuxuryText variant="label">{course.title}</LuxuryText>
                          <div className="flex gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${course.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {course.status}
                            </span>
                            <span className="text-xs text-slate-500">{course.hours}h • {course.ceus} CEUs</span>
                          </div>
                        </div>
                        {course.status === 'Completed' && (
                          <LuxuryButton variant="outline" size="sm">
                            View Certificate
                          </LuxuryButton>
                        )}
                      </div>
                    </LuxuryCard>
                  ))}
                </div>
              </LuxurySection>
            </LuxurySection>

            <LuxuryCard variant="glass" className="p-6 text-center">
              <LuxuryText variant="h3">🔗 Connect Brightwheel Account</LuxuryText>
              <LuxuryText variant="body" className="text-slate-600 mt-2">
                Sync your Brightwheel courses and certifications automatically
              </LuxuryText>
              <LuxuryButton variant="primary" className="mt-4">
                Connect to Brightwheel
              </LuxuryButton>
            </LuxuryCard>
          </div>
        )}
      </div>
    </LuxuryGradientBg>
  );
}
