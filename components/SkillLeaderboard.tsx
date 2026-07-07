'use client';

import React, { useState, useEffect } from 'react';
import { useSkillLeaderboard } from '@/lib/credentialHooks';
import { LuxuryButton, LuxuryCard, LuxurySection, LuxuryText, LuxuryBadge } from '@/components/LuxuryUI';

const SKILL_NAMES: Record<string, string> = {
  'classroom-management': '🎯 Classroom Management',
  'student-engagement': '🎨 Student Engagement',
  'curriculum-design': '📖 Curriculum Design',
  'assessment-feedback': '📊 Assessment & Feedback',
  'parent-communication': '💬 Parent Communication',
  'professional-growth': '🌟 Professional Growth',
  'overall': '🏆 Overall Mastery'
};

const MEDAL_COLORS = {
  1: 'text-yellow-500', // Gold
  2: 'text-gray-400', // Silver
  3: 'text-orange-600', // Bronze
  default: 'text-slate-600'
};

interface SkillLeaderboardProps {
  skillId?: string;
  limit?: number;
  currentUserId?: string;
  showUserRank?: boolean;
}

export function SkillLeaderboard({
  skillId = 'overall',
  limit = 50,
  currentUserId,
  showUserRank = true
}: SkillLeaderboardProps) {
  const { leaderboard, userRank, loading, updateUserRank } = useSkillLeaderboard(skillId, limit);
  const [selectedSkill, setSelectedSkill] = useState(skillId);

  useEffect(() => {
    if (currentUserId && showUserRank) {
      updateUserRank(currentUserId);
    }
  }, [currentUserId, updateUserRank, showUserRank]);

  const skillName = SKILL_NAMES[selectedSkill] || 'Overall Leaderboard';
  const medalColor = (rank: number) => {
    if (rank === 1) return MEDAL_COLORS[1];
    if (rank === 2) return MEDAL_COLORS[2];
    if (rank === 3) return MEDAL_COLORS[3];
    return MEDAL_COLORS.default;
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <LuxurySection title={skillName} subtitle="Loading leaderboard...">
        <div className="flex justify-center p-8">
          <div className="animate-pulse">Loading top teachers...</div>
        </div>
      </LuxurySection>
    );
  }

  return (
    <div className="space-y-6">
      <LuxurySection title={skillName} subtitle="Top educators by skill mastery">
        {currentUserId && userRank && showUserRank && (
          <LuxuryCard variant="glass" className="p-4 mb-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <LuxuryText variant="label">Your Rank</LuxuryText>
                <LuxuryText variant="h2" className="text-blue-600">
                  #{userRank}
                </LuxuryText>
              </div>
              <div className="text-right">
                <LuxuryText variant="body" className="text-slate-600">
                  {leaderboard.length} total educators
                </LuxuryText>
              </div>
            </div>
          </LuxuryCard>
        )}

        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <LuxuryCard
              key={`${entry.userId}-${index}`}
              variant={index < 3 ? 'default' : 'glass'}
              className={`p-4 hover:shadow-lg transition-shadow ${
                entry.userId === currentUserId ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Rank & Name */}
                <div className="flex items-center gap-4 flex-1">
                  <div className={`text-2xl font-bold min-w-12 ${medalColor(entry.rank)}`}>
                    {getMedalEmoji(entry.rank)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <LuxuryText variant="label">{entry.teacherName}</LuxuryText>
                      {entry.achievementBadges && entry.achievementBadges.length > 0 && (
                        <div className="flex gap-1">
                          {entry.achievementBadges.map((badge, i) => (
                            <span key={i} className="text-sm">
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <LuxuryText variant="body" className="text-slate-600">
                      Level {entry.level} • {entry.credentialsCount} credentials
                    </LuxuryText>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <LuxuryText variant="h3" className="text-blue-600">
                    {entry.totalPoints.toLocaleString()}
                  </LuxuryText>
                  <LuxuryText variant="body" className="text-slate-600 text-sm">
                    points
                  </LuxuryText>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                      style={{
                        width: `${Math.min(100, (entry.totalPoints / (leaderboard[0]?.totalPoints || 1)) * 100)}%`
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 min-w-12 text-right">
                    {Math.round((entry.totalPoints / (leaderboard[0]?.totalPoints || 1)) * 100)}%
                  </span>
                </div>
              </div>
            </LuxuryCard>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center p-8">
            <LuxuryText variant="body" className="text-slate-600">
              No educators on this leaderboard yet
            </LuxuryText>
          </div>
        )}
      </LuxurySection>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <LuxuryCard variant="glass" className="p-3 text-center">
          <div className="text-2xl mb-1">🥇</div>
          <LuxuryText variant="label" className="text-yellow-600">
            1st Place
          </LuxuryText>
        </LuxuryCard>
        <LuxuryCard variant="glass" className="p-3 text-center">
          <div className="text-2xl mb-1">🥈</div>
          <LuxuryText variant="label" className="text-gray-500">
            2nd Place
          </LuxuryText>
        </LuxuryCard>
        <LuxuryCard variant="glass" className="p-3 text-center">
          <div className="text-2xl mb-1">🥉</div>
          <LuxuryText variant="label" className="text-orange-700">
            3rd Place
          </LuxuryText>
        </LuxuryCard>
        <LuxuryCard variant="glass" className="p-3 text-center">
          <div className="text-2xl mb-1">📈</div>
          <LuxuryText variant="label" className="text-blue-600">
            Top 50
          </LuxuryText>
        </LuxuryCard>
      </div>
    </div>
  );
}
