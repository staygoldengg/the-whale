/**
 * Event-driven cache system for prefetching and loading pages on-demand
 * Reduces token calls and improves perceived performance
 */

export interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class PageCache {
  private cache: Map<string, CacheEntry> = new Map();
  private prefetchQueue: Set<string> = new Set();
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  /**
   * Store data in cache
   */
  set(key: string, data: any, ttlMinutes: number = 30): void {
    const ttl = ttlMinutes * 60 * 1000;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    this.notifyListeners(key, data);
  }

  /**
   * Get data from cache (null if expired)
   */
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Register listener for cache updates
   */
  subscribe(key: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  /**
   * Notify all listeners of updates
   */
  private notifyListeners(key: string, data: any): void {
    this.listeners.get(key)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Cache listener error:', error);
      }
    });
  }

  /**
   * Prefetch multiple pages
   */
  prefetchPages(urls: string[]): void {
    urls.forEach(url => {
      if (!this.prefetchQueue.has(url)) {
        this.prefetchQueue.add(url);
        this.prefetchPageAsync(url);
      }
    });
  }

  /**
   * Async prefetch a single page (non-blocking)
   */
  private prefetchPageAsync(url: string): void {
    // Use requestIdleCallback if available, otherwise setTimeout
    const callback = () => {
      fetch(url, { priority: 'low' as any })
        .then(res => res.text())
        .then(data => {
          this.set(`page:${url}`, data, 60); // Cache for 60 minutes
          this.prefetchQueue.delete(url);
        })
        .catch(() => {
          this.prefetchQueue.delete(url);
        });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback, { timeout: 5000 });
    } else {
      setTimeout(callback, 2000);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.listeners.clear();
    this.prefetchQueue.clear();
  }

  /**
   * Get cache stats
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const pageCache = new PageCache();
