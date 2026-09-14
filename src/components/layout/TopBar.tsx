import React, { useState } from 'react';
import {
  Bell,
  Search,
  MapPin,
  User,
  LogOut,
  Sliders,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  Users,
  ArrowRightLeft,
  FileText,
  Menu,
  X,
  LayoutDashboard,
  ClipboardList,
  Scale,
  Download,
  FileCode,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { OfficialEmblem } from '../ui/OfficialEmblem';
import { MobileNavDrawer } from './MobileNavDrawer';
import { generateTechnicalDossierPDF } from '../../services/technicalDossierPdf';

interface TopBarProps {
  breadcrumbs?: Array<{ label: string; route?: string }>;
}

export const TopBar: React.FC<TopBarProps> = ({ breadcrumbs }) => {
  const {
    currentUser,
    currentAdmin,
    currentRole,
    switchRole,
    logout,
    navigateTo,
    activeRoute,
  } = useInspection();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const activeName = currentRole === 'ADMIN' ? currentAdmin.name : currentUser.name;
  const activeDesignation = currentRole === 'ADMIN' ? currentAdmin.designation : currentUser.designation;
  const activeInitials = currentRole === 'ADMIN' ? 'PG' : (currentUser.avatar || currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase());

  return (
    <header className="h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs print:hidden">
      {/* Left: Dual Emblems & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={() => setShowMobileNav(true)}
          className="md:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => navigateTo(currentRole === 'ADMIN' ? '/admin' : '/dashboard')}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0"
          title="LabelLens Legal Metrology Portal"
        >
          <OfficialEmblem type="india" size="xs" />
          <span className="font-black text-sm tracking-tight text-slate-900 hidden xs:inline sm:inline">
            Label<span className="text-blue-600">Lens</span>
          </span>
        </div>

        <div className="h-5 w-px bg-slate-200 shrink-0 hidden sm:block" />

        {/* Desktop Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center text-xs font-medium text-slate-500 truncate">
          <span
            onClick={() => navigateTo(currentRole === 'ADMIN' ? '/admin' : '/dashboard')}
            className="hover:text-blue-700 cursor-pointer text-slate-900 font-bold tracking-tight shrink-0"
          >
            Label<span className="text-blue-600">Lens</span>
          </span>
          {breadcrumbs &&
            breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 mx-1.5 shrink-0" />
                {crumb.route ? (
                  <span
                    onClick={() => navigateTo(crumb.route!)}
                    className="hover:text-blue-700 cursor-pointer text-slate-600 truncate"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <span className="text-slate-900 font-semibold truncate">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
        </nav>

        {/* Mobile Single-Title Crumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <span className="sm:hidden text-xs font-bold text-slate-800 truncate max-w-[130px] border-l border-slate-200 pl-2">
            {breadcrumbs[breadcrumbs.length - 1].label}
          </span>
        )}

        <div className="hidden lg:flex items-center gap-1.5 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
          <span className="font-semibold">
            {currentRole === 'ADMIN' ? 'Directorate Admin' : 'Field Inspection'}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">
            {currentRole === 'ADMIN' ? 'Legal Metrology' : 'Enforcement'}
          </span>
        </div>
      </div>

      {/* Right: Search, Actions, Role Indicator, Notifications & Menu */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Global search placeholder */}
        <div className="relative hidden md:block w-44 lg:w-56">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search inspection records..."
            onClick={() => {
              if (activeRoute !== '/inspections') navigateTo('/inspections');
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        {/* Technical Research & Whitepaper PDF Download CTA */}
        <button
          type="button"
          onClick={() => {
            generateTechnicalDossierPDF();
          }}
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-bold border border-slate-300 shadow-2xs transition-colors cursor-pointer"
          title="Download Comprehensive Technical Research & Architecture Specification (PDF)"
        >
          <Download className="w-3.5 h-3.5 text-blue-700" />
          <span className="hidden xl:inline">Technical Research (PDF)</span>
          <span className="xl:hidden">Whitepaper</span>
        </button>

        {/* Quick New Inspection CTA if not on new */}
        {activeRoute !== '/inspections/new' && currentRole === 'INSPECTOR' && (
          <button
            onClick={() => navigateTo('/inspections/new')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Inspection</span>
          </button>
        )}

        {/* Role Indicator Badge (read-only, no unauthorized elevation) */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border select-none ${
            currentRole === 'ADMIN'
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : 'bg-blue-50 text-blue-900 border-blue-200'
          }`}
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${currentRole === 'ADMIN' ? 'text-amber-700' : 'text-blue-700'}`} />
          <span>{currentRole === 'ADMIN' ? 'Admin: Directorate' : `Inspector: ${currentUser.name}`}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-80 bg-white border border-slate-200 rounded-lg shadow-xl p-3 text-xs z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-semibold text-slate-800">
                <span>Inspection Alerts</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                  2 Pending
                </span>
              </div>
              <div className="space-y-2 mt-2">
                <div
                  onClick={() => {
                    setShowNotifications(false);
                    navigateTo('/inspections/INS-2026-0043/evidence');
                  }}
                  className="p-2 bg-slate-50 hover:bg-blue-50 rounded cursor-pointer border border-slate-100"
                >
                  <p className="font-semibold text-slate-900">INS-2026-0043: Review required</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Price marking & net quantity evidence await inspector sign-off.
                  </p>
                </div>
                <div
                  onClick={() => {
                    setShowNotifications(false);
                    navigateTo('/inspections');
                  }}
                  className="p-2 bg-slate-50 hover:bg-blue-50 rounded cursor-pointer border border-slate-100"
                >
                  <p className="font-semibold text-slate-900">Surveillance Notice: Rice & Pulses</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Updated mandatory font height rule PCR 2011 Schedule II circular.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-slate-100 rounded-md border border-slate-200 text-xs font-medium text-slate-800 cursor-pointer min-h-[38px]"
          >
            <div
              className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold ${
                currentRole === 'ADMIN' ? 'bg-amber-800' : 'bg-blue-900'
              }`}
            >
              {activeInitials}
            </div>
            <div className="text-left hidden xl:block leading-tight">
              <p className="font-bold text-slate-900">{activeName}</p>
              <p className="text-[10px] text-slate-500">{activeDesignation}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-3 text-xs z-50">
              <div className="pb-2.5 border-b border-slate-100">
                <p className="font-bold text-slate-900">{activeName}</p>
                <p className="text-slate-500 text-[11px]">{activeDesignation}</p>
                <p className="text-slate-400 font-mono text-[10px] mt-0.5">
                  {currentRole === 'ADMIN' ? currentAdmin.email : currentUser.email}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  <span>
                    {currentRole === 'ADMIN'
                      ? 'Directorate Super-Admin'
                      : 'Authorized Field Credentials'}
                  </span>
                </div>
              </div>

              <div className="py-2 space-y-1">
                {currentRole === 'ADMIN' ? (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      switchRole('INSPECTOR');
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-slate-700 hover:bg-slate-50 rounded cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>View as Field Inspector</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigateTo('/inspections');
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-slate-700 hover:bg-slate-50 rounded cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>My Inspection Records</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigateTo(currentRole === 'ADMIN' ? '/admin/settings' : '/settings');
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-slate-700 hover:bg-slate-50 rounded cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentRole === 'ADMIN' ? 'System Settings' : 'Inspector Settings'}</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    generateTechnicalDossierPDF();
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-blue-800 hover:bg-blue-50 rounded font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-700" />
                  <span>Technical Research (PDF)</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-red-700 hover:bg-red-50 rounded font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Gateway</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={showMobileNav}
        onClose={() => setShowMobileNav(false)}
      />
    </header>
  );
};
