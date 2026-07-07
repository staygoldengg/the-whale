import Link from 'next/link';
import { CoverArt } from '@/components/CoverArt';
import { FuturisticButton, FuturisticBackground, PulsingOrb, AnimatedText } from '@/components/FuturisticUI';
import { BrandingFooter } from '@/components/BrandingFooter';

export default function HomePage() {
  return (
    <>
      <main className="whale-shell min-h-screen p-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 opacity-30">
          <PulsingOrb size="lg" color="from-blue-400 to-cyan-400" />
        </div>
        <div className="absolute bottom-20 left-10 opacity-20">
          <PulsingOrb size="md" color="from-purple-400 to-pink-400" />
        </div>

        <div className="relative z-10">
          <div className="absolute right-6 top-6 rounded-3xl bg-white/90 p-3 shadow-soft backdrop-blur">
            <Link href="/login" className="whale-muted-button text-sm px-4 py-2">
              Staff Login
            </Link>
          </div>

          <section className="mx-auto max-w-4xl p-8 text-center">
            {/* Logo/Icon */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-6xl text-white shadow-lg animate-pulse-glow">
              🐋
            </div>

            {/* School branding */}
            <p className="font-semibold uppercase tracking-widest text-sm text-blue-600 mb-2">
              Westhampton Day School
            </p>

            <p className="font-semibold uppercase tracking-wider text-whale-700 mb-3">
              AI Companion for Educators
            </p>

            {/* Main heading */}
            <h1 className="mt-3 text-6xl font-black tracking-tight text-slate-950 mb-4">
              The <AnimatedText>Whale</AnimatedText>
            </h1>

            {/* Tagline */}
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Generate preschool-safe theme weeks, lesson plans, parent messages, team emails, and more.
              Built by educators, powered by advanced AI to make your teaching time more impactful.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/dashboard" className="inline-block">
                <FuturisticButton variant="gradient" size="lg" shimmer>
                  Open Dashboard
                </FuturisticButton>
              </Link>
              <Link href="/login" className="inline-block">
                <FuturisticButton variant="secondary" size="lg">
                  Staff Login
                </FuturisticButton>
              </Link>
            </div>

            {/* Feature section */}
            <div className="mt-12 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-left">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                🚀 Get Started Instantly
              </p>
              <h2 className="mt-3 text-4xl font-black text-slate-950">Open in Base Mode</h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Use The Whale immediately as a guest. No account needed. Staff login unlocks:
              </p>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Save and organize your work</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Personalized AI suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Brightwheel integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Advanced customization</span>
                </li>
              </ul>
            </div>

            {/* Preview */}
            <div className="mt-10">
              <CoverArt className="mx-auto h-72 w-full max-w-3xl rounded-2xl border-2 border-slate-200 bg-slate-100 shadow-lg" />
            </div>

            {/* Feature highlights */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '📚', title: 'Lesson Planning', desc: 'AI-powered lesson generation with quality scoring' },
                { icon: '🎨', title: 'Creative Assets', desc: 'Theme weeks, coloring pages, and parent messages' },
                { icon: '🔄', title: 'School Brain', desc: 'Central knowledge base for all your resources' }
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-blue-100 bg-white/70 backdrop-blur p-6 text-center hover:shadow-lg transition-all hover:translate-y-[-2px]"
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Branding Footer */}
      <BrandingFooter showBuiltBy showPoweredBy />
    </>
  );
}
