'use client';

import { useEffect, useState } from 'react';
import { useAppSettings } from '@/components/AppSettingsProvider';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  action?: string;
  actionLabel?: string;
  gradient: string;
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '🐋 Welcome to The Whale',
    description: 'Your AI-powered operations companion for schools. No login required—start immediately as a guest.',
    icon: '👋',
    gradient: 'from-whale-500 to-whale-600',
  },
  {
    id: 'personalize',
    title: '🎨 Personalize Your Dashboard',
    description: 'Add your name, subtitle, and pin your favorite shortcuts. Everything is saved locally on this device.',
    icon: '✨',
    action: '/dashboard/settings',
    actionLabel: 'Go to Settings',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'ai-index',
    title: '📚 Explore the AI Index',
    description: 'Browse 40+ AI-powered tools for lesson planning, parent messages, feedback, and more. Create custom workflow columns to organize by your process.',
    icon: '🔍',
    action: '/dashboard/ai-index',
    actionLabel: 'Open AI Index',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    id: 'autofill',
    title: '⚡ Quick Start with Autofill',
    description: 'On any AI tool, click the autofill buttons at the top to instantly populate the form with examples. Then customize for your needs.',
    icon: '🎯',
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    id: 'tips',
    title: '💡 Daily Teaching Tips',
    description: 'Get rotating wisdom from 30 curated teaching tips. Customize rotation speed and mode in settings.',
    icon: '🌟',
    action: '/dashboard/teacher-tips',
    actionLabel: 'View Tips',
    gradient: 'from-green-500 to-green-600',
  },
  {
    id: 'features',
    title: '🎵 More Features Included',
    description: 'Ambient music • Offline support • Mobile app install • Desktop app • Drag-drop organization • Custom columns • Guest mode',
    icon: '🚀',
    gradient: 'from-pink-500 to-pink-600',
  },
  {
    id: 'ready',
    title: '✅ You\'re All Set!',
    description: 'Everything is free to use, works offline, and saves to your device. Start exploring and creating!',
    icon: '🎉',
    gradient: 'from-indigo-500 to-indigo-600',
  },
];

export function OnboardingFlow() {
  const { settings, setShowOnboarding, setHasSeenOnboarding } = useAppSettings();
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Only show onboarding on first visit (not seen before)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-close onboarding after 10 seconds of inactivity if not interacted with
  useEffect(() => {
    if (!settings.showOnboarding || !mounted) return;
    
    const timer = setTimeout(() => {
      dismissOnboarding();
    }, 45000); // 45 seconds max display time

    return () => clearTimeout(timer);
  }, [settings.showOnboarding, mounted]);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
  };

  if (!mounted || !settings.showOnboarding || settings.hasSeenOnboarding) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-xl rounded-3xl bg-gradient-to-br ${step.gradient} p-1 shadow-2xl`}>
        <div className="rounded-3xl bg-white p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-600">
                STEP {currentStep + 1} OF {steps.length}
              </span>
              <button
                onClick={() => dismissOnboarding()}
                className="text-xl text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${step.gradient} transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">{step.icon}</div>
            <h2 className="text-3xl font-black mb-3">{step.title}</h2>
            <p className="text-lg text-slate-600 leading-relaxed">{step.description}</p>
          </div>

          {/* Action Button */}
          {step.action && (
            <a
              href={step.action}
              onClick={() => dismissOnboarding()}
              className="block w-full bg-whale-600 hover:bg-whale-700 text-white font-bold py-3 px-4 rounded-xl text-center mb-4 transition"
            >
              {step.actionLabel}
            </a>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className="flex-1 py-3 px-4 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-bold rounded-xl transition disabled:opacity-50"
              disabled={currentStep === 0}
            >
              ← Back
            </button>

            {isLast ? (
              <button
                onClick={() => dismissOnboarding()}
                className="flex-1 py-3 px-4 bg-whale-600 hover:bg-whale-700 text-white font-bold rounded-xl transition"
              >
                Get Started! 🚀
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="flex-1 py-3 px-4 bg-whale-600 hover:bg-whale-700 text-white font-bold rounded-xl transition"
              >
                Next →
              </button>
            )}
          </div>

          {/* Skip */}
          <button
            onClick={() => dismissOnboarding()}
            className="w-full mt-3 text-slate-500 hover:text-slate-700 text-sm font-bold transition"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
