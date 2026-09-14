import React from 'react';
import { Check } from 'lucide-react';

export type StepKey =
  | 'details'
  | 'upload'
  | 'analyze'
  | 'result'
  | 'review'
  | 'evidence'
  | 'report'
  | number;

interface StepItem {
  key: string;
  stepNumber: number;
  label: string;
}

const STEPS: StepItem[] = [
  { key: 'upload', stepNumber: 1, label: 'Capture Package' },
  { key: 'analyze', stepNumber: 2, label: 'AI Scanner & OCR' },
  { key: 'result', stepNumber: 3, label: 'Audit Findings' },
  { key: 'evidence', stepNumber: 4, label: 'Evidence Review' },
  { key: 'report', stepNumber: 5, label: 'Form 1 Report' },
];

interface StepperProps {
  currentStep: StepKey;
  inspectionId?: string;
  onStepClick?: (step: string) => void;
  allowNavigationToCompleted?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  inspectionId,
  onStepClick,
  allowNavigationToCompleted = true,
}) => {
  // Normalize step key
  const normalizedKey =
    typeof currentStep === 'number'
      ? STEPS[currentStep - 1]?.key || 'upload'
      : currentStep === 'review'
      ? 'result'
      : currentStep === 'details'
      ? 'upload'
      : currentStep;

  const currentIndex = Math.max(
    0,
    STEPS.findIndex((s) => s.key === normalizedKey)
  );
  const currentStepItem = STEPS[currentIndex] || STEPS[0];
  const progressPercent = Math.round(((currentIndex + 1) / STEPS.length) * 100);

  return (
    <nav
      aria-label="Inspection Workflow Progress"
      className="w-full bg-white border border-slate-200/90 rounded-xl p-3 sm:p-4 mb-3 sm:mb-5 shadow-2xs"
    >
      {/* Mobile Compact & Uncluttered Progress Bar */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-5 h-5 rounded-md bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
              {currentStepItem.stepNumber}
            </span>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-900 truncate">
                {currentStepItem.label}
              </span>
              <span className="text-[10px] text-slate-500 ml-1.5 font-medium">
                ({currentStepItem.stepNumber}/{STEPS.length})
              </span>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
            {progressPercent}% Done
          </span>
        </div>

        {/* Continuous slim progress bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Desktop Horizontal Chain */}
      <ol className="hidden sm:flex items-center justify-between gap-2 overflow-x-auto">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isClickable = allowNavigationToCompleted && isCompleted && onStepClick;

          return (
            <li
              key={step.key}
              className={`flex items-center gap-2.5 min-w-max ${
                isClickable ? 'cursor-pointer group' : ''
              }`}
              onClick={() => {
                if (isClickable) onStepClick(step.key);
              }}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted
                    ? 'bg-slate-800 text-white group-hover:bg-slate-900'
                    : isCurrent
                    ? 'bg-blue-700 text-white ring-2 ring-blue-200'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.stepNumber}
              </div>

              <div className="flex flex-col">
                <span
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? 'text-blue-900'
                      : isCompleted
                      ? 'text-slate-800 group-hover:text-blue-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                </span>
              </div>

              {idx < STEPS.length - 1 && (
                <div
                  className={`hidden sm:block w-6 md:w-12 lg:w-16 h-0.5 mx-1.5 ${
                    idx < currentIndex ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
