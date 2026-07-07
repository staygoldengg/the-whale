'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WDS_COLORS, WESTHAMPTON_INFO } from '@/lib/wdsTheme';

export function WDSHeroLanding() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-700 to-emerald-600">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl">🎓</div>
            <div>
              <h1 className="text-xl font-bold text-white">{WESTHAMPTON_INFO.shortName}</h1>
              <p className="text-xs text-emerald-100">{WESTHAMPTON_INFO.tagline}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-2 text-white hover:bg-white/20 rounded-lg transition"
            >
              Sign In
            </button>
            <Link
              href="/dashboard/career-path"
              className="px-6 py-2 bg-gradient-to-r from-amber-300 to-rose-200 text-slate-900 font-semibold rounded-lg hover:shadow-lg transition"
            >
              Start as Guest 🚀
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Heading */}
          <div className="mb-8 space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              {WESTHAMPTON_INFO.tagline}
            </h2>
            <p className="text-xl md:text-2xl text-emerald-50">
              Track your teaching journey from rookie to legendary master
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-12">
            <p className="text-white text-lg leading-relaxed">
              {WESTHAMPTON_INFO.mission}
            </p>
            <p className="text-emerald-100 text-sm mt-4">
              Est. {WESTHAMPTON_INFO.established} • Nationally Accredited • {WESTHAMPTON_INFO.location}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: '📜',
                title: 'Credential Verification',
                desc: 'Submit credentials and let AI verify authenticity'
              },
              {
                icon: '⭐',
                title: 'Skill Development',
                desc: 'Earn points and level up across 6 skill areas'
              },
              {
                icon: '🏆',
                title: 'Leaderboards',
                desc: 'Compete with colleagues and celebrate achievements'
              },
              {
                icon: '🤖',
                title: 'AI Coaching',
                desc: 'Personalized recommendations for growth'
              },
              {
                icon: '👥',
                title: 'Team Collaboration',
                desc: 'Mentor, share resources, and collaborate'
              },
              {
                icon: '🎓',
                title: '30-Year Path',
                desc: 'Journey from rookie to legendary master'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-emerald-100 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/dashboard/career-path"
              className="px-8 py-4 bg-gradient-to-r from-amber-300 to-rose-200 text-slate-900 font-bold rounded-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              Explore as Guest 🚀
            </Link>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition"
            >
              Sign In to Account
            </button>
          </div>

          {/* Guest Mode Info */}
          <div className="bg-emerald-50/10 backdrop-blur border border-emerald-300/30 rounded-xl p-6 inline-block">
            <p className="text-emerald-50 text-sm">
              ✨ <strong>Try everything as a guest!</strong> All features are available.
              <br />
              Just sign in when you're ready to save your progress.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white/5 backdrop-blur py-20 px-4 border-y border-white/20">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Our Values</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {WESTHAMPTON_INFO.values.map((value, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl mb-3">
                  {value === 'Nurturing' && '🤝'}
                  {value === 'Safe' && '🛡️'}
                  {value === 'Respectful' && '🙏'}
                  {value === 'Creative' && '🎨'}
                  {value === 'Community-Focused' && '🌍'}
                  {value === 'Excellence' && '⭐'}
                </div>
                <h4 className="text-white font-semibold">{value}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-white/10 py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-bold mb-4">About WDS</h4>
            <p className="text-emerald-100 text-sm">{WESTHAMPTON_INFO.tagline}</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <p className="text-emerald-100 text-sm">{WESTHAMPTON_INFO.phone}</p>
            <p className="text-emerald-100 text-sm">{WESTHAMPTON_INFO.location}</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="text-emerald-100 text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Accreditation</h4>
            <p className="text-emerald-100 text-sm">{WESTHAMPTON_INFO.accreditation}</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-emerald-100 text-sm">
          <p>© 2026 {WESTHAMPTON_INFO.name}. Established {WESTHAMPTON_INFO.established}.</p>
          <p className="mt-2 text-xs">Lessons that Last a Lifetime</p>
        </div>
      </footer>
    </div>
  );
}
