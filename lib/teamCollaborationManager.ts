/**
 * Team Collaboration System
 * Enables teachers to work together, share resources, and grow together
 */

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'teacher' | 'lead_teacher' | 'mentor' | 'curriculum_specialist';
  yearsOfExperience: number;
  gradeLevel: string;
  subjectArea: string;
  specialization: string[];
  bio?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: string;
  avatar?: string;
  sharedResources: string[]; // Resource IDs
  collaborationStats: {
    lessonsCoPlanned: number;
    resourcesShared: number;
    feedbackExchanges: number;
    projectsCompleted: number;
  };
}

export interface Collaboration {
  id: string;
  type: 'co-planning' | 'resource-sharing' | 'peer-review' | 'mentorship' | 'project';
  title: string;
  description: string;
  participants: string[]; // Team member IDs
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  deadline?: string;
  completedDate?: string;
  goals: string[];
  progress: number; // 0-100%
  outcomes: string[];
}

export interface MentorshipPair {
  id: string;
  mentor: TeamMember;
  mentee: TeamMember;
  establishedAt: string;
  focusAreas: string[];
  meetingFrequency: 'weekly' | 'biweekly' | 'monthly';
  nextMeetingDate?: string;
  sessions: MentorshipSession[];
}

export interface MentorshipSession {
  id: string;
  date: string;
  duration: number; // minutes
  topic: string;
  notes?: string;
  menteeProgress: string[];
  nextFocusAreas: string[];
}

export interface SharedResource {
  id: string;
  title: string;
  description: string;
  type: 'lesson_plan' | 'worksheet' | 'assessment' | 'strategy' | 'template';
  createdBy: string; // Team member ID
  createdAt: string;
  tags: string[];
  gradeLevel: string;
  subjectArea: string;
  url?: string;
  fileSize?: number;
  downloadCount: number;
  ratings: Array<{
    userId: string;
    rating: 1 | 2 | 3 | 4 | 5;
    review?: string;
    date: string;
  }>;
  avgRating: number;
}

export interface TeamChallenge {
  id: string;
  title: string;
  description: string;
  category: 'innovation' | 'impact' | 'collaboration' | 'efficiency' | 'engagement';
  difficulty: number; // 1-10
  startDate: string;
  endDate: string;
  participants: Array<{
    memberId: string;
    score: number;
    submissions: number;
    progress: number;
  }>;
  prizes?: string[];
  leaderboard: Array<{
    memberId: string;
    score: number;
    achievement: string;
  }>;
}

// Team Collaboration Manager
class TeamCollaborationManager {
  private teams: Map<string, Team> = new Map();
  private collaborations: Map<string, Collaboration> = new Map();
  private mentorships: Map<string, MentorshipPair> = new Map();
  private sharedResources: Map<string, SharedResource> = new Map();
  private teamChallenges: Map<string, TeamChallenge> = new Map();
  private listeners: Set<() => void> = new Set();

  /**
   * Create a team
   */
  createTeam(team: Team): void {
    this.teams.set(team.id, team);
    this.notifyListeners();
  }

  /**
   * Add member to team
   */
  addTeamMember(teamId: string, member: TeamMember): boolean {
    const team = this.teams.get(teamId);
    if (!team) return false;

    if (!team.members.find(m => m.id === member.id)) {
      team.members.push(member);
      this.notifyListeners();
      return true;
    }

    return false;
  }

  /**
   * Start collaboration
   */
  startCollaboration(collaboration: Collaboration): void {
    this.collaborations.set(collaboration.id, collaboration);
    this.notifyListeners();
  }

  /**
   * Update collaboration progress
   */
  updateCollaborationProgress(collaborationId: string, progress: number, outcomes?: string[]): void {
    const collaboration = this.collaborations.get(collaborationId);
    if (!collaboration) return;

    collaboration.progress = Math.min(100, progress);
    
    if (outcomes) {
      collaboration.outcomes = outcomes;
    }

    if (collaboration.progress === 100) {
      collaboration.status = 'completed';
      collaboration.completedDate = new Date().toISOString();
    }

    this.notifyListeners();
  }

  /**
   * Establish mentorship
   */
  establishMentorship(mentorship: MentorshipPair): void {
    this.mentorships.set(mentorship.id, mentorship);
    this.notifyListeners();
  }

  /**
   * Log mentorship session
   */
  logMentorshipSession(mentorshipId: string, session: MentorshipSession): void {
    const mentorship = this.mentorships.get(mentorshipId);
    if (!mentorship) return;

    mentorship.sessions.push(session);
    
    // Schedule next meeting if frequency allows
    const nextMeetingDays = mentorship.meetingFrequency === 'weekly' ? 7 : 
                            mentorship.meetingFrequency === 'biweekly' ? 14 : 30;
    
    mentorship.nextMeetingDate = new Date(Date.now() + nextMeetingDays * 86400000).toISOString();
    
    this.notifyListeners();
  }

