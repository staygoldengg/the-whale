import Link from 'next/link';
import { LuxuryGradientBg, LuxuryCard, LuxuryButton, LuxuryText, LuxuryDivider, LuxuryBadge, LuxurySection } from '@/components/LuxuryUI';
import { FuturisticButton, FuturisticBackground, PulsingOrb, AnimatedText } from '@/components/FuturisticUI';
import { BrandingFooter } from '@/components/BrandingFooter';

export default function HomePage() {
  return (
    <>
      <main className="whale-shell min-h-screen overflow-hidden">
        <LuxuryGradientBg variant="premium" className="min-h-screen flex flex-col">
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 opacity-20">
            <PulsingOrb size="lg" color="from-blue-400 to-cyan-400" />
          </div>
          <div className="absolute bottom-20 left-10 opacity-15">
            <PulsingOrb size="md" color="from-purple-400 to-pink-400" />
          </div>

          <div className="relative z-10 flex-1 flex flex-col">
            <div className="absolute right-6 top-6 rounded-2xl">
              <Link href="/login">
                <LuxuryButton variant="secondary" size="md">
                  Staff Login
                </LuxuryButton>
              </Link>
            </div>

<section className="mx-auto max-w-5xl px-6 py-16 text-center flex-1 flex flex-col justify-center">
              {/* Logo/Icon */}
              <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-7xl text-white shadow-2xl shadow-blue-300/50 animate-pulse-glow">
                🐋
              </div>

              {/* School branding */}
              <LuxuryBadge variant="primary" className="mx-auto mb-6 w-fit">
                Westhampton Day School
              </LuxuryBadge>

              <p className="font-semibold uppercase tracking-wider text-blue-600 mb-4">
                Premium AI Companion for Educators
              </p>

              {/* Main heading */}
              <LuxuryText variant="h1" gradient className="mb-6">
                The <AnimatedText>Whale</AnimatedText>
              </LuxuryText>

              {/* Tagline */}
              <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-700 font-medium mb-8">
                Transform your teaching with AI-powered lesson planning, theme weeks, parent communications, and school management—all designed by educators for educators.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Link href="/dashboard">
                  <LuxuryButton variant="primary" size="lg">
                    ✨ Open Dashboard
                  </LuxuryButton>
                </Link>
                <Link href="/login">
                  <LuxuryButton variant="outline" size="lg">
                    Staff Login
                  </LuxuryButton>
                </Link>
              </div>

              <LuxuryDivider className="mb-12" />

              {/* Feature highlights - Luxury cards */}
              <LuxurySection
                title="What's Included"
                subtitle="Everything educators need to create engaging learning experiences"
                className="mb-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LuxuryCard variant="glass" hover className="p-8 text-left">
                    <div className="text-5xl mb-4">📚</div>
                    <LuxuryText variant="h3">Lesson Planning Suite</LuxuryText>
                    <p className="text-slate-600 mt-3 leading-relaxed">
                      AI-powered lesson generation with quality scoring, materials lists, and pedagogical alignment to standards.
                    </p>
                  </LuxuryCard>

                  <LuxuryCard variant="glass" hover className="p-8 text-left">
                    <div className="text-5xl mb-4">🎨</div>
                    <LuxuryText variant="h3">Creative Assets</LuxuryText>
                    <p className="text-slate-600 mt-3 leading-relaxed">
                      Theme weeks, coloring pages, parent messages, team emails—all generated to match your school's voice.
                    </p>
                  </LuxuryCard>

                  <LuxuryCard variant="glass" hover className="p-8 text-left">
                    <div className="text-5xl mb-4">🌍</div>
                    <LuxuryText variant="h3">School Dashboard</LuxuryText>
                    <p className="text-slate-600 mt-3 leading-relaxed">
                      Unified hub for attendance gamification, nutrition tracking, weather insights, and learning pathways.
                    </p>
                  </LuxuryCard>

                  <LuxuryCard variant="glass" hover className="p-8 text-left">
                    <div className="text-5xl mb-4">🧠</div>
                    <LuxuryText variant="h3">School Brain</LuxuryText>
                    <p className="text-slate-600 mt-3 leading-relaxed">
                      Central knowledge base indexing 50+ curated teaching materials, organized by subject and grade level.
                    </p>
                  </LuxuryCard>
                </div>
              </LuxurySection>

              {/* Get Started Card */}
              <LuxuryCard variant="elevated" className="p-10 mb-12 bg-gradient-to-br from-white to-blue-50">
                <LuxuryText variant="h2" className="mb-4">🚀 Start Free Today</LuxuryText>
                <p className="text-slate-700 mb-6 max-w-2xl mx-auto leading-relaxed">
                  No account required. Open as a guest and explore the full dashboard. Create a staff account anytime to save your work and unlock personalization.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <LuxuryButton variant="gradient" size="lg">
                      Launch Dashboard
                    </LuxuryButton>
                  </Link>
                  <Link href="/login">
                    <LuxuryButton variant="secondary" size="lg">
                      Sign In
                    </LuxuryButton>
                  </Link>
                </div>
              </LuxuryCard>

              {/* Benefits Grid */}
              <LuxurySection
                title="Why Educators Love The Whale"
                className="mb-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: '⚡', text: 'Save 5+ hours per week on planning' },
                    { icon: '🎯', text: 'Aligned to learning standards' },
                    { icon: '🔒', text: 'Preschool-safe content' },
                    { icon: '💻', text: 'Works offline' },
                    { icon: '📱', text: 'Mobile app ready' },
                    { icon: '🎉', text: 'Free tier available' },
                  ].map((benefit) => (
                    <div key={benefit.text} className="flex items-center gap-3 text-left">
                      <span className="text-3xl">{benefit.icon}</span>
                      <p className="text-slate-700 font-medium">{benefit.text}</p>
                    </div>
                  ))}
                </div>
              </LuxurySection>
            </section>
          </div>
        </LuxuryGradientBg>
      </main>

      {/* Branding Footer */}
      <BrandingFooter showBuiltBy showPoweredBy />
    </>
  );
}
