'use client';

import React, { useEffect, useState } from 'react';
import { guestModeManager } from '@/lib/guestModeManager';
import { WESTHAMPTON_INFO } from '@/lib/wdsTheme';

interface GuestModeLayoutProps {
  children: React.ReactNode;
}

export function GuestModeLayout({ children }: GuestModeLayoutProps) {
  const [isGuest, setIsGuest] = useState(true);
  const [sessionStats, setSessionStats] = useState<any>(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  useEffect(() => {
    const isGuestMode = guestModeManager.isGuestMode();
    setIsGuest(isGuestMode);
    setSessionStats(guestModeManager.getSessionStats());

    const unsubscribe = guestModeManager.subscribe(() => {
      setSessionStats(guestModeManager.getSessionStats());
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Show save prompt after 5+ actions
    if (sessionStats?.actionsPerformed >= 5) {
      setShowSavePrompt(true);
    }
  }, [sessionStats?.actionsPerformed]);

  if (!isGuest) {
    return <>{children}</>;
  }

  return (
    <div>
      {/* Guest Mode Header Banner */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-400 to-rose-300 text-slate-900 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <div>
              <p className="font-bold">Guest Mode Active</p>
              <p className="text-xs">All features available • Sign in to save your work</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {sessionStats && (
              <div className="hidden md:flex gap-4 text-sm">
                <div>
                  <span className="font-semibold">{sessionStats.actionsPerformed}</span> actions
                </div>
                <div>
                  <span className="font-semibold">{sessionStats.durationMinutes}</span> min
                </div>
              </div>
            )}
            <button
              onClick={() => setShowSavePrompt(true)}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-semibold"
            >
              Save Work 💾
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {children}

      {/* Save Prompt Modal */}
      {showSavePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-3">💾</div>
              <h3 className="text-2xl font-bold text-slate-900">Save Your Progress</h3>
              <p className="text-slate-600 mt-2">
                You&apos;ve done great work! Sign in to save everything you&apos;ve accomplished.
              </p>
            </div>

            {sessionStats && (
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Actions Performed:</span>
                  <span className="font-bold text-blue-600">{sessionStats.actionsPerformed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Session Duration:</span>
                  <span className="font-bold text-emerald-600">{sessionStats.durationMinutes} min</span>
                </div>
                {sessionStats.dataItems.credentials > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Credentials:</span>
                    <span className="font-bold text-purple-600">{sessionStats.dataItems.credentials}</span>
                  </div>
                )}
                {sessionStats.dataItems.skillPoints > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Skill Achievements:</span>
                    <span className="font-bold text-amber-600">{sessionStats.dataItems.skillPoints}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg transition"
              >
                Sign In to Save 🔐
              </button>
              <button
                onClick={() => setShowSavePrompt(false)}
                className="w-full px-6 py-3 border-2 border-slate-300 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Continue as Guest
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Your guest data is stored locally and will be lost if you clear browser storage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
