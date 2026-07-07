'use client';

import React, { useState, useEffect } from 'react';

/**
 * Futuristic animated button with shifting effect
 */
export interface FuturisticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  shimmer?: boolean;
  children: React.ReactNode;
}

export function FuturisticButton({
  variant = 'primary',
  size = 'md',
  animated = true,
  shimmer = false,
  children,
  className = '',
  ...props
}: FuturisticButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = `
    relative font-semibold transition-all duration-300 overflow-hidden
    rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-500
      text-white hover:shadow-lg hover:shadow-blue-500/50
      focus:ring-blue-500
    `,
    secondary: `
      bg-gradient-to-r from-indigo-600 to-purple-600
      text-white hover:shadow-lg hover:shadow-indigo-500/50
      focus:ring-indigo-500
    `,
    outline: `
      border-2 border-blue-500 text-blue-600
      hover:bg-blue-50 focus:ring-blue-500
    `,
    gradient: `
      bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500
      text-white hover:shadow-xl hover:shadow-purple-500/50
      focus:ring-purple-500
    `
  };

  return (
    <button
      {...props}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${animated ? 'hover:translate-y-[-2px] active:translate-y-[0px]' : ''}
        ${shimmer ? 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700' : ''}
        ${className}
      `}
    >
      {children}
      
      {isHovered && animated && (
        <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
      )}
    </button>
  );
}

/**
 * Futuristic animated background with moving elements
 */
export interface FuturisticBackgroundProps {
  variant?: 'gradient' | 'mesh' | 'particles' | 'grid';
  children?: React.ReactNode;
  className?: string;
}

export function FuturisticBackground({
  variant = 'gradient',
  children,
  className = ''
}: FuturisticBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 opacity-60">
        {variant === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 animate-gradient-shift" />
        )}
        
        {variant === 'mesh' && (
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay-1" />
            <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay-2" />
          </div>
        )}

        {variant === 'particles' && (
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        )}

        {variant === 'grid' && (
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        )}
      </div>

      {/* Content overlay */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Animated text with gradient shimmer effect
 */
export interface AnimatedTextProps {
  children: string;
  className?: string;
  animated?: boolean;
}

export function AnimatedText({
  children,
  className = '',
  animated = true
}: AnimatedTextProps) {
  return (
    <span
      className={`
        ${animated ? 'animate-text-shimmer bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent' : ''}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

/**
 * Pulsing orb element for decoration
 */
export interface PulsingOrbProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function PulsingOrb({
  size = 'md',
  color = 'from-blue-500 to-purple-600',
  className = ''
}: PulsingOrbProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${color} opacity-75 animate-pulse blur-lg`}
      />
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${color} opacity-50 animate-pulse`}
      />
      <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm" />
    </div>
  );
}

/**
 * Animated card with hover effects
 */
export interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'gradient';
  hoverEffect?: 'lift' | 'scale' | 'glow';
}

export function AnimatedCard({
  children,
  className = '',
  variant = 'glass',
  hoverEffect = 'lift'
}: AnimatedCardProps) {
  const variantClasses = {
    glass: 'backdrop-blur-md bg-white/10 border border-white/20',
    solid: 'bg-white shadow-lg',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'
  };

  const hoverClasses = {
    lift: 'hover:translate-y-[-4px] hover:shadow-xl',
    scale: 'hover:scale-105',
    glow: 'hover:shadow-xl hover:shadow-blue-500/30'
  };

  return (
    <div
      className={`
        rounded-xl transition-all duration-300 cursor-pointer
        ${variantClasses[variant]}
        ${hoverClasses[hoverEffect]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
