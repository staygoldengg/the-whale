'use client';

import React, { ReactNode } from 'react';

/**
 * Luxury UI Component Library
 * Premium, refined components with elegant interactions
 */

// ============================================================================
// LUXURY CARD - Elevated depth with glass effect
// ============================================================================

interface LuxuryCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'minimal';
  hover?: boolean;
  onClick?: () => void;
}

export function LuxuryCard({
  children,
  className = '',
  variant = 'elevated',
  hover = true,
  onClick,
}: LuxuryCardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300 ease-out';
  
  const variants = {
    default: 'bg-white border border-slate-200/50',
    elevated: 'bg-white shadow-lg shadow-slate-200/40 border border-slate-200/30',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/20',
    minimal: 'bg-gradient-to-br from-slate-50 to-white border border-slate-100',
  };

  const hoverEffects = hover ? 'hover:shadow-2xl hover:shadow-slate-300/30 hover:border-slate-300/50 hover:-translate-y-1' : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverEffects} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// ============================================================================
// LUXURY BUTTON - Refined with premium interactions
// ============================================================================

interface LuxuryButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void | Promise<void>;
}

export function LuxuryButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
}: LuxuryButtonProps) {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 ease-out cursor-pointer focus-ring-primary active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-300/30 hover:shadow-xl hover:shadow-blue-400/40 hover:from-blue-700 hover:to-blue-800',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 shadow-md shadow-slate-300/20',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700',
    ghost: 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900',
    gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg shadow-pink-400/30 hover:shadow-xl',
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        {children}
      </div>
    </button>
  );
}

// ============================================================================
// LUXURY TEXT - Premium typography
// ============================================================================

interface LuxuryTextProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption';
  className?: string;
  gradient?: boolean;
}

export function LuxuryText({
  children,
  variant = 'body',
  className = '',
  gradient = false,
}: LuxuryTextProps) {
  const variants = {
    h1: 'text-5xl font-black tracking-tight',
    h2: 'text-4xl font-bold tracking-tight',
    h3: 'text-2xl font-bold tracking-tight',
    body: 'text-base font-regular leading-relaxed',
    label: 'text-sm font-semibold uppercase tracking-wider',
    caption: 'text-xs font-medium text-slate-600',
  };

  const baseClass = `text-slate-900 ${variants[variant]}`;
  const gradientClass = gradient ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' : '';

  const Element = variant === 'h1' ? 'h1' : variant === 'h2' ? 'h2' : variant === 'h3' ? 'h3' : 'p';

  return (
    <Element className={`${baseClass} ${gradientClass} ${className}`}>
      {children}
    </Element>
  );
}

// ============================================================================
// LUXURY STAT - Premium metric display
// ============================================================================

interface LuxuryStatProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  trend?: number; // positive or negative
  className?: string;
}

export function LuxuryStat({
  icon,
  label,
  value,
  unit = '',
  trend,
  className = '',
}: LuxuryStatProps) {
  return (
    <LuxuryCard variant="glass" className={`p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-slate-600 text-sm font-medium mb-2">{label}</p>
      <p className="text-3xl font-black text-slate-900">
        {value}
        {unit && <span className="text-lg text-slate-500 ml-1">{unit}</span>}
      </p>
    </LuxuryCard>
  );
}

// ============================================================================
// LUXURY LOADER - Premium loading animation
// ============================================================================

export function LuxuryLoader() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 border-r-blue-600 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-50 to-white" />
      </div>
    </div>
  );
}

// ============================================================================
// LUXURY SECTION - Premium section wrapper
// ============================================================================

interface LuxurySectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  gradient?: boolean;
}

export function LuxurySection({
  children,
  title,
  subtitle,
  action,
  className = '',
  gradient = false,
}: LuxurySectionProps) {
  return (
    <section className={className}>
      {(title || subtitle) && (
        <div className="mb-8 flex items-start justify-between">
          <div>
            {title && <LuxuryText variant="h3" gradient={gradient}>{title}</LuxuryText>}
            {subtitle && <p className="text-slate-600 mt-2">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

// ============================================================================
// LUXURY INPUT - Premium form input
// ============================================================================

interface LuxuryInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  icon?: ReactNode;
  disabled?: boolean;
  type?: string;
  className?: string;
}

export function LuxuryInput({
  placeholder = '',
  value = '',
  onChange,
  icon,
  disabled = false,
  type = 'text',
  className = '',
}: LuxuryInputProps) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-3 ${icon ? 'pl-12' : ''} bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200 text-slate-900 placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      />
    </div>
  );
}

// ============================================================================
// LUXURY BADGE - Premium status indicator
// ============================================================================

interface LuxuryBadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary';
  className?: string;
}

export function LuxuryBadge({
  children,
  variant = 'primary',
  className = '',
}: LuxuryBadgeProps) {
  const variants = {
    success: 'bg-green-100/80 text-green-700 border border-green-200/50',
    warning: 'bg-amber-100/80 text-amber-700 border border-amber-200/50',
    error: 'bg-red-100/80 text-red-700 border border-red-200/50',
    info: 'bg-blue-100/80 text-blue-700 border border-blue-200/50',
    primary: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200/50',
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ============================================================================
// LUXURY DIVIDER - Elegant separator
// ============================================================================

export function LuxuryDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent ${className}`} />
  );
}

// ============================================================================
// LUXURY GRADIENT BACKGROUND
// ============================================================================

interface LuxuryGradientBgProps {
  children: ReactNode;
  variant?: 'premium' | 'luxury' | 'elegant';
  className?: string;
}

export function LuxuryGradientBg({
  children,
  variant = 'premium',
  className = '',
}: LuxuryGradientBgProps) {
  const variants = {
    premium: 'bg-gradient-to-br from-slate-50 via-blue-50 to-white',
    luxury: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
    elegant: 'bg-gradient-to-br from-white via-slate-50 to-slate-100',
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
