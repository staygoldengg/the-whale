'use client';

import React, { useEffect, useState } from 'react';
import { guestModeManager } from '@/lib/guestModeManager';
import { WESTHAMPTON_INFO } from '@/lib/wdsTheme';
import { Save, LogIn } from 'lucide-react';

interface GuestModeLayoutProps {
  children: React.ReactNode;
}

export function GuestModeLayout({ children }: GuestModeLayoutProps) {
  const [isGuest, setIsGuest] = useState(true);
  const [sessionStats, setSessionStats] = useState<any>(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

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
    // Show save prompt after 8+ actions
    if (sessionStats?.actionsPerformed >= 8 && !showSavePrompt) {
      setShowSavePrompt(true);
    }
    // Update banner visibility after 10+ actions
    if (sessionStats?.actionsPerformed >= 10) {
      setShowBanner(true);
    }
  }, [sessionStats?.actionsPerformed, showSavePrompt]);

  if (!isGuest) {
    return <>{children}</>;
  }

  return (
    <div>
      {/* Compact Guest Mode Bar - Shows after 10+ actions */}
      {showBanner && (
        <div className="sticky top-0 z-35 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm border-b border-emerald-200/50 px-4 py-2 shadow-sm transition-all duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-lg">👤</span>
              <div className="hidden sm:block">
                <p className="font-semibold text-emerald-900">Guest Mode</p>
                <p className="text-xs text-emerald-700 opacity-75">Actions: {sessionStats?.actionsPerformed} • {sessionStats?.durationMinutes}m</p>
              </div>
            </div>
            <button
              onClick={() => setShowSavePrompt(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-md transition font-semibold text-sm flex items-center gap-2"
            >
              <Save size={14} />
              <span className="hidden sm:inline">Save Work</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {children}

      {/* Save Prompt Modal */}
      {showSavePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5">
            <div className="text-center">
              <div className="text-5xl mb-4">💾</div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Save Your Progress</h3>
              <p className="text-sm text-slate-600 mt-2">
                You&apos;ve made great progress! Sign in to save all your work.
              </p>
            </div>

            {sessionStats && (
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-lg p-4 space-y-3 border border-emerald-200/50">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{sessionStats.actionsPerformed}</div>
                    <div className="text-xs text-slate-600 mt-1">Actions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">{sessionStats.durationMinutes}m</div>
                    <div className="text-xs text-slate-600 mt-1">Duration</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <LogIn size={16} />
                Sign In to Save
              </button>
              <button
                onClick={() => setShowSavePrompt(false)}
                className="w-full px-6 py-2.5 border-2 border-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition text-sm"
              >
                Keep Working as Guest
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Your work is stored locally. Sign in anytime to save permanently.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
