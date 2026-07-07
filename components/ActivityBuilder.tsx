'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, Zap, AlertCircle, CheckCircle2, Loader, X, ChevronDown } from 'lucide-react';
import { FuturisticButton } from './FuturisticUI';

interface EducationalActivity {
  title: string;
  description: string;
  duration: number;
  groupSize: string;
  location: 'indoor' | 'outdoor' | 'both';
  ageRange: string;
  objectives: string[];
  skills: { name: string; icon?: string }[];
  standards: string[];
  suppliesIncluded: string[];
  suppliesNotIncluded: string[];
  teachingTips: string;
  assessmentTips: string;
}

/**
 * ActivityBuilder: Component to create rich educational activities
 */
export function ActivityBuilder({
  onSave,
  onCancel
}: {
  onSave: (activity: EducationalActivity) => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState<'basic' | 'content' | 'pedagogy' | 'review'>('basic');
  const [activity, setActivity] = useState<EducationalActivity>({
    title: '',
    description: '',
    duration: 15,
    groupSize: 'Small group',
    location: 'indoor',
    ageRange: '3-5 years',
    objectives: [],
    skills: [],
    standards: [],
    suppliesIncluded: [],
    suppliesNotIncluded: [],
    teachingTips: '',
    assessmentTips: ''
  });

  const [newObjective, setNewObjective] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newStandard, setNewStandard] = useState('');
  const [newSupply, setNewSupply] = useState({ text: '', isIncluded: true });

  const skillEmojis = ['🎨', '🧮', '📚', '💪', '🎵', '🤝', '🧩', '💭'];
  const commonSkills = [
    { name: 'Fine Motor', icon: '🖐️' },
    { name: 'Gross Motor', icon: '💪' },
    { name: 'Language', icon: '📚' },
    { name: 'Math', icon: '🧮' },
    { name: 'Social-Emotional', icon: '🤝' },
    { name: 'Creativity', icon: '🎨' },
    { name: 'Problem Solving', icon: '🧩' },
    { name: 'Observation', icon: '👀' }
  ];

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: '📝' },
    { id: 'content', label: 'Content', icon: '📚' },
    { id: 'pedagogy', label: 'Pedagogy', icon: '🎓' },
    { id: 'review', label: 'Review', icon: '✓' }
  ];

  const handleNext = () => {
    const stepOrder = ['basic', 'content', 'pedagogy', 'review'];
    const currentIdx = stepOrder.indexOf(step);
    if (currentIdx < stepOrder.length - 1) {
      setStep(stepOrder[currentIdx + 1] as any);
    }
  };

  const handleBack = () => {
    const stepOrder = ['basic', 'content', 'pedagogy', 'review'];
    const currentIdx = stepOrder.indexOf(step);
    if (currentIdx > 0) {
      setStep(stepOrder[currentIdx - 1] as any);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex justify-between gap-2">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex-1 text-center">
            <button
              onClick={() => setStep(s.id as any)}
              className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                step === s.id
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="mr-1">{s.icon}</span>
              {s.label}
            </button>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 space-y-6">
        {step === 'basic' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Activity Basics</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Activity Title</label>
                <input
                  type="text"
                  value={activity.title}
                  onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                  placeholder="e.g., Morning Circle Time"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea
                  value={activity.description}
                  onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                  placeholder="What is this activity about?"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={activity.duration}
                    onChange={(e) => setActivity({ ...activity, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Age Range</label>
                  <input
                    type="text"
                    value={activity.ageRange}
                    onChange={(e) => setActivity({ ...activity, ageRange: e.target.value })}
                    placeholder="3-5 years"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Group Size</label>
                  <select
                    value={activity.groupSize}
                    onChange={(e) => setActivity({ ...activity, groupSize: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Individual</option>
                    <option>Small group</option>
                    <option>Large group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                  <select
                    value={activity.location}
                    onChange={(e) => setActivity({ ...activity, location: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'content' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Learning Content</h3>

            {/* Objectives */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Learning Objectives</label>
              <div className="space-y-2">
                {activity.objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-sm text-slate-700">✓ {obj}</span>
                    <button
                      onClick={() => setActivity({
                        ...activity,
                        objectives: activity.objectives.filter((_, i) => i !== idx)
                      })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Add an objective..."
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newObjective) {
                      setActivity({
                        ...activity,
                        objectives: [...activity.objectives, newObjective]
                      });
                      setNewObjective('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (newObjective) {
                      setActivity({
                        ...activity,
                        objectives: [...activity.objectives, newObjective]
                      });
                      setNewObjective('');
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Developmental Skills</label>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {commonSkills.map((skill) => (
                  <button
                    key={skill.name}
                    onClick={() => {
                      if (activity.skills.some(s => s.name === skill.name)) {
                        setActivity({
                          ...activity,
                          skills: activity.skills.filter(s => s.name !== skill.name)
                        });
                      } else {
                        setActivity({
                          ...activity,
                          skills: [...activity.skills, skill]
                        });
                      }
                    }}
                    className={`p-2 rounded-lg font-bold text-sm transition-all ${
                      activity.skills.some(s => s.name === skill.name)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {skill.icon} {skill.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'pedagogy' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Pedagogical Framework</h3>

            {/* Supplies */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Supplies & Materials</label>
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs font-bold text-green-700 mb-1">Included</p>
                  {activity.suppliesIncluded.map((supply, idx) => (
                    <div key={`inc-${idx}`} className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-700">✓ {supply}</span>
                      <button
                        onClick={() => setActivity({
                          ...activity,
                          suppliesIncluded: activity.suppliesIncluded.filter((_, i) => i !== idx)
                        })}
                        className="ml-auto text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-700 mb-1">Not Included</p>
                  {activity.suppliesNotIncluded.map((supply, idx) => (
                    <div key={`not-${idx}`} className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-700">• {supply}</span>
                      <button
                        onClick={() => setActivity({
                          ...activity,
                          suppliesNotIncluded: activity.suppliesNotIncluded.filter((_, i) => i !== idx)
                        })}
                        className="ml-auto text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSupply.text}
                  onChange={(e) => setNewSupply({ ...newSupply, text: e.target.value })}
                  placeholder="Add supply..."
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200"
                />
                <select
                  value={newSupply.isIncluded ? 'included' : 'notincluded'}
                  onChange={(e) => setNewSupply({ ...newSupply, isIncluded: e.target.value === 'included' })}
                  className="px-3 py-2 rounded-lg border border-slate-200"
                >
                  <option value="included">Included</option>
                  <option value="notincluded">Not Included</option>
                </select>
                <button
                  onClick={() => {
                    if (newSupply.text) {
                      if (newSupply.isIncluded) {
                        setActivity({
                          ...activity,
                          suppliesIncluded: [...activity.suppliesIncluded, newSupply.text]
                        });
                      } else {
                        setActivity({
                          ...activity,
                          suppliesNotIncluded: [...activity.suppliesNotIncluded, newSupply.text]
                        });
                      }
                      setNewSupply({ text: '', isIncluded: true });
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Teaching Tips */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Teaching Tips</label>
              <textarea
                value={activity.teachingTips}
                onChange={(e) => setActivity({ ...activity, teachingTips: e.target.value })}
                placeholder="How to facilitate this activity..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-20"
              />
            </div>

            {/* Assessment Tips */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Assessment Tips (what to observe)</label>
              <textarea
                value={activity.assessmentTips}
                onChange={(e) => setActivity({ ...activity, assessmentTips: e.target.value })}
                placeholder="What indicators show learning? (separate multiple observations with line breaks)"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-20"
              />
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Review Activity</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs font-bold text-slate-600 mb-1">TITLE</p>
                <p className="text-lg font-bold text-slate-900">{activity.title}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs font-bold text-slate-600 mb-1">AGE RANGE</p>
                <p className="text-lg font-bold text-slate-900">{activity.ageRange}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs font-bold text-slate-600 mb-1">DURATION</p>
                <p className="text-lg font-bold text-slate-900">{activity.duration} min</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs font-bold text-slate-600 mb-1">GROUP SIZE</p>
                <p className="text-lg font-bold text-slate-900">{activity.groupSize}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-700 mb-2">Description</p>
              <p className="text-slate-600 p-4 bg-slate-50 rounded-lg">{activity.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-xs font-bold text-green-700">OBJECTIVES</p>
                <p className="text-2xl font-black text-green-600">{activity.objectives.length}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs font-bold text-blue-700">SKILLS</p>
                <p className="text-2xl font-black text-blue-600">{activity.skills.length}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-xs font-bold text-orange-700">SUPPLIES</p>
                <p className="text-2xl font-black text-orange-600">{activity.suppliesIncluded.length + activity.suppliesNotIncluded.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-3 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
        >
          Cancel
        </button>

        <div className="flex gap-3">
          {step !== 'basic' && (
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-lg bg-slate-200 text-slate-700 font-bold hover:bg-slate-300"
            >
              ← Back
            </button>
          )}

          {step !== 'review' ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-2"
            >
              Next →
            </button>
          ) : (
            <FuturisticButton
              variant="gradient"
              size="lg"
              onClick={() => onSave(activity)}
            >
              <CheckCircle2 className="w-5 h-5" />
              Save Activity
            </FuturisticButton>
          )}
        </div>
      </div>
    </div>
  );
}
