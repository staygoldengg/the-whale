/**
 * Guest Mode React Hook
 */

import { useEffect, useState } from 'react';
import { guestModeManager } from '@/lib/guestModeManager';

type DataKey = 'credentials' | 'activities' | 'skillPoints' | 'customizations';

export function useGuestMode() {
  const [isGuest, setIsGuest] = useState(true);
  const [sessionStats, setSessionStats] = useState<any>(null);

  useEffect(() => {
    const isGuestMode = guestModeManager.isGuestMode();
    setIsGuest(isGuestMode);
    setSessionStats(guestModeManager.getSessionStats());

    const unsubscribe = guestModeManager.subscribe(() => {
      setIsGuest(guestModeManager.isGuestMode());
      setSessionStats(guestModeManager.getSessionStats());
    });

    return unsubscribe;
  }, []);

  const addData = (key: DataKey, data: any) => {
    guestModeManager.addData(key, data);
  };

  const updateData = (key: DataKey, updater: (current: any) => any) => {
    guestModeManager.updateData(key, updater);
  };

  const exportData = () => {
    return guestModeManager.exportData();
  };

  const clearSession = () => {
    guestModeManager.clearSession();
  };

  return {
    isGuest,
    sessionStats,
    addData,
    updateData,
    exportData,
    clearSession,
    manager: guestModeManager
  };
}
