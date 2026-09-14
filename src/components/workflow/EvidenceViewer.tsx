import React, { useState } from 'react';
import { useInspection } from '../../context/InspectionContext';
import {
  EvidenceItem,
  Finding,
  ImageAsset,
  Inspection,
  ReviewStatus,
} from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Clock,
  Layers,
  FileText,
  ShieldCheck,
  Save,
  Tag,
  Eye,
  Info,
  Ruler,
  ArrowRightLeft,
} from 'lucide-react';
import { PhysicalMeasurementModal } from './PhysicalMeasurementModal';
import { PhysicalVsOnlineModal } from './PhysicalVsOnlineModal';

interface EvidenceViewerProps {
  inspection: Inspection;
  onUpdateFindingStatus: (
    findingId: string,
    status: ReviewStatus,
    note?: string
  ) => void;
  onUpdateEvidenceStatus: (
    evidenceId: string,
    status: ReviewStatus,
    note: string
  ) => void;
  onGenerateReport: () => void;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  inspection,
  onUpdateFindingStatus,
  onUpdateEvidenceStatus,
  onGenerateReport,
}) => {
  const { saveDraftInspection, showToast } = useInspection();

  // Active selected finding & evidence
  const [selectedFindingId, setSelectedFindingId] = useState<string>(
    inspection.findings[0]?.id || ''
  );
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(
    inspection.evidence[0]?.id || ''
  );
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [inspectorNoteInput, setInspectorNoteInput] = useState<string>('');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [isPhysicalModalOpen, setIsPhysicalModalOpen] = useState<boolean>(false);
  const [isOnlineModalOpen, setIsOnlineModalOpen] = useState<boolean>(false);

  // Selected finding
  const activeFinding =
    inspection.findings.find((f) => f.id === selectedFindingId) ||
    inspection.findings[0];

  // Active evidence item
  const activeEvidence =
    inspection.evidence.find((ev) => ev.id === selectedEvidenceId) ||
    inspection.evidence[0];

  // Linked image for active evidence or active finding
  const targetImageId =
    activeEvidence?.sourceImageId ||
    inspection.images[0]?.id;

  const [selectedImageId, setSelectedImageId] = useState<string>(
    targetImageId || inspection.images[0]?.id || ''
  );

  const activeImage =
    inspection.images.find((img) => img.id === selectedImageId) ||
    inspection.images[0];

  // Sync reviewer notes when evidence selection changes
  React.useEffect(() => {
    if (activeEvidence) {
      setInspectorNoteInput(activeEvidence.reviewerNote || '');
    }
  }, [selectedEvidenceId]);

  const handleSelectFinding = (finding: Finding) => {
    setSelectedFindingId(finding.id);
    if (finding.evidenceIds && finding.evidenceIds.length > 0) {
      const firstEv = inspection.evidence.find((e) => e.id === finding.evidenceIds[0]);
      if (firstEv) {
        setSelectedEvidenceId(firstEv.id);
        setSelectedImageId(firstEv.sourceImageId);
      }
    }
  };

  const handleSelectEvidence = (ev: EvidenceItem) => {
    setSelectedEvidenceId(ev.id);
    setSelectedImageId(ev.sourceImageId);
    if (ev.linkedFindingIds && ev.linkedFindingIds.length > 0) {
      setSelectedFindingId(ev.linkedFindingIds[0]);
    }
  };

  const handleSaveNoteAndStatus = (status: ReviewStatus) => {
    if (activeEvidence) {
      onUpdateEvidenceStatus(activeEvidence.id, status, inspectorNoteInput);
    }
    if (activeFinding) {
      onUpdateFindingStatus(activeFinding.id, status, inspectorNoteInput);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-[780px]">
      {/* Evidence Workspace Header */}
      <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-700 rounded text-white">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Evidence Review & Verification Workspace
              </h2>
              <span className="text-[10px] font-mono bg-blue-900 text-blue-300 border border-blue-700/60 px-1.5 py-0.2 rounded">
                PCR 2011 Audit Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Inspection: {inspection.id} • {inspection.product.brand} {inspection.product.name} ({inspection.product.declaredQuantity})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPhysicalModalOpen(true)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open Calibrated Numeral Height Caliper Tool"
          >
            <Ruler className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Caliper Gauge</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOnlineModalOpen(true)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open E-Commerce Physical vs. Online Comparison"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Online Cross-Check</span>
          </button>

          <button
            type="button"
            onClick={onGenerateReport}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report Preview</span>
          </button>
        </div>
      </div>

      {/* 3-Pane Responsive Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Pane 1: Left List (25% / 3 cols) */}
        <div className="lg:col-span-3 border-r border-slate-200 bg-slate-50 flex flex-col overflow-y-auto">
          <div className="p-3 border-b border-slate-200 bg-white sticky top-0 z-10">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Findings & Observations ({inspection.findings.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Select an item to view linked package evidence
            </p>
          </div>

          {/* Finding items */}
          <div className="p-2 space-y-2">
            {inspection.findings.map((finding) => {
              const isSelected = finding.id === selectedFindingId;

              return (
                <div
                  key={finding.id}
                  onClick={() => handleSelectFinding(finding)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-400 shadow-xs ring-1 ring-blue-200'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                      {finding.id}
                    </span>
                    <StatusBadge status={finding.severity} size="sm" />
                  </div>

                  <h4 className="font-bold text-slate-900 leading-snug mt-1">
                    {finding.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {finding.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">
                      Field: {finding.relatedField}
                    </span>
                    <StatusBadge status={finding.reviewStatus} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Evidence Items Index */}
          <div className="p-3 border-t border-slate-200 bg-white mt-auto">
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              Registered Evidence Items ({inspection.evidence.length})
            </h4>
            <div className="space-y-1.5">
              {inspection.evidence.map((ev) => {
                const isSelected = ev.id === selectedEvidenceId;

                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => handleSelectEvidence(ev)}
                    className={`w-full text-left p-2 rounded text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-blue-700 text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="truncate">{ev.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1 rounded ${
                        isSelected ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {ev.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pane 2: Center Image Viewer (50% / 6 cols) */}
        <div className="lg:col-span-6 bg-slate-950 flex flex-col justify-between overflow-hidden relative">
          {/* Viewer Toolbar */}
          <div className="p-2.5 bg-slate-900/90 text-white flex items-center justify-between border-b border-slate-800 text-xs z-10">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">
                Viewing: {activeImage ? `${activeImage.role} (${activeImage.filename})` : 'No Image'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {activeImage?.width} × {activeImage?.height} px
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 border ${
                  showAnnotations
                    ? 'bg-blue-700 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Annotations</span>
              </button>

              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
                className="p-1 hover:bg-slate-800 rounded text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-[11px] px-1 text-slate-300">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                className="p-1 hover:bg-slate-800 rounded text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="p-1 hover:bg-slate-800 rounded text-slate-300"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Image Stage with SVG Bounding Box Overlays */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-slate-950 relative select-none">
            {activeImage ? (
              <div
                className="relative transition-transform duration-200 origin-center"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
              >
                <img
                  src={activeImage.dataUrl}
                  alt={activeImage.filename}
                  className="max-h-[580px] w-auto object-contain rounded border border-slate-700/80 shadow-2xl"
                />

                {/* SVG Annotations for this image */}
                {showAnnotations && (
                  <div className="absolute inset-0 pointer-events-none">
                    {inspection.evidence
                      .filter((ev) => ev.sourceImageId === activeImage.id && ev.region)
                      .map((ev) => {
                        const isThisSelected = ev.id === activeEvidence?.id;
                        const r = ev.region!;

                        return (
                          <div
                            key={ev.id}
                            style={{
                              left: `${r.x}%`,
                              top: `${r.y}%`,
                              width: `${r.width}%`,
                              height: `${r.height}%`,
                            }}
                            className={`absolute border-2 pointer-events-auto cursor-pointer transition-all ${
                              isThisSelected
                                ? 'border-amber-400 bg-amber-400/20 shadow-lg ring-2 ring-amber-300'
                                : 'border-blue-400 bg-blue-500/10 hover:bg-blue-500/20'
                            }`}
                            onClick={() => handleSelectEvidence(ev)}
                            title={`${ev.label} (${ev.id})`}
                          >
                            <span
                              className={`absolute -top-5 left-0 px-1.5 py-0.2 text-[10px] font-bold font-mono rounded whitespace-nowrap shadow-xs ${
                                isThisSelected
                                  ? 'bg-amber-400 text-slate-950'
                                  : 'bg-blue-700 text-white'
                              }`}
                            >
                              {r.label || ev.label}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-500 text-xs">No image loaded</div>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
            {inspection.images.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedImageId(img.id)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-xs border transition-all ${
                  img.id === selectedImageId
                    ? 'bg-blue-900/80 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <div className="w-6 h-6 rounded bg-slate-950 overflow-hidden shrink-0">
                  <img src={img.dataUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="font-semibold">{img.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pane 3: Right Details & Review Controls (25% / 3 cols) */}
        <div className="lg:col-span-3 border-l border-slate-200 bg-white flex flex-col justify-between overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {activeEvidence?.id || 'NO EVIDENCE'}
                </span>
                <StatusBadge status={activeEvidence?.reviewStatus || 'PENDING'} size="sm" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2">
                {activeEvidence?.label}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {activeEvidence?.description}
              </p>
            </div>

            {/* Applicable Rule Reference */}
            {activeFinding?.ruleReference && (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Applicable Statutory Rule
                </p>
                <p className="text-slate-800 font-medium text-[11px] leading-snug">
                  {activeFinding.ruleReference}
                </p>
              </div>
            )}

            {/* Extracted Markings Cross-Check */}
            <div className="p-2.5 bg-blue-50/50 border border-blue-200 rounded-md text-xs">
              <p className="text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1">
                Extracted Field Trace
              </p>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-600">Field: {activeFinding?.relatedField}</span>
                <span className="font-bold text-slate-900">
                  Confidence: {activeFinding?.confidence}
                </span>
              </div>
            </div>

            {/* Inspector Verification Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Inspector Verification Note
              </label>
              <textarea
                value={inspectorNoteInput}
                onChange={(e) => setInspectorNoteInput(e.target.value)}
                rows={3}
                placeholder="Enter regulatory observation notes, calibration check, or follow-up reason..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Decision Controls */}
            <div>
              <p className="text-xs font-bold text-slate-800 mb-2">
                Set Review Determination
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveNoteAndStatus('VERIFIED')}
                  className="p-2 rounded border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Verified</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveNoteAndStatus('NEEDS_MORE_EVIDENCE')}
                  className="p-2 rounded border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-sky-700" />
                  <span>Need Evidence</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveNoteAndStatus('PENDING')}
                  className="p-2 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Pending</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveNoteAndStatus('NOT_APPLICABLE')}
                  className="p-2 rounded border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5 text-slate-600" />
                  <span>Not Applicable</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Human Review Guarantee */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Inspector Prerogative</span>
            </div>
            <span>
              Determinations update the inspection ledger and attach to the official draft report.
            </span>
          </div>
        </div>
      </div>

      {/* Physical Measurement Modal (Stage 7) */}
      <PhysicalMeasurementModal
        isOpen={isPhysicalModalOpen}
        onClose={() => setIsPhysicalModalOpen(false)}
        declaredQuantity={inspection.product.declaredQuantity}
        onSaveMeasurement={(data) => {
          saveDraftInspection({
            ...inspection,
            reviewerOverallNotes: `${inspection.reviewerOverallNotes || ''}\n[Physical Measurement]: Measured ${data.measuredMm}mm (Req: ${data.expectedMinMm}mm, Result: ${data.result})`,
          });
          showToast(`Physical measurement (${data.measuredMm} mm) recorded in dossier`, 'success');
        }}
      />

      {/* Physical vs Online Modal (Stage 8) */}
      <PhysicalVsOnlineModal
        isOpen={isOnlineModalOpen}
        onClose={() => setIsOnlineModalOpen(false)}
        inspection={inspection}
        onSaveComparison={(compData) => {
          saveDraftInspection({
            ...inspection,
            reviewerOverallNotes: `${inspection.reviewerOverallNotes || ''}\n[Online Audit ${compData.platform}]: Status ${compData.overallStatus}`,
          });
          showToast(`E-Commerce comparison with ${compData.platform} saved`, 'success');
        }}
      />
    </div>
  );
};