  /**
   * Share resource
   */
  shareResource(resource: SharedResource): void {
    this.sharedResources.set(resource.id, resource);
    this.notifyListeners();
  }

  /**
   * Rate shared resource
   */
  rateResource(resourceId: string, userId: string, rating: 1 | 2 | 3 | 4 | 5, review?: string): void {
    const resource = this.sharedResources.get(resourceId);
    if (!resource) return;

    // Remove existing rating if any
    resource.ratings = resource.ratings.filter(r => r.userId !== userId);

    // Add new rating
    resource.ratings.push({
      userId,
      rating,
      review,
      date: new Date().toISOString()
    });

    // Recalculate average
    resource.avgRating = resource.ratings.reduce((sum, r) => sum + r.rating, 0) / resource.ratings.length;

    this.notifyListeners();
  }

  /**
   * Download resource (track usage)
   */
  downloadResource(resourceId: string): void {
    const resource = this.sharedResources.get(resourceId);
    if (!resource) return;

    resource.downloadCount++;
    this.notifyListeners();
  }

  /**
   * Create team challenge
   */
  createTeamChallenge(challenge: TeamChallenge): void {
    this.teamChallenges.set(challenge.id, challenge);
    this.notifyListeners();
  }

  /**
   * Submit challenge entry
   */
  submitChallengeEntry(challengeId: string, memberId: string, score: number): void {
    const challenge = this.teamChallenges.get(challengeId);
    if (!challenge) return;

    let participant = challenge.participants.find(p => p.memberId === memberId);
    
    if (!participant) {
      participant = {
        memberId,
        score: 0,
        submissions: 0,
        progress: 0
      };
      challenge.participants.push(participant);
    }

    participant.score += score;
    participant.submissions++;
    participant.progress = Math.min(100, participant.submissions * 20);

    // Update leaderboard
    challenge.leaderboard = challenge.participants
      .map(p => ({
        memberId: p.memberId,
        score: p.score,
        achievement: p.score > 80 ? 'Champion' : p.score > 60 ? 'Rising Star' : 'Participant'
      }))
      .sort((a, b) => b.score - a.score);

    this.notifyListeners();
  }

  /**
   * Get recommendations for collaboration
   */
  getCollaborationRecommendations(memberId: string): TeamMember[] {
    const allMembers = Array.from(this.teams.values())
      .flatMap(team => team.members)
      .filter(member => member.id !== memberId);

    // Find members with complementary skills
    return allMembers
      .sort((a, b) => {
        // Prioritize different grade levels for resource sharing
        return Math.random() - 0.5;
      })
      .slice(0, 3);
  }

  /**
   * Get mentorship matches
   */
  getMentorshipMatches(menteeLevelYears: number): TeamMember[] {
    const allMembers = Array.from(this.teams.values()).flatMap(team => team.members);
    
    return allMembers
      .filter(member => member.yearsOfExperience > menteeLevelYears + 2)
      .sort((a, b) => a.yearsOfExperience - b.yearsOfExperience);
  }

  /**
   * Get teams
   */
  getTeams(): Team[] {
    return Array.from(this.teams.values());
  }

  /**
   * Get team by ID
   */
  getTeam(teamId: string): Team | undefined {
    return this.teams.get(teamId);
  }

  /**
   * Get collaborations
   */
  getCollaborations(): Collaboration[] {
    return Array.from(this.collaborations.values());
  }

  /**
   * Get mentorships
   */
  getMentorships(): MentorshipPair[] {
    return Array.from(this.mentorships.values());
  }

  /**
   * Get shared resources
   */
  getSharedResources(filters?: { gradeLevel?: string; subjectArea?: string; type?: string }): SharedResource[] {
    let resources = Array.from(this.sharedResources.values());

    if (filters?.gradeLevel) {
      resources = resources.filter(r => r.gradeLevel === filters.gradeLevel);
    }
    if (filters?.subjectArea) {
      resources = resources.filter(r => r.subjectArea === filters.subjectArea);
    }
    if (filters?.type) {
      resources = resources.filter(r => r.type === filters.type);
    }

    return resources.sort((a, b) => b.avgRating - a.avgRating);
  }

  /**
   * Get top resources
   */
  getTopResources(limit: number = 10): SharedResource[] {
    return Array.from(this.sharedResources.values())
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, limit);
  }

  /**
   * Get team challenges
   */
  getTeamChallenges(): TeamChallenge[] {
    return Array.from(this.teamChallenges.values());
  }

  /**
   * Get challenge leaderboard
   */
  getChallengeLeaderboard(challengeId: string) {
    const challenge = this.teamChallenges.get(challengeId);
    return challenge?.leaderboard || [];
  }

  /**
   * Subscribe to updates
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
}

export const teamManager = new TeamCollaborationManager();
