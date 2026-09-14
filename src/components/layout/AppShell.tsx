import React from 'react';
import { SidebarNav } from './SidebarNav';
import { TopBar } from './TopBar';
import { DemoBanner } from '../ui/DemoBanner';
import { useInspection } from '../../context/InspectionContext';
import { ShieldCheck, Info, X } from 'lucide-react';
import { ScrollProgressBar, BackToTopButton } from '../ui/ScrollEffects';
import { OfficialEmblem } from '../ui/OfficialEmblem';

interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{ label: string; route?: string }>;
}

export const AppShell: React.FC<AppShellProps> = ({ children, breadcrumbs }) => {
  const { toast, clearToast } = useInspection();

  return (
    <div className="h-screen max-h-screen h-[100dvh] bg-slate-100 text-slate-900 flex flex-col antialiased font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative print:h-auto print:max-h-none print:overflow-visible print:bg-white">
      {/* Scroll Progress Bar at very top */}
      <div className="print:hidden">
        <ScrollProgressBar />
      </div>

      {/* Sovereign Tricolor Accent Bar */}
      <div className="gov-tricolor-bar shrink-0 z-40 print:hidden" />

      <div className="flex flex-1 min-h-0 overflow-hidden w-full relative print:h-auto print:overflow-visible">
        {/* Persistent Left Navigation Rail (Stable & Fixed Blue Rail - Never Moves on Scroll) */}
        <div className="print:hidden shrink-0 h-full">
          <SidebarNav />
        </div>

        {/* Main Column with Fixed Header and Scrollable Content */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-hidden relative">
          {/* Stable Top Navigation & Banner (Fixed, Never Moves on Scroll) */}
          <div className="shrink-0 z-30 print:hidden">
            <TopBar breadcrumbs={breadcrumbs} />
            <DemoBanner />
          </div>

          {/* Independently Scrollable White Content Area (Only This Part Scrolls) */}
          <div
            id="main-scroll-container"
            className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-y-auto overflow-x-hidden bg-slate-100 relative focus:outline-none print:h-auto print:overflow-visible print:bg-white"
          >
            {/* Toast Notification Container */}
            {toast && (
              <div
                role="alert"
                className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 print:hidden ${
                  toast.type === 'error'
                    ? 'bg-red-50 text-red-900 border-red-200'
                    : toast.type === 'warning'
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : toast.type === 'info'
                    ? 'bg-blue-50 text-blue-900 border-blue-200'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                }`}
              >
                <Info className="w-4 h-4 shrink-0" />
                <span>{toast.message}</span>
                <button
                  onClick={clearToast}
                  className="ml-2 text-slate-400 hover:text-slate-700 p-0.5"
                  aria-label="Close notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Primary View Outlet */}
            <main className="flex-1 p-2.5 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto print:p-0 print:max-w-none print:m-0">
              {children}
            </main>

            {/* Floating Back to Top Button */}
            <div className="print:hidden">
              <BackToTopButton />
            </div>

            {/* Institutional Footer with Official Emblem */}
            <footer className="mt-auto border-t border-slate-200 bg-white px-4 sm:px-6 py-4 text-xs text-slate-600 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
              <div className="flex items-center gap-3">
                <OfficialEmblem type="india" size="xs" />
                <div className="border-l border-slate-200 pl-3 leading-tight">
                  <span className="font-black text-slate-900">Label<span className="text-blue-600">Lens</span></span>
                  <span className="text-slate-500 text-[11px]">
                    {' '}— Legal Metrology Enforcement Portal
                  </span>
                  <span className="text-slate-300 mx-1.5">|</span>
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                    PCR 2011 Compliance
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[11px]">
                <span>Department of Consumer Affairs &bull; Government of India</span>
                <span>&bull;</span>
                <span>National Legal Metrology Portal</span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
