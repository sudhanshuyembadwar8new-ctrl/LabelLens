import React, { useState } from 'react';
import { Inspection, Inspector } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Printer,
  ArrowLeft,
  LayoutDashboard,
  Building2,
  PackageCheck,
  Camera,
  FileText,
  AlertTriangle,
  CheckCircle2,
  BookmarkCheck,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { OfficialEmblem } from '../ui/OfficialEmblem';
import { generateInspectionReportPDF } from '../../services/inspectionReportPdf';

interface ReportCanvasProps {
  inspection: Inspection;
  inspector: Inspector;
  onBackToEvidence: () => void;
  onReturnDashboard: () => void;
  onSaveDraft: () => void;
  onMarkComplete?: () => void;
}

export const ReportCanvas: React.FC<ReportCanvasProps> = ({
  inspection,
  inspector,
  onBackToEvidence,
  onReturnDashboard,
  onSaveDraft,
  onMarkComplete,
}) => {
  const [mobileViewMode, setMobileViewMode] = useState<'cards' | 'table'>('cards');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    generateInspectionReportPDF(inspection, inspector);
  };

  const isAlreadyCompleted =
    inspection.status === 'REPORT_READY' || inspection.status === 'VERIFIED';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Action Toolbar (Screen Only - Touch Friendly & Clean on Mobile) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-4 shadow-2xs print:hidden space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onBackToEvidence}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Evidence</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Record:</span>
              <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {inspection.id}
              </span>
            </div>
            <button
              type="button"
              onClick={onReturnDashboard}
              className="sm:hidden min-h-[40px] px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Mobile View Toggle (Cards vs Table) */}
            <div className="sm:hidden grid grid-cols-2 border border-slate-200 rounded-lg overflow-hidden bg-slate-100 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setMobileViewMode('cards')}
                className={`py-1.5 rounded-md font-bold transition-all cursor-pointer text-center ${
                  mobileViewMode === 'cards'
                    ? 'bg-white text-blue-900 shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                Cards View
              </button>
              <button
                type="button"
                onClick={() => setMobileViewMode('table')}
                className={`py-1.5 rounded-md font-bold transition-all cursor-pointer text-center ${
                  mobileViewMode === 'table'
                    ? 'bg-white text-blue-900 shadow-2xs'
                    : 'text-slate-600'
                }`}
              >
                Table View
              </button>
            </div>

            <div className="grid grid-cols-1 sm:flex sm:items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="min-h-[44px] px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-lg flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                title="Download official Form 1 Inspection Memo as PDF"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Report</span>
              </button>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="min-h-[40px] px-3.5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Memo</span>
                </button>

                {onMarkComplete && !isAlreadyCompleted && (
                  <button
                    type="button"
                    onClick={onMarkComplete}
                    className="min-h-[40px] px-3.5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-slate-900 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    title="Mark inspection complete and sync to Admin Portal"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Submit</span>
                  </button>
                )}

                {isAlreadyCompleted && (
                  <span className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Synced</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onReturnDashboard}
                className="hidden sm:flex min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Paper-Like Statutory Report Canvas (Form 1 - Clean, Crisp, & Structured) */}
      <div
        id="statutory-inspection-sheet"
        className="bg-white border border-slate-300/80 rounded-xl shadow-xs max-w-4xl mx-auto p-4 sm:p-7 md:p-10 relative text-slate-900 font-sans print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none"
      >
        {/* ===================================================================
            HEADER: Sovereign & Directorate Official Identity
            =================================================================== */}
        <div className="border-b-2 border-slate-900 pb-4 sm:pb-5 mb-5 sm:mb-6 official-header report-page-break-avoid">
          {/* Top Logo Bar */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <OfficialEmblem type="india" size="md" />
              <div className="hidden xs:block">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-600 leading-tight">
                  GOVERNMENT OF INDIA
                </p>
                <p className="text-[9px] font-semibold text-slate-500 uppercase">
                  Dept. of Consumer Affairs
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono font-bold text-slate-700">
                FORM 1 &bull; RULE 6 STATUTORY RECORD
              </span>
            </div>
          </div>

          {/* Central Title */}
          <div className="text-center sm:text-left pt-1">
            <h1 className="text-base sm:text-xl font-black tracking-tight uppercase text-slate-950 leading-tight">
              LEGAL METROLOGY (PCR 2011) STATUTORY INSPECTION SHEET
            </h1>
            <p className="text-xs font-semibold text-slate-700 mt-1">
              Directorate of Legal Metrology &bull; Department of Consumer Affairs
            </p>
            <p className="text-[10px] font-mono text-slate-500 mt-0.5">
              Enforcement Wing &bull; Legal Metrology Act 2009 (1 of 2010) &bull; Packaged Commodities Rules 2011
            </p>
          </div>

          {/* Record Identity Strip */}
          <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Inspection ID:</span>
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                {inspection.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Legal Status:</span>
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded border border-amber-300 bg-amber-50 text-amber-900">
                {inspection.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Notice of Form 1 Statutory Draft Record */}
        <div className="mb-5 sm:mb-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-600 report-page-break-avoid">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-700 shrink-0" />
            <span className="font-bold text-slate-900">
              FORM 1 INSPECTION RECORD: Digital Verification Record under PCR 2011
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 shrink-0">
            Inspection Date: {inspection.inspectionDate || new Date().toLocaleDateString('en-GB')}
          </span>
        </div>

        {/* ===================================================================
            SECTION 1 & 2: Inspector Particulars & Surveillance Context
            =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 sm:mb-6 text-xs report-page-break-avoid">
          {/* Card 1: Authorized Inspector */}
          <div className="border border-slate-200 rounded-lg p-3.5 sm:p-4 bg-slate-50/70 space-y-2">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200/80">
              <span>Authorized Inspection Officer</span>
            </h2>
            <p className="font-black text-slate-950 text-sm">{inspector.name}</p>
            <div className="space-y-1.5 text-slate-600 pt-1">
              <div className="flex flex-col xs:flex-row xs:justify-between gap-0.5">
                <span className="text-slate-500 font-medium">Designation / ID:</span>
                <span className="font-semibold text-slate-800">{inspector.designation} ({inspector.id})</span>
              </div>
              <div className="flex flex-col xs:flex-row xs:justify-between gap-0.5">
                <span className="text-slate-500 font-medium">Office:</span>
                <span className="font-semibold text-slate-800">{inspector.office}</span>
              </div>
              <div className="flex flex-col xs:flex-row xs:justify-between gap-0.5">
                <span className="text-slate-500 font-medium">Jurisdiction Circle:</span>
                <span className="font-bold text-blue-900">{inspection.jurisdiction}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Inspection Particulars */}
          <div className="border border-slate-200 rounded-lg p-3.5 sm:p-4 bg-slate-50/70 space-y-2">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200/80">
              <span>Inspection Context</span>
            </h2>
            <div className="space-y-1.5 text-slate-600 pt-1">
              <div className="flex flex-col xs:flex-row xs:justify-between gap-0.5">
                <span className="text-slate-500 font-medium">Inspection Date:</span>
                <span className="font-semibold text-slate-800">{inspection.inspectionDate}</span>
              </div>
              <div className="flex flex-col xs:flex-row xs:justify-between gap-0.5">
                <span className="text-slate-500 font-medium">Surveillance Mode:</span>
                <span className="font-semibold text-slate-800">{inspection.inspectionType || 'Retail Store Routine Check'}</span>
              </div>
              <div className="flex flex-col xs:flex-row xs:justify-between gap-0.5">
                <span className="text-slate-500 font-medium">Sampling Source:</span>
                <span className="font-semibold text-slate-800">{inspection.context.source || 'Retail Shelf Sample'}</span>
              </div>
              <div className="flex flex-col xs:flex-row xs:justify-between gap-0.5">
                <span className="text-slate-500 font-medium">Verification Engine:</span>
                <span className="font-mono text-slate-800 font-bold">LabelLens Stage 1 Seed v1.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 3 & 4: Commercial Unit & Packaged Commodity Details
            =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 sm:mb-6 text-xs report-page-break-avoid">
          {/* Card 1: Commercial Unit */}
          <div className="border border-slate-200 rounded-lg p-3.5 sm:p-4 bg-white space-y-2">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Establishment / Commercial Unit</span>
            </h2>
            <p className="font-extrabold text-slate-950 text-sm">{inspection.business.name || 'Local Retail Outlet'}</p>
            <div className="space-y-1.5 text-slate-600 pt-1">
              <div className="flex flex-col xs:flex-row xs:justify-between gap-0.5">
                <span className="text-slate-500 font-medium">Store Type:</span>
                <span className="font-semibold text-slate-800">{inspection.business.type || 'Supermarket / Grocery'}</span>
              </div>
              <div className="bg-slate-50 rounded-md p-2 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Premises Address:</span>
                <p className="text-slate-800 font-medium text-xs mt-0.5">
                  {inspection.business.address || 'Central Market, Sector 17, 110001'}
                </p>
              </div>
              {inspection.business.contact && (
                <p className="text-slate-500 font-mono text-[11px]">
                  Phone / Contact: {inspection.business.contact}
                </p>
              )}
            </div>
          </div>

          {/* Card 2: Packaged Commodity */}
          <div className="border border-slate-200 rounded-lg p-3.5 sm:p-4 bg-white space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <PackageCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>Packaged Commodity Details</span>
              </h2>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                Auto-Extracted via Scanner
              </span>
            </div>
            <div className="space-y-1.5 text-slate-600 pt-1">
              <div className="flex flex-col xs:flex-row xs:justify-between gap-0.5">
                <span className="text-slate-500 font-medium">Brand Name:</span>
                <span className="font-black text-slate-950 text-xs">{inspection.product.brand || 'Bikaji'}</span>
              </div>
              <div className="flex flex-col xs:flex-row xs:justify-between gap-0.5">
                <span className="text-slate-500 font-medium">Product / Commodity:</span>
                <span className="font-semibold text-slate-800">{inspection.product.name || 'Soya Sticks'}</span>
              </div>
              <div className="flex flex-col xs:flex-row xs:justify-between gap-0.5">
                <span className="text-slate-500 font-medium">Commodity Category:</span>
                <span className="font-semibold text-slate-800">{inspection.product.category || 'Food / Namkeen'}</span>
              </div>
              {/* Highlighted Net Quantity Block */}
              <div className="bg-slate-50 rounded-md p-2 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-700 font-semibold text-xs">Declared Net Quantity:</span>
                <span className="font-mono font-black text-slate-950 text-xs bg-white px-2.5 py-1 rounded border border-slate-300 shadow-2xs">
                  {inspection.product.declaredQuantity || '200 g'}
                </span>
              </div>
              <div className="flex flex-col xs:flex-row xs:justify-between gap-0.5">
                <span className="text-slate-500 font-medium">Package Format:</span>
                <span className="font-semibold text-slate-800">{inspection.product.packageType || 'Flexible Pouch'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 5: Registered Photographic Evidence (Clean, Un-mixed Frames)
            =================================================================== */}
        <div className="mb-5 sm:mb-6 border border-slate-200 rounded-lg p-3.5 sm:p-4 evidence-block report-page-break-avoid">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-blue-700" />
            <span>Registered Photographic Evidence ({inspection.images.length} Panels)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {inspection.images.map((img, idx) => (
              <div
                key={img.id || idx}
                className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/60 flex flex-col items-center report-page-break-avoid"
              >
                <div className="w-full h-40 sm:h-48 bg-slate-900/5 rounded-md overflow-hidden flex items-center justify-center mb-2.5 border border-slate-200">
                  <img
                    src={img.dataUrl}
                    alt={img.role || 'Evidence image'}
                    className="max-h-full max-w-full object-contain evidence-thumb"
                  />
                </div>
                <div className="w-full flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-900 truncate">{img.role}</p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">{img.filename}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                    {img.width} &times; {img.height}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================
            SECTION 6: Observed Declarations (PCR 2011 Schedule II)
            Clear separation of each field so data NEVER overlaps or mixes
            =================================================================== */}
        <div className="mb-5 sm:mb-6 report-page-break-avoid">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-700" />
              <span>Observed Declarations (PCR 2011 Schedule II)</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">
              {inspection.extractedFields.length} statutory fields verified
            </span>
          </div>

          {/* Desktop & Print Table View */}
          <div className={`${mobileViewMode === 'cards' ? 'hidden sm:block' : 'block'} print:block border border-slate-200 rounded-lg overflow-x-auto`}>
            <table className="w-full text-left text-xs border-collapse min-w-[550px]">
              <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Statutory Field</th>
                  <th className="py-2.5 px-3">Observed Marking</th>
                  <th className="py-2.5 px-3">Package Panel</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3 text-right sm:text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inspection.extractedFields.map((field) => (
                  <tr key={field.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {field.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-950">
                      {field.value}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                      {field.source}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {field.confidence}
                    </td>
                    <td className="py-2.5 px-3 text-right sm:text-left">
                      <StatusBadge status={field.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Completely eliminates clutter & data mixing on phones) */}
          <div className={`${mobileViewMode === 'cards' ? 'block sm:hidden' : 'hidden'} print:hidden space-y-2.5`}>
            {inspection.extractedFields.map((field) => (
              <div
                key={field.id}
                className="border border-slate-200 rounded-lg p-3 bg-white shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                  <span className="font-bold text-slate-900 text-xs">{field.name}</span>
                  <StatusBadge status={field.status} size="sm" />
                </div>

                {/* Isolated Observed Marking Box - High Contrast & Unmixed */}
                <div className="bg-slate-50 rounded-md p-2.5 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Observed Package Marking:
                  </span>
                  <p className="font-mono font-bold text-slate-950 text-xs break-words leading-relaxed">
                    {field.value}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Panel: <strong className="text-slate-700">{field.source}</strong></span>
                  <span className="font-mono text-slate-400">Match: {field.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================
            SECTION 7: Inspection Findings & Non-Compliance Points
            =================================================================== */}
        <div className="mb-5 sm:mb-6 report-page-break-avoid">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Findings &amp; Potential Non-Compliance Observations</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">
              {inspection.findings.length} findings logged
            </span>
          </div>

          {/* Desktop & Print Table View */}
          <div className={`${mobileViewMode === 'cards' ? 'hidden sm:block' : 'block'} print:block border border-slate-200 rounded-lg overflow-x-auto`}>
            <table className="w-full text-left text-xs border-collapse min-w-[650px]">
              <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Finding Title &amp; Explanation</th>
                  <th className="py-2.5 px-3">Applicable Rule</th>
                  <th className="py-2.5 px-3 text-right sm:text-left">Review Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inspection.findings.map((f) => (
                  <tr key={f.id} className="align-top hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {f.id}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={f.severity} size="sm" />
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-900">{f.title}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{f.description}</p>
                      {f.evidenceIds && f.evidenceIds.length > 0 && (
                        <p className="text-[10px] font-mono text-blue-700 mt-1">
                          Linked Evidence: {f.evidenceIds.join(', ')}
                        </p>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-700 font-medium">
                      {f.ruleReference || 'PCR 2011 Schedule II'}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-right sm:text-left">
                      <StatusBadge status={f.reviewStatus} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Clean & Spacious on phones!) */}
          <div className={`${mobileViewMode === 'cards' ? 'block sm:hidden' : 'hidden'} print:hidden space-y-2.5`}>
            {inspection.findings.map((f) => (
              <div
                key={f.id}
                className="border border-slate-200 rounded-lg p-3.5 bg-white shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                    {f.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={f.severity} size="sm" />
                    <StatusBadge status={f.reviewStatus} size="sm" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-xs">{f.title}</h3>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{f.description}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-md border border-slate-100 space-y-1 text-[11px]">
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-500">Applicable Rule:</span>{' '}
                    <span className="font-medium text-slate-900">{f.ruleReference || 'PCR 2011 Schedule II'}</span>
                  </p>
                  {f.evidenceIds && f.evidenceIds.length > 0 && (
                    <p className="font-mono text-blue-700 text-[10px]">
                      Linked Evidence: {f.evidenceIds.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================
            SECTION 8: Inspector Findings Summary & Directives
            =================================================================== */}
        <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 border border-slate-200 rounded-lg bg-slate-50/70 text-xs report-page-break-avoid space-y-1.5">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
            <span>Inspector Findings Summary &amp; Directives</span>
          </h2>
          <p className="text-slate-800 leading-relaxed font-sans whitespace-pre-wrap pt-0.5">
            {inspection.reviewerOverallNotes ||
              'Inspection observations compiled from retail packaged samples. Packaging declarations cross-verified against PCR 2011 standard guidelines. Notice recommended to packer regarding price marking inclusive-of-taxes syntax.'}
          </p>
        </div>

        {/* ===================================================================
            SECTION 9: Verification Sign-off & Supervisory Seal
            =================================================================== */}
        <div className="mt-8 pt-5 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-xs signoff-block report-page-break-avoid">
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Inspector Verification Sign-Off
            </p>
            <div className="h-12 sm:h-14 border-b border-dashed border-slate-400 flex items-end pb-1">
              <span className="font-serif italic text-slate-900 text-sm font-semibold">
                {inspector.name} ({inspector.id})
              </span>
            </div>
            <p className="text-[11px] text-slate-700 font-bold">
              Authorized Signature &bull; {inspector.designation}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">Date: {inspection.inspectionDate}</p>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Supervisory Office Seal &amp; Stamping
            </p>
            <div className="h-12 sm:h-14 border border-dashed border-slate-400 rounded-md flex items-center justify-center text-slate-600 text-[11px] bg-slate-50 font-mono font-bold">
              [ OFFICIAL {inspection.jurisdiction.toUpperCase()} SEAL ]
            </div>
            <p className="text-[11px] text-slate-700 font-semibold">
              {inspector.office}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">National Enforcement Portal</p>
          </div>
        </div>

        {/* ===================================================================
            SECTION 10: Legal Metrology Form 1 Disclaimer Footer
            =================================================================== */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono no-print-margin">
          Form 1 Statutory Inspection Draft &bull; Digital Compliance Evaluation under Legal Metrology Act 2009 &amp; Packaged Commodities Rules 2011 &bull; Directorate of Legal Metrology
        </div>
      </div>
    </div>
  );
};
