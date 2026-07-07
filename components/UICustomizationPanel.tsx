'use client';

import { useState, useEffect } from 'react';
import {
  UICustomization,
  ColorScheme,
  Template,
  LayoutMode,
  COLOR_SCHEMES,
  TEMPLATES,
  DEFAULT_CUSTOMIZATION,
  applyTemplate,
  getColorSchemeCSS
} from '@/lib/uiCustomization';
import { Settings, X, Palette, Layout, Zap } from 'lucide-react';

export interface UICustomizationPanelProps {
  onCustomizationChange?: (customization: UICustomization) => void;
  initialCustomization?: UICustomization;
  className?: string;
}

export function UICustomizationPanel({
  onCustomizationChange,
  initialCustomization = DEFAULT_CUSTOMIZATION,
  className = ''
}: UICustomizationPanelProps) {
  const [customization, setCustomization] = useState<UICustomization>(initialCustomization);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'layout' | 'templates'>('colors');

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('whale-ui-customization', JSON.stringify(customization));
    
    // Apply color scheme CSS variables
    const cssVars = getColorSchemeCSS(customization.colorScheme);
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    onCustomizationChange?.(customization);
  }, [customization, onCustomizationChange]);

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    setCustomization({ ...customization, colorScheme: scheme });
  };

  const handleTemplateChange = (template: Template) => {
    const newCustomization = applyTemplate(template, customization);
    setCustomization(newCustomization);
  };

  const handleLayoutChange = (layout: LayoutMode) => {
    setCustomization({ ...customization, layoutMode: layout });
  };

  const handleFontSizeChange = (size: 'sm' | 'base' | 'lg' | 'xl') => {
    setCustomization({ ...customization, fontSize: size });
  };

  const handleCompactModeToggle = () => {
    setCustomization({ ...customization, compactMode: !customization.compactMode });
  };

  const handleBrandingToggle = () => {
    setCustomization({ ...customization, showBranding: !customization.showBranding });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40 ${className}`}
        title="Customize UI"
      >
        <Settings size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Palette size={20} /> Customize Your Dashboard
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          {['colors', 'layout', 'templates'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`flex-1 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Color Schemes Tab */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Palette size={18} /> Color Scheme
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(Object.keys(COLOR_SCHEMES) as ColorScheme[]).map((scheme) => {
                    const colors = COLOR_SCHEMES[scheme];
                    return (
                      <button
                        key={scheme}
                        onClick={() => handleColorSchemeChange(scheme)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          customization.colorScheme === scheme
                            ? 'border-blue-600 ring-2 ring-blue-300'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex gap-2 mb-2">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: colors.primary }}
                          />
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: colors.secondary }}
                          />
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: colors.accent }}
                          />
                        </div>
                        <p className="text-xs font-semibold text-gray-700">
                          {scheme.replace('-', ' ').toUpperCase()}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Font Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {(['sm', 'base', 'lg', 'xl'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleFontSizeChange(size)}
                      className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all border ${
                        customization.fontSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Layout Tab */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Layout size={18} /> Layout Mode
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(['default', 'compact', 'spacious', 'tablet', 'mobile'] as LayoutMode[]).map((layout) => (
                    <button
                      key={layout}
                      onClick={() => handleLayoutChange(layout)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        customization.layoutMode === layout
                          ? 'border-blue-600 ring-2 ring-blue-300'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-sm font-semibold text-gray-700">
                        {layout.charAt(0).toUpperCase() + layout.slice(1)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {layout === 'compact' && 'Dense & efficient'}
                        {layout === 'spacious' && 'Breathing room'}
                        {layout === 'default' && 'Balanced'}
                        {layout === 'tablet' && 'For tablets'}
                        {layout === 'mobile' && 'For phones'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.compactMode}
                    onChange={handleCompactModeToggle}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Compact Mode</p>
                    <p className="text-xs text-gray-500">Minimize margins and padding</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.showBranding}
                    onChange={handleBrandingToggle}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Show Branding</p>
                    <p className="text-xs text-gray-500">Display "Built by..." footer</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Quick presets combine colors, layout, and other settings.
              </p>
              {(Object.keys(TEMPLATES) as Template[]).map((template) => (
                <button
                  key={template}
                  onClick={() => handleTemplateChange(template)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    customization.template === template
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-semibold text-gray-900">
                    {template.replace('-', ' ').toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {template === 'corporate' && 'Professional and spacious for serious work'}
                    {template === 'playful' && 'Colorful and engaging for creative teams'}
                    {template === 'minimal' && 'Distraction-free minimal design'}
                    {template === 'vibrant' && 'Bold colors and modern layout'}
                    {template === 'professional-school' && 'Designed specifically for schools'}
                    {template === 'default' && 'Balanced and versatile'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t px-6 py-4 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Your customizations are saved automatically
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
