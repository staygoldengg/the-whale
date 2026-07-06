'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'school';

type AppSettings = {
  fontScale: number;
  textColor: string;
  appVolume: number;
  subscriptionPlan: SubscriptionPlan;
  calmMusicEnabled: boolean;
  tipRotationSeconds: number;
  tipRotationMode: 'sequential' | 'random';
  dashboardDisplayName: string;
  dashboardSubtitle: string;
  pinnedShortcutIds: string[];
  showLaunchSplash: boolean;
};

type AppSettingsContextValue = {
  settings: AppSettings;
  setFontScale: (fontScale: number) => void;
  setTextColor: (textColor: string) => void;
  setAppVolume: (appVolume: number) => void;
  setSubscriptionPlan: (subscriptionPlan: SubscriptionPlan) => void;
  setCalmMusicEnabled: (enabled: boolean) => void;
  setTipRotationSeconds: (seconds: number) => void;
  setTipRotationMode: (mode: 'sequential' | 'random') => void;
  setDashboardDisplayName: (name: string) => void;
  setDashboardSubtitle: (subtitle: string) => void;
  setPinnedShortcutIds: (ids: string[]) => void;
  setShowLaunchSplash: (enabled: boolean) => void;
};

const defaultSettings: AppSettings = {
  fontScale: 1,
  textColor: '#0f172a',
  appVolume: 35,
  subscriptionPlan: 'free',
  calmMusicEnabled: false,
  tipRotationSeconds: 8,
  tipRotationMode: 'sequential',
  dashboardDisplayName: 'Teacher',
  dashboardSubtitle: 'Ready to plan a warm and organized school day?',
  pinnedShortcutIds: ['teacher-tips', 'weekly-plan', 'parent-messages'],
  showLaunchSplash: true
};

const storageKey = 'the-whale-app-settings-v1';

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<AppSettings>;
      setSettings({ ...defaultSettings, ...parsed });
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
    document.documentElement.style.setProperty('--app-font-scale', String(settings.fontScale));
    document.documentElement.style.setProperty('--app-text-color', settings.textColor);
  }, [settings]);

  const value = useMemo<AppSettingsContextValue>(() => ({
    settings,
    setFontScale: (fontScale) => setSettings((prev) => ({ ...prev, fontScale })),
    setTextColor: (textColor) => setSettings((prev) => ({ ...prev, textColor })),
    setAppVolume: (appVolume) => setSettings((prev) => ({ ...prev, appVolume })),
    setSubscriptionPlan: (subscriptionPlan) => setSettings((prev) => ({ ...prev, subscriptionPlan })),
    setCalmMusicEnabled: (calmMusicEnabled) => setSettings((prev) => ({ ...prev, calmMusicEnabled })),
    setTipRotationSeconds: (tipRotationSeconds) => setSettings((prev) => ({ ...prev, tipRotationSeconds })),
    setTipRotationMode: (tipRotationMode) => setSettings((prev) => ({ ...prev, tipRotationMode })),
    setDashboardDisplayName: (dashboardDisplayName) => setSettings((prev) => ({ ...prev, dashboardDisplayName })),
    setDashboardSubtitle: (dashboardSubtitle) => setSettings((prev) => ({ ...prev, dashboardSubtitle })),
    setPinnedShortcutIds: (pinnedShortcutIds) => setSettings((prev) => ({ ...prev, pinnedShortcutIds })),
    setShowLaunchSplash: (showLaunchSplash) => setSettings((prev) => ({ ...prev, showLaunchSplash }))
  }), [settings]);

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider.');
  }
  return context;
}
