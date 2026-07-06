'use client';

import { useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabaseClient';
import { CoverArt } from '@/components/CoverArt';

export default function LoginPage() {
  const supabase = createBrowserSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function continueAsGuest() {
    document.cookie = 'guest=true; path=/; max-age=604800; samesite=lax';
    window.location.href = '/dashboard';
  }

  async function handleAccountSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (mode === 'signup') {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName || email.split('@')[0] }),
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || 'Unable to create account.');
        setLoading(false);
        return;
      }

      setMessage('Account created. Now sign in with your email and password.');
      setMode('login');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    window.location.href = '/dashboard';

    setLoading(false);
  }

  async function handlePasswordRecovery() {
    if (!email) {
      setMessage('Enter your email to recover your password.');
      return;
    }
    setLoading(true);
    const response = await fetch('/api/auth/recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    setMessage(result.message || result.error || 'If the email exists, a recovery link has been sent.');
    setLoading(false);
  }

  return (
    <main className="whale-shell flex min-h-screen items-center justify-center p-6">
      <div className="whale-panel w-full max-w-md space-y-6 p-7">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-whale-700 text-3xl text-white">🐋</div>
          <h1 className="text-3xl font-black">Welcome to The Whale</h1>
          <p className="mt-2 text-sm text-slate-600">Start as a guest to browse and try the app. Create an account with email and password when you want to save your work.</p>
        </div>

        <button
          type="button"
          className="whale-button w-full"
          disabled={loading}
          onClick={continueAsGuest}
        >
          Continue as Guest
        </button>

        <div className="flex items-center gap-3 py-3 text-sm text-slate-500">
          <span className="h-px flex-1 bg-slate-200" />
          <span>Save progress</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className={`whale-muted-button w-full ${mode === 'login' ? 'opacity-100' : 'opacity-70'}`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`whale-muted-button w-full ${mode === 'signup' ? 'opacity-100' : 'opacity-70'}`}
            onClick={() => setMode('signup')}
          >
            Create Account
          </button>
        </div>

        {mode === 'login' && (
          <div className="text-right">
            <button type="button" className="text-sm text-whale-700 underline" onClick={handlePasswordRecovery} disabled={loading}>
              Forgot password?
            </button>
          </div>
        )}

        <form onSubmit={handleAccountSubmit} className="space-y-4">
          {mode === 'signup' && (
            <label className="block space-y-2">
              <span className="whale-label">Name</span>
              <input
                className="whale-input"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>
          )}
          <label className="block space-y-2">
            <span className="whale-label">Email</span>
            <input
              className="whale-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block space-y-2">
            <span className="whale-label">Password</span>
            <input
              className="whale-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="whale-button w-full" disabled={loading}>
            {loading ? 'Working...' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        {message && (
          <p className="rounded-2xl bg-whale-50 p-4 text-sm font-semibold text-whale-900">{message}</p>
        )}

        <CoverArt className="h-40 w-full rounded-3xl border border-slate-200 bg-slate-100" />
      </div>
    </main>
  );
}
