/**
 * Credential and Skill Points React Hooks
 */

import { useCallback, useEffect, useState } from 'react';
import { credentialManager, Credential, CredentialStatus } from '@/lib/credentialVerificationManager';
import { credentialAnalyzer } from '@/lib/aiCredentialAnalyzer';
import { skillPointsManager, SkillLeaderboardEntry, UserSkillPoints } from '@/lib/skillPointsManager';

/**
 * Hook for managing credential submission and viewing
 */
export function useCredentialManagement(userId: string) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Subscribe to credential updates
    const unsubscribe = credentialManager.subscribe(allCredentials => {
      const userCreds = allCredentials.filter(c => c.userId === userId);
      setCredentials(userCreds);
      setStats(credentialManager.getCredentialStats(userId));
    });

    // Initial load
    setCredentials(credentialManager.getUserCredentials(userId));
    setStats(credentialManager.getCredentialStats(userId));

    return unsubscribe;
  }, [userId]);

  const submitCredential = useCallback(
    async (request: any) => {
      setLoading(true);
      try {
        // Submit credential
        const credential = credentialManager.submitCredential(userId, request);

        // Analyze with AI
        const analysis = credentialAnalyzer.analyzeCredential(credential);

        // Update scores
        credentialManager.updateCredentialScores(
          credential.id,
          analysis.authenticityScore,
          analysis.weightScore,
          analysis.relevanceScore,
          analysis.credibilityIndicators
        );

        // Calculate points
        const pointsAwarded = credentialAnalyzer.calculatePointsAwarded(
          analysis.authenticityScore,
          analysis.weightScore,
          analysis.relevanceScore
        );

        const skillPoints = credentialAnalyzer.distributeSkillPoints(
          pointsAwarded,
          analysis.suggestedSkills,
          analysis.relevanceScore
        );

        // Award points to skill manager
        skillPoints.forEach(({ skillId, points }) => {
          skillPointsManager.awardSkillPoints(
            userId,
            skillId,
            points,
            'credential',
            credential.id,
            `Points from credential: ${credential.title}`
          );
        });

        // Verify credential
        credentialManager.verifyCredential(credential.id, pointsAwarded, skillPoints, 'ai_analyzer');

        // Save to storage
        credentialManager.saveToStorage();
        skillPointsManager.saveToStorage();

        return credential;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return {
    credentials,
    stats,
    loading,
    submitCredential,
    getCredential: (id: string) => credentialManager.getCredential(id),
    deleteCredential: (id: string) => {
      // Implementation for deletion
    }
  };
}

/**
 * Hook for viewing and tracking skill points
 */
export function useSkillPoints(userId: string) {
  const [allSkills, setAllSkills] = useState<UserSkillPoints[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [topSkill, setTopSkill] = useState<UserSkillPoints | null>(null);

  useEffect(() => {
    const unsubscribe = skillPointsManager.subscribe(() => {
      const skills = skillPointsManager.getUserAllSkills(userId);
      setAllSkills(skills);

      const total = skills.reduce((sum, s) => sum + s.totalPoints, 0);
      setTotalPoints(total);

      const top = skills.length > 0 
        ? skills.reduce((max, s) => (s.totalPoints > max.totalPoints ? s : max))
        : null;
      setTopSkill(top);
    });

    // Initial load
    const skills = skillPointsManager.getUserAllSkills(userId);
    setAllSkills(skills);
    const total = skills.reduce((sum, s) => sum + s.totalPoints, 0);
    setTotalPoints(total);
    const top = skills.length > 0
      ? skills.reduce((max, s) => (s.totalPoints > max.totalPoints ? s : max))
      : null;
    setTopSkill(top);

    return unsubscribe;
  }, [userId]);

  return {
    allSkills,
    totalPoints,
    topSkill,
    getSkillPoints: (skillId: string) => skillPointsManager.getUserSkillPoints(userId, skillId),
    awardPoints: (skillId: string, points: number, source: string) =>
      skillPointsManager.awardSkillPoints(userId, skillId, points, 'activity', undefined, source)
  };
}

/**
 * Hook for viewing leaderboards
 */
export function useSkillLeaderboard(skillId?: string, limit: number = 50) {
  const [leaderboard, setLeaderboard] = useState<SkillLeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Initial load
    if (skillId && skillId !== 'overall') {
      const lb = skillPointsManager.getSkillLeaderboard(skillId, limit);
      setLeaderboard(lb);
    } else {
      const lb = skillPointsManager.getOverallLeaderboard(limit);
      setLeaderboard(lb);
    }

    setLoading(false);
  }, [skillId, limit]);

  const updateUserRank = useCallback(
    (userId: string) => {
      if (skillId && skillId !== 'overall') {
        const rank = skillPointsManager.getUserRankInSkill(userId, skillId);
        setUserRank(rank);
      } else {
        const rank = skillPointsManager.getUserOverallRank(userId);
        setUserRank(rank);
      }
    },
    [skillId]
  );

  return {
    leaderboard,
    userRank,
    loading,
    updateUserRank,
    refresh: () => {
      if (skillId && skillId !== 'overall') {
        setLeaderboard(skillPointsManager.getSkillLeaderboard(skillId, limit));
      } else {
        setLeaderboard(skillPointsManager.getOverallLeaderboard(limit));
      }
    }
  };
}

/**
 * Hook for credential analytics
 */
export function useCredentialAnalytics(userId: string) {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const credentials = credentialManager.getUserCredentials(userId);
    const verified = credentials.filter(c => c.status === CredentialStatus.VERIFIED);

    const avgAuthenticityScore =
      verified.length > 0
        ? verified.reduce((sum, c) => sum + c.authenticityScore, 0) / verified.length
        : 0;

    const avgWeightScore =
      verified.length > 0
        ? verified.reduce((sum, c) => sum + c.weightScore, 0) / verified.length
        : 0;

    const avgRelevanceScore =
      verified.length > 0
        ? verified.reduce((sum, c) => sum + c.relevanceScore, 0) / verified.length
        : 0;

    const credentialsByType: Record<string, number> = {};
    credentials.forEach(c => {
      credentialsByType[c.type] = (credentialsByType[c.type] || 0) + 1;
    });

    setAnalytics({
      totalCredentials: credentials.length,
      verifiedCount: verified.length,
      pendingCount: credentials.filter(c => c.status === CredentialStatus.PENDING).length,
      rejectedCount: credentials.filter(c => c.status === CredentialStatus.REJECTED).length,
      averageAuthenticityScore: Math.round(avgAuthenticityScore),
      averageWeightScore: Math.round(avgWeightScore),
      averageRelevanceScore: Math.round(avgRelevanceScore),
      credentialsByType,
      totalPointsEarned: verified.reduce((sum, c) => sum + c.totalPointsAwarded, 0)
    });
  }, [userId]);

  return analytics;
}
