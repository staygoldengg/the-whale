'use client';

import { useState } from 'react';
import { BookOpen, Calendar, Users, Target, Zap, AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { FuturisticButton } from './FuturisticUI';

interface LessonResult {
  qualityScore: number;
  qualityLabel: string;
  lessonPlan: {
    plan: {
      content: string;
    };
  };
}

export function EnhancedLessonPlanner() {
  const [step, setStep] = useState<'form' | 'preview' | 'result'>('form');
  const [result, setResult] = useState<LessonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    classroom: '',
    ageGroup: '',
    theme: '',
    weekOf: '',
    goals: '',
    materials: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const payload = {
      classroom: formData.classroom,
      ageGroup: formData.ageGroup,
      theme: formData.theme,
      weekOf: formData.weekOf,
      developmentalGoals: formData.goals.split(',').map((x) => x.trim()).filter(Boolean),
      materials: formData.materials.split(',').map((x) => x.trim()).filter(Boolean),
      notes: formData.notes
    };

    try {
      const res = await fetch('/api/schoolos/lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Lesson plan generation failed');
      setResult(json);
      setStep('result');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-8 h-8" />
              <span className="text-sm font-bold uppercase tracking-wide opacity-90">Lesson Planning</span>
            </div>
            <h1 className="text-4xl font-black mb-2">AI-Powered Lesson Planner</h1>
            <p className="text-blue-100">Create engaging lesson plans with School Brain insights and automatic quality checks</p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between gap-4 px-2">
        {[
          { label: 'Details', icon: BookOpen, step: 'form' as const },
          { label: 'Generate', icon: Zap, step: 'preview' as const },
          { label: 'Review', icon: CheckCircle2, step: 'result' as const }
        ].map((item, idx) => (
          <div key={idx} className="flex-1">
            <button
              onClick={() => step === item.step && setStep(item.step)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                step === item.step
                  ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Form View */}
      {step === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Section 1: Classroom Info */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Classroom Information
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Classroom Name"
                name="classroom"
                placeholder="Pre-K, Kindergarten, Grade 1"
                value={formData.classroom}
                onChange={handleChange}
                icon={Users}
              />
              <FormField
                label="Age Group"
                name="ageGroup"
                placeholder="4-5 years, 5-6 years"
                value={formData.ageGroup}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Grid Section 2: Weekly Theme */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              Weekly Theme
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Weekly Theme"
                name="theme"
                placeholder="e.g., Ocean Helpers, Seasons, Community Workers"
                value={formData.theme}
                onChange={handleChange}
              />
              <FormField
                label="Week Starting"
                name="weekOf"
                type="date"
                placeholder="2026-07-06"
                value={formData.weekOf}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Grid Section 3: Learning & Materials */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-green-600" />
              Learning Objectives & Materials
            </h2>
            <div className="space-y-4">
              <FormField
                label="Developmental Goals"
                name="goals"
                placeholder="fine motor skills, social-emotional learning, letter recognition"
                value={formData.goals}
                onChange={handleChange}
                help="Comma-separated list of learning objectives"
              />
              <FormField
                label="Materials & Resources"
                name="materials"
                placeholder="crayons, paper plates, building blocks, books"
                value={formData.materials}
                onChange={handleChange}
                help="Available classroom materials (comma-separated)"
              />
            </div>
          </div>

          {/* Grid Section 4: Notes */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Additional Notes</h2>
            <div>
              <label className="block">
                <span className="text-sm font-bold text-slate-700">Special Instructions</span>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any school-specific constraints, student needs, or special requests..."
                  className="mt-2 w-full rounded-xl border border-slate-200 p-4 font-normal placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all min-h-24"
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">Error generating lesson plan</p>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <FuturisticButton
              variant="gradient"
              size="lg"
              disabled={loading}
              className="flex-1"
              onClick={handleSubmit}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Generate Lesson Plan
                </div>
              )}
            </FuturisticButton>
          </div>
        </form>
      )}

      {/* Result View */}
      {step === 'result' && result && (
        <div className="space-y-6">
          {/* Quality Score Card */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 border border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-green-700 mb-1">Quality Assessment</p>
                <h2 className="text-3xl font-black text-slate-900">
                  {result.qualityScore}<span className="text-xl text-green-600">/100</span>
                </h2>
                <p className="text-green-700 font-bold mt-2">{result.qualityLabel}</p>
              </div>
              <div className={`flex items-center justify-center w-20 h-20 rounded-full font-black text-2xl ${
                result.qualityScore >= 80 ? 'bg-green-500 text-white' :
                result.qualityScore >= 60 ? 'bg-yellow-500 text-white' :
                'bg-orange-500 text-white'
              }`}>
                {result.qualityScore}
              </div>
            </div>
          </div>

          {/* Lesson Plan Content */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-600" />
              Your Lesson Plan
            </h3>
            <div className="space-y-4">
              <pre className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-200 text-sm overflow-auto max-h-96">
                {result.lessonPlan.plan.content}
              </pre>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <FuturisticButton
              variant="secondary"
              size="lg"
              onClick={() => setStep('form')}
            >
              Create Another
            </FuturisticButton>
            <FuturisticButton
              variant="primary"
              size="lg"
              onClick={() => {
                const element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result.lessonPlan.plan.content));
                element.setAttribute('download', `lesson-plan-${new Date().toISOString().split('T')[0]}.txt`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
            >
              Download Plan
            </FuturisticButton>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  name,
  placeholder,
  value,
  onChange,
  help,
  type = 'text',
  icon: Icon
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  help?: string;
  type?: string;
  icon?: any;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </span>
      <input
        type={type}
        name={name}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 font-normal placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      />
      {help && <p className="text-xs text-slate-500 mt-1.5">{help}</p>}
    </label>
  );
}
