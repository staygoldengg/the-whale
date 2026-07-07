/**
 * Brightwheel Learning Integration
 * Tracks courses, certifications, and continuing education units (CEUs)
 * from Brightwheel professional development platform
 */

export interface BrightwheelCourse {
  id: string;
  title: string;
  description: string;
  hours: number;
  ceus: number; // Continuing Education Units
  status: 'in_progress' | 'completed' | 'not_started';
  completionDate?: string;
  certificateUrl?: string;
  category: string;
  provider: 'brightwheel';
  type: 'course' | 'certification' | 'workshop';
  clicki?: boolean; // If it's a Click Hour Course
}

export interface BrightwheelCertification {
  id: string;
  title: string;
  description: string;
  completedDate: string;
  expiryDate?: string;
  certificateUrl: string;
  issuer: string; // e.g., "Brightwheel", "CDA", etc.
  credentialId?: string;
  skills: string[];
}

export interface BrightwheelStats {
  totalCoursesCompleted: number;
  totalInProgressCourses: number;
  totalCeusEarned: number;
  totalHoursCompleted: number;
  totalCertifications: number;
  lastUpdated: string;
}

export interface BrightwheelProfile {
  userId: string;
  email: string;
  name: string;
  schoolName?: string;
  stats: BrightwheelStats;
  courses: BrightwheelCourse[];
  certifications: BrightwheelCertification[];
  lastSyncedAt: string;
}

// Brightwheel Integration Manager
class BrightwheelIntegrationManager {
  private profiles: Map<string, BrightwheelProfile> = new Map();
  private listeners: Set<() => void> = new Set();

  // In production, these would be real API calls to Brightwheel
  // For now, we'll provide the structure for integration

  /**
   * Sync Brightwheel data for a user
   * In production, this would fetch from Brightwheel API
   */
  async syncBrightwheelProfile(userId: string, brightwheelEmail: string): Promise<BrightwheelProfile | null> {
    try {
      // This is where we'd call the Brightwheel API
      // For now, we'll return a structure ready for data
      const profile: BrightwheelProfile = {
        userId,
        email: brightwheelEmail,
        name: '', // Would be fetched from Brightwheel
        schoolName: '',
        stats: {
          totalCoursesCompleted: 0,
          totalInProgressCourses: 0,
          totalCeusEarned: 0,
          totalHoursCompleted: 0,
          totalCertifications: 0,
          lastUpdated: new Date().toISOString()
        },
        courses: [],
        certifications: [],
        lastSyncedAt: new Date().toISOString()
      };

      this.profiles.set(userId, profile);
      this.notifyListeners();
      return profile;
    } catch (error) {
      console.error('Error syncing Brightwheel profile:', error);
      return null;
    }
  }

  /**
   * Add a course to user's profile
   */
  addCourse(userId: string, course: BrightwheelCourse): void {
    const profile = this.profiles.get(userId);
    if (!profile) return;

    // Remove if already exists
    profile.courses = profile.courses.filter(c => c.id !== course.id);
    profile.courses.push(course);

    // Update stats
    if (course.status === 'completed') {
      profile.stats.totalCoursesCompleted++;
      profile.stats.totalCeusEarned += course.ceus;
      profile.stats.totalHoursCompleted += course.hours;
    } else if (course.status === 'in_progress') {
      profile.stats.totalInProgressCourses++;
    }

    profile.stats.lastUpdated = new Date().toISOString();
    this.notifyListeners();
  }

  /**
   * Add a certification to user's profile
   */
  addCertification(userId: string, certification: BrightwheelCertification): void {
    const profile = this.profiles.get(userId);
    if (!profile) return;

    // Remove if already exists
    profile.certifications = profile.certifications.filter(c => c.id !== certification.id);
    profile.certifications.push(certification);

    profile.stats.totalCertifications++;
    profile.stats.lastUpdated = new Date().toISOString();
    this.notifyListeners();
  }

