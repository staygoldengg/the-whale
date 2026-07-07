/**
 * Dynamic UI customization system
 * Allows users to customize layout, colors, and templates
 */

export type ColorScheme = 'ocean' | 'forest' | 'sunset' | 'school-pride' | 'high-contrast' | 'calm-blue';
export type LayoutMode = 'default' | 'compact' | 'spacious' | 'tablet' | 'mobile';
export type Template = 'default' | 'corporate' | 'playful' | 'minimal' | 'vibrant' | 'professional-school';

export interface UICustomization {
  colorScheme: ColorScheme;
  layoutMode: LayoutMode;
  template: Template;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  showMusicPlayer: boolean;
  showTeacherTips: boolean;
  sidebarPosition: 'left' | 'right';
  compactMode: boolean;
  accentColor: string;
  schoolName?: string;
  schoolLogo?: string;
  showBranding: boolean;
}

export const DEFAULT_CUSTOMIZATION: UICustomization = {
  colorScheme: 'ocean',
  layoutMode: 'default',
  template: 'professional-school',
  fontSize: 'base',
  showMusicPlayer: true,
  showTeacherTips: true,
  sidebarPosition: 'right',
  compactMode: false,
  accentColor: '#1e5a96',
  schoolName: 'Westhampton Day School',
  schoolLogo: '🐋',
  showBranding: true
};

export const COLOR_SCHEMES: Record<ColorScheme, Record<string, string>> = {
  ocean: {
    primary: '#1e5a96',
    secondary: '#2d8cbe',
    accent: '#00a8e8',
    background: '#f0f4f8',
    surface: '#ffffff',
    text: '#1a1a1a',
    muted: '#64748b'
  },
  forest: {
    primary: '#2d5016',
    secondary: '#5a7c3e',
    accent: '#7ab55c',
    background: '#f0f5e8',
    surface: '#ffffff',
    text: '#1a1a1a',
    muted: '#64748b'
  },
  sunset: {
    primary: '#c84630',
    secondary: '#d97939',
    accent: '#ff9a56',
    background: '#fff5f0',
    surface: '#ffffff',
    text: '#1a1a1a',
    muted: '#64748b'
  },
  'school-pride': {
    primary: '#d4164f',
    secondary: '#ff5e78',
    accent: '#ffd700',
    background: '#fff8f0',
    surface: '#ffffff',
    text: '#1a1a1a',
    muted: '#64748b'
  },
  'high-contrast': {
    primary: '#000000',
    secondary: '#333333',
    accent: '#ffff00',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
    muted: '#666666'
  },
  'calm-blue': {
    primary: '#4a90e2',
    secondary: '#357abd',
    accent: '#7ec8e3',
    background: '#ecf0f5',
    surface: '#ffffff',
    text: '#2c3e50',
    muted: '#95a5a6'
  }
};

export const TEMPLATES: Record<Template, Partial<UICustomization>> = {
  default: {
    layoutMode: 'default',
    colorScheme: 'ocean',
    fontSize: 'base'
  },
  corporate: {
    layoutMode: 'spacious',
    colorScheme: 'calm-blue',
    fontSize: 'lg',
    compactMode: false
  },
  playful: {
    layoutMode: 'spacious',
    colorScheme: 'school-pride',
    fontSize: 'lg'
  },
  minimal: {
    layoutMode: 'compact',
    colorScheme: 'high-contrast',
    fontSize: 'base'
  },
  vibrant: {
    layoutMode: 'default',
    colorScheme: 'sunset',
    fontSize: 'lg'
  },
  'professional-school': {
    layoutMode: 'default',
    colorScheme: 'ocean',
    fontSize: 'base',
    showBranding: true
  }
};

/**
 * Get CSS variables for color scheme
 */
export function getColorSchemeCSS(colorScheme: ColorScheme): Record<string, string> {
  const colors = COLOR_SCHEMES[colorScheme];
  return {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-background': colors.background,
    '--color-surface': colors.surface,
    '--color-text': colors.text,
    '--color-muted': colors.muted
  } as Record<string, string>;
}

/**
 * Apply template preset
 */
export function applyTemplate(template: Template, current: UICustomization): UICustomization {
  return {
    ...current,
    ...TEMPLATES[template]
  };
}
