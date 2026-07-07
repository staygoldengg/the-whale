/**
 * Skill Points System
 * Tracks skill points from credentials and activities
 */

export interface SkillPointsEntry {
  id: string;
  userId: string;
  skillId: string;
  points: number;
  source: 'credential' | 'activity' | 'achievement' | 'collaboration'; // Where points came from
  sourceId?: string; // credentialId or activityId
  description: string;
  awardedAt: Date;
}

export interface UserSkillPoints {
  userId: string;
  skillId: string;
  totalPoints: number;
  level: number; // 1-10
  percentToNextLevel: number; // 0-100
  entries: SkillPointsEntry[];
  lastUpdated: Date;
}

export interface SkillLeaderboardEntry {
  rank: number;
  userId: string;
  teacherName: string;
  skillId: string;
  totalPoints: number;
  level: number;
  credentialsCount: number;
  profileImageUrl?: string;
  achievementBadges?: string[];
}

// Points required for each skill level
const POINTS_PER_LEVEL = {
  1: 0,
  2: 100,
  3: 300,
  4: 600,
  5: 1000,
  6: 1500,
  7: 2100,
  8: 2800,
  9: 3600,
  10: 4500
};

export class SkillPointsManager {
  private skillPoints: Map<string, UserSkillPoints> = new Map(); // key: userId:skillId
  private entries: Map<string, SkillPointsEntry> = new Map();
  private listeners: Set<(updates: UserSkillPoints[]) => void> = new Set();
  private userSkillIndex: Map<string, string[]> = new Map(); // userId -> [skillIds]

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Award skill points to a user
   */
  awardSkillPoints(
    userId: string,
    skillId: string,
    points: number,
    source: 'credential' | 'activity' | 'achievement' | 'collaboration',
    sourceId?: string,
    description?: string
  ): SkillPointsEntry {
    const entry: SkillPointsEntry = {
      id: `points_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      skillId,
      points,
      source,
      sourceId,
      description: description || `Points from ${source}`,
      awardedAt: new Date()
    };

    // Store entry
    this.entries.set(entry.id, entry);

    // Update or create skill points record
    const key = `${userId}:${skillId}`;
    let skillPoints = this.skillPoints.get(key);

    if (!skillPoints) {
      skillPoints = {
        userId,
        skillId,
        totalPoints: 0,
        level: 1,
        percentToNextLevel: 0,
        entries: [],
        lastUpdated: new Date()
      };
      this.skillPoints.set(key, skillPoints);
      this.addToUserSkillIndex(userId, skillId);
    }

    skillPoints.entries.push(entry);
    skillPoints.totalPoints += points;
    skillPoints.level = this.calculateLevel(skillPoints.totalPoints);
    skillPoints.percentToNextLevel = this.calculatePercentToNextLevel(
      skillPoints.totalPoints,
      skillPoints.level
    );
    skillPoints.lastUpdated = new Date();

    this.notifyListeners();
    return entry;
  }

  /**
   * Get skill points for a user and skill
   */
  getUserSkillPoints(userId: string, skillId: string): UserSkillPoints | null {
    const key = `${userId}:${skillId}`;
    return this.skillPoints.get(key) || null;
  }

  /**
   * Get all skills for a user with their points
   */
  getUserAllSkills(userId: string): UserSkillPoints[] {
    const skillIds = this.userSkillIndex.get(userId) || [];
    return skillIds
      .map(skillId => this.getUserSkillPoints(userId, skillId))
      .filter((s): s is UserSkillPoints => s !== null);
  }

  /**
   * Get leaderboard for a specific skill
   */
  getSkillLeaderboard(skillId: string, limit: number = 50): SkillLeaderboardEntry[] {
    const entries: Array<[string, UserSkillPoints]> = [];

    this.skillPoints.forEach((skillPoints, key) => {
      if (skillPoints.skillId === skillId) {
        entries.push([key, skillPoints]);
      }
    });

    return entries
      .sort((a, b) => b[1].totalPoints - a[1].totalPoints)
      .slice(0, limit)
      .map((entry, index) => ({
        rank: index + 1,
        userId: entry[1].userId,
        teacherName: this.getTeacherName(entry[1].userId),
        skillId: entry[1].skillId,
        totalPoints: entry[1].totalPoints,
        level: entry[1].level,
        credentialsCount: this.countUserCredentials(entry[1].userId, skillId),
        profileImageUrl: undefined, // Can be populated from user profile
        achievementBadges: this.getAchievementBadges(entry[1].level)
      }));
  }

  /**
   * Get overall leaderboard (all users by total points across all skills)
   */
  getOverallLeaderboard(limit: number = 100): SkillLeaderboardEntry[] {
    const userTotals: Map<string, number> = new Map();
    const userSkills: Map<string, Map<string, UserSkillPoints>> = new Map();

    this.skillPoints.forEach(skillPoints => {
      const current = userTotals.get(skillPoints.userId) || 0;
      userTotals.set(skillPoints.userId, current + skillPoints.totalPoints);

      if (!userSkills.has(skillPoints.userId)) {
        userSkills.set(skillPoints.userId, new Map());
      }
      userSkills.get(skillPoints.userId)!.set(skillPoints.skillId, skillPoints);
    });

    return Array.from(userTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map((entry, index) => {
        const [userId, totalPoints] = entry;
        const skills = userSkills.get(userId);
        const highestLevel = skills
          ? Math.max(...Array.from(skills.values()).map(s => s.level))
          : 1;
        const skillCount = skills?.size || 0;

        return {
          rank: index + 1,
          userId,
          teacherName: this.getTeacherName(userId),
          skillId: 'overall', // Special ID for overall leaderboard
          totalPoints,
          level: highestLevel,
          credentialsCount: this.countUserTotalCredentials(userId),
          profileImageUrl: undefined,
          achievementBadges: this.getAchievementBadges(highestLevel)
        };
      });
  }

  /**
   * Get top users in a skill with ranking
   */
  getTopUsersInSkill(skillId: string, limit: number = 10): SkillLeaderboardEntry[] {
    return this.getSkillLeaderboard(skillId, limit);
  }

  /**
   * Get user's rank in a skill
   */
  getUserRankInSkill(userId: string, skillId: string): number {
    const leaderboard = this.getSkillLeaderboard(skillId, 1000);
    const rank = leaderboard.findIndex(entry => entry.userId === userId);
    return rank >= 0 ? rank + 1 : leaderboard.length + 1;
  }

  /**
   * Get user's overall rank
   */
  getUserOverallRank(userId: string): number {
    const leaderboard = this.getOverallLeaderboard(10000);
    const rank = leaderboard.findIndex(entry => entry.userId === userId);
    return rank >= 0 ? rank + 1 : leaderboard.length + 1;
  }

  /**
   * Calculate level based on total points
   */
  private calculateLevel(totalPoints: number): number {
    for (let level = 10; level >= 1; level--) {
      if (totalPoints >= POINTS_PER_LEVEL[level as keyof typeof POINTS_PER_LEVEL]) {
        return level;
      }
    }
    return 1;
  }

  /**
   * Calculate percentage to next level
   */
  private calculatePercentToNextLevel(totalPoints: number, currentLevel: number): number {
    if (currentLevel >= 10) return 100; // Max level

    const currentLevelPoints =
      POINTS_PER_LEVEL[currentLevel as keyof typeof POINTS_PER_LEVEL];
    const nextLevelPoints = POINTS_PER_LEVEL[(currentLevel + 1) as keyof typeof POINTS_PER_LEVEL];

    const pointsInLevel = totalPoints - currentLevelPoints;
    const pointsNeeded = nextLevelPoints - currentLevelPoints;

    return Math.min(100, Math.floor((pointsInLevel / pointsNeeded) * 100));
  }

  /**
   * Get achievement badges based on level
   */
  private getAchievementBadges(level: number): string[] {
    const badges: string[] = [];

    if (level >= 1) badges.push('🌱');
    if (level >= 2) badges.push('🌿');
    if (level >= 3) badges.push('🌳');
    if (level >= 5) badges.push('🏆');
    if (level >= 7) badges.push('👑');
    if (level >= 9) badges.push('💎');
    if (level >= 10) badges.push('✨');

    return badges;
  }

  /**
   * Get teacher name (placeholder - should come from user profile)
   */
  private getTeacherName(userId: string): string {
    // TODO: Integrate with user profile manager
    return `Teacher ${userId.substring(0, 8)}`;
  }

  /**
   * Count credentials for user in a skill
   */
  private countUserCredentials(userId: string, skillId: string): number {
    let count = 0;
    this.entries.forEach(entry => {
      if (entry.userId === userId && entry.skillId === skillId && entry.source === 'credential') {
        count++;
      }
    });
    return count;
  }

  /**
   * Count total credentials for user
   */
  private countUserTotalCredentials(userId: string): number {
    let count = 0;
    this.entries.forEach(entry => {
      if (entry.userId === userId && entry.source === 'credential') {
        count++;
      }
    });
    return count;
  }

  /**
   * Add skill to user's skill index
   */
  private addToUserSkillIndex(userId: string, skillId: string) {
    const skills = this.userSkillIndex.get(userId) || [];
    if (!skills.includes(skillId)) {
      skills.push(skillId);
      this.userSkillIndex.set(userId, skills);
    }
  }

  /**
   * Subscribe to updates
   */
  subscribe(listener: (updates: UserSkillPoints[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify listeners
   */
  private notifyListeners() {
    const updates = Array.from(this.skillPoints.values());
    this.listeners.forEach(listener => listener(updates));
  }

  /**
   * Save to storage
   */
  saveToStorage() {
    try {
      const data = {
        skillPoints: Array.from(this.skillPoints.entries()),
        entries: Array.from(this.entries.entries()),
        userSkillIndex: Array.from(this.userSkillIndex.entries())
      };
      localStorage.setItem('whale_skill_points', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save skill points:', error);
    }
  }

  /**
   * Load from storage
   */
  private loadFromStorage() {
    try {
      const data = localStorage.getItem('whale_skill_points');
      if (!data) return;

      const parsed = JSON.parse(data);
      this.skillPoints = new Map(parsed.skillPoints);
      this.entries = new Map(parsed.entries);
      this.userSkillIndex = new Map(parsed.userSkillIndex);
    } catch (error) {
      console.error('Failed to load skill points:', error);
    }
  }
}

// Singleton instance
export const skillPointsManager = new SkillPointsManager();
