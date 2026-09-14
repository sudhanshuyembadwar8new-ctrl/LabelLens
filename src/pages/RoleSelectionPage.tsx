import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { UserCheck, ShieldCheck, ArrowRight, ArrowLeft, Scale, Camera, FileCheck } from 'lucide-react';
import { useInspection } from '../context/InspectionContext';
import { OfficialEmblem } from '../components/ui/OfficialEmblem';
import { LabelLensAuthBackground } from '../components/auth/LabelLensAuthBackground';

export const RoleSelectionPage: React.FC = () => {
  const { navigateTo } = useInspection();
  const shouldReduceMotion = useReducedMotion();

  return (
    <LabelLensAuthBackground>
      {/* Sovereign Tricolor Accent Bar */}
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
                PCR 2011
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Digital Legal Metrology Inspector Portal
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('/')}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-slate-800/80 border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center my-auto">
        {/* Title & Introduction */}
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-xl mx-auto mb-8 space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold mb-2">
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            <span>Official Identity Authentication</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Select Your Operating Role
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Choose your designated portal role to proceed to your verified workspace. Distinct access privileges and security protocols apply.
          </p>
        </motion.div>

        {/* Two Primary Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto w-full">
          {/* Card 1: Inspector Login */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.08 }}
            className="bg-slate-900/90 border border-slate-800 hover:border-blue-500 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-blue-950/50 transition-all flex flex-col justify-between group backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-500" />

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                <UserCheck className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded">
                  Field Operations
                </span>
                <h2 className="text-lg font-bold text-white mt-2">
                  INSPECTOR LOGIN
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  For authorized field officers conducting retail surveillance, package scanning, and PCR 2011 compliance checks.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>Record packaged commodity inspections</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>Capture front &amp; back packaging photos</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>OCR text extraction &amp; rule validation</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>Generate Form 1 statutory inspection reports</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('/login/inspector')}
              className="mt-6 w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 group-hover:bg-blue-500 cursor-pointer active:scale-[0.99]"
            >
              <span>Proceed to Inspector Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>

          {/* Card 2: Admin Login */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.16 }}
            className="bg-slate-900/90 border border-slate-800 hover:border-amber-500 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-amber-950/50 transition-all flex flex-col justify-between group backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded">
                  Directorate Supervision
                </span>
                <h2 className="text-lg font-bold text-white mt-2">
                  ADMIN LOGIN
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  For lead administrator Prasad Gajulwar and supervisory officers overseeing team deployments and statewide dossiers.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Monitor all 5 team field inspectors</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Live activity feed &amp; inspection ledgers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Review pending reviews &amp; completed reports</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Examine individual inspector dossiers</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('/login/admin')}
              className="mt-6 w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 group-hover:bg-amber-500 cursor-pointer active:scale-[0.99]"
            >
              <span>Proceed to Admin Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Official Environment Notice */}
        <div className="mt-8 text-center text-xs text-slate-400 max-w-md mx-auto">
          <p>
            National Legal Metrology Statutory Enforcement Environment
            <br />
            Select your assigned role to access the field inspection or supervisory console.
          </p>
        </div>
      </main>

      {/* Institutional Dark Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-3 px-4 text-center text-xs text-slate-500">
        <p>Government of India &bull; Directorate of Legal Metrology &bull; LabelLens Enforcement System</p>
      </footer>
    </LabelLensAuthBackground>
  );
};
