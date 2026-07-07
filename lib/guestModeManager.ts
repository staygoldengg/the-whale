/**
 * Guest Mode Manager
 * Allows users to access all features without signing in
 * Work is stored locally until they create an account to save permanently
 */

export interface GuestSession {
  id: string;
  createdAt: Date;
  lastAccessedAt: Date;
  data: {
    credentials: any[];
    skillPoints: any[];
    activities: any[];
    customizations: any;
  };
  isGuest: boolean;
}

export interface SavePrompt {
  show: boolean;
  message: string;
  actionsTaken: string[];
  dataSize: number;
}

export class GuestModeManager {
  private currentSession: GuestSession | null = null;
  private savePromptShown = false;
  private actionsCount = 0;
  private listeners: Set<(session: GuestSession | null) => void> = new Set();

  constructor() {
    // Only load from storage on client side
    if (typeof window !== 'undefined') {
      this.loadOrCreateSession();
    }
  }

  /**
   * Load existing guest session or create new one
   */
  private loadOrCreateSession() {
    try {
      const stored = localStorage.getItem('wds_guest_session');
      if (stored) {
        this.currentSession = JSON.parse(stored);
        this.currentSession!.lastAccessedAt = new Date();
      } else {
        this.currentSession = this.createNewSession();
      }
      this.saveToStorage();
    } catch (error) {
      console.error('Failed to load guest session:', error);
      this.currentSession = this.createNewSession();
    }
  }

  /**
   * Create a new guest session
   */
  private createNewSession(): GuestSession {
    return {
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      lastAccessedAt: new Date(),
      data: {
        credentials: [],
        skillPoints: [],
        activities: [],
        customizations: {}
      },
      isGuest: true
    };
  }

  /**
   * Get current guest session
   */
  getSession(): GuestSession | null {
    return this.currentSession;
  }

  /**
   * Check if user is in guest mode
   */
  isGuestMode(): boolean {
    return this.currentSession?.isGuest ?? true;
  }

  /**
   * Add data to guest session
   */
  addData(key: keyof GuestSession['data'], data: any) {
    if (!this.currentSession) return;

    if (Array.isArray(this.currentSession.data[key])) {
      this.currentSession.data[key] = [...this.currentSession.data[key], data];
    } else {
      this.currentSession.data[key] = data;
    }

    this.actionsCount++;
    this.saveToStorage();
    this.notifyListeners();

    // Show save prompt after significant work
    if (this.actionsCount >= 5 && !this.savePromptShown) {
      this.savePromptShown = true;
      // Prompt will be shown in UI
    }
  }

  /**
   * Update data in guest session
   */
  updateData(key: keyof GuestSession['data'], updater: (current: any) => any) {
    if (!this.currentSession) return;

    this.currentSession.data[key] = updater(this.currentSession.data[key]);
    this.actionsCount++;
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Get all guest data
   */
  getAllData() {
    return this.currentSession?.data || {};
  }

  /**
   * Export guest data as JSON (for saving to account)
   */
  exportData(): string {
    if (!this.currentSession) return '{}';
    return JSON.stringify(this.currentSession.data, null, 2);
  }

  /**
   * Clear guest session
   */
  clearSession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wds_guest_session');
    }
    this.currentSession = this.createNewSession();
    this.actionsCount = 0;
    this.savePromptShown = false;
    this.notifyListeners();
  }

  /**
   * Convert guest session to permanent account
   */
  migrateToAccount(userId: string): boolean {
    if (!this.currentSession) return false;

    try {
      // Mark session as migrated and not guest
      this.currentSession.isGuest = false;
      
      // Store under user ID (only on client side)
      if (typeof window !== 'undefined') {
        localStorage.setItem(`wds_user_${userId}_data`, JSON.stringify(this.currentSession.data));
        localStorage.removeItem('wds_guest_session');
      }
      
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to migrate guest session:', error);
      return false;
    }
  }

  /**
   * Save to localStorage
   */
  private saveToStorage() {
    try {
      if (typeof window !== 'undefined' && this.currentSession) {
        localStorage.setItem('wds_guest_session', JSON.stringify(this.currentSession));
      }
    } catch (error) {
      console.error('Failed to save guest session:', error);
    }
  }

  /**
   * Subscribe to session changes
   */
  subscribe(listener: (session: GuestSession | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify listeners
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentSession));
  }

  /**
   * Get session stats
   */
  getSessionStats() {
    if (!this.currentSession) return null;

    return {
      sessionId: this.currentSession.id,
      createdAt: this.currentSession.createdAt,
      lastAccessedAt: this.currentSession.lastAccessedAt,
      durationMinutes: Math.floor(
        (new Date().getTime() - this.currentSession.createdAt.getTime()) / (1000 * 60)
      ),
      actionsPerformed: this.actionsCount,
      dataItems: {
        credentials: (this.currentSession.data.credentials as any[])?.length || 0,
        skillPoints: (this.currentSession.data.skillPoints as any[])?.length || 0,
        activities: (this.currentSession.data.activities as any[])?.length || 0
      }
    };
  }
}

// Singleton instance
export const guestModeManager = new GuestModeManager();
