'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * ChartBar: Simple horizontal bar chart
 */
export function ChartBar({
  data,
  label,
  max
}: {
  data: Array<{ label: string; value: number; color?: string }>;
  label?: string;
  max?: number;
}) {
  const maxValue = max || Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-4">
      {label && <h3 className="font-bold text-slate-900">{label}</h3>}
      {data.map((item, idx) => (
        <div key={idx}>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-sm font-bold text-slate-700">{item.label}</p>
            <p className="text-sm font-bold text-slate-900">{item.value}</p>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                item.color || 'bg-blue-500'
              }`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Metric: Display a single metric with trend
 */
export function Metric({
  label,
  value,
  unit,
  trend,
  trendLabel,
  comparison,
  icon: Icon,
  color = 'blue'
}: {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  comparison?: string;
  icon?: React.ElementType;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}) {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50',
    purple: 'text-purple-600 bg-purple-50'
  };

  const [colorClass, bgClass] = colorMap[color].split(' ');

  return (
    <div className={`rounded-lg ${bgClass} p-4`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">{label}</p>
        {Icon && <Icon className={`w-5 h-5 ${colorClass}`} />}
      </div>
      
      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-2xl font-black text-slate-900">{value}</p>
        {unit && <p className="text-sm font-bold text-slate-600">{unit}</p>}
      </div>

      {(trend !== undefined || comparison) && (
        <div className="flex items-center gap-2">
          {trend !== undefined && (
            <div className={`flex items-center gap-0.5 text-xs font-bold ${
              trend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend)}%
            </div>
          )}
          {trendLabel && <p className="text-xs text-slate-600">{trendLabel}</p>}
          {comparison && <p className="text-xs text-slate-500">{comparison}</p>}
        </div>
      )}
    </div>
  );
}

/**
 * Timeline: Show chronological events
 */
export function Timeline({
  events
}: {
  events: Array<{
    id: string;
    title: string;
    description?: string;
    date: string;
    type?: 'completed' | 'pending' | 'scheduled';
    icon?: React.ElementType;
  }>;
}) {
  const typeColors = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    scheduled: 'bg-blue-100 text-blue-700'
  };

  return (
    <div className="space-y-4">
      {events.map((event, idx) => {
        const isLast = idx === events.length - 1;
        const type = event.type || 'scheduled';
        const Icon = event.icon;

        return (
          <div key={event.id} className="relative pl-6">
            {/* Timeline dot */}
            <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full ${typeColors[type]}`} />
            
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-1.5 top-4 w-0.5 h-12 bg-slate-200" />
            )}

            {/* Content */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-slate-900">{event.title}</h4>
                {Icon && <Icon className="w-5 h-5 text-slate-400" />}
              </div>
              {event.description && (
                <p className="text-sm text-slate-600 mb-2">{event.description}</p>
              )}
              <p className="text-xs font-bold text-slate-600">{event.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * PieChart: Simplified pie chart using CSS
 */
export function PieChart({
  data,
  label
}: {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  label?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const conic = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const conic = `${item.color} ${currentAngle}deg ${currentAngle + angle}deg`;
    currentAngle += angle;
    return conic;
  }).join(', ');

  return (
    <div className="flex flex-col items-center gap-6">
      {label && <h3 className="font-bold text-slate-900 text-lg">{label}</h3>}
      
      <div
        className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
        style={{
          background: `conic-gradient(${conic})`
        }}
      />

      <div className="space-y-2 w-full">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-slate-700">
              {item.label}: <span className="font-bold">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * SparklineChart: Tiny inline sparkline
 */
export function SparklineChart({
  data,
  label,
  color = 'blue'
}: {
  data: number[];
  label?: string;
  color?: 'blue' | 'green' | 'orange' | 'red';
}) {
  const colorMap = {
    blue: 'text-blue-500 fill-blue-200',
    green: 'text-green-500 fill-green-200',
    orange: 'text-orange-500 fill-orange-200',
    red: 'text-red-500 fill-red-200'
  };

  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const width = 200;
  const height = 40;
  const points = data.map((value, idx) => ({
    x: (idx / (data.length - 1)) * width,
    y: height - ((value - min) / range) * (height - 4)
  }));

  const pathData = points.map((p, idx) =>
    `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ` L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-bold text-slate-600">{label}</p>}
      <svg viewBox={`0 0 ${width} ${height}`} className={`w-full h-8 ${colorMap[color]}`}>
        <path d={pathData} />
      </svg>
    </div>
  );
}

/**
 * ComparisonCard: Compare two values
 */
export function ComparisonCard({
  title,
  primary,
  secondary,
  primaryLabel = 'This Month',
  secondaryLabel = 'Last Month',
  unit
}: {
  title: string;
  primary: number;
  secondary: number;
  primaryLabel?: string;
  secondaryLabel?: string;
  unit?: string;
}) {
  const difference = primary - secondary;
  const percentChange = secondary !== 0 ? ((difference / secondary) * 100) : 0;
  const isPositive = difference >= 0;

  return (
    <div className="rounded-lg bg-white p-6 border border-slate-200">
      <h3 className="font-bold text-slate-900 mb-4">{title}</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold text-slate-600 mb-1">{primaryLabel}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900">{primary}</p>
            {unit && <p className="text-sm text-slate-600">{unit}</p>}
          </div>
        </div>

        <div className="h-0.5 bg-slate-200" />

        <div>
          <p className="text-xs font-bold text-slate-600 mb-1">{secondaryLabel}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-600">{secondary}</p>
            {unit && <p className="text-sm text-slate-500">{unit}</p>}
          </div>
        </div>

        {difference !== 0 && (
          <div className={`mt-4 p-2 rounded-lg flex items-center gap-2 font-bold text-sm ${
            isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isPositive ? '+' : ''}{percentChange.toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}
