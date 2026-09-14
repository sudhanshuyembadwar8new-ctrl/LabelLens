import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  Loader2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Layers,
  FileCheck2,
  Zap,
} from 'lucide-react';

interface ProgressChecklistProps {
  inspectionId: string;
  onComplete: () => void;
}

interface StepItem {
  id: number;
  label: string;
  detail: string;
}

const STAGES: StepItem[] = [
  {
    id: 1,
    label: 'Product imagery received & registered',
    detail: 'Principal display panel and statutory markings panels registered in evidentiary workspace.',
  },
  {
    id: 2,
    label: 'Optical preprocessing & quality assessment',
    detail: 'Evaluating contrast, blur score, orientation, perspective alignment, and package geometry.',
  },
  {
    id: 3,
    label: 'Multilingual OCR & text isolation',
    detail: 'Extracting label text in English, Hindi, and Marathi; isolating price stamps and net quantity numeral blocks.',
  },
  {
    id: 4,
    label: 'Deterministic PCR 2011 statutory rule verification',
    detail: 'Cross-referencing observed declarations against Schedule II standards, USP calculation, and Rule 13 font ratios.',
  },
  {
    id: 5,
    label: 'Evidence linkage & review workspace synthesis',
    detail: 'Formulating bounding coordinate crops, confidence metrics, and draft findings for inspector sign-off.',
  },
];

export const ProgressChecklist: React.FC<ProgressChecklistProps> = ({
  inspectionId,
  onComplete,
}) => {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [progressPercent, setProgressPercent] = useState<number>(20);

  useEffect(() => {
    // Ultra-fast responsive execution pipeline (~550ms total for responsive feel)
    const timer1 = setTimeout(() => {
      setCurrentStage(2);
      setProgressPercent(40);
    }, 80);

    const timer2 = setTimeout(() => {
      setCurrentStage(3);
      setProgressPercent(65);
    }, 180);

    const timer3 = setTimeout(() => {
      setCurrentStage(4);
      setProgressPercent(85);
    }, 290);

    const timer4 = setTimeout(() => {
      setCurrentStage(5);
      setProgressPercent(100);
    }, 400);

    const timer5 = setTimeout(() => {
      onComplete();
    }, 550);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <div className="max-w-2xl mx-auto my-6 bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-xs">
      {/* Top Banner Disclaimer */}
      <div className="mb-5 p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
          <span className="font-bold">FAST AI REGULATORY VERIFICATION</span>
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="font-mono text-[11px] bg-blue-700 hover:bg-blue-800 text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Zap className="w-3 h-3 text-amber-300" />
          <span>Skip Wait →</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-5">
        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 font-semibold">
          {inspectionId}
        </span>
        <h2 className="text-lg font-extrabold text-slate-900 mt-2.5">
          Analyzing Packaged Commodity Evidence
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Executing optical preprocessing, OCR text extraction, and PCR 2011 statutory rule verification.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span>Analysis Sequence</span>
          <span className="font-mono font-bold text-blue-700">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
          <div
            className="bg-blue-700 h-full transition-all duration-200 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5 mb-6">
        {STAGES.map((stage) => {
          const isDone = currentStage > stage.id || progressPercent === 100;
          const isCurrent = currentStage === stage.id && progressPercent < 100;

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-lg border transition-all flex items-start gap-3 ${
                isDone
                  ? 'bg-slate-50 border-slate-200'
                  : isCurrent
                  ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-100'
                  : 'bg-white border-slate-100 opacity-60'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-700 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-slate-400 font-bold">
                    {stage.id}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isDone
                        ? 'text-slate-900'
                        : isCurrent
                        ? 'text-blue-900'
                        : 'text-slate-500'
                    }`}
                  >
                    {stage.label}
                  </span>
                  {isDone && (
                    <span className="text-[10px] font-semibold text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.2 rounded">
                      VERIFIED
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-semibold text-blue-700 font-mono animate-pulse">
                      PROCESSING...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {stage.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-slate-500 text-[11px]">
        <span>PCR 2011 Automated Metrology Engine</span>
        <button
          type="button"
          onClick={onComplete}
          className="text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
        >
          View Results Directly →
        </button>
      </div>
    </div>
  );
};
