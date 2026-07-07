/**
 * React Hooks for Teacher Career Progression, AI Learning, and Team Collaboration
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { careerManager, CareerStats, Achievement, Streak, SkillArea } from '@/lib/careerProgressionManager';
import { aiLearningEngine, AIRecommendation, SystemInsight, LearningState, TeacherAction } from '@/lib/reinforcementLearningAI';
import { teamManager, Team, Collaboration, MentorshipPair, SharedResource } from '@/lib/teamCollaborationManager';
import { brightwheelManager, BrightwheelProfile, BrightwheelCourse, BrightwheelCertification } from '@/lib/brightwheelIntegration';

/**
 * Hook: Track career progression
 */
export function useCareerProgression() {
  const [stats, setStats] = useState<CareerStats | null>(null);
  const [skills, setSkills] = useState<SkillArea[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);

  useEffect(() => {
    const unsubscribe = careerManager.subscribe(() => {
      setStats(careerManager.getStats());
      setSkills(careerManager.getSkills());
      setAchievements(careerManager.getAchievements());
      setStreaks(careerManager.getStreaks());
    });

    // Initial load
    setStats(careerManager.getStats());
    setSkills(careerManager.getSkills());
    setAchievements(careerManager.getAchievements());
    setStreaks(careerManager.getStreaks());

    return unsubscribe;
  }, []);

  const awardXp = useCallback((activity: string, amount: number, multiplier?: number) => {
    careerManager.awardXp(activity, amount, multiplier);
  }, []);

  const recordActivity = useCallback((activity: string, metrics: Record<string, number>) => {
    careerManager.recordActivityImpact(activity, metrics);
  }, []);

  const unlockAchievement = useCallback((achievementId: string, achievement: Achievement) => {
    return careerManager.unlockAchievement(achievementId, achievement);
  }, []);

  const progressSkill = useCallback((skillId: string, xpAmount: number) => {
    careerManager.progressSkill(skillId, xpAmount);
  }, []);

  return {
    stats,
    skills,
    achievements,
    streaks,
    awardXp,
    recordActivity,
    unlockAchievement,
    progressSkill
  };
}

/**
 * Hook: AI Learning and recommendations
 */
export function useAICoach(teacherId: string) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [insights, setInsights] = useState<SystemInsight[]>([]);
  const [learningState, setLearningState] = useState<LearningState | null>(null);
  const [nextAction, setNextAction] = useState<{ action: string; confidence: number } | null>(null);

  useEffect(() => {
    const unsubscribe = aiLearningEngine.subscribe(() => {
      setRecommendations(aiLearningEngine.getRecommendations());
      setInsights(aiLearningEngine.getSystemInsights());
      setLearningState(aiLearningEngine.getLearningState(teacherId) || null);
      setNextAction(aiLearningEngine.predictNextBestAction(teacherId));
    });

    // Initial load
    setRecommendations(aiLearningEngine.getRecommendations());
    setInsights(aiLearningEngine.getSystemInsights());
    setLearningState(aiLearningEngine.getLearningState(teacherId) || null);
    setNextAction(aiLearningEngine.predictNextBestAction(teacherId));

    return unsubscribe;
  }, [teacherId]);

  const recordAction = useCallback((action: TeacherAction) => {
    aiLearningEngine.recordAction(action, teacherId);
  }, [teacherId]);

  const updateLearningState = useCallback((state: LearningState) => {
    aiLearningEngine.setLearningState(teacherId, state);
  }, [teacherId]);

  return {
    recommendations,
    insights,
    learningState,
    nextAction,
    recordAction,
    updateLearningState
  };
}

/**
 * Hook: Team collaboration
 */
