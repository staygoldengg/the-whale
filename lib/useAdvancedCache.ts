/**
 * useAdvancedCache Hook
 * Provides performance-optimized data fetching with deduplication, debouncing, and optimistic updates
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { cacheManager } from '@/lib/advancedCacheManager';

export interface UseAdvancedCacheOptions {
  debounce?: number; // Debounce delay in ms (0 = no debounce)
  throttle?: number; // Throttle interval in ms (0 = no throttle)
  ttl?: number; // Cache TTL in minutes
  deduplicate?: boolean; // Deduplicate in-flight requests
}

/**
 * Use advanced cache for fetching data
 * - Deduplicates identical requests
 * - Debounces rapid requests
 * - Returns cached data immediately
 */
export function useAdvancedCache<T>(
  url: string | null,
  options: UseAdvancedCacheOptions = {}
) {
  const {
    debounce = 0,
    throttle = 0,
    ttl = 30,
    deduplicate = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (!url) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    let isMounted = true;
    let timer: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        let result: T | null = null;

        if (throttle > 0) {
          // Use throttled fetch
          result = await cacheManager.fetchThrottled<T>(url, throttle);
        } else if (debounce > 0) {
          // Use debounced fetch
          result = await cacheManager.fetchDebounced<T>(url, debounce);
        } else if (deduplicate) {
          // Use deduped fetch
          result = await cacheManager.fetchDedup<T>(url);
        } else {
          // Regular fetch
          result = await fetch(url).then(r => r.json());
          cacheManager.set(url, result, ttl);
        }

        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    if (debounce > 0) {
      // Debounced fetch runs after delay
      timer = setTimeout(fetchData, debounce);
    } else {
      // Immediate fetch
      fetchData();
    }

    // Subscribe to cache updates
    unsubscribeRef.current = cacheManager.subscribe(url, (updatedData) => {
      if (isMounted) {
        setData(updatedData);
      }
    });

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [url, debounce, throttle, ttl, deduplicate]);

  return { data, loading, error };
}

/**
 * Use optimistic update pattern
 * Shows immediate UI change, confirms with server, rolls back on error
 */
export function useOptimisticUpdate<T>(
  key: string,
  onUpdate: (data: T) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [optimistic, setOptimistic] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const updateOptimistic = async (newData: T) => {
    // Show optimistic update immediately
    cacheManager.setOptimistic(key, newData);
    setOptimistic(newData);
    setLoading(true);

    try {
      // Confirm with server
      const confirmed = await onUpdate(newData);
      cacheManager.confirmOptimistic(key, confirmed, 60);
      setData(confirmed);
      setOptimistic(null);
      setLoading(false);
      return confirmed;
    } catch (error) {
      // Rollback on error
      cacheManager.cancelOptimistic(key);
      setOptimistic(null);
      setLoading(false);
      throw error;
    }
  };

  return {
    data: optimistic || data,
    isOptimistic: !!optimistic,
    loading,
    updateOptimistic,
  };
}

/**
 * Use batched updates
 * Collects multiple updates and sends them together
 */
export function useBatchedUpdates<T>(
  batchUrl: string,
  batchDelay: number = 100
) {
  const batchRef = useRef<Record<string, T>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const addTouch = (key: string, data: T) => {
    batchRef.current[key] = data;

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer to send batch
    timerRef.current = setTimeout(() => {
      cacheManager.batchRequest(
        batchUrl,
        `batch-${Date.now()}`,
        batchRef.current,
        0
      );
      batchRef.current = {};
      timerRef.current = null;
    }, batchDelay);
  };

  const flush = async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (Object.keys(batchRef.current).length > 0) {
      await cacheManager.fetchDedup(batchUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchRef.current),
      });
      batchRef.current = {};
    }
  };

  return { addTouch, flush };
}

/**
 * Preload URLs (helpful for navigation links)
 */
export function usePreload(urls: string[]) {
  useEffect(() => {
    cacheManager.preload(urls);
  }, [urls]);
}

/**
 * Get cache stats for debugging
 */
export function useCacheStats() {
  const [stats, setStats] = useState(cacheManager.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(cacheManager.getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return stats;
}
