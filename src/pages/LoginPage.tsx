import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  KeyRound,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  User,
  Lock,
  Building,
  Users,
  Eye,
  EyeOff,
  RefreshCw,
  Scale,
  CheckCircle2,
  FileCheck,
  HelpCircle,
  PhoneCall,
  ExternalLink,
  Cpu,
  BadgeCheck,
  Store,
  Sparkles,
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';
import { UserRole } from '../types';
import { OfficialEmblem } from '../components/ui/OfficialEmblem';
import { ScrollProgressBar } from '../components/ui/ScrollEffects';
import { TEAM_INSPECTORS, DEFAULT_ADMIN } from '../data/seedData';

export const LoginPage: React.FC = () => {
  const { login, navigateTo } = useInspection();

  const [activeTab, setActiveTab] = useState<UserRole>('ADMIN');
  const [selectedInspectorId, setSelectedInspectorId] = useState<string>(TEAM_INSPECTORS[0].id); // NAVINYA_INS_01
  const [userIdOrEmail, setUserIdOrEmail] = useState<string>(DEFAULT_ADMIN.id); // PRASAD_ADMIN_01
  const [password, setPassword] = useState<string>('LabelLens@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('7M9X2');
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    if (role === 'ADMIN') {
      setUserIdOrEmail(DEFAULT_ADMIN.id); // PRASAD_ADMIN_01
      setPassword('LabelLens@2026');
    } else {
      const selected = TEAM_INSPECTORS.find((t) => t.id === selectedInspectorId) || TEAM_INSPECTORS[0];
      setUserIdOrEmail(selected.id);
      setPassword('LabelLens@2026');
    }
    setError(null);
  };

  const handleSelectInspector = (inspId: string) => {
    setSelectedInspectorId(inspId);
    setUserIdOrEmail(inspId);
    setError(null);
  };

  const regenerateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdOrEmail.trim()) {
      setError('Please provide your official Inspector / Admin ID or Email.');
      return;
    }
    setError(null);
    const success = login({
      userId: userIdOrEmail.trim(),
      email: userIdOrEmail.trim(),
      password: password.trim(),
      role: activeTab,
    });
    if (!success) {
      setError('Authentication failed. Please verify credentials.');
    }
  };

  const handleDirectTeamLogin = (inspId: string) => {
    login({
      userId: inspId,
      password: password || 'LabelLens@2026',
      role: 'INSPECTOR',
    });
  };

  const handleDirectAdminLogin = () => {
    login({
      userId: DEFAULT_ADMIN.id,
      password: password || 'LabelLens@2026',
      role: 'ADMIN',
    });
  };

  const currentInspectorObj =
    TEAM_INSPECTORS.find((t) => t.id === selectedInspectorId) || TEAM_INSPECTORS[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between antialiased selection:bg-blue-100 selection:text-blue-900 bg-gov-pattern">
      <ScrollProgressBar />

      {/* Sovereign Tricolor Header Bar */}
      <div className="gov-tricolor-bar shrink-0" />

      {/* Institutional Apex Top Banner */}
      <header className="bg-white border-b border-slate-200 py-3 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Official Emblem & Title */}
          <div className="flex items-center gap-3.5">
            <OfficialEmblem type="india" size="md" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                  DIRECTORATE OF LEGAL METROLOGY
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-200">
                  PCR 2011
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Consumer Protection &amp; Packaged Commodities Automated Enforcement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-700" />
              <span>Official Regulatory Enforcement Portal</span>
            </span>
          </div>
        </div>
      </header>

      {/* Central Login Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Prototype Information & Team Credentials Guide */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Testing Readiness
                </span>
              </div>

              <h2 className="font-display text-xl font-black text-white tracking-tight">
                LabelLens Real-World Store Prototype Testing
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                This testing environment is configured for the prototype evaluation team to visit nearby grocery and retail stores, photograph real packaged commodities, and test optical compliance under the Legal Metrology (Packaged Commodities) Rules 2011.
              </p>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs space-y-2">
                <p className="font-bold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Workspace Isolation Policy</span>
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Every team inspector has an isolated workspace. Store visits conducted under your ID remain exclusively in your ledger and will not bleed into your teammates' accounts.
                </p>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <p className="text-[11px] text-slate-400 font-semibold mb-2">
                  Authorized Field Prototype Accounts:
                </p>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                  {TEAM_INSPECTORS.map((insp) => (
                    <div
                      key={insp.id}
                      className="p-1.5 rounded bg-slate-800 text-slate-200 border border-slate-700/60 flex items-center justify-between"
                    >
                      <span className="font-bold">{insp.id}</span>
                      <span className="text-[9px] text-slate-400">{insp.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-1.5 rounded bg-amber-950/60 border border-amber-500/40 text-[10px] font-mono text-amber-200 flex items-center justify-between">
                  <span className="font-bold">LABELLENS_ADMIN_01</span>
                  <span className="text-amber-300 text-[9px]">Directorate HQ</span>
                </div>
              </div>
            </div>

            {/* Field Safety Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-1">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-amber-700" />
                <span>Field Testing Guideline</span>
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Only record package packaging labels and publicly displayed prices. Do not collect sensitive store employee identification or confidential supplier invoices.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Interactive Login Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8"
          >
            {/* Header Tabs: Inspector vs Admin */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => handleTabChange('INSPECTOR')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'INSPECTOR'
                    ? 'bg-blue-700 text-white shadow-sm ring-1 ring-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <User className="w-4 h-4" />
                <div className="text-left">
                  <span className="block leading-none">Field Inspector</span>
                  <span
                    className={`text-[9px] block leading-tight font-medium ${
                      activeTab === 'INSPECTOR' ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    6 Team Accounts
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('ADMIN')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'ADMIN'
                    ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <div className="text-left">
                  <span className="block leading-none">Directorate Admin</span>
                  <span
                    className={`text-[9px] block leading-tight font-medium ${
                      activeTab === 'ADMIN' ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    PRASAD_ADMIN_01
                  </span>
                </div>
              </button>
            </div>

            {/* Dynamic Content based on Active Tab */}
            {activeTab === 'INSPECTOR' ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Field Inspector Authentication
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select your assigned team account to enter your isolated inspection workspace.
                  </p>
                </div>

                {/* Quick-Select Team Members Grid */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Your Team Member Account:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TEAM_INSPECTORS.map((insp) => {
                      const isSelected = selectedInspectorId === insp.id;
                      return (
                        <button
                          key={insp.id}
                          type="button"
                          onClick={() => handleSelectInspector(insp.id)}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-extrabold text-blue-900">
                              {insp.id}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            )}
                          </div>
                          <p className="font-bold text-xs text-slate-900 mt-1">{insp.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{insp.designation}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Active Selected Inspector Login Form */}
                <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Account ID / Official Email
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={userIdOrEmail}
                        onChange={(e) => setUserIdOrEmail(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-mono text-slate-900 font-bold"
                        placeholder="e.g. PRASAD_INS_01"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Prototype Password
                      </label>
                      <span className="text-[10px] font-mono text-slate-400">
                        Default: LabelLens@2026
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium text-slate-900"
                        placeholder="••••••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] mt-2"
                  >
                    <span>Log In as {currentInspectorObj.name} ({currentInspectorObj.id})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick 1-Tap Entry for Faster Field Testing */}
                <div className="pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleDirectTeamLogin(selectedInspectorId)}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Quick Enter: {currentInspectorObj.name} Workspace</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Directorate Admin Tab */
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Directorate Admin SSO Authentication
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Central supervisory access for state controller and evaluation judges to view aggregate team metrics.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-amber-400 font-bold">PRASAD_ADMIN_01</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      Supervisory Level
                    </span>
                  </div>
                  <p className="font-bold text-slate-100">{DEFAULT_ADMIN.name}</p>
                  <p className="text-[11px] text-slate-400">{DEFAULT_ADMIN.designation} • {DEFAULT_ADMIN.email}</p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admin ID / Email
                    </label>
                    <input
                      type="text"
                      value={userIdOrEmail}
                      onChange={(e) => setUserIdOrEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white font-mono text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Admin Secret Key / Password
                      </label>
                      <span className="text-[10px] font-mono text-slate-400">
                        Default: LabelLens@2026
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-3 pr-10 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white font-medium text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] mt-2"
                  >
                    <span>Authenticate as Prasad (PRASAD_ADMIN_01)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleDirectAdminLogin}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>Direct Jury Admin Sign-In</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Official Bottom Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <OfficialEmblem type="india" size="xs" />
            <span className="font-black text-slate-800">Label<span className="text-blue-600">Lens</span></span>
            <span>• Legal Metrology &amp; Packaged Commodities Enforcement System</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="text-slate-600">Department of Consumer Affairs, Government of India</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
