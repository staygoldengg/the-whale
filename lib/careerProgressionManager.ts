/**
 * Teacher Career Progression System
 * Tracks teaching journey from Year 0 (rookie) to 15+ years (veteran)
 * Gamified with achievements, XP, streaks, and skill development
 */

export type TeacherLevel = 
  | 'rookie'        // Year 0-1: Just starting
  | 'novice'        // Year 1-3: Learning basics
  | 'apprentice'    // Year 3-5: Building confidence
  | 'practitioner'  // Year 5-8: Skilled professional
  | 'expert'        // Year 8-12: Mastery level
  | 'veteran'       // Year 12-15: Wise mentor
  | 'master';       // Year 15+: Legend

export interface CareerMilestone {
  id: string;
  level: TeacherLevel;
  title: string;
  description: string;
  yearsOfExperience: number;
  requirements: string[];
  unlockableFeatures: string[];
  icon: string;
  successRate: number; // 0-100
}

export interface SkillArea {
  id: string;
  name: string;
  category: 'core' | 'advanced' | 'specialized';
  description: string;
  level: number; // 0-10
  maxLevel: number;
  experience: number;
  nextMilestoneXp: number;
  proficiency: number; // 0-100%
  endorsements: number; // How many peers endorsed this
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: string;
  xpReward: number;
  progressToward?: string; // Path or goal this achievement contributes to
}

export interface Streak {
  id: string;
  activity: 'lesson_planning' | 'parent_engagement' | 'student_assessment' | 'professional_development';
  currentCount: number;
  maxCount: number;
  lastActivityDate: string;
  xpMultiplier: number; // Increases with streak
}

export interface CareerStats {
  totalXp: number;
  level: number; // 1-100
  yearsOfExperience: number;
  currentTeacherLevel: TeacherLevel;
  lessonsPlanned: number;
  lessonsDelivered: number;
  studentsImpacted: number;
  peersHelped: number;
  menteeCount: number;
  mentoredByCount: number;
  achievementsCount: number;
  skillsUnlocked: number;
  communityContributions: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  targetLevel: TeacherLevel;
  skills: SkillArea[];
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  mentor?: string; // Recommended mentor name
  progress: number; // 0-100%
  checkpoints: string[];
  completedCheckpoints: string[];
}

export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  category: 'skill_development' | 'student_impact' | 'collaboration' | 'innovation' | 'leadership';
  targetLevel: TeacherLevel;
  deadline: string;
  progress: number; // 0-100%
  milestones: Array<{
    title: string;
    completed: boolean;
    completedDate?: string;
  }>;
  xpReward: number;
  difficulty: number; // 1-10
}

// Teacher Career Progression Manager
class CareerProgressionManager {
  private careerStats: CareerStats = {
    totalXp: 0,
    level: 1,
    yearsOfExperience: 0,
    currentTeacherLevel: 'rookie',
    lessonsPlanned: 0,
    lessonsDelivered: 0,
    studentsImpacted: 0,
    peersHelped: 0,
    menteeCount: 0,
    mentoredByCount: 0,
    achievementsCount: 0,
    skillsUnlocked: 0,
    communityContributions: 0,
  };

  private skills: Map<string, SkillArea> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private streaks: Map<string, Streak> = new Map();
  private careerGoals: Map<string, CareerGoal> = new Map();
  private learningPaths: Map<string, LearningPath> = new Map();

  private listeners: Set<() => void> = new Set();

  /**
   * Award XP for activities
   */
  awardXp(activity: string, amount: number, multiplier: number = 1): void {
    const totalXp = Math.floor(amount * multiplier);
    this.careerStats.totalXp += totalXp;
    
    // Check for level up
    const oldLevel = this.careerStats.level;
    this.careerStats.level = Math.floor(this.careerStats.totalXp / 1000) + 1;
    
    if (this.careerStats.level > oldLevel) {
      this.onLevelUp();
    }

    // Update career level based on XP
    this.updateCareerLevel();
    this.notifyListeners();
  }

  /**
   * Update teacher level based on years of experience
   */
  private updateCareerLevel(): void {
    const years = this.careerStats.yearsOfExperience;
    
    if (years < 1) this.careerStats.currentTeacherLevel = 'rookie';
    else if (years < 3) this.careerStats.currentTeacherLevel = 'novice';
    else if (years < 5) this.careerStats.currentTeacherLevel = 'apprentice';
    else if (years < 8) this.careerStats.currentTeacherLevel = 'practitioner';
    else if (years < 12) this.careerStats.currentTeacherLevel = 'expert';
    else if (years < 15) this.careerStats.currentTeacherLevel = 'veteran';
    else this.careerStats.currentTeacherLevel = 'master';
  }

  /**
   * Unlock achievement
   */
  unlockAchievement(achievementId: string, achievement: Achievement): boolean {
    if (this.achievements.has(achievementId)) {
      return false; // Already unlocked
    }

    achievement.unlockedAt = new Date().toISOString();
    this.achievements.set(achievementId, achievement);
    
    this.awardXp(`achievement_${achievementId}`, achievement.xpReward, 2);
    this.careerStats.achievementsCount++;
    
    this.notifyListeners();
    return true;
  }

  /**
   * Add/update skill
   */
  addSkill(skill: SkillArea): void {
    this.skills.set(skill.id, skill);
    
    if (skill.level > 0 && !this.skills.has(skill.id)) {
      this.careerStats.skillsUnlocked++;
    }
    
    this.notifyListeners();
  }

