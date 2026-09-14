import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Home,
  FileText,
  PlusCircle,
  BookOpen,
  ShieldCheck,
  LogOut,
  LogIn,
  Scale,
  Users,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { OfficialEmblem } from '../ui/OfficialEmblem';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const {
    isAuthenticated,
    currentRole,
    currentUser,
    currentAdmin,
    teamInspectors,
    switchInspector,
    switchRole,
    activeRoute,
    navigateTo,
    logout,
  } = useInspection();

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleNavigate = (route: string) => {
    onClose();
    navigateTo(route);
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  const activeName = currentRole === 'ADMIN' ? currentAdmin.name : currentUser.name;
  const activeDesignation = currentRole === 'ADMIN' ? currentAdmin.designation : currentUser.designation;

  const drawerContent = (
    <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true" aria-label="Navigation Menu">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div
        className="relative w-72 sm:w-80 max-w-[85vw] h-full max-h-[100dvh] bg-slate-900 text-slate-100 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 overflow-hidden"
      >
        {/* Drawer Header with Dual Official Emblems */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 shrink-0 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center p-1 bg-white/10 rounded-lg border border-white/10">
              <OfficialEmblem type="india" size="xs" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-white">Label<span className="text-blue-400">Lens</span></span>
                <span className="text-[9px] font-mono font-bold bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded">
                  PCR 2011
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Digital Legal Metrology</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Pill */}
        {isAuthenticated && (
          <div className="px-4 py-3 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-full text-white flex items-center justify-center text-xs font-black shrink-0 ${
                  currentRole === 'ADMIN' ? 'bg-amber-600' : 'bg-blue-600'
                }`}
              >
                {currentRole === 'ADMIN' ? 'PG' : currentUser.avatar || 'IN'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{activeName}</p>
                <p className="text-[10px] text-slate-400 truncate">{activeDesignation}</p>
              </div>
            </div>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                currentRole === 'ADMIN'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}
            >
              {currentRole}
            </span>
          </div>
        )}

        {/* Navigation Links - comfortable touch targets */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 overscroll-contain">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Navigation Menu
          </p>

          {/* 1. Dashboard */}
          <button
            type="button"
            onClick={() => handleNavigate(currentRole === 'ADMIN' ? '/admin' : '/dashboard')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeRoute === '/dashboard' || activeRoute === '/admin'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">{currentRole === 'ADMIN' ? 'Admin Dashboard' : 'Inspector Dashboard'}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>

          {/* 2. New Inspection CTA */}
          <button
            type="button"
            onClick={() => handleNavigate(isAuthenticated ? '/inspections/new' : '/login')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
              activeRoute === '/inspections/new'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1 text-left">New Store Inspection</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>

          {/* 3. Inspections Registry */}
          <button
            type="button"
            onClick={() => handleNavigate('/inspections')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeRoute === '/inspections'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">Inspection Records</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>

          {/* 4. Legal Metrology Rules */}
          <button
            type="button"
            onClick={() => handleNavigate('/legal-metrology')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeRoute === '/legal-metrology'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">PCR 2011 Rule Book</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>

          {/* 5. Role Switcher in Drawer */}
          {isAuthenticated && (
            <div className="pt-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Role &amp; View Mode
              </p>
              <button
                type="button"
                onClick={() => {
                  if (currentRole === 'ADMIN') {
                    switchRole('INSPECTOR');
                    handleNavigate('/dashboard');
                  } else {
                    switchRole('ADMIN');
                    handleNavigate('/admin');
                  }
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="flex-1 text-left">
                  Switch to {currentRole === 'ADMIN' ? 'Inspector View' : 'Directorate Admin'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            </div>
          )}

          {/* 6. Switch Inspector (for field demo) */}
          {isAuthenticated && currentRole === 'INSPECTOR' && (
            <div className="pt-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Active Inspector Account
              </p>
              <div className="grid grid-cols-2 gap-1.5 px-1">
                {teamInspectors.map((insp) => (
                  <button
                    key={insp.id}
                    type="button"
                    onClick={() => {
                      switchInspector(insp.id);
                      onClose();
                    }}
                    className={`px-2.5 py-2 rounded-md text-[11px] font-semibold text-center truncate cursor-pointer transition-colors ${
                      insp.id === currentUser.id
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {insp.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 7. Settings */}
          <div className="pt-2 border-t border-slate-800/80 my-2">
            <button
              type="button"
              onClick={() => handleNavigate('/settings')}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                activeRoute === '/settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Settings &amp; Configuration</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          </div>

          {/* 8. Sign Out */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-3 text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-400 shrink-0" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleNavigate('/login')}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-white shrink-0" />
              <span>Login (Inspector / Admin)</span>
            </button>
          )}
        </div>

        {/* Drawer Footer with Safe Area */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[10px] text-slate-400 text-center shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <p className="font-semibold text-slate-300">LabelLens Legal Metrology</p>
          <p className="text-slate-500 mt-0.5">Legal Metrology Act 2009 &bull; PCR 2011</p>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};
