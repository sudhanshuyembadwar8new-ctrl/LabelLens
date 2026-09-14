import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Camera,
  Store,
  Sparkles,
  ShieldCheck,
  Ruler,
  Send,
  Layers,
  ChevronRight,
  HelpCircle,
  Clock,
  FileCheck2,
  Sliders,
  Scale,
} from 'lucide-react';

interface FirstTimeInspectorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInspection: () => void;
}

interface StepDetail {
  number: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  instructions: string[];
  statutoryRules: string[];
  tip: string;
}

const STEPS: StepDetail[] = [
  {
    number: 1,
    title: 'Establishment & Commodity Intake',
    subtitle: 'Register merchant premises and commodity classification',
    icon: Store,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    badge: 'Step 1 of 6',
    instructions: [
      'Enter the official Trade/Store Name and complete shop address within your circle jurisdiction.',
      'Record the merchant GSTIN or municipal trade license number for formal legal traceability.',
      'Select commodity type (Packaged Food, Personal Care, Household Goods, Electronics, etc.).',
      'Choose the retail package form: Mono-carton, Pouch, Bottle/Can, Blister pack, or Corrugated shipper.',
    ],
    statutoryRules: [
      'Legal Metrology Act, 2009 — Section 15 (Power of inspection & entry)',
      'Rule 3 (Application to pre-packaged commodities intended for retail sale)',
    ],
    tip: 'Tip: For routine market surveillance, standard field visit mode is pre-selected with your official officer credentials.',
  },
  {
    number: 2,
    title: 'Multi-Angle Package Photography & Preprocessing',
    subtitle: 'Capture clear photographic evidence and apply optical enhancement',
    icon: Camera,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    badge: 'Step 2 of 6',
    instructions: [
      'Capture Front Panel (PDP): Must clearly display the brand trademark, commodity descriptor, and declared net quantity.',
      'Capture Back/Declarations Panel: Must show MRP, date of packaging, complete manufacturer details, and consumer care redressal.',
      'Use the built-in Optical Preprocessing Suite:',
      '• Auto-Gain & Exposure: Brightens dark or dim photographs captured inside grocery aisles.',
      '• Unsharp Mask (Sharpening): Sharpens faint dot-matrix or ink-jet statutory stamps.',
      '• Cylindrical Surface Unwarp: Flattens curved typography on round cans, jars, and bottles.',
      '• Text Isolation: Eliminates colorful graphic packaging backgrounds to extract clean black/white text.',
    ],
    statutoryRules: [
      'PCR 2011 Rule 6 (General provisions for declaration)',
      'Rule 7 (Declarations to be on the principal display panel)',
    ],
    tip: 'Tip: Ensure the price stamp and net quantity numeral are well-lit and in sharp optical focus.',
  },
  {
    number: 3,
    title: 'Multimodal AI & Indian Script OCR Extraction',
    subtitle: 'Automatic optical extraction in English, Hindi, Marathi & regional scripts',
    icon: Sparkles,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    badge: 'Step 3 of 6',
    instructions: [
      'Click "Run Regulatory Analysis" to initiate multimodal computer vision processing.',
      'The engine automatically reads printed text in English and Indian languages (Hindi, Marathi, Gujarati, etc.).',
      'Statutory fields are detected with precise on-image bounding coordinates (Brand, Quantity, MRP, Month/Year, Origin, Manufacturer, Consumer Care).',
      'Any missing declaration or non-standard syntax is automatically flagged with an amber "Review Required" or red "Violation" badge.',
    ],
    statutoryRules: [
      'PCR 2011 Rule 9 (Language of declarations: Hindi in Devanagari or English)',
      'Schedule II (Standard units of weight and measure)',
    ],
    tip: 'Tip: The AI never fabricates declarations. If a date or address is missing from the physical package, it marks it "Review Required" for your statutory confirmation.',
  },
  {
    number: 4,
    title: 'Statutory Legal Metrology (PCR 2011) Audit',
    subtitle: 'Deterministic verification of mandatory legal requirements & exemptions',
    icon: Scale,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    badge: 'Step 4 of 6',
    instructions: [
      'MRP Tax Phrasing: Verifies strict compliance with Rule 6(1)(e) — must state "inclusive of all taxes" (or "incl. of all taxes").',
      'Unit Sale Price (USP): Cross-checks mandatory USP calculation per g/kg or ml/L under PCR 2021 Second Amendment.',
      'Standard Units: Confirms weight/volume is declared in standard metric units (g, kg, ml, l, N) per Rule 11.',
      'Statutory Exemption Resolution:',
      '• Rule 26(a): Net content ≤ 10g or 10ml exempt from packing date and consumer care.',
      '• Rule 26(b): Agricultural packages > 50kg exempt from retail declaration requirements.',
      '• Rule 26(d): Electronic goods permit QR code digital declarations for secondary addresses.',
    ],
    statutoryRules: [
      'PCR 2011 Rule 6(1)(e) & Rule 6(1)(da) (MRP & USP mandate)',
      'PCR 2011 Rule 26 (Statutory exemptions & exceptions)',
    ],
    tip: 'Tip: Check the USP calculation badge to confirm the unit price correctly corresponds to the declared net quantity.',
  },
  {
    number: 5,
    title: 'Digital Millimeter Caliper & E-Commerce Cross-Check',
    subtitle: 'Verify physical character heights and scan for market price tampering',
    icon: Ruler,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    badge: 'Step 5 of 6',
    instructions: [
      'Rule 13 Numeral Height Gauge: Use the on-screen digital millimeter caliper to verify that the declared net quantity numeral meets minimum statutory height standards (≥ 2.0 mm for 100g–500g; ≥ 4.0 mm for > 1kg).',
      'Dual-Pricing / Smudge Audit: Inspect close-up crops for smeared price stickers, dual stickers, or scratched dates.',
      'Quick-Commerce Price Cross-Check: Use the integrated search to verify if the merchant or warehouse is selling the same commodity above MRP on e-commerce platforms.',
    ],
    statutoryRules: [
      'PCR 2011 Rule 13 & Schedule II (Minimum height of numerals and letters)',
      'Legal Metrology Act, 2009 — Section 36 (Penalty for non-standard packages)',
    ],
    tip: 'Tip: Adjust the caliper gauge using the + / - buttons to compare the printed character against the statutory threshold.',
  },
  {
    number: 6,
    title: 'Officer Sign-off & Direct Submission to Admin',
    subtitle: 'Generate Form 1 Statutory Sheet with instant Directorate HQ synchronization',
    icon: Send,
    color: 'text-blue-700 bg-blue-50 border-blue-300',
    badge: 'Step 6 of 6',
    instructions: [
      'Review all findings and accept or adjust officer observations in the Evidence Workspace.',
      'The system automatically drafts the official Form 1 Statutory Inspection Report with legal citation references.',
      'Click "Complete & Submit Inspection":',
      '• The inspection status is finalized as "Report Ready".',
      '• The dossier is instantly transmitted to the Directorate Admin Command Portal.',
      '• The submission immediately updates your personal inspector performance ledger and circle inspection totals in real time!',
    ],
    statutoryRules: [
      'Legal Metrology Enforcement Procedure (Form 1 Inspection Memo)',
      'Real-Time Directorate Central Surveillance Database Sync',
    ],
    tip: 'Tip: Once submitted, the inspection appears instantly under your name in the Admin Portal and can be viewed or exported as an official statutory memo.',
  },
];