export function useTeamCollaboration() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [mentorships, setMentorships] = useState<MentorshipPair[]>([]);
  const [sharedResources, setSharedResources] = useState<SharedResource[]>([]);

  useEffect(() => {
    const unsubscribe = teamManager.subscribe(() => {
      setTeams(teamManager.getTeams());
      setCollaborations(teamManager.getCollaborations());
      setMentorships(teamManager.getMentorships());
      setSharedResources(teamManager.getSharedResources());
    });

    // Initial load
    setTeams(teamManager.getTeams());
    setCollaborations(teamManager.getCollaborations());
    setMentorships(teamManager.getMentorships());
    setSharedResources(teamManager.getSharedResources());

    return unsubscribe;
  }, []);

  const startCollaboration = useCallback((collaboration: Collaboration) => {
    teamManager.startCollaboration(collaboration);
  }, []);

  const updateCollaborationProgress = useCallback((collaborationId: string, progress: number, outcomes?: string[]) => {
    teamManager.updateCollaborationProgress(collaborationId, progress, outcomes);
  }, []);

  const shareResource = useCallback((resource: SharedResource) => {
    teamManager.shareResource(resource);
  }, []);

  const rateResource = useCallback((resourceId: string, userId: string, rating: 1 | 2 | 3 | 4 | 5, review?: string) => {
    teamManager.rateResource(resourceId, userId, rating, review);
  }, []);

  return {
    teams,
    collaborations,
    mentorships,
    sharedResources,
    startCollaboration,
    updateCollaborationProgress,
    shareResource,
    rateResource
  };
}

/**
 * Hook: Gamification tracking
 */
export function useGamification(teacherId: string) {
  const { stats, awardXp, recordActivity } = useCareerProgression();
  const { recommendations } = useAICoach(teacherId);

  // Gamification utilities
  const trackActivity = useCallback((
    type: 'lesson_created' | 'lesson_delivered' | 'resource_shared' | 'peer_helped' | 'student_impacted',
    data?: Record<string, any>
  ) => {
    const rewards: Record<string, number> = {
      'lesson_created': 50,
      'lesson_delivered': 100,
      'resource_shared': 75,
      'peer_helped': 75,
      'student_impacted': 50
    };

    const xp = rewards[type] || 50;
    awardXp(type, xp);
    recordActivity(type, data || {});
  }, [awardXp, recordActivity]);

  const celebrateWin = useCallback((message: string, xp: number) => {
    awardXp('celebration', xp);
    console.log(`🎉 ${message} +${xp}XP`);
  }, [awardXp]);

  return {
    stats,
    recommendations,
    trackActivity,
    celebrateWin,
    isLevelUp: stats ? (stats.totalXp % 1000 < 100) : false
  };
}

/**
 * Hook: Personalized learning paths
 */
