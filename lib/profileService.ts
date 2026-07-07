/**
 * Profile Service - Manages user profile data with Supabase
 * Integrates with advanced cache manager for optimal performance
 */

import { cacheManager } from './advancedCacheManager';
import { createBrowserSupabase } from './supabaseClient';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  school_name?: string;
  role: 'admin' | 'teacher' | 'staff' | 'parent';
  grade_level?: string;
  subscription_plan: 'free' | 'starter' | 'pro' | 'school';
  dashboard_display_name: string;
  dashboard_subtitle?: string;
  preferred_language: string;
  theme_preference: 'light' | 'dark' | 'auto';
  color_scheme: string;
  template_style: string;
  layout_mode: string;
  font_scale: number;
  calm_music_enabled: boolean;
  tip_rotation_seconds: number;
  tip_rotation_mode: 'sequential' | 'random';
  show_onboarding: boolean;
  has_seen_onboarding: boolean;
  profile_completed: boolean;
  last_login_at?: string;
  school_id?: string;
  phone_number?: string;
  location?: string;
  bio?: string;
  preferences?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

class ProfileService {
  private supabase = createBrowserSupabase();
  private cacheKey = 'profile:current';
  private profileUpdateListeners: Set<(profile: Profile) => void> = new Set();

  /**
   * Get current user profile (cached, deduplicated)
   */
  async getCurrentProfile(): Promise<Profile | null> {
    try {
      // Check cache first
      const cached = cacheManager.getIfValid<Profile>(this.cacheKey);
      if (cached) {
        return cached;
      }

      // Get current user
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return null;

      // Fetch with deduplication (prevents duplicate requests)
      return await cacheManager.fetchDedup<Profile>(
        `/api/profile/${user.id}`,
        { method: 'GET' }
      );
    } catch (error) {
      console.error('Failed to get profile:', error);
      return null;
    }
  }

  /**
   * Update profile with optimistic updates
   */
  async updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Set optimistic update immediately (UI shows change before server confirms)
      const currentProfile = cacheManager.getIfValid<Profile>(this.cacheKey);
      const optimisticProfile = { ...currentProfile, ...updates } as Profile;
      cacheManager.setOptimistic(this.cacheKey, optimisticProfile);

      // Send update request with debouncing (prevents multiple rapid requests)
      const result = await cacheManager.fetchDebounced<Profile>(
        `/api/profile/${user.id}`,
        300, // 300ms debounce
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        }
      );

      // Confirm optimistic update
      if (result) {
        cacheManager.confirmOptimistic(this.cacheKey, result, 60);
        this.notifyListeners(result);
      }

      return result;
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Cancel optimistic update on error
      cacheManager.cancelOptimistic(this.cacheKey);
      return null;
    }
  }

  /**
   * Batch update preferences (useful for multiple settings at once)
   */
  async batchUpdatePreferences(prefs: Record<string, any>): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Batch requests together to reduce API calls
      cacheManager.batchRequest(
        `/api/profile/${user.id}/batch`,
        `profile-batch-${Date.now()}`,
        prefs,
        150 // 150ms batch window
      );
    } catch (error) {
      console.error('Failed to batch update preferences:', error);
    }
  }

  /**
   * Throttle profile updates to once per second
   */
  async throttledUpdate(updates: Partial<Profile>): Promise<Profile | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      return await cacheManager.fetchThrottled<Profile>(
        `/api/profile/${user.id}`,
        1000, // 1 second throttle
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        }
      );
    } catch (error) {
      console.error('Failed to throttle update profile:', error);
      return null;
    }
  }

  /**
   * Subscribe to profile updates
   */
  subscribeToProfile(callback: (profile: Profile) => void): () => void {
    this.profileUpdateListeners.add(callback);
    return () => {
      this.profileUpdateListeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of profile changes
   */
  private notifyListeners(profile: Profile): void {
    this.profileUpdateListeners.forEach(callback => {
      try {
        callback(profile);
      } catch (error) {
        console.error('Profile listener error:', error);
      }
    });
  }

  /**
   * Create new profile (on signup)
   */
  async createProfile(profile: Partial<Profile>): Promise<Profile | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fullProfile = {
        id: user.id,
        email: user.email || '',
        role: 'teacher' as const,
        subscription_plan: 'free' as const,
        dashboard_display_name: 'Teacher',
        preferred_language: 'en',
        theme_preference: 'light' as const,
        color_scheme: 'ocean',
        template_style: 'default',
        layout_mode: 'default',
        font_scale: 1,
        calm_music_enabled: false,
        tip_rotation_seconds: 8,
        tip_rotation_mode: 'sequential' as const,
        show_onboarding: false,
        has_seen_onboarding: false,
        profile_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...profile,
      };

      const result = await cacheManager.fetchDedup<Profile>(
        '/api/profile',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullProfile),
        }
      );

      if (result) {
        cacheManager.set(this.cacheKey, result, 60);
      }

      return result;
    } catch (error) {
      console.error('Failed to create profile:', error);
      return null;
    }
  }

  /**
   * Clear profile cache
   */
  clearCache(): void {
    cacheManager.set(this.cacheKey, null, 0);
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    return cacheManager.getStats();
  }
}

export const profileService = new ProfileService();