export const FirstTimeInspectorGuideModal: React.FC<FirstTimeInspectorGuideModalProps> = ({
  isOpen,
  onClose,
  onStartInspection,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = STEPS[currentStepIdx];
  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
      onStartInspection();
    } else {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider bg-blue-800 text-blue-200 px-2 py-0.5 rounded font-bold">
                  Official Field Induction
                </span>
                <span className="text-xs text-slate-300">PCR 2011 SOP</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                Inspector First-Time Guide: How to Conduct an Inspection
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 flex-1 max-w-md">
            {STEPS.map((s, idx) => (
              <button
                key={s.number}
                type="button"
                onClick={() => setCurrentStepIdx(idx)}
                className={`h-2 rounded-full transition-all flex-1 cursor-pointer ${
                  idx === currentStepIdx
                    ? 'bg-blue-600'
                    : idx < currentStepIdx
                    ? 'bg-emerald-500'
                    : 'bg-slate-300'
                }`}
                title={`Step ${s.number}: ${s.title}`}
              />
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-600 shrink-0">
            Step {currentStep.number} of {STEPS.length}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {/* Step Title Header */}
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${currentStep.color}`}>
              <currentStep.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {currentStep.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {currentStep.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          {/* Key Field Instructions */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Standard Operating Procedure (What You Need to Do)</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {currentStep.instructions.map((ins, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                  <span>{ins}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Metrology Rules Applicable */}
          <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-3.5 space-y-1.5">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Statutory Rule Citations (Legal Metrology Act / PCR 2011)</span>
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {currentStep.statutoryRules.map((rule, i) => (
                <span
                  key={i}
                  className="bg-white border border-blue-200 text-blue-900 text-[11px] font-medium px-2 py-0.5 rounded-md"
                >
                  {rule}
                </span>
              ))}
            </div>
          </div>

          {/* Field Pro-Tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Officer Field Tip:</span>{' '}
              <span>{currentStep.tip}</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isFirst
                ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-500'
                : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 shadow-2xs'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartInspection();
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Skip Guide
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isLast ? 'Start My First Inspection' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
