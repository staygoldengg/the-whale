'use client';

import React, { useState } from 'react';
import { Target, TrendingUp, BookOpen, Users, Lightbulb, Award, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { FuturisticButton } from './FuturisticUI';

/**
 * LearningPathways Component
 * 
 * Shows individualized developmental pathways with progress tracking
 * across cognitive, social-emotional, physical, and creative domains.
 */
export function LearningPathways() {
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  const pathways = [
    {
      id: 'cognitive',
      name: 'Cognitive Development',
      emoji: '🧠',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      progress: 68,
      milestones: [
        { title: 'Color Recognition', completed: true },
        { title: 'Number Sequencing 1-5', completed: true },
        { title: 'Sorting by Category', completed: true },
        { title: 'Counting 1-10', completed: false },
        { title: 'Basic Problem Solving', completed: false },
      ],
    },
    {
      id: 'socialemotional',
      name: 'Social-Emotional',
      emoji: '❤️',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      progress: 75,
      milestones: [
        { title: 'Following Directions', completed: true },
        { title: 'Sharing with Peers', completed: true },
        { title: 'Expressing Emotions', completed: true },
        { title: 'Conflict Resolution', completed: false },
        { title: 'Empathy Recognition', completed: false },
      ],
    },
    {
      id: 'physical',
      name: 'Physical Development',
      emoji: '💪',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      progress: 82,
      milestones: [
        { title: 'Gross Motor Skills', completed: true },
        { title: 'Balance & Coordination', completed: true },
        { title: 'Fine Motor Control', completed: true },
        { title: 'Pencil Grip Development', completed: true },
        { title: 'Cutting with Scissors', completed: false },
      ],
    },
    {
      id: 'creative',
      name: 'Creative Expression',
      emoji: '🎨',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      progress: 71,
      milestones: [
        { title: 'Color Exploration', completed: true },
        { title: 'Drawing Shapes', completed: true },
        { title: 'Musical Rhythm', completed: true },
        { title: 'Imaginative Play', completed: false },
        { title: 'Story Telling', completed: false },
      ],
    },
  ];

  const activePathway = selectedPathway ? pathways.find(p => p.id === selectedPathway) : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-2xl text-slate-900">Learning Pathways</h3>
          <p className="text-sm text-slate-600">Individualized developmental progress</p>
        </div>
        <Target className="w-8 h-8 text-blue-600" />
      </div>

      {/* Pathway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pathways.map(pathway => (
          <div
            key={pathway.id}
            onClick={() => setSelectedPathway(selectedPathway === pathway.id ? null : pathway.id)}
            className={`rounded-2xl p-6 border-2 cursor-pointer transition-all ${
              selectedPathway === pathway.id
                ? `${pathway.bgColor} ${pathway.borderColor} ring-2 ring-offset-2`
                : `${pathway.bgColor} ${pathway.borderColor} hover:shadow-lg`
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{pathway.emoji}</span>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">{pathway.name}</h4>
                  <p className="text-sm text-slate-600">{pathway.progress}% Complete</p>
                </div>
              </div>
              <ChevronRight className={`w-6 h-6 transition-transform ${selectedPathway === pathway.id ? 'rotate-90' : ''}`} />
            </div>

            {/* Progress Bar */}
            <div className="w-full rounded-full h-3 bg-slate-200 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${pathway.color} transition-all`}
                style={{ width: `${pathway.progress}%` }}
              />
            </div>

            {/* Expanded Details */}
            {selectedPathway === pathway.id && (
              <div className="mt-6 space-y-3 border-t-2 border-current pt-4 opacity-70">
                {pathway.milestones.map((milestone, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {milestone.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                    <span className={milestone.completed ? 'line-through text-slate-500' : 'text-slate-900'}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * LessonPlanIdeas Component
 * 
 * Suggests relevant lesson ideas based on learning pathways and interests
 */
export function LessonPlanIdeas() {
  const lessons = [
    {
      id: 1,
      title: 'Rainbow Color Sorting',
      domain: 'Cognitive',
      emoji: '🌈',
      duration: '20 min',
      skillsDeveloped: ['Color Recognition', 'Sorting', 'Categorization'],
      materials: ['Colored items', 'Sorting basket'],
      difficulty: 'Beginner',
    },
    {
      id: 2,
      title: 'Emotion Faces Activity',
      domain: 'Social-Emotional',
      emoji: '😊',
      duration: '25 min',
      skillsDeveloped: ['Emotion Recognition', 'Expression', 'Communication'],
      materials: ['Paper plates', 'Markers', 'Yarn'],
      difficulty: 'Beginner',
    },
    {
      id: 3,
      title: 'Obstacle Course Challenge',
      domain: 'Physical',
      emoji: '🏃',
      duration: '30 min',
      skillsDeveloped: ['Gross Motor', 'Balance', 'Coordination'],
      materials: ['Cones', 'Rope', 'Mats'],
      difficulty: 'Intermediate',
    },
    {
      id: 4,
      title: 'Story Time & Drama Play',
      domain: 'Creative',
      emoji: '🎭',
      duration: '35 min',
      skillsDeveloped: ['Imagination', 'Language', 'Social Skills'],
      materials: ['Books', 'Props', 'Costume pieces'],
      difficulty: 'Intermediate',
    },
    {
      id: 5,
      title: 'Number Song & Dance',
      domain: 'Cognitive',
      emoji: '🎵',
      duration: '15 min',
      skillsDeveloped: ['Number Sequence', 'Rhythm', 'Memory'],
      materials: ['Music player', 'Open space'],
      difficulty: 'Beginner',
    },
    {
      id: 6,
      title: 'Nature Art Collage',
      domain: 'Creative',
      emoji: '🍃',
      duration: '40 min',
      skillsDeveloped: ['Fine Motor', 'Creativity', 'Observation'],
      materials: ['Paper', 'Glue', 'Natural items'],
      difficulty: 'Intermediate',
    },
  ];

  const getDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      'Cognitive': 'from-blue-100 to-blue-50',
      'Social-Emotional': 'from-pink-100 to-pink-50',
      'Physical': 'from-green-100 to-green-50',
      'Creative': 'from-purple-100 to-purple-50',
    };
    return colors[domain] || 'from-slate-100 to-slate-50';
  };

  const getDomainBorder = (domain: string) => {
    const colors: Record<string, string> = {
      'Cognitive': 'border-blue-200',
      'Social-Emotional': 'border-pink-200',
      'Physical': 'border-green-200',
      'Creative': 'border-purple-200',
    };
    return colors[domain] || 'border-slate-200';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-2xl text-slate-900">Suggested Lessons</h3>
          <p className="text-sm text-slate-600">Ideas aligned with learning pathways</p>
        </div>
        <Lightbulb className="w-8 h-8 text-yellow-500" />
      </div>

      {/* Lesson Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map(lesson => (
          <div
            key={lesson.id}
            className={`rounded-xl p-5 border-2 ${getDomainBorder(lesson.domain)} bg-gradient-to-br ${getDomainColor(lesson.domain)} hover:shadow-lg transition-all cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{lesson.emoji}</span>
                <div>
                  <h4 className="font-bold text-slate-900">{lesson.title}</h4>
                  <p className="text-xs text-slate-600">{lesson.domain}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="text-xs font-bold bg-white/50 backdrop-blur px-2 py-1 rounded-full">⏱️ {lesson.duration}</span>
              <span className="text-xs font-bold bg-white/50 backdrop-blur px-2 py-1 rounded-full">
                {lesson.difficulty === 'Beginner' ? '🌱 Beginner' : '🌳 Intermediate'}
              </span>
            </div>

            <div className="mb-3 pb-3 border-b border-current opacity-50">
              <p className="text-xs font-bold text-slate-600 mb-1">Skills Developed:</p>
              <div className="flex flex-wrap gap-1">
                {lesson.skillsDeveloped.map((skill, idx) => (
                  <span key={idx} className="text-xs bg-white/70 backdrop-blur px-2 py-0.5 rounded text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-bold text-slate-600 mb-1">Materials:</p>
              <p className="text-xs text-slate-700">{lesson.materials.join(', ')}</p>
            </div>

            <FuturisticButton
              variant="secondary"
              size="sm"
              className="w-full"
            >
              View Lesson
            </FuturisticButton>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * GlobalEarlyLearningTrends Component
 * 
 * Showcases recent trends and innovations in early childhood education worldwide
 */
export function GlobalEarlyLearningTrends() {
  const trends = [
    {
      id: 1,
      title: 'Montessori-Inspired Learning',
      region: '🇮🇹 Italy / Global',
      description: 'Self-directed learning with prepared environments emphasizing independence',
      keyBenefit: 'Child-paced development',
      emoji: '🏫',
      color: 'from-amber-100 to-orange-100',
      borderColor: 'border-amber-300',
    },
    {
      id: 2,
      title: 'Outdoor Learning (Forest Schools)',
      region: '🇸🇪 Scandinavia',
      description: 'Nature-based education with extended outdoor time year-round',
      keyBenefit: 'Resilience & Environmental awareness',
      emoji: '🌲',
      color: 'from-green-100 to-emerald-100',
      borderColor: 'border-green-300',
    },
    {
      id: 3,
      title: 'Project-Based Learning',
      region: '🇺🇸 USA / Europe',
      description: 'Deep investigation of themes through hands-on exploration',
      keyBenefit: 'Critical thinking & Collaboration',
      emoji: '📚',
      color: 'from-blue-100 to-indigo-100',
      borderColor: 'border-blue-300',
    },
    {
      id: 4,
      title: 'Social-Emotional Learning Focus',
      region: '🌍 Worldwide',
      description: 'Emphasis on emotional literacy and relationship skills',
      keyBenefit: 'Mental health & Social skills',
      emoji: '❤️',
      color: 'from-pink-100 to-rose-100',
      borderColor: 'border-pink-300',
    },
    {
      id: 5,
      title: 'Play-Based Learning',
      region: '🇳🇿 New Zealand (Te Whāriki)',
      description: 'Learning through play as primary educational approach',
      keyBenefit: 'Joy & Natural curiosity development',
      emoji: '🎮',
      color: 'from-purple-100 to-violet-100',
      borderColor: 'border-purple-300',
    },
    {
      id: 6,
      title: 'STEM/STEAM Integration',
      region: '🌍 Global',
      description: 'Science, Technology, Engineering, Arts, Math in integrated contexts',
      keyBenefit: 'Problem-solving & Future readiness',
      emoji: '🔬',
      color: 'from-cyan-100 to-teal-100',
      borderColor: 'border-cyan-300',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-2xl text-slate-900">Global Learning Trends</h3>
          <p className="text-sm text-slate-600">Innovations in early childhood education worldwide</p>
        </div>
        <TrendingUp className="w-8 h-8 text-blue-600" />
      </div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trends.map(trend => (
          <div
            key={trend.id}
            className={`rounded-xl p-5 border-2 ${trend.borderColor} bg-gradient-to-br ${trend.color} hover:shadow-lg transition-all cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{trend.emoji}</span>
              <span className="text-sm font-bold bg-white/60 backdrop-blur px-2 py-1 rounded">
                {trend.region}
              </span>
            </div>

            <h4 className="font-bold text-lg text-slate-900 mb-2">{trend.title}</h4>
            <p className="text-sm text-slate-700 mb-3">{trend.description}</p>

            <div className="pt-3 border-t-2 border-current opacity-70">
              <p className="text-xs font-bold text-slate-600 mb-1">Key Benefit:</p>
              <p className="text-sm font-bold text-slate-800">✨ {trend.keyBenefit}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
        <p className="text-sm text-slate-700">
          <span className="font-bold">💡 Insight:</span> The global trend in early learning emphasizes holistic child development through play, nature connection, and social-emotional learning. Focus has shifted from traditional academic emphasis to building foundational skills like creativity, resilience, and collaboration.
        </p>
      </div>
    </div>
  );
}