export function useLearningPaths(teacherId: string) {
  const { learningState } = useAICoach(teacherId);
  const { stats } = useCareerProgression();

  // Generate suggested learning paths based on experience level
  const getSuggestedPaths = useCallback(() => {
    if (!stats) return [];

    const yearsExp = stats.yearsOfExperience;
    const level = stats.currentTeacherLevel;

    const paths = {
      rookie: [
        { id: 'classroom-basics', title: 'Classroom Management Fundamentals', icon: '🎯', difficulty: 1 },
        { id: 'first-lessons', title: 'Planning Your First Lessons', icon: '📚', difficulty: 1 },
        { id: 'student-engagement', title: 'Capturing Student Attention', icon: '✨', difficulty: 2 }
      ],
      novice: [
        { id: 'advanced-planning', title: 'Advanced Lesson Planning', icon: '📖', difficulty: 3 },
        { id: 'assessment-strategies', title: 'Effective Assessment Techniques', icon: '📊', difficulty: 3 },
        { id: 'parent-communication', title: 'Building Parent Relationships', icon: '💬', difficulty: 2 }
      ],
      apprentice: [
        { id: 'differentiation', title: 'Differentiated Instruction', icon: '🎨', difficulty: 4 },
        { id: 'innovation', title: 'Innovative Teaching Methods', icon: '🚀', difficulty: 4 },
        { id: 'collaboration', title: 'Effective Team Teaching', icon: '🤝', difficulty: 3 }
      ],
      practitioner: [
        { id: 'leadership', title: 'Teacher Leadership Fundamentals', icon: '👑', difficulty: 5 },
        { id: 'curriculum-design', title: 'Curriculum Development', icon: '🏗️', difficulty: 5 },
        { id: 'mentoring', title: 'Mentoring New Teachers', icon: '🧑‍🏫', difficulty: 4 }
      ],
      expert: [
        { id: 'advanced-curriculum', title: 'Advanced Curriculum Design', icon: '🎓', difficulty: 7 },
        { id: 'systemic-change', title: 'School Improvement Initiatives', icon: '🌟', difficulty: 7 },
        { id: 'mentorship-mastery', title: 'Advanced Mentorship Strategies', icon: '🏆', difficulty: 6 }
      ],
      master: [
        { id: 'thought-leadership', title: 'Becoming a Thought Leader', icon: '📢', difficulty: 8 },
        { id: 'legacy-building', title: 'Building Your Teaching Legacy', icon: '👑', difficulty: 8 },
        { id: 'district-leadership', title: 'District-Level Leadership', icon: '🌐', difficulty: 8 }
      ],
      master_2: [
        { id: 'master-educator', title: 'Master Educator Development', icon: '👑', difficulty: 9 },
        { id: 'advanced-mentoring', title: 'Advanced Teacher Mentoring', icon: '🧑‍🏫', difficulty: 9 },
        { id: 'curriculum-leadership', title: 'Curriculum Leadership', icon: '📚', difficulty: 9 }
      ],
      master_3: [
        { id: 'transformational-leadership', title: 'Transformational Leadership', icon: '👑👑', difficulty: 9 },
        { id: 'innovation-leadership', title: 'Leading Innovation in Education', icon: '💡', difficulty: 10 },
        { id: 'systemic-advocacy', title: 'Systemic Education Advocacy', icon: '🗣️', difficulty: 10 }
      ],
      master_4: [
        { id: 'system-change', title: 'System Change Leadership', icon: '💎', difficulty: 10 },
        { id: 'policy-influence', title: 'Education Policy Influence', icon: '📋', difficulty: 10 },
        { id: 'movement-building', title: 'Building Educational Movements', icon: '🌍', difficulty: 10 }
      ],
      master_5: [
        { id: 'innovation-development', title: 'Innovation & Development', icon: '💎', difficulty: 10 },
        { id: 'research-leadership', title: 'Leading Education Research', icon: '🔬', difficulty: 10 },
        { id: 'network-building', title: 'Building Global Education Networks', icon: '🌐', difficulty: 10 }
      ],
      master_6: [
        { id: 'legacy-documentation', title: 'Documenting Your Legacy', icon: '✨', difficulty: 10 },
        { id: 'wisdom-sharing', title: 'Sharing Your Wisdom', icon: '📖', difficulty: 10 },
        { id: 'hall-of-fame', title: 'Hall of Fame Recognition', icon: '🏆', difficulty: 10 }
      ],
      legendary_master: [
        { id: 'eternal-legacy', title: 'Creating an Eternal Legacy', icon: '🌟', difficulty: 10 },
        { id: 'visionary-work', title: 'Visionary Education Work', icon: '✨', difficulty: 10 },
        { id: 'influence-scope', title: 'Expanding Global Influence', icon: '🌍', difficulty: 10 }
      ]
    };

    return paths[level] || [];
  }, [stats]);

  return {
    suggestedPaths: getSuggestedPaths(),
    learningState,
    experienceLevel: stats?.currentTeacherLevel
  };
}

/**
 * Hook: Real-time activity tracking
 */
