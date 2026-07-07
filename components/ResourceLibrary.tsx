'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Download, FileText, Zap } from 'lucide-react';
import {
  LESSON_PLANNING_RESOURCES,
  getCategories,
  getSubjects,
  getGradeLevels,
  searchResources,
  getResourcesByCategory,
  getResourcesBySubject,
  getResourcesByGradeLevel,
} from '@/lib/lessonPlanningResources';
import { FuturisticButton } from './FuturisticUI';

/**
 * ResourceLibrary Component
 * 
 * Provides searchable, filterable access to all lesson planning resources
 * from the indexed library.
 */
export function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Get filter options
  const categories = useMemo(() => getCategories(), []);
  const subjects = useMemo(() => getSubjects(), []);
  const grades = useMemo(() => getGradeLevels(), []);

  // Filter and search resources
  const filteredResources = useMemo(() => {
    let results = LESSON_PLANNING_RESOURCES;

    // Apply search
    if (searchQuery.trim()) {
      results = searchResources(searchQuery);
    }

    // Apply category filter
    if (selectedCategory) {
      results = results.filter(r => r.category === selectedCategory);
    }

    // Apply subject filter
    if (selectedSubject) {
      results = results.filter(r => r.subject === selectedSubject);
    }

    // Apply grade level filter
    if (selectedGrade) {
      results = results.filter(r => !r.gradeLevel || r.gradeLevel.includes(selectedGrade));
    }

    return results;
  }, [searchQuery, selectedCategory, selectedSubject, selectedGrade]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedSubject('');
    setSelectedGrade('');
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      template: '📋',
      worksheet: '📝',
      guide: '📖',
      zip: '📦',
      image: '🖼️',
      pptx: '🎬',
      xls: '📊',
    };
    return icons[type] || '📄';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-8 h-8" />
              <span className="text-sm font-bold uppercase tracking-wide opacity-90">Resource Library</span>
            </div>
            <h1 className="text-4xl font-black mb-2">Teaching Materials Library</h1>
            <p className="text-blue-100">Access {LESSON_PLANNING_RESOURCES.length}+ curated lesson plans, templates, and teaching resources</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources... (titles, keywords, subjects)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
            showFilters
              ? 'bg-blue-600 text-white ring-2 ring-blue-300'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-2xl bg-white p-6 border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Subjects</option>
                {subjects.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>

            {/* Grade Level Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Grade Level</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Grades</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>
                    {grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-red-600 font-bold hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-600">
            Showing <span className="text-blue-600 font-black">{filteredResources.length}</span> of{' '}
            <span className="text-blue-600 font-black">{LESSON_PLANNING_RESOURCES.length}</span> resources
          </p>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map(resource => (
            <div
              key={resource.id}
              className="rounded-lg bg-white p-5 border border-slate-200 hover:shadow-lg transition-all hover:border-blue-300"
            >
              {/* Header with Type Icon */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{getTypeIcon(resource.type)}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-2">{resource.title}</h3>
                    <p className="text-xs text-slate-500">{resource.filename}</p>
                  </div>
                </div>
              </div>

              {/* Category & Type */}
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="inline-flex items-center text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                  {resource.category}
                </span>
                {resource.subcategory && (
                  <span className="inline-flex items-center text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                    {resource.subcategory}
                  </span>
                )}
                <span className="inline-flex items-center text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full uppercase">
                  {resource.type}
                </span>
              </div>

              {/* Description */}
              {resource.description && (
                <p className="text-sm text-slate-600 mb-3 line-clamp-3">{resource.description}</p>
              )}

              {/* Grade Levels */}
              {resource.gradeLevel && (
                <div className="flex gap-1 mb-3 flex-wrap">
                  {resource.gradeLevel.map(grade => (
                    <span
                      key={grade}
                      className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded"
                    >
                      {grade === 'K' ? 'K' : `Gr. ${grade}`}
                    </span>
                  ))}
                </div>
              )}

              {/* Keywords */}
              {resource.keywords && resource.keywords.length > 0 && (
                <div className="mb-4 pt-3 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-600 mb-2">Keywords:</p>
                  <div className="flex gap-1 flex-wrap">
                    {resource.keywords.slice(0, 3).map(keyword => (
                      <span
                        key={keyword}
                        className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                    {resource.keywords.length > 3 && (
                      <span className="text-xs text-slate-500">
                        +{resource.keywords.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <FuturisticButton
                variant="secondary"
                size="sm"
                className="w-full"
              >
                <Download className="w-4 h-4" />
                Access Resource
              </FuturisticButton>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-50 p-12 text-center border border-slate-200">
          <Zap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No resources found</h3>
          <p className="text-slate-600 mb-6">
            Try adjusting your search or filters to find what you're looking for
          </p>
          <FuturisticButton
            variant="primary"
            onClick={clearFilters}
          >
            Clear All Filters
          </FuturisticButton>
        </div>
      )}
    </div>
  );
}
