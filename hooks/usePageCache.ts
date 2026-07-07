'use client';

import { useEffect, useCallback, useRef } from 'react';
import { pageCache } from '@/lib/pageCache';

/**
 * Hook for managing page prefetching and caching
 * Usage: usePageCache(['/dashboard/lesson-planner', '/dashboard/theme-week'])
 */
export function usePageCache(urls: string[]): void {
  const prefetchedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Filter out already prefetched URLs
    const urlsToPrefetch = urls.filter(url => !prefetchedRef.current.has(url));

    if (urlsToPrefetch.length > 0) {
      // Mark as prefetched
      urlsToPrefetch.forEach(url => prefetchedRef.current.add(url));

      // Prefetch the pages
      pageCache.prefetchPages(urlsToPrefetch);
    }
  }, [urls]);
}

/**
 * Hook for subscribing to cache updates
 * Usage: const data = useCacheData('page:/dashboard/lesson-planner')
 */
export function useCacheData<T = any>(key: string): T | null {
  const [data, setData] = React.useState<T | null>(() => pageCache.get(key));

  React.useEffect(() => {
    // Set initial data
    const cached = pageCache.get(key);
    if (cached) {
      setData(cached);
    }

    // Subscribe to updates
    const unsubscribe = pageCache.subscribe(key, (newData) => {
      setData(newData);
    });

    return unsubscribe;
  }, [key]);

  return data;
}

/**
 * Hook for smart prefetching based on user interaction
 * Prefetches pages on hover/focus to anticipate user navigation
 */
export function useSmartPrefetch(): (url: string) => void {
  return useCallback((url: string) => {
    if (!pageCache.has(`page:${url}`)) {
      pageCache.prefetchPages([url]);
    }
  }, []);
}

import React from 'react';