export function useActivityTracking(teacherId: string) {
  const { recordActivity, awardXp } = useCareerProgression();
  const { recordAction } = useAICoach(teacherId);

  const trackLessonPlanned = useCallback(() => {
    recordActivity('lesson_planned', { count: 1 });
    awardXp('lesson_planning', 50);
  }, [recordActivity, awardXp]);

  const trackLessonDelivered = useCallback((studentsCount: number) => {
    recordActivity('lesson_delivered', { count: 1, students: studentsCount });
    awardXp('lesson_delivery', 100);
  }, [recordActivity, awardXp]);

  const trackStudentImpact = useCallback((students: number) => {
    recordActivity('student_impacted', { students });
    recordAction({
      id: `action_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'student_assessment',
      context: { students },
      outcome: 'success',
      satisfaction: 8,
      duration: 0,
      skillsImproved: ['student_engagement', 'assessment']
    });
  }, [recordActivity, recordAction]);

  const trackPeerHelp = useCallback(() => {
    recordActivity('peer_helped', { count: 1 });
    awardXp('peer_support', 75);
  }, [recordActivity, awardXp]);

  return {
    trackLessonPlanned,
    trackLessonDelivered,
    trackStudentImpact,
    trackPeerHelp
  };
}

/**
 * Hook: Mentorship tracking
 */
export function useMentorshipTracker(mentorshipId: string) {
  const { mentorships } = useTeamCollaboration();

  const mentorship = mentorships.find(m => m.id === mentorshipId);

  const getSessionHistory = useCallback(() => {
    return mentorship?.sessions || [];
  }, [mentorship]);

  const getFocusAreas = useCallback(() => {
    return mentorship?.focusAreas || [];
  }, [mentorship]);

  const getProgressMetrics = useCallback(() => {
    if (!mentorship) return null;

    const sessions = mentorship.sessions;
    return {
      totalSessions: sessions.length,
      averageSessionDuration: sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length,
      topicsCovered: [...new Set(sessions.map(s => s.topic))],
      lastSessionDate: sessions[sessions.length - 1]?.date || null,
      menteeProgress: sessions[sessions.length - 1]?.menteeProgress || []
    };
  }, [mentorship]);

  return {
    mentorship,
    sessionHistory: getSessionHistory(),
    focusAreas: getFocusAreas(),
    progressMetrics: getProgressMetrics()
  };
}

/**
 * Hook: Brightwheel integration and tracking
 */
export function useBrightwheelIntegration(teacherId: string) {
  const [profile, setProfile] = useState<BrightwheelProfile | null>(null);
  const [courses, setCourses] = useState<BrightwheelCourse[]>([]);
  const [certifications, setCertifications] = useState<BrightwheelCertification[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = brightwheelManager.subscribe(() => {
      const profile = brightwheelManager.getProfile(teacherId);
      setProfile(profile || null);
      
      if (profile) {
        setCourses(profile.courses);
        setCertifications(profile.certifications);
        setStats(profile.stats);
      }
    });

    // Initial load
    const profile = brightwheelManager.getProfile(teacherId);
    setProfile(profile || null);
    if (profile) {
      setCourses(profile.courses);
      setCertifications(profile.certifications);
      setStats(profile.stats);
    }

    return unsubscribe;
  }, [teacherId]);

  const syncProfile = useCallback(async (brightwheelEmail: string) => {
    return await brightwheelManager.syncBrightwheelProfile(teacherId, brightwheelEmail);
  }, [teacherId]);

  const addCourse = useCallback((course: BrightwheelCourse) => {
    brightwheelManager.addCourse(teacherId, course);
  }, [teacherId]);

  const addCertification = useCallback((certification: BrightwheelCertification) => {
    brightwheelManager.addCertification(teacherId, certification);
  }, [teacherId]);

  const updateCourseStatus = useCallback((
    courseId: string, 
    status: 'in_progress' | 'completed' | 'not_started',
    completionDate?: string
  ) => {
    brightwheelManager.updateCourseStatus(teacherId, courseId, status, completionDate);
  }, [teacherId]);

  const getCeuBoost = useCallback((): number => {
    return brightwheelManager.calculateCeuBoost(teacherId, '');
  }, [teacherId]);

  return {
    profile,
    courses,
    certifications,
    stats,
    syncProfile,
    addCourse,
    addCertification,
    updateCourseStatus,
    ceuBoost: getCeuBoost()
  };
}