  /**
   * Update course status
   */
  updateCourseStatus(
    userId: string, 
    courseId: string, 
    status: 'in_progress' | 'completed' | 'not_started',
    completionDate?: string
  ): void {
    const profile = this.profiles.get(userId);
    if (!profile) return;

    const course = profile.courses.find(c => c.id === courseId);
    if (!course) return;

    const oldStatus = course.status;
    course.status = status;

    if (status === 'completed' && oldStatus !== 'completed') {
      course.completionDate = completionDate || new Date().toISOString();
      profile.stats.totalCoursesCompleted++;
      profile.stats.totalCeusEarned += course.ceus;
      profile.stats.totalHoursCompleted += course.hours;

      if (oldStatus === 'in_progress') {
        profile.stats.totalInProgressCourses--;
      }
    } else if (status === 'in_progress' && oldStatus !== 'in_progress') {
      profile.stats.totalInProgressCourses++;
    }

    profile.stats.lastUpdated = new Date().toISOString();
    this.notifyListeners();
  }

  /**
   * Get user's Brightwheel profile
   */
  getProfile(userId: string): BrightwheelProfile | undefined {
    return this.profiles.get(userId);
  }

  /**
   * Get user's completed courses
   */
  getCompletedCourses(userId: string): BrightwheelCourse[] {
    const profile = this.profiles.get(userId);
    if (!profile) return [];

    return profile.courses.filter(c => c.status === 'completed');
  }

  /**
   * Get user's in-progress courses
   */
  getInProgressCourses(userId: string): BrightwheelCourse[] {
    const profile = this.profiles.get(userId);
    if (!profile) return [];

    return profile.courses.filter(c => c.status === 'in_progress');
  }

  /**
   * Get total CEUs earned
   */
  getTotalCeus(userId: string): number {
    const profile = this.profiles.get(userId);
    return profile?.stats.totalCeusEarned || 0;
  }

  /**
   * Get total hours completed
   */
  getTotalHours(userId: string): number {
    const profile = this.profiles.get(userId);
    return profile?.stats.totalHoursCompleted || 0;
  }

  /**
   * Get certifications
   */
  getCertifications(userId: string): BrightwheelCertification[] {
    const profile = this.profiles.get(userId);
    return profile?.certifications || [];
  }

  /**
   * Calculate proficiency boost from CEUs
   * 1 CEU = 1% proficiency increase in related skills
   */
  calculateCeuBoost(userId: string, skillId: string): number {
    const profile = this.profiles.get(userId);
    if (!profile) return 0;

    // In production, would map courses to skills
    // For now, return CEU count as percentage boost
    return Math.min(50, profile.stats.totalCeusEarned); // Cap at 50%
  }

  /**
   * Get stats
   */
  getStats(userId: string): BrightwheelStats | undefined {
    return this.profiles.get(userId)?.stats;
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

/**
 * Helper function to create a BrightwheelCourse from Brightwheel API data
 */
export function createBrightwheelCourse(data: {
  id: string;
  title: string;
  description: string;
  hours: number;
  ceus: number;
  status: 'in_progress' | 'completed' | 'not_started';
  category: string;
  completionDate?: string;
  certificateUrl?: string;
  clicki?: boolean;
}): BrightwheelCourse {
  return {
    ...data,
    provider: 'brightwheel',
    type: data.clicki ? 'course' : 'certification'
  };
}

/**
 * Fetch Brightwheel data from public pages
 * This creates integration points for scraping/API calls
 */
export async function fetchBrightwheelData(email: string) {
  // API Endpoints that would be used:
  // Training dashboard: https://schools.mybrightwheel.com/training
  // Certifications: https://professionaldevelopment.mybrightwheel.com/certifications

  // In production, this would:
  // 1. Authenticate with Brightwheel
  // 2. Fetch course list
  // 3. Fetch certification list
  // 4. Parse CEUs and hours
  // 5. Track completion status
  // 6. Store locally with lastSyncedAt

  return {
    success: false,
    message: 'Brightwheel API integration requires OAuth setup',
    integrationPoints: [
      {
        name: 'Training Dashboard',
        url: 'https://schools.mybrightwheel.com/training',
        dataAvailable: ['courses_completed', 'ceus_earned', 'hours_completed', 'certifications']
      },
      {
        name: 'Certifications Portal',
        url: 'https://professionaldevelopment.mybrightwheel.com/certifications',
        dataAvailable: ['certification_list', 'completion_dates', 'expiry_dates', 'credentials']
      }
    ]
  };
}

export const brightwheelManager = new BrightwheelIntegrationManager();
