import React, { useState } from 'react';
import {
  X,
  Scale,
  Ruler,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Camera,
  Info,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ConfidenceLevel } from '../../types';
import { getMinimumRequiredFontHeightMm } from '../../services/analysisPipeline';

interface PhysicalMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  declaredQuantity: string;
  onSaveMeasurement?: (data: {
    measuredMm: number;
    expectedMinMm: number;
    confidence: ConfidenceLevel;
    result: 'COMPLIANT' | 'REVIEW_REQUIRED';
    notes: string;
  }) => void;
}

export const PhysicalMeasurementModal: React.FC<PhysicalMeasurementModalProps> = ({
  isOpen,
  onClose,
  declaredQuantity,
  onSaveMeasurement,
}) => {
  if (!isOpen) return null;

  const expectedMinMm = getMinimumRequiredFontHeightMm(declaredQuantity || '500 g');

  // Calibration state
  const [referenceType, setReferenceType] = useState<
    'CARD' | 'COIN' | 'RULER' | 'CUSTOM'
  >('CARD');
  const [refKnownMm, setRefKnownMm] = useState<number>(85.6); // standard ID-1 card width
  const [refPixelSpan, setRefPixelSpan] = useState<number>(320); // pixels across ref in photo

  // Measurement state
  const [numeralPixelHeight, setNumeralPixelHeight] = useState<number>(14); // pixels of numeral
  const [confidence, setConfidence] = useState<ConfidenceLevel>('MEDIUM');
  const [inspectorNotes, setInspectorNotes] = useState<string>(
    'Measured using calibrated reference card. Numeral height approximates statutory threshold.'
  );

  // Optical pixel-to-mm ratio: pixels per mm = refPixelSpan / refKnownMm
  const pixelsPerMm = Math.max(0.1, refPixelSpan / (refKnownMm || 1));
  const measuredMm = Number((numeralPixelHeight / pixelsPerMm).toFixed(2));

  // Statutory check
  const isCompliant = measuredMm >= expectedMinMm;
  const result: 'COMPLIANT' | 'REVIEW_REQUIRED' = isCompliant
    ? 'COMPLIANT'
    : 'REVIEW_REQUIRED';

  const handleSelectRef = (type: 'CARD' | 'COIN' | 'RULER' | 'CUSTOM') => {
    setReferenceType(type);
    if (type === 'CARD') {
      setRefKnownMm(85.6);
      setRefPixelSpan(320);
    } else if (type === 'COIN') {
      setRefKnownMm(25.0); // 1 Rupee / 5 Rupee coin standard
      setRefPixelSpan(95);
    } else if (type === 'RULER') {
      setRefKnownMm(10.0);
      setRefPixelSpan(40);
    }
  };

  const handleSave = () => {
    if (onSaveMeasurement) {
      onSaveMeasurement({
        measuredMm,
        expectedMinMm,
        confidence,
        result,
        notes: inspectorNotes,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col my-auto animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-700 rounded text-white">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Calibrated Optical Measurement Tool
              </h3>
              <p className="text-[11px] text-slate-400">
                PCR 2011 Rule 13 / Schedule II — Numeral Font Height Calibration
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Optical Gauge Notice */}
        <div className="px-5 py-2.5 bg-blue-50/80 border-b border-blue-200 text-blue-950 text-[11px] flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <strong>Assistive Optical Gauge:</strong> Standard photography without a calibrated reference cannot guarantee absolute millimeter precision. This optical gauge computes pixel-to-millimeter ratio using a known in-frame physical reference object. Final legal enforcement requires certified physical dial calipers.
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Step 1: Select In-Frame Calibration Reference */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              1. Reference Object Calibration
            </label>
            <p className="text-xs text-slate-500">
              Select the known physical object placed adjacent to package in the photograph:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSelectRef('CARD')}
                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                  referenceType === 'CARD'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold block">Standard ID / Card</span>
                <span className="text-[10px] text-slate-500">85.6 mm width</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRef('COIN')}
                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                  referenceType === 'COIN'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold block">Rupee Coin</span>
                <span className="text-[10px] text-slate-500">25.0 mm diam.</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRef('RULER')}
                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                  referenceType === 'RULER'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold block">10mm Scale Marker</span>
                <span className="text-[10px] text-slate-500">10.0 mm span</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRef('CUSTOM')}
                className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                  referenceType === 'CUSTOM'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold block">Custom Reference</span>
                <span className="text-[10px] text-slate-500">Manual input</span>
              </button>
            </div>

            {/* Slider to adjust reference span in image */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  Reference Object Optical Span in Image:
                </span>
                <span className="font-mono font-bold text-blue-700">
                  {refPixelSpan} px ({refKnownMm} mm known)
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="800"
                value={refPixelSpan}
                onChange={(e) => setRefPixelSpan(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Calculated Resolution:</span>
                <span className="font-mono font-bold text-slate-700">
                  {pixelsPerMm.toFixed(2)} pixels/mm
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Numeral Font Height Measurement */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              2. Numeral Bounding Box Caliper Measurement
            </label>
            <p className="text-xs text-slate-500">
              Isolate numeral height (e.g., numeral "5" in "5 kg" or "500 g") on the display panel:
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  Numeral Vertical Height (Reticle):
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {numeralPixelHeight} px &rarr;{' '}
                  <strong className="text-blue-700 text-sm font-black">{measuredMm} mm</strong>
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="60"
                value={numeralPixelHeight}
                onChange={(e) => setNumeralPixelHeight(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Fine-tune with reticle caliper slider</span>
                <span>Range: 4px – 60px</span>
              </div>
            </div>
          </div>

          {/* Step 3: Comparative Determination Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Rule 13 / Schedule II Statutory Threshold Comparison</span>
              <span className="font-mono text-[11px] text-slate-500">
                Declared Qty: {declaredQuantity}
              </span>
            </div>

            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-white border border-slate-100 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Measured Height
                </span>
                <span className="text-xl font-black text-slate-900 block mt-0.5">
                  {measuredMm} mm
                </span>
                <span className="text-[10px] text-slate-400">Optical gauge</span>
              </div>

              <div className="p-2.5 bg-white border border-slate-100 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Expected Minimum
                </span>
                <span className="text-xl font-black text-blue-700 block mt-0.5">
                  {expectedMinMm.toFixed(1)} mm
                </span>
                <span className="text-[10px] text-slate-400">Schedule II Table</span>
              </div>

              <div className="p-2.5 bg-white border border-slate-100 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Optical Confidence
                </span>
                <div className="mt-1">
                  <select
                    value={confidence}
                    onChange={(e) => setConfidence(e.target.value as ConfidenceLevel)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-800"
                  >
                    <option value="HIGH">HIGH (Planar)</option>
                    <option value="MEDIUM">MEDIUM (Slight Angle)</option>
                    <option value="LOW">LOW (Curve / Glare)</option>
                  </select>
                </div>
                <span className="text-[10px] text-slate-400">Surface geometry</span>
              </div>

              <div className={`p-2.5 border rounded-lg ${
                isCompliant
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <span className="text-[10px] font-semibold uppercase tracking-wider block">
                  Assistive Result
                </span>
                <div className="flex items-center justify-center gap-1 mt-1 font-bold text-xs">
                  {isCompliant ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>COMPLIANT</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>REVIEW REQ.</span>
                    </>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">
                  {isCompliant ? 'Meets Schedule II' : 'Potential Under-height'}
                </span>
              </div>
            </div>
          </div>

          {/* Inspector Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Inspector Calibration Notes for Form 1 Inspection Sheet:
            </label>
            <textarea
              rows={2}
              value={inspectorNotes}
              onChange={(e) => setInspectorNotes(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Record notes on reference object calibration, surface angle, or dial caliper corroboration..."
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Record Measurement in Dossier</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
