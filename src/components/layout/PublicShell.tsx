import React, { useState } from 'react';
import { Scale, ShieldCheck, ArrowRight, LogIn, Users, Menu } from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { OfficialEmblem } from '../ui/OfficialEmblem';
import { ScrollProgressBar, BackToTopButton } from '../ui/ScrollEffects';
import { MobileNavDrawer } from './MobileNavDrawer';

interface PublicShellProps {
  children: React.ReactNode;
}

export const PublicShell: React.FC<PublicShellProps> = ({ children }) => {
  const { navigateTo } = useInspection();
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      {/* Top Scroll Indicator */}
      <ScrollProgressBar />

      {/* Sovereign Tricolor Accent Bar */}
      <div className="gov-tricolor-bar shrink-0 z-50 sticky top-0" />

      {/* Dark Institutional Header with Official Emblem */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0.5 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile hamburger menu toggle */}
            <button
              type="button"
              onClick={() => setShowMobileNav(true)}
              className="md:hidden p-1.5 -ml-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              onClick={() => navigateTo('/')}
              className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group min-w-0"
            >
              {/* Official Emblem Container - Crisp white badge for proper visibility */}
              <div className="flex items-center justify-center bg-white p-1 rounded-md shadow-xs shrink-0 w-7 h-7 sm:w-8 sm:h-8">
                <OfficialEmblem type="india" size="xs" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-white shrink-0">
                    Label<span className="text-blue-400">Lens</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-blue-900/90 text-blue-300 border border-blue-700/80 px-1.5 py-0.2 rounded shrink-0">
                    PCR 2011
                  </span>
                  <span className="hidden md:inline-block text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded shrink-0">
                    GOV PORTAL
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-tight truncate max-w-[200px] sm:max-w-none">
                  AI-Powered Digital Legal Metrology Inspector
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="hidden lg:inline-flex text-xs text-slate-400 font-mono bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
              LEGAL METROLOGY
            </span>
            <button
              type="button"
              onClick={() => navigateTo('/login')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span className="xs:hidden">Login</span>
              <span className="hidden xs:inline sm:hidden">Inspector Login</span>
              <span className="hidden sm:inline">Inspector / Admin Login</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <MobileNavDrawer
          isOpen={showMobileNav}
          onClose={() => setShowMobileNav(false)}
        />
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Back to Top */}
      <BackToTopButton />

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <OfficialEmblem type="india" size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <span>Label<span className="text-blue-600">Lens</span></span>
                <span className="text-slate-400 font-normal">|</span>
                <span className="font-semibold text-slate-700">
                  National Legal Metrology Surveillance
                </span>
              </div>
              <p className="mt-1 text-slate-500 text-[11px] max-w-xl">
                Statutory regulatory assistive platform designed to assist authorized Legal Metrology inspectors in verifying pre-packaged commodities under the Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-slate-500 text-[11px]">
            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono border border-slate-200">
              Version v2.4.0-PCR2011
            </span>
            <span>Non-Autonomous Assistive System</span>
            <span>All Determinations Require Human Inspector Verification</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
