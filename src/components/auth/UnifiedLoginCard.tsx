import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  UserCheck,
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Loader2,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { OfficialEmblem } from '../ui/OfficialEmblem';
import { TEAM_INSPECTORS, DEFAULT_ADMIN } from '../../data/seedData';
import { UserRole } from '../../types';

interface UnifiedLoginCardProps {
  role: UserRole;
}

export const UnifiedLoginCard: React.FC<UnifiedLoginCardProps> = ({ role }) => {
  const { login, navigateTo, showToast } = useInspection();

  const isInspector = role === 'INSPECTOR';
  const shouldReduceMotion = useReducedMotion();

  // State
  const [userId, setUserId] = useState<string>(
    isInspector ? 'NAVINYA_INS_02' : DEFAULT_ADMIN.id
  );
  const [password, setPassword] = useState<string>('LabelLens@2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSelectQuickAccount = (id: string) => {
    setUserId(id);
    setErrorMessage(null);
  };

  const handleFastLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedId = userId.trim();
    if (!trimmedId) {
      setErrorMessage(isInspector ? 'Please enter Inspector ID.' : 'Please enter Administrator ID.');
      return;
    }

    setIsSubmitting(true);

    // Fast immediate validation without artificial multi-second lag
    const success = login({
      userId: trimmedId,
      password: password.trim(),
      role,
    });

    if (!success) {
      setIsSubmitting(false);
      setErrorMessage(
        isInspector
          ? 'Authentication failed. Please verify Inspector ID and password.'
          : 'Authentication failed. Please verify Administrator credentials.'
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Centered Login Card */}
      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900/90 backdrop-blur-md border border-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-2xl shadow-blue-950/40 relative overflow-hidden"
      >
        {/* Subtle Top Accent Line */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            isInspector ? 'bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-500' : 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500'
          }`}
        />

        {/* Card Header */}
        <div className="text-center space-y-3 pb-5 border-b border-slate-800">
          {/* Official Emblem + LabelLens Branding */}
          <div className="flex items-center justify-center gap-2">
            <div className="p-1.5 bg-white/10 rounded-lg border border-white/15 backdrop-blur-xs flex items-center justify-center">
              <OfficialEmblem type="india" size="xs" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-white">Label<span className="text-blue-400">Lens</span></span>
                <span className="text-[9px] font-mono font-bold bg-blue-900/80 text-blue-300 border border-blue-700/60 px-1 py-0.2 rounded">
                  PCR 2011
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                Legal Metrology Enforcement System
              </p>
            </div>
          </div>

          {/* Role Icon & Title */}
          <div className="pt-2">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2.5 border shadow-inner ${
                isInspector
                  ? 'bg-blue-600/15 border-blue-500/30 text-blue-400'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              }`}
            >
              {isInspector ? <UserCheck className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>

            <h1 className="text-xl font-bold tracking-tight text-white uppercase">
              {isInspector ? 'Inspector Login' : 'Administrator Login'}
            </h1>

            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              {isInspector
                ? 'Field officer access for commodity surveillance, evidence capture, and statutory PCR 2011 compliance review.'
                : 'Directorate supervisory console for inspector workload monitoring, state registry review, and compliance dossiers.'}
            </p>
          </div>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-950/80 border border-red-800 text-red-200 rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleFastLogin} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              {isInspector ? 'Inspector Login ID' : 'Administrator ID'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value.toUpperCase());
                  setErrorMessage(null);
                }}
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs font-mono bg-slate-950/90 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white font-bold"
                placeholder={isInspector ? 'e.g. NAVINYA_INS_02' : 'PRASAD_ADMIN_01'}
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                Default: LabelLens@2026
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                required
                className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-950/90 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white font-medium"
                placeholder="••••••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-[0.99] mt-2 ${
              isInspector
                ? 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-900/30 disabled:bg-blue-800/80'
                : 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 shadow-amber-900/30 disabled:bg-amber-800/80'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>
                  {isInspector
                    ? 'Sign In to Inspector Dashboard'
                    : 'Sign In as Prasad (Directorate Admin)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Quick 1-Tap Account Selector for Prototype Field Testing */}
        <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isInspector ? 'Quick Field-Test Accounts' : 'Authorized Supervisory Account'}
            </span>
            <span className="text-[9px] font-mono text-blue-400 font-semibold">1-Tap Select</span>
          </div>

          {isInspector ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono text-[10px]">
              {TEAM_INSPECTORS.map((insp) => {
                const isSelected = userId === insp.id;
                return (
                  <button
                    key={insp.id}
                    type="button"
                    onClick={() => handleSelectQuickAccount(insp.id)}
                    className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-950/80 border-blue-500 text-blue-200 ring-1 ring-blue-500/40'
                        : 'bg-slate-950/50 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold truncate">{insp.id.replace('_INS_', ' #')}</span>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0 ml-1" />}
                    </div>
                    <span className="text-[9px] text-slate-400 font-sans truncate">{insp.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleSelectQuickAccount(DEFAULT_ADMIN.id)}
              className={`w-full p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                userId === DEFAULT_ADMIN.id
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200 ring-1 ring-amber-500/40'
                  : 'bg-slate-950/50 hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              <div>
                <div className="font-mono text-xs font-bold text-amber-300">
                  {DEFAULT_ADMIN.id}
                </div>
                <div className="text-[10px] text-slate-400">
                  {DEFAULT_ADMIN.name} • {DEFAULT_ADMIN.designation}
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            </button>
          )}
        </div>

        {/* Back to Role Selection */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => navigateTo('/login')}
            className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Operating Role</span>
          </button>

          <span className="text-[10px] text-slate-500 font-mono">
            {isInspector ? 'Field ID' : 'Admin ID'}
          </span>
        </div>
      </motion.div>

      {/* Legal Notice below card */}
      <div className="mt-4 text-center text-[11px] text-slate-400">
        <p>
          National Legal Metrology Gateway &bull; Enforcement Circle
          <br />
          Legal Metrology (Packaged Commodities) Rules, 2011 &bull; Authorized Officers Only
        </p>
      </div>
    </div>
  );
};
