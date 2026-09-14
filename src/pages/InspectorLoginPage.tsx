import React from 'react';
import { LabelLensAuthBackground } from '../components/auth/LabelLensAuthBackground';
import { UnifiedLoginCard } from '../components/auth/UnifiedLoginCard';
import { OfficialEmblem } from '../components/ui/OfficialEmblem';
import { useInspection } from '../context/InspectionContext';
import { ArrowLeft } from 'lucide-react';

export const InspectorLoginPage: React.FC = () => {
  const { navigateTo } = useInspection();

  return (
    <LabelLensAuthBackground>
      {/* Sovereign Tricolor Bar */}
      <div className="gov-tricolor-bar shrink-0" />

      {/* Top Bar Header */}
      <header className="px-4 sm:px-8 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div
          onClick={() => navigateTo('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex items-center justify-center p-1.5 bg-white/10 rounded-lg border border-white/15">
            <OfficialEmblem type="india" size="xs" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-white">Label<span className="text-blue-400">Lens</span></span>
              <span className="text-[9px] font-mono font-bold bg-blue-900/80 text-blue-300 border border-blue-700/60 px-1.5 py-0.2 rounded">
                FIELD
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Legal Metrology Field Inspector Portal
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('/login')}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-slate-800/80 border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Role Selection</span>
        </button>
      </header>

      {/* Centered Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <UnifiedLoginCard role="INSPECTOR" />
      </main>

      {/* Institutional Dark Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-3 px-4 text-center text-xs text-slate-500">
        <p>Government of India &bull; Directorate of Legal Metrology &bull; Field Enforcement Operations</p>
      </footer>
    </LabelLensAuthBackground>
  );
};
