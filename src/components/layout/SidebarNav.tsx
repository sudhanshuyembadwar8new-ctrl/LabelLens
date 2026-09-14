import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Settings,
  Scale,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  Users,
  ShieldCheck,
  ArrowRightLeft,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { OfficialEmblem } from '../ui/OfficialEmblem';

export const SidebarNav: React.FC = () => {
  const {
    activeRoute,
    navigateTo,
    currentUser,
    currentAdmin,
    currentRole,
    switchRole,
  } = useInspection();

  const isNavActive = (route: string) => {
    if (route === '/dashboard') return activeRoute === '/dashboard';
    if (route === '/admin') return activeRoute === '/admin';
    if (route === '/inspections/new') {
      return (
        activeRoute === '/inspections/new' ||
        activeRoute.includes('/upload') ||
        activeRoute.includes('/analyzing') ||
        activeRoute.includes('/result') ||
        activeRoute.includes('/evidence') ||
        activeRoute.includes('/report')
      );
    }
    if (route === '/inspections') return activeRoute === '/inspections';
    if (route === '/settings') return activeRoute === '/settings';
    return false;
  };

  return (
    <aside
      className="hidden md:flex md:w-64 bg-slate-900 text-slate-300 flex-col shrink-0 select-none border-r border-slate-800 h-full overflow-hidden z-20"
      aria-label="Inspector Navigation Rail"
    >
      {/* Top Header / Branding with Official Seal */}
      <div className="shrink-0">
        <div
          onClick={() => navigateTo(currentRole === 'ADMIN' ? '/admin' : '/dashboard')}
          className="p-4 border-b border-slate-800/80 cursor-pointer group bg-slate-950/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-1.5 bg-white/10 rounded-lg border border-white/10 backdrop-blur-xs">
              <OfficialEmblem type="india" size="xs" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-white">Label<span className="text-blue-400">Lens</span></span>
                <span className="text-[9px] font-mono font-bold bg-blue-900/80 text-blue-300 border border-blue-700/60 px-1 py-0.2 rounded">
                  PCR 2011
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                Digital Legal Metrology Inspector
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="p-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-3 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {currentRole === 'ADMIN' ? 'Directorate Controls' : 'Inspector Workspace'}
            </p>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                currentRole === 'ADMIN'
                  ? 'bg-amber-900/80 text-amber-300 border border-amber-500/40'
                  : 'bg-blue-900/80 text-blue-300 border border-blue-500/40'
              }`}
            >
              {currentRole}
            </span>
          </div>

          <nav className="space-y-1">
            {currentRole === 'ADMIN' ? (
              <>
                {/* Admin Overview */}
                <button
                  onClick={() => navigateTo('/admin/dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-all text-left ${
                    activeRoute.startsWith('/admin') && !activeRoute.includes('/settings') && !activeRoute.includes('/inspectors/')
                      ? 'bg-amber-900/60 text-white border-l-4 border-amber-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>Supervisory Dashboard</span>
                </button>

                {/* Team Inspectors */}
                <button
                  onClick={() => navigateTo('/admin/inspectors')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-all text-left ${
                    activeRoute.includes('/inspectors')
                      ? 'bg-amber-900/60 text-white border-l-4 border-amber-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Field Inspectors</span>
                </button>

                {/* State Inspection Registry */}
                <button
                  onClick={() => navigateTo('/admin/inspections')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-all text-left ${
                    activeRoute === '/admin/inspections'
                      ? 'bg-amber-900/60 text-white border-l-4 border-amber-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <ClipboardList className="w-4 h-4 text-amber-400" />
                  <span>State Registry</span>
                </button>
              </>
            ) : (
              <>
                {/* Inspector Dashboard */}
                <button
                  onClick={() => navigateTo('/dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-all text-left ${
                    activeRoute === '/dashboard'
                      ? 'bg-blue-800/70 text-white border-l-4 border-blue-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard
                    className={`w-4 h-4 ${
                      activeRoute === '/dashboard' ? 'text-blue-300' : 'text-slate-400'
                    }`}
                  />
                  <span>Field Dashboard</span>
                </button>

                {/* New Inspection Form 1 */}
                <button
                  onClick={() => navigateTo('/inspections/new')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-all text-left ${
                    activeRoute.includes('/new') ||
                    activeRoute.includes('/upload') ||
                    activeRoute.includes('/analyzing') ||
                    activeRoute.includes('/result') ||
                    activeRoute.includes('/evidence') ||
                    activeRoute.includes('/report')
                      ? 'bg-blue-800/70 text-white border-l-4 border-blue-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <div className="flex items-center justify-between flex-1">
                    <span>New Inspection</span>
                    <span className="text-[9px] font-bold bg-emerald-900/60 text-emerald-300 px-1 py-0.2 rounded">
                      Form 1
                    </span>
                  </div>
                </button>

                {/* Inspections History */}
                <button
                  onClick={() => navigateTo('/inspections')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-all text-left ${
                    activeRoute === '/inspections'
                      ? 'bg-blue-800/70 text-white border-l-4 border-blue-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <ClipboardList
                    className={`w-4 h-4 ${
                      activeRoute === '/inspections' ? 'text-blue-300' : 'text-slate-400'
                    }`}
                  />
                  <span>My Inspections</span>
                </button>
              </>
            )}

            {/* Legal Metrology Knowledge Base */}
            <button
              onClick={() => navigateTo('/legal-metrology')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-all text-left ${
                activeRoute === '/legal-metrology'
                  ? 'bg-blue-800/70 text-white border-l-4 border-blue-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Scale
                className={`w-4 h-4 ${
                  activeRoute === '/legal-metrology' ? 'text-blue-300' : 'text-slate-400'
                }`}
              />
              <div className="flex items-center justify-between flex-1">
                <span>PCR 2011 Rules</span>
                <span className="text-[9px] font-bold bg-slate-800 text-slate-400 px-1 py-0.2 rounded">
                  Guide
                </span>
              </div>
            </button>

            {/* Settings */}
            <button
              onClick={() => navigateTo(currentRole === 'ADMIN' ? '/admin/settings' : '/settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-all text-left ${
                activeRoute.includes('/settings')
                  ? 'bg-blue-800/70 text-white border-l-4 border-blue-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Settings
                className={`w-4 h-4 ${
                  activeRoute.includes('/settings') ? 'text-blue-300' : 'text-slate-400'
                }`}
              />
              <span>{currentRole === 'ADMIN' ? 'System Settings' : 'Settings'}</span>
            </button>
          </nav>
        </div>

      {/* Footer: Clean Active Identity Card */}
      <div className="p-3 border-t border-slate-800/80 shrink-0 mt-auto bg-slate-950/40">
        <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-bold text-white truncate">
              {currentRole === 'ADMIN' ? currentAdmin.name : currentUser.name}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentRole === 'ADMIN' ? currentAdmin.designation : currentUser.designation}
            </p>
          </div>
          <span
            className={`w-2 h-2 rounded-full shrink-0 ring-2 ring-slate-900 ${
              currentRole === 'ADMIN' ? 'bg-amber-400' : 'bg-emerald-500'
            }`}
            title="Active Session"
          />
        </div>
      </div>
    </aside>
  );
};
