/**
 * Advanced Cache Manager with Request Deduplication, Debouncing & Optimistic Updates
 * Eliminates lag from rapid clicking and duplicate requests
 */

export interface CachedRequest {
  url: string;
  timestamp: number;
  ttl: number;
  data: any;
}

export interface PendingRequest {
  url: string;
  promise: Promise<any>;
  startTime: number;
}

class AdvancedCacheManager {
  private cache: Map<string, CachedRequest> = new Map();
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private throttleTimestamps: Map<string, number> = new Map();
  private requestBatch: Map<string, any> = new Map();
  private batchTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private optimisticUpdates: Map<string, any> = new Map();

  /**
   * Deduplicated fetch - if request is in-flight, return existing promise
   */
  async fetchDedup<T>(url: string, options: RequestInit = {}): Promise<T> {
    // Return cached data if available and valid
    const cached = this.getIfValid<T>(url);
    if (cached !== null) {
      return cached;
    }

    // If request is already in-flight, return existing promise
    if (this.pendingRequests.has(url)) {
      return this.pendingRequests.get(url)!.promise;
    }

    // Create new request
    const promise = fetch(url, {
      ...options,
      signal: AbortSignal.timeout(30000), // 30s timeout
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then(data => {
        // Cache for 30 minutes
        this.set(url, data, 30);
        this.pendingRequests.delete(url);
        return data;
      })
      .catch(error => {
        this.pendingRequests.delete(url);
        throw error;
      });

    // Track pending request
    this.pendingRequests.set(url, {
      url,
      promise,
      startTime: Date.now(),
    });

    return promise;
  }

  /**
   * Debounced fetch - wait for debounce window before fetching
   */
  fetchDebounced<T>(
    url: string,
    delayMs: number = 300,
    options: RequestInit = {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      // Clear existing timer
      if (this.debounceTimers.has(url)) {
        clearTimeout(this.debounceTimers.get(url));
      }

      // Set new timer
      const timer = setTimeout(() => {
        this.fetchDedup<T>(url, options)
          .then(resolve)
          .catch(reject);
        this.debounceTimers.delete(url);
      }, delayMs);

      this.debounceTimers.set(url, timer);
    });
  }

  /**
   * Throttled fetch - rate limit requests to once per interval
   */
  async fetchThrottled<T>(
    url: string,
    intervalMs: number = 1000,
    options: RequestInit = {}
  ): Promise<T | null> {
    const lastRequest = this.throttleTimestamps.get(url) || 0;
    const timeSinceLastRequest = Date.now() - lastRequest;

    if (timeSinceLastRequest < intervalMs) {
      // Return cached if available, otherwise null
      return this.getIfValid<T>(url);
    }

    this.throttleTimestamps.set(url, Date.now());
    return this.fetchDedup<T>(url, options);
  }

  /**
   * Batch multiple requests to fire together after delay
   */
  batchRequest(url: string, key: string, data: any, delayMs: number = 100): void {
    this.requestBatch.set(key, data);

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }

    this.batchTimer = setTimeout(() => {
      const batchData = Object.fromEntries(this.requestBatch);
      this.fetchDedup(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchData),
      }).catch(console.error);
      this.requestBatch.clear();
      this.batchTimer = null;
    }, delayMs);
  }

  /**
   * Set optimistic update (shows before server confirms)
   */
  setOptimistic(key: string, data: any): void {
    this.optimisticUpdates.set(key, data);
    this.notifyListeners(key, data);
  }

  /**
   * Confirm optimistic update and cache result
   */
  confirmOptimistic(key: string, serverData: any, ttlMinutes: number = 30): void {
    this.set(key, serverData, ttlMinutes);
    this.optimisticUpdates.delete(key);
  }

  /**
   * Cancel optimistic update (rollback)
   */
  cancelOptimistic(key: string): void {
    this.optimisticUpdates.delete(key);
    // Re-notify with cached value if exists
    const cached = this.getIfValid(key);
    if (cached !== null) {
      this.notifyListeners(key, cached);
    }
  }

  /**
   * Set cache entry
   */
  set(key: string, data: any, ttlMinutes: number = 30): void {
    this.cache.set(key, {
      url: key,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
      data,
    });
    this.notifyListeners(key, data);
  }

  /**
   * Get if valid (not expired)
   */
  getIfValid<T = any>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Get with fallback to optimistic update
   */
  getWithOptimistic<T = any>(key: string): T | null {
    // Prefer optimistic update if exists
    if (this.optimisticUpdates.has(key)) {
      return this.optimisticUpdates.get(key) as T;
    }
    return this.getIfValid<T>(key);
  }

  /**
   * Subscribe to cache changes
   */
  subscribe(key: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(key: string, data: any): void {
    this.listeners.get(key)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  /**
   * Preload multiple URLs
   */
  preload(urls: string[]): void {
    urls.forEach(url => {
      if (!this.cache.has(url) && !this.pendingRequests.has(url)) {
        this.fetchDedup(url).catch(() => {
          // Ignore preload errors
        });
      }
    });
  }

  /**
   * Clear all pending operations
   */
  clearPending(): void {
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
    if (this.batchTimer) clearTimeout(this.batchTimer);
    this.batchTimer = null;
    this.pendingRequests.clear();
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      cached: this.cache.size,
      pending: this.pendingRequests.size,
      optimistic: this.optimisticUpdates.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Clear all
   */
  clear(): void {
    this.cache.clear();
    this.listeners.clear();
    this.optimisticUpdates.clear();
    this.clearPending();
  }
}

export const cacheManager = new AdvancedCacheManager();
