'use client';

export interface BrandingFooterProps {
  showBuiltBy?: boolean;
  showPoweredBy?: boolean;
  className?: string;
}

export function BrandingFooter({
  showBuiltBy = true,
  showPoweredBy = true,
  className = ''
}: BrandingFooterProps) {
  return (
    <footer className={`bg-gradient-to-r from-slate-900 to-slate-800 text-white py-6 border-t border-slate-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Built By */}
          {showBuiltBy && (
            <div className="text-center md:text-left text-sm opacity-90 hover:opacity-100 transition-opacity">
              <p>
                Built by{' '}
                <span className="font-semibold text-blue-300">Dejan Carlisle-Miller</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Designed for educators, powered by innovation
              </p>
            </div>
          )}

          {/* Divider */}
          {showBuiltBy && showPoweredBy && (
            <div className="hidden md:block w-px h-8 bg-slate-600" />
          )}

          {/* Powered By */}
          {showPoweredBy && (
            <div className="text-center md:text-right text-sm opacity-90 hover:opacity-100 transition-opacity">
              <p>
                Systems powered by{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  COS:CORE
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Advanced AI for educational excellence
              </p>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-4 border-t border-slate-700 text-center text-xs text-gray-400">
          <p>© 2026 Westhampton Day School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
