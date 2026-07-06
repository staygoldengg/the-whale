'use client';

import { useAppSettings, type SubscriptionPlan } from '@/components/AppSettingsProvider';
import { dashboardShortcuts } from '@/lib/dashboardShortcuts';

const colorOptions = [
  { label: 'Slate', value: '#0f172a' },
  { label: 'Warm Gray', value: '#3f3f46' },
  { label: 'Ocean Blue', value: '#1e3a8a' },
  { label: 'Forest', value: '#14532d' }
];

const plans: { value: SubscriptionPlan; label: string; detail: string }[] = [
  { value: 'free', label: 'Free', detail: 'Core tools with guest mode.' },
  { value: 'starter', label: 'Starter', detail: 'Expanded templates and saved drafts.' },
  { value: 'pro', label: 'Pro', detail: 'Advanced AI workflows and analytics.' },
  { value: 'school', label: 'School', detail: 'Team-level workflows and admin controls.' }
];

export default function SettingsPage() {
  const {
    settings,
    setFontScale,
    setTextColor,
    setAppVolume,
    setSubscriptionPlan,
    setCalmMusicEnabled,
    setTipRotationSeconds,
    setTipRotationMode,
    setDashboardDisplayName,
    setDashboardSubtitle,
    setPinnedShortcutIds,
    setShowLaunchSplash
  } = useAppSettings();

  function toggleShortcut(id: string) {
    const current = settings.pinnedShortcutIds;
    if (current.includes(id)) {
      setPinnedShortcutIds(current.filter((entry) => entry !== id));
      return;
    }
    if (current.length >= 6) {
      return;
    }
    setPinnedShortcutIds([...current, id]);
  }

  return (
    <div className="space-y-6">
      <section className="whale-panel p-7">
        <p className="text-sm font-bold uppercase tracking-wide text-whale-700">Settings</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Personalize your app</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Adjust readability, color comfort, calm music volume, and your active subscription plan.</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="whale-panel p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-950">Display</h2>
          <label className="block space-y-2">
            <span className="whale-label">Font size scale ({settings.fontScale.toFixed(2)}x)</span>
            <input
              className="w-full"
              type="range"
              min={0.85}
              max={1.35}
              step={0.05}
              value={settings.fontScale}
              onChange={(e) => setFontScale(Number(e.target.value))}
            />
          </label>
          <label className="block space-y-2">
            <span className="whale-label">Text color</span>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTextColor(option.value)}
                  className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${settings.textColor === option.value ? 'border-whale-700 bg-whale-100 text-whale-900' : 'border-slate-200 bg-white text-slate-700'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </label>
        </article>

        <article className="whale-panel p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-950">Audio</h2>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
            <span className="text-sm font-semibold text-slate-700">Calm background music</span>
            <button
              type="button"
              onClick={() => setCalmMusicEnabled(!settings.calmMusicEnabled)}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${settings.calmMusicEnabled ? 'bg-whale-700 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              {settings.calmMusicEnabled ? 'On' : 'Off'}
            </button>
          </label>
          <label className="block space-y-2">
            <span className="whale-label">App volume ({settings.appVolume}%)</span>
            <input
              className="w-full"
              type="range"
              min={0}
              max={100}
              step={1}
              value={settings.appVolume}
              onChange={(e) => setAppVolume(Number(e.target.value))}
            />
          </label>
        </article>
      </section>

      <section className="whale-panel p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-950">Dashboard Personalization</h2>
        <label className="block space-y-2">
          <span className="whale-label">Display name</span>
          <input
            className="whale-input"
            value={settings.dashboardDisplayName}
            onChange={(e) => setDashboardDisplayName(e.target.value)}
            placeholder="Teacher name"
          />
        </label>
        <label className="block space-y-2">
          <span className="whale-label">Dashboard subtitle</span>
          <textarea
            className="whale-input min-h-24"
            value={settings.dashboardSubtitle}
            onChange={(e) => setDashboardSubtitle(e.target.value)}
            placeholder="Personal message shown on dashboard"
          />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
          <span className="text-sm font-semibold text-slate-700">Show launch splash on dashboard open</span>
          <button
            type="button"
            onClick={() => setShowLaunchSplash(!settings.showLaunchSplash)}
            className={`rounded-xl px-3 py-2 text-sm font-semibold ${settings.showLaunchSplash ? 'bg-whale-700 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            {settings.showLaunchSplash ? 'On' : 'Off'}
          </button>
        </label>
        <div className="space-y-2">
          <p className="whale-label">Pin up to 6 shortcut buttons on dashboard</p>
          <div className="flex flex-wrap gap-2">
            {dashboardShortcuts.map((shortcut) => {
              const active = settings.pinnedShortcutIds.includes(shortcut.id);
              return (
                <button
                  key={shortcut.id}
                  type="button"
                  onClick={() => toggleShortcut(shortcut.id)}
                  className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${active ? 'border-whale-700 bg-whale-50 text-whale-900' : 'border-slate-200 bg-white text-slate-700'}`}
                >
                  {shortcut.title}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="whale-panel p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-950">AI Tip Rotation</h2>
        <label className="block space-y-2">
          <span className="whale-label">Tip interval ({settings.tipRotationSeconds}s)</span>
          <input
            className="w-full"
            type="range"
            min={4}
            max={20}
            step={1}
            value={settings.tipRotationSeconds}
            onChange={(e) => setTipRotationSeconds(Number(e.target.value))}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTipRotationMode('sequential')}
            className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${settings.tipRotationMode === 'sequential' ? 'border-whale-700 bg-whale-50 text-whale-900' : 'border-slate-200 bg-white text-slate-700'}`}
          >
            Sequential
          </button>
          <button
            type="button"
            onClick={() => setTipRotationMode('random')}
            className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${settings.tipRotationMode === 'random' ? 'border-whale-700 bg-whale-50 text-whale-900' : 'border-slate-200 bg-white text-slate-700'}`}
          >
            Random
          </button>
        </div>
      </section>

      <section className="whale-panel p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-950">Subscription plan</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {plans.map((plan) => (
            <button
              key={plan.value}
              type="button"
              onClick={() => setSubscriptionPlan(plan.value)}
              className={`rounded-2xl border p-4 text-left ${settings.subscriptionPlan === plan.value ? 'border-whale-700 bg-whale-50' : 'border-slate-200 bg-white'}`}
            >
              <p className="font-bold text-slate-950">{plan.label}</p>
              <p className="mt-1 text-sm text-slate-600">{plan.detail}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