  /**
   * Progress skill level
   */
  progressSkill(skillId: string, xpAmount: number): void {
    const skill = this.skills.get(skillId);
    if (!skill) return;

    skill.experience += xpAmount;
    
    const xpPerLevel = 1000;
    const newLevel = Math.floor(skill.experience / xpPerLevel);
    
    if (newLevel > skill.level && newLevel <= skill.maxLevel) {
      skill.level = newLevel;
      skill.proficiency = (skill.level / skill.maxLevel) * 100;
      
      this.awardXp(`skill_${skillId}`, 500, 1.5);
    }
    
    this.notifyListeners();
  }

  /**
   * Create/update streak
   */
  updateStreak(activity: Streak['activity']): void {
    const streak = this.streaks.get(activity) || {
      id: `streak_${activity}`,
      activity,
      currentCount: 0,
      maxCount: 0,
      lastActivityDate: '',
      xpMultiplier: 1
    };

    const today = new Date().toDateString();
    const lastDate = streak.lastActivityDate ? new Date(streak.lastActivityDate).toDateString() : '';

    if (lastDate === today) {
      return; // Already updated today
    }

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (lastDate === yesterday) {
      // Streak continues
      streak.currentCount++;
    } else {
      // Streak broken or new
      streak.currentCount = 1;
    }

    streak.lastActivityDate = new Date().toISOString();
    streak.maxCount = Math.max(streak.maxCount, streak.currentCount);
    streak.xpMultiplier = 1 + (streak.currentCount * 0.1); // 10% bonus per day in streak
    
    this.streaks.set(activity, streak);
    this.awardXp(`streak_${activity}`, 100, streak.xpMultiplier);
    
    this.notifyListeners();
  }

  /**
   * Record activity impact
   */
  recordActivityImpact(activity: string, metrics: Record<string, number>): void {
    if (activity === 'lesson_planned') {
      this.careerStats.lessonsPlanned += metrics.count || 1;
      this.updateStreak('lesson_planning');
      this.awardXp('lesson_planning', 50);
    } else if (activity === 'lesson_delivered') {
      this.careerStats.lessonsDelivered += metrics.count || 1;
      this.updateStreak('lesson_planning');
      this.awardXp('lesson_delivered', 100);
    } else if (activity === 'student_impacted') {
      this.careerStats.studentsImpacted += metrics.students || 0;
      this.updateStreak('student_assessment');
      this.awardXp('student_impact', 50 * (metrics.students || 1));
    } else if (activity === 'peer_helped') {
      this.careerStats.peersHelped += metrics.count || 1;
      this.updateStreak('parent_engagement');
      this.awardXp('peer_help', 75);
    } else if (activity === 'community_contribution') {
      this.careerStats.communityContributions += metrics.count || 1;
      this.awardXp('community', 200);
    }

    this.notifyListeners();
  }

  /**
   * Create learning path
   */
  createLearningPath(path: LearningPath): void {
    this.learningPaths.set(path.id, path);
    this.notifyListeners();
  }

  /**
   * Progress learning path
   */
  progressLearningPath(pathId: string, checkpointId: string): void {
    const path = this.learningPaths.get(pathId);
    if (!path) return;

    if (!path.completedCheckpoints.includes(checkpointId)) {
      path.completedCheckpoints.push(checkpointId);
      path.progress = (path.completedCheckpoints.length / path.checkpoints.length) * 100;
      this.awardXp(`checkpoint_${checkpointId}`, 250);

      if (path.progress === 100) {
        this.unlockAchievement(`path_complete_${pathId}`, {
          id: `path_complete_${pathId}`,
          title: `Completed: ${path.title}`,
          description: `Mastered the ${path.title} learning path`,
          icon: '🏆',
          rarity: 'rare',
          category: 'learning',
          xpReward: 500
        });
      }
    }

    this.notifyListeners();
  }

  /**
   * Add career goal
   */
  addCareerGoal(goal: CareerGoal): void {
    this.careerGoals.set(goal.id, goal);
    this.notifyListeners();
  }

  /**
   * Progress career goal
   */
  progressCareerGoal(goalId: string, milestoneIndex: number): void {
    const goal = this.careerGoals.get(goalId);
    if (!goal || !goal.milestones[milestoneIndex]) return;

    const milestone = goal.milestones[milestoneIndex];
    if (!milestone.completed) {
      milestone.completed = true;
      milestone.completedDate = new Date().toISOString();
      
      goal.progress = (goal.milestones.filter(m => m.completed).length / goal.milestones.length) * 100;
      
      this.awardXp(`goal_${goalId}`, Math.floor(goal.xpReward / goal.milestones.length));

      if (goal.progress === 100) {
        this.awardXp(`goal_complete_${goalId}`, goal.xpReward);
      }
    }

    this.notifyListeners();
  }

  /**
   * Get stats
   */
  getStats(): CareerStats {
    return { ...this.careerStats };
  }

  /**
   * Get all skills
   */
  getSkills(): SkillArea[] {
    return Array.from(this.skills.values());
  }

  /**
   * Get achievements
   */
  getAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  /**
   * Get active streaks
   */
  getStreaks(): Streak[] {
    return Array.from(this.streaks.values());
  }

  /**
   * Get learning paths
   */
  getLearningPaths(): LearningPath[] {
    return Array.from(this.learningPaths.values());
  }

  /**
   * Get career goals
   */
  getCareerGoals(): CareerGoal[] {
    return Array.from(this.careerGoals.values());
  }

  /**
   * Listen to updates
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback());
  }

  /**
   * Handle level up
   */
  private onLevelUp(): void {
    console.log(`🎉 Level up! Now level ${this.careerStats.level}`);
  }
}

export const careerManager = new CareerProgressionManager();
