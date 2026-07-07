'use client';

import React, { useState } from 'react';
import { ChevronRight, Play, BookOpen, Sparkles, MessageCircle, Award, Target, Video } from 'lucide-react';
import { WDSEducationalVideoPlayer } from './WDSEducationalVideoPlayer';
import { AILearningCompanion } from './AILearningCompanion';

export function WDSProfessionalGrowth() {
  const [activeSection, setActiveSection] = useState<'videos' | 'career' | 'ai'>('videos');
  const [showCertificationInput, setShowCertificationInput] = useState(false);
  const [certificationText, setCertificationText] = useState('');
  const [certificationPoints, setCertificationPoints] = useState(0);

  // Mock WDS Curriculum Content
  const wdsPrograms = [
    {
      id: 1,
      title: 'Two-Year-Old Program',
      emoji: '👶',
      url: 'https://westhamptondayschool.org/curriculum/two-year-old-program/',
      description: 'Nurturing development through exploration and play'
    },
    {
      id: 2,
      title: 'Three-Year-Old Program',
      emoji: '🧒',
      url: 'https://westhamptondayschool.org/curriculum/three-year-old-program/',
      description: 'Building independence and social skills'
    },
    {
      id: 3,
      title: 'Pre-Kindergarten Program',
      emoji: '👧',
      url: 'https://westhamptondayschool.org/curriculum/pre-kindergarten-program/',
      description: 'Preparing for school success'
    },
    {
      id: 4,
      title: 'Kindergarten Program',
      emoji: '🎓',
      url: 'https://westhamptondayschool.org/curriculum/kindergarten-program/',
      description: 'Foundational academic skills and confidence'
    },
    {
      id: 5,
      title: 'After School Program',
      emoji: '⚽',
      url: 'https://westhamptondayschool.org/curriculum/after-school-program/',
      description: 'Enrichment and extended care'
    },
    {
      id: 6,
      title: 'Resource & Enrichment',
      emoji: '🎨',
      url: 'https://westhamptondayschool.org/resource-and-enrichment/',
      description: 'Specialized support and learning'
    }
  ];

  const careerPathways = [
    {
      title: 'Lead Teacher',
      icon: '👨‍🏫',
      milestones: ['2+ years classroom experience', 'Bachelor\'s degree', 'Leadership certification'],
      timeline: '18-24 months'
    },
    {
      title: 'Curriculum Specialist',
      icon: '📚',
      milestones: ['3+ years experience', 'Master\'s in Education', 'Curriculum design training'],
      timeline: '24-36 months'
    },
    {
      title: 'School Administrator',
      icon: '🏫',
      milestones: ['5+ years teaching', 'Master\'s degree', 'Admin certification'],
      timeline: '36+ months'
    }
  ];

  const handleCertificationSubmit = () => {
    if (certificationText.trim()) {
      // Calculate points based on degree level
      let points = 10; // Base points
      if (certificationText.toLowerCase().includes('master')) points = 50;
      if (certificationText.toLowerCase().includes('doctorate')) points = 100;
      if (certificationText.toLowerCase().includes('phd')) points = 150;
      
      setCertificationPoints(certificationPoints + points);
      setCertificationText('');
      setShowCertificationInput(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with WDS Branding */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-8 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <img
            src="https://westhamptondayschool.org/wp-content/uploads/2019/03/wds-logo-horiz.png"
            alt="WDS"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Professional Growth</span>
          </div>
          <h1 className="text-4xl font-black mb-2">
            Career Excellence at Westhampton Day School
          </h1>
          <p className="text-emerald-100 max-w-2xl">
            Grow with us through video learning, career pathways, and AI-guided professional development tailored to your goals.
          </p>
        </div>
      </div>

      {/* Certification Points Tracker */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">Professional Certification Points</h3>
          </div>
          <div className="text-3xl font-black text-emerald-600">{certificationPoints}</div>
        </div>
        
        {!showCertificationInput ? (
          <button
            onClick={() => setShowCertificationInput(true)}
            className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>+</span> Add Certification or Degree
          </button>
        ) : (
          <div className="space-y-3">
            <textarea
              value={certificationText}
              onChange={(e) => setCertificationText(e.target.value)}
              placeholder="Paste your degree, certificate, or transcript summary (e.g., Master of Education in Early Childhood, Certified Positive Behavior Support Specialist, 2025)"
              className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCertificationSubmit}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowCertificationInput(false);
                  setCertificationText('');
                }}
                className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSection('videos')}
          className={`flex items-center gap-2 px-6 py-3 font-bold border-b-2 transition-colors ${
            activeSection === 'videos'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-emerald-600'
          }`}
        >
          <Video className="w-5 h-5" />
          Professional Videos
        </button>
        <button
          onClick={() => setActiveSection('career')}
          className={`flex items-center gap-2 px-6 py-3 font-bold border-b-2 transition-colors ${
            activeSection === 'career'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-emerald-600'
          }`}
        >
          <Target className="w-5 h-5" />
          Career Pathways
        </button>
        <button
          onClick={() => setActiveSection('ai')}
          className={`flex items-center gap-2 px-6 py-3 font-bold border-b-2 transition-colors ${
            activeSection === 'ai'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-600 hover:text-emerald-600'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          AI Learning
        </button>
      </div>

      {/* Professional Videos Section */}
      {activeSection === 'videos' && (
        <div className="space-y-8">
          <WDSEducationalVideoPlayer />

          {/* WDS Programs Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              Westhampton Day School Programs & Curriculum
            </h2>
            <p className="text-slate-600">
              Explore our comprehensive curriculum for each age group and learn the pedagogical approach that guides our teaching.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wdsPrograms.map((program) => (
                <a
                  key={program.id}
                  href={program.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-emerald-400 hover:shadow-lg hover:bg-emerald-50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{program.emoji}</div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{program.title}</h3>
                  <p className="text-sm text-slate-600 group-hover:text-emerald-700">{program.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Career Pathways Section */}
      {activeSection === 'career' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-600" />
            Career Growth Pathways
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careerPathways.map((path, idx) => (
              <div
                key={idx}
                className="p-6 bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-200 rounded-xl hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{path.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{path.title}</h3>
                <p className="text-sm text-emerald-600 font-semibold mb-4">Timeline: {path.timeline}</p>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 uppercase">Key Milestones:</p>
                  {path.milestones.map((milestone, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Play className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{milestone}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors">
                  Learn More
                </button>
              </div>
            ))}
          </div>

          {/* Add Video Guidance */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Video className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Watch Career Pathway Videos</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Head to the Professional Videos tab to watch training modules for each career pathway.
                </p>
                <button
                  onClick={() => setActiveSection('videos')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  View Videos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Learning Companion Section */}
      {activeSection === 'ai' && <AILearningCompanion />}
    </div>
  );
}
