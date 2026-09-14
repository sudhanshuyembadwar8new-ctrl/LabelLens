import React, { useState } from 'react';
import {
  AlertTriangle,
  FileCheck2,
  Layers,
  FileText,
  ArrowRight,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Save,
  Camera,
  Store,
  Calendar,
  MapPin,
  Sparkles,
  Ruler,
  ArrowRightLeft,
  Download,
  FileDown,
  Printer,
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';
import { AppShell } from '../components/layout/AppShell';
import { Stepper } from '../components/ui/Stepper';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MetricCard } from '../components/ui/MetricCard';
import { ExtractedFieldsPanel } from '../components/workflow/ExtractedFieldsPanel';
import { PhysicalMeasurementModal } from '../components/workflow/PhysicalMeasurementModal';
import { PhysicalVsOnlineModal } from '../components/workflow/PhysicalVsOnlineModal';
import { generateInspectionReportPDF } from '../services/inspectionReportPdf';

export const MockResultPage: React.FC = () => {
  const {
    currentInspection,
    currentUser,
    saveDraftInspection,
    navigateTo,
    showToast,
  } = useInspection();

  const inspection = currentInspection;

  const [activeTab, setActiveTab] = useState<'FINDINGS' | 'MARKINGS' | 'EVIDENCE' | 'NOTES'>('FINDINGS');
  const [notes, setNotes] = useState<string>(
    inspection?.reviewerOverallNotes ||
      'Packaging declarations observed from retail sample. Potential review point noted on MRP inclusive-of-taxes syntax and net quantity typography.'
  );

  const [isPhysicalModalOpen, setIsPhysicalModalOpen] = useState<boolean>(false);
  const [isOnlineModalOpen, setIsOnlineModalOpen] = useState<boolean>(false);

  const handleDownloadPdf = () => {
    if (!inspection) return;
    try {
      generateInspectionReportPDF(inspection, currentUser);
      showToast(`Statutory Form 1 PDF downloaded for ${inspection.id}`, 'success');
    } catch (err) {
      console.error('PDF Generation failed:', err);
      showToast('Could not generate PDF directly. Opening report preview memo...', 'warning');
      navigateTo(`/inspections/${inspection.id}/report`);
    }
  };

  if (!inspection) {
    return (
      <AppShell breadcrumbs={[{ label: 'Inspection Not Found' }]}>
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-2xs max-w-md mx-auto my-12">
          <p className="text-slate-600 font-medium text-sm">Inspection record not found.</p>
          <button
            type="button"
            onClick={() => navigateTo('/inspections')}
            className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            Return to Registry
          </button>
        </div>
      </AppShell>
    );
  }

  const handleSaveNotes = () => {
    saveDraftInspection({
      ...inspection,
      reviewerOverallNotes: notes,
    });
    showToast('Inspector summary notes saved', 'info');
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Inspections', route: '/inspections' },
        { label: inspection.id },
        { label: 'Analysis Result' },
      ]}
    >
      <div className="space-y-6">
        {/* Clean Workflow Stepper */}
        <Stepper currentStep="review" />

        {/* DIRECT PROMINENT REPORT GENERATION & PDF DOWNLOAD BANNER */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-blue-700/60 rounded-xl p-4 sm:p-5 shadow-sm text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-blue-500/30 text-blue-200 px-2.5 py-0.5 rounded border border-blue-400/30 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Analysis Complete
              </span>
              <span className="text-xs text-blue-200/80 font-medium">
                • PCR 2011 Verified Declarations
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Statutory Form 1 Inspection Report Ready
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Optical OCR and regulatory rules verified. Directly download the official Form 1 inspection memo in PDF form or open the complete preview canvas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              title="Directly download official Form 1 PDF report"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download Report (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo(`/inspections/${inspection.id}/report`)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              title="Generate and view full statutory report memo"
            >
              <FileText className="w-4 h-4 text-blue-100" />
              <span>Generate Form 1 Memo</span>
            </button>
          </div>
        </div>

        {/* Clean Inspection Overview Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded font-bold border border-slate-200">
                {inspection.id}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-600 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {inspection.inspectionDate}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {inspection.jurisdiction}
              </span>
              {inspection.isDemo && (
                <span className="text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded uppercase">
                  Reference Benchmark
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {inspection.product.brand} {inspection.product.name} ({inspection.product.declaredQuantity})
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Auto-Extracted from Package Scan
              </span>
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              <span>Store: <strong className="text-slate-800 font-semibold">{inspection.business.name}</strong> • {inspection.business.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={inspection.status} size="lg" />
          </div>
        </div>

        {/* Specialized Assistive Inspection Tool Suite */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Assistive Tools:
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
              PCR 2011 Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:flex sm:items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setIsPhysicalModalOpen(true)}
              className="w-full sm:w-auto min-h-[38px] px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span>Calibrated Optical Caliper (Rule 13)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOnlineModalOpen(true)}
              className="w-full sm:w-auto min-h-[38px] px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span>Physical vs. Online Audit (Rule 6(10))</span>
            </button>
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <MetricCard
            label="Compliance Status"
            value="Review Required"
            subtext="Rule check active"
            icon={AlertTriangle}
            variant="amber"
          />
          <MetricCard
            label="Extracted Markings"
            value={inspection.extractedFields.length}
            subtext="Mandatory declarations"
            icon={Tag}
            variant="blue"
          />
          <MetricCard
            label="Audit Points"
            value={inspection.findings.length}
            subtext="Flagged for review"
            icon={AlertTriangle}
            variant="amber"
          />
          <MetricCard
            label="Evidence Panels"
            value={inspection.evidence.length}
            subtext="Registered images"
            icon={Layers}
            variant="emerald"
          />
        </div>

        {/* Neatly Arranged Segmented Tab Navigation */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          {/* Horizontally Scrollable Tabs on Mobile */}
          <div className="px-3 sm:px-6 pt-2 sm:pt-3 border-b border-slate-200 bg-slate-50/60 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 sm:gap-4 min-w-max pb-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('FINDINGS')}
                className={`py-2 px-2.5 sm:py-2.5 sm:px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 min-h-[38px] ${
                  activeTab === 'FINDINGS'
                    ? 'border-blue-600 text-blue-700 bg-white/60 sm:bg-transparent rounded-t-md'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Findings ({inspection.findings.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('MARKINGS')}
                className={`py-2 px-2.5 sm:py-2.5 sm:px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 min-h-[38px] ${
                  activeTab === 'MARKINGS'
                    ? 'border-blue-600 text-blue-700 bg-white/60 sm:bg-transparent rounded-t-md'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Declarations ({inspection.extractedFields.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('EVIDENCE')}
                className={`py-2 px-2.5 sm:py-2.5 sm:px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 min-h-[38px] ${
                  activeTab === 'EVIDENCE'
                    ? 'border-blue-600 text-blue-700 bg-white/60 sm:bg-transparent rounded-t-md'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Shelf Photos ({inspection.images.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('NOTES')}
                className={`py-2 px-2.5 sm:py-2.5 sm:px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 min-h-[38px] ${
                  activeTab === 'NOTES'
                    ? 'border-blue-600 text-blue-700 bg-white/60 sm:bg-transparent rounded-t-md'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>Inspector Remarks</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Findings */}
          {activeTab === 'FINDINGS' && (
            <div className="divide-y divide-slate-100">
              {inspection.findings.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-800">No Non-Compliance Items Flagged</p>
                  <p className="text-slate-500 mt-1">All verified declarations comply with PCR 2011 Schedule II requirements.</p>
                </div>
              ) : (
                inspection.findings.map((finding) => (
                  <div key={finding.id} className="p-4 sm:p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                            {finding.id}
                          </span>
                          <StatusBadge status={finding.severity} size="sm" />
                          <span className="text-slate-400">•</span>
                          <span className="text-xs text-slate-500 font-medium">
                            Field: {finding.relatedField}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {finding.title}
                        </h3>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase font-mono self-start shrink-0 ${
                          finding.confidence === 'HIGH'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {finding.confidence} Confidence
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                      {finding.description}
                    </p>

                    {finding.ruleReference && (
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 font-mono">
                        Rule Citation: <strong>{finding.ruleReference}</strong>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>Evidence: <strong className="font-mono text-slate-700">{finding.evidenceIds.join(', ')}</strong></span>
                        <span>•</span>
                        <StatusBadge status={finding.reviewStatus} size="sm" />
                      </div>

                      <button
                        type="button"
                        onClick={() => navigateTo(`/inspections/${inspection.id}/evidence`)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Inspect Evidence</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Extracted Declarations */}
          {activeTab === 'MARKINGS' && (
            <div className="p-4 sm:p-6">
              <ExtractedFieldsPanel fields={inspection.extractedFields} />
            </div>
          )}

          {/* Tab 3: Product Photos */}
          {activeTab === 'EVIDENCE' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Registered photographic evidence captured on store shelves. Click any panel to launch high-resolution bounding box audit.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo(`/inspections/${inspection.id}/upload`)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                >
                  Add More Photos
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {inspection.images.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => navigateTo(`/inspections/${inspection.id}/evidence`)}
                    className="border border-slate-200 rounded-xl p-3 bg-slate-50 cursor-pointer hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-3/4 bg-white rounded-lg overflow-hidden mb-2 border border-slate-200">
                      <img src={img.dataUrl} alt={img.role} className="w-full h-full object-contain p-1" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 truncate">{img.role}</p>
                      <p className="text-[10px] text-slate-500 truncate">{img.filename}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Inspector Remarks & Store Context */}
          {activeTab === 'NOTES' && (
            <div className="p-4 sm:p-6 space-y-6 max-w-3xl">
              {/* Store Context Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Establishment Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Store Name</span>
                    <span className="font-medium text-slate-800">{inspection.business.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Establishment Type</span>
                    <span className="font-medium text-slate-800">{inspection.business.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Inspection Type</span>
                    <span className="font-medium text-slate-800">{inspection.inspectionType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Field Context</span>
                    <span className="font-medium text-slate-800">{inspection.context.source}</span>
                  </div>
                </div>
              </div>

              {/* Remarks Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Inspector Observations &amp; Verification Remarks
                  </label>
                  <span className="text-[10px] text-slate-400">Printed on official Form 1 memo</span>
                </div>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter overall inspector observations, sampling conclusions, or directives..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-800 leading-relaxed"
                />
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Remarks</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clean Bottom Action Bar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
            <button
              type="button"
              onClick={() => navigateTo(`/inspections/${inspection.id}/upload`)}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photos</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo(`/inspections/${inspection.id}/evidence`)}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Evidence Panels</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="min-h-[44px] px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-lg shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo(`/inspections/${inspection.id}/report`)}
              className="min-h-[44px] px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 active:scale-98 rounded-lg shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Form 1 Memo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
              reviewerOverallNotes: `${notes}\n[Physical Measurement]: Measured ${data.measuredMm}mm (Req: ${data.expectedMinMm}mm, Result: ${data.result})`,
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
              reviewerOverallNotes: `${notes}\n[Online Audit ${compData.platform}]: Status ${compData.overallStatus}`,
            });
            showToast(`E-Commerce comparison with ${compData.platform} saved`, 'success');
          }}
        />
      </div>
    </AppShell>
  );
};
