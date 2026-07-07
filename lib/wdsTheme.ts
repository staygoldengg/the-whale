/**
 * Westhampton Day School Brand Colors and Theme
 * Christian, nurturing, safe, and educational aesthetic
 */

export const WDS_COLORS = {
  // Primary Colors - Inspired by WDS branding
  primary: {
    navy: '#1a365d', // Deep trust/authority
    teal: '#0d9488', // Growth/learning
    gold: '#d4af37', // Excellence/achievement
    emerald: '#059669' // Nurture/nature
  },
  
  // Secondary Colors
  secondary: {
    sky: '#0ea5e9', // Hope/openness
    rose: '#f43f5e', // Warmth/care
    amber: '#f59e0b', // Energy/creativity
    purple: '#8b5cf6' // Wisdom/growth
  },
  
  // Accents for WDS
  accents: {
    lightGold: '#fcd34d', // Gentle highlight
    darkTeal: '#0f766e', // Deep emphasis
    softBlue: '#e0f2fe', // Background
    warmCream: '#fffbeb' // Inviting background
  },
  
  // Semantic
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
};

export const WDS_THEME = {
  name: 'Westhampton Day School',
  tagline: 'Lessons that Last a Lifetime',
  colors: WDS_COLORS,
  
  // Typography
  fonts: {
    heading: 'font-serif', // Traditional, established
    body: 'font-sans' // Clean, modern
  },
  
  // Gradients
  gradients: {
    primary: 'from-slate-900 via-teal-600 to-emerald-500',
    secondary: 'from-blue-50 to-teal-50',
    accent: 'from-amber-300 to-rose-200',
    hero: 'from-navy-900 via-teal-700 to-emerald-600'
  }
};

export const WESTHAMPTON_INFO = {
  name: 'Westhampton Day School',
  shortName: 'WDS',
  tagline: 'Lessons that Last a Lifetime',
  established: 1953,
  mission: 'Providing a Christian environment that is nurturing, safe, mutually respectful, and conducive to learning.',
  location: '6100 Patterson Avenue, Richmond, VA 23226',
  phone: '(804) 282-7459',
  email: 'info@westhamptondayschool.org',
  website: 'westhamptondayschool.org',
  logo: {
    emoji: '🐋',
    colors: {
      primary: '#1a365d', // Navy
      accent: '#059669'    // Emerald
    },
    description: 'Whale mascot representing strength, wisdom, and community'
  },
  values: [
    { name: 'Nurturing', emoji: '🤝' },
    { name: 'Safe', emoji: '🛡️' },
    { name: 'Respectful', emoji: '🙏' },
    { name: 'Creative', emoji: '🎨' },
    { name: 'Community', emoji: '🌍' },
    { name: 'Excellence', emoji: '⭐' }
  ],
  accreditation: 'Nationally Accredited - NACCRRA',
  socialLinks: {
    facebook: 'https://facebook.com/westhamptondayschool',
    instagram: 'https://instagram.com/westhamptondayschool'
  }
};

export type ColorPalette = typeof WDS_COLORS;
export type Theme = typeof WDS_THEME;
