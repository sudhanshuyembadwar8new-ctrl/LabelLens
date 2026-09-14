import React, { useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Building,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Camera,
  Search,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';

const WORKFLOW_STEPS = [
  { step: 1, title: 'Capture Package', desc: 'Scan front & statutory labels', icon: Camera },
  { step: 2, title: 'OCR & Analysis', desc: 'Rule 13 font & declarations', icon: Search },
  { step: 3, title: 'Review Audit', desc: 'MRP, date, & compliance', icon: AlertTriangle },
  { step: 4, title: 'Evidence Check', desc: 'Bounding box validation', icon: CheckCircle2 },
  { step: 5, title: 'Statutory Report', desc: 'Form 1 inspection memo', icon: FileCheck },
];

export const InspectorProfileBanner: React.FC = () => {
  const { currentUser, startNewInspection } = useInspection();
  const [showWorkflow, setShowWorkflow] = useState(false);

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
      {/* Officer Header */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-700 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs border border-blue-500/30">
            {currentUser.avatar || 'IN'}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                {currentUser.name}
              </h2>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                {currentUser.id}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Active Session
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 mt-1">
              <span>{currentUser.designation}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-mono text-[11px]">
                {currentUser.email}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowWorkflow(!showWorkflow)}
            className="flex-1 sm:flex-initial min-h-[40px] px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{showWorkflow ? 'Hide Workflow' : 'Workflow Steps'}</span>
            {showWorkflow ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => startNewInspection()}
            className="flex-1 sm:flex-initial min-h-[40px] px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Inspection</span>
          </button>
        </div>
      </div>

      {/* Expandable Clean Workflow Guide */}
      {showWorkflow && (
        <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Field Investigation Statutory Workflow (PCR 2011 Standard)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {WORKFLOW_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-white border border-slate-200 rounded-lg p-2.5 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="w-5 h-5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold flex items-center justify-center border border-blue-100">
                      {step.step}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
