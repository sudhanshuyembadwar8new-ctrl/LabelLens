import React, { useState } from 'react';
import {
  User,
  MapPin,
  Sparkles,
  Info,
  RefreshCw,
  Scale,
  ShieldCheck,
  Building,
  FileCode,
  Download,
  Cpu,
  Layers,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';
import { AppShell } from '../components/layout/AppShell';
import { generateTechnicalDossierPDF } from '../services/technicalDossierPdf';

type SettingsTab = 'system' | 'profile' | 'jurisdiction' | 'research' | 'about';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    resetDemoData,
    showToast,
  } = useInspection();

  const [activeTab, setActiveTab] = useState<SettingsTab>('research');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Profile form state
  const [name, setName] = useState(currentUser.name);
  const [designation, setDesignation] = useState(currentUser.designation);
  const [office, setOffice] = useState(currentUser.office);
  const [jurisdiction, setJurisdiction] = useState(currentUser.jurisdiction);

  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      generateTechnicalDossierPDF();
      showToast('Technical Research Dossier (PDF) generated and downloaded successfully!', 'info');
    } catch (err) {
      console.error('Failed to generate PDF', err);
      showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      designation,
      office,
      jurisdiction,
    });
    showToast('Inspector credentials and jurisdiction updated', 'info');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Reset registry test data? This will restore baseline records, inspections, and clear any local drafts.'
      )
    ) {
      resetDemoData();
      showToast('Registry restored to baseline benchmark state', 'info');
    }
  };

  return (
    <AppShell breadcrumbs={[{ label: 'System Settings & Configuration' }]}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            System Settings &amp; Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure officer credentials, review statutory rule sets, or reset benchmark data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          {/* Left Tab Navigation */}
          <div className="md:col-span-4 border-r border-slate-200 bg-slate-50 p-3 space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('system')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'system'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Registry &amp; Benchmark Data</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Inspector Profile &amp; ID</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('jurisdiction')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'jurisdiction'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Jurisdiction &amp; Statutory Rules</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('research')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'research'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Technical Research &amp; Whitepaper</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About LabelLens System</span>
            </button>
          </div>

          {/* Right Tab Content */}
          <div className="md:col-span-8 p-6">
            {/* System / Benchmark Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Registry &amp; Benchmark Calibration
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage baseline reference packages and field ledger synchronization
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-950 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-blue-950">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>Deterministic Regulatory Analysis Engine</span>
                  </div>
                  <p className="text-blue-900 leading-relaxed text-[11px]">
                    Analysis workflows strictly execute mathematical and statutory checks according to the Legal Metrology (Packaged Commodities) Rules, 2011. Font heights, unit sale pricing, and mandatory declarations are evaluated deterministically.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Reset Registry to Factory Baseline
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Restores initial reference records (INS-2026-0042 &amp; INS-2026-0043) and resets local inspector notes.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetData}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Data</span>
                    </button>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <h4 className="text-xs font-bold text-slate-900 mb-1">
                      Reference Benchmark Package Specifications
                    </h4>
                    <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                      <li><strong>Primary Benchmark:</strong> Annapurna Premium Rice 5 kg (Poly pack)</li>
                      <li><strong>Observation 1:</strong> Declared quantity font height (3.2mm vs 4.0mm requirement under Rule 13)</li>
                      <li><strong>Observation 2:</strong> Retail sale price phrasing (Missing standard &apos;inclusive of all taxes&apos; suffix under Rule 6(1)(e))</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Inspector Identity &amp; Station
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorized officer details populated on official Form 1 inspection sheets
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Inspector Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Jurisdiction Division
                    </label>
                    <select
                      value={jurisdiction}
                      onChange={(e) => setJurisdiction(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 font-medium"
                    >
                      <option value="Pune Division">Pune Division</option>
                      <option value="Mumbai Metropolitan">Mumbai Metropolitan</option>
                      <option value="Nagpur Division">Nagpur Division</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Divisional Office
                    </label>
                    <input
                      type="text"
                      value={office}
                      onChange={(e) => setOffice(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Save Inspector Profile
                  </button>
                </div>
              </form>
            )}

            {/* Jurisdiction & Legal Rules Tab */}
            {activeTab === 'jurisdiction' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Statutory Rules in Effect
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Legal framework governing automated checking and manual inspector validation
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Scale className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Legal Metrology (Packaged Commodities) Rules, 2011 (PCR 2011)
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Mandatory declarations under Rule 6: Name and address of manufacturer/packer, common or generic name of commodity, net quantity, month and year of manufacture/packing, retail sale price (MRP inclusive of all taxes), consumer care details, and country of origin.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex items-start gap-2.5">
                    <Building className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Schedule II (Area of Principal Display Panel &amp; Minimum Font Height)
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Specifies typography size thresholds: For packages exceeding 1 kg up to 5 kg, minimum numeral font height of declared quantity is 4.0 mm (or 6.0 mm depending on display area).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Technical Research & Whitepaper Tab */}
            {activeTab === 'research' && (
              <div className="space-y-6 text-xs">
                {/* Header & Download PDF Callout */}
                <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600 text-blue-100 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                        System Whitepaper
                      </span>
                      <span className="text-[11px] text-blue-200">
                        Version 2.4.0 • September 2026
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      LabelLens Technical Research &amp; Architectural Dossier
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Complete specifications of all software libraries, computer vision algorithms, statutory PCR 2011 rule evaluation engines, and multimodal AI pipelines.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Whitepaper (PDF)'}</span>
                  </button>
                </div>

                {/* Section 1: Software Stack & Versions */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-blue-700" />
                    <span>1. Technology Stack &amp; Library Version Matrix</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">React</span>
                        <span className="font-mono text-[11px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">v19.0.1</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong>Why used:</strong> Concurrent rendering engine with automatic batching and fine-grained state updates, critical for high-framerate 60 FPS Canvas 2D image manipulations without lag on mobile devices.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">TypeScript</span>
                        <span className="font-mono text-[11px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">v5.8.2</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong>Why used:</strong> Enforces compile-time type verification across complex statutory data models, OCR bounding box coordinate matrices, and statutory exemption rules, eliminating runtime crashes.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Vite &amp; Plugin</span>
                        <span className="font-mono text-[11px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">v6.2.3 / v5.0.4</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong>Why used:</strong> Native ESM architecture provides lightning-fast cold starts and optimized production rollup bundling with minimal artifact size for Cloud Run deployments.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Tailwind CSS</span>
                        <span className="font-mono text-[11px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">v4.1.14</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong>Why used:</strong> Zero-runtime styling with native CSS nesting, responsive touch-target ergonomics, and pixel-precise print media stylesheets for Form 1 statutory certificates.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Express &amp; TSX</span>
                        <span className="font-mono text-[11px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">v4.21.2 / v4.21.0</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong>Why used:</strong> Handles API proxying, cross-device inspection sync, JSON persistence, and isolates Gemini API credentials strictly on the backend.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Google GenAI SDK</span>
                        <span className="font-mono text-[11px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">v2.4.0 (Gemini 3.8 Flash)</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong>Why used:</strong> DeepMind multimodal vision model capable of sub-second extraction of multilingual Indian script (English, Devanagari, Marathi) with precise coordinate bounding boxes.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Motion</span>
                        <span className="font-mono text-[11px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">v12.23.24</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong>Why used:</strong> GPU-accelerated layout transitions, stepper progress indicators, and interactive caliper tool physics.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">jsPDF</span>
                        <span className="font-mono text-[11px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">v4.0.0</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong>Why used:</strong> Client-side vector PDF generation allowing instant offline compilation and download of statutory reports and this technical dossier.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Computer Vision Algorithms */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-700" />
                    <span>2. Computer Vision &amp; Optical Preprocessing Engine</span>
                  </h3>

                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3 text-[11px] text-slate-600">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900">A. Dynamic Histogram Auto-Gain &amp; Exposure Adjustment</h4>
                      <p className="leading-relaxed">
                        Computes min and max luminance across the image pixels and applies linear contrast stretching: <code className="bg-slate-200 px-1 rounded font-mono">Y_norm = ((Y - Y_min) / (Y_max - Y_min)) * 255</code>. Recovers low-contrast dot-matrix batch codes on dark foils.
                      </p>
                    </div>

                    <div className="space-y-1 border-t border-slate-200 pt-2.5">
                      <h4 className="font-bold text-slate-900">B. 3x3 Laplacian Unsharp Mask Convolution</h4>
                      <p className="leading-relaxed">
                        Applies a high-pass spatial convolution matrix <code className="bg-slate-200 px-1 rounded font-mono">[[0, -1, 0], [-1, 5, -1], [0, -1, 0]]</code> to sharpen numeral edges, barcodes, and micro-print statutory declarations, improving OCR accuracy on low-resolution mobile cameras.
                      </p>
                    </div>

                    <div className="space-y-1 border-t border-slate-200 pt-2.5">
                      <h4 className="font-bold text-slate-900">C. Trigonometric Cylindrical Surface Unwarping</h4>
                      <p className="leading-relaxed">
                        Eliminates barrel distortion from curved beverage bottles and cans. Given cylinder radius <code className="bg-slate-200 px-1 rounded font-mono">R</code> and center <code className="bg-slate-200 px-1 rounded font-mono">cx</code>, unrolls curved coordinates using inverse arcsin projection: <code className="bg-slate-200 px-1 rounded font-mono">x_flat = cx + R * arcsin((x - cx) / R)</code>.
                      </p>
                    </div>

                    <div className="space-y-1 border-t border-slate-200 pt-2.5">
                      <h4 className="font-bold text-slate-900">D. Adaptive Text Isolation &amp; Dual Binarization</h4>
                      <p className="leading-relaxed">
                        Evaluates local pixel neighborhood gradients to isolate declaration text from multicolored glossy branding, enabling crisp OCR extraction even against reflective metallic foil pouches.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Statutory Rules & Math */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-amber-700" />
                    <span>3. Statutory Rules Engine &amp; Mathematical Formulations</span>
                  </h3>

                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3 text-[11px] text-slate-600">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900">Rule 6(1)(e): MRP Tax Inclusion Validation</h4>
                      <p className="leading-relaxed">
                        Audits price declarations against mandatory statutory syntax: &quot;inclusive of all taxes&quot; or &quot;incl. of all taxes&quot;. Enforces the Indian Rupee symbol (₹) or &quot;MRP Rs.&quot; and detects unauthorized alteration stickers or dual-pricing.
                      </p>
                    </div>

                    <div className="space-y-1 border-t border-slate-200 pt-2.5">
                      <h4 className="font-bold text-slate-900">Rule 6(1)(da): Unit Sale Price (USP) Mathematical Model</h4>
                      <p className="leading-relaxed">
                        Computes <code className="bg-slate-200 px-1 rounded font-mono">USP = Total MRP / Declared Net Metric Quantity</code>. Enforces statutory unit hierarchy: For net quantity &gt; 1 kg or 1 L, USP must be declared per kg or per L. For &lt; 1 kg or 1 L, declared per g or per ml. For counted items, declared per piece (N). Validates within 0.1% rounding tolerance.
                      </p>
                    </div>

                    <div className="space-y-1 border-t border-slate-200 pt-2.5">
                      <h4 className="font-bold text-slate-900">Rule 13 &amp; Schedule II: Digital Caliper Font Height Verification</h4>
                      <p className="leading-relaxed">
                        Correlates Principal Display Panel (PDP) area with minimum legal numeral height (&le;200g: 2.0mm, 200g-500g: 3.0mm, 500g-1kg: 4.0mm, &gt;1kg: 4.0mm or 6.0mm for blown/embossed containers). Calibrated using on-screen standard reference tokens (credit card 85.6mm, coin 25mm).
                      </p>
                    </div>

                    <div className="space-y-1 border-t border-slate-200 pt-2.5">
                      <h4 className="font-bold text-slate-900">Rule 26: Statutory Exemption Verification</h4>
                      <p className="leading-relaxed">
                        Evaluates statutory exemptions: Rule 26(a) for small packages &le;10g or &le;10ml; Rule 26(b) for agricultural bags &gt;50kg; Rule 26(c) for instant restaurant food packets; and Rule 3 for non-retail industrial/institutional supplies.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 4: Full-Stack Architecture & Sync */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <span>4. Full-Stack Sync &amp; Privacy Architecture</span>
                  </h3>

                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2 text-[11px] text-slate-600">
                    <p className="leading-relaxed">
                      <strong>Cross-Device Synchronization:</strong> Inspection dossiers and administrative audit events are synchronized across tabs via the HTML5 BroadcastChannel API and across physical devices via the Express <code className="bg-slate-200 px-1 rounded font-mono">/api/sync</code> endpoint with disk persistence in <code className="bg-slate-200 px-1 rounded font-mono">/data/inspections.json</code>.
                    </p>
                    <p className="leading-relaxed">
                      <strong>Zero PII Collection:</strong> No employee personal information or sensitive private biometric data is stored. Only commercial retail store metadata (Store Name, Address, GSTIN) and commodity packaging compliance declarations are cataloged.
                    </p>
                    <p className="leading-relaxed">
                      <strong>Backend Secret Isolation:</strong> Gemini API keys and sensitive tokens are strictly maintained server-side in Node.js, completely inaccessible to client-side browser inspection.
                    </p>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Complete Technical PDF'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    About LabelLens Platform
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Digital Legal Metrology &amp; Statutory Compliance Intelligence
                  </p>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg space-y-3 bg-slate-50">
                  <div className="grid grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Statutory Framework</span>
                      <p className="font-bold text-slate-900">Legal Metrology Act, 2009</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Governing Rules</span>
                      <p className="font-mono font-bold text-blue-700">PCR 2011 (as amended)</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Software Classification</span>
                      <p className="font-semibold text-slate-900">Enforcement Assistive System</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Engine Version</span>
                      <p className="font-mono font-bold text-emerald-700">PCR-2011-V2.1</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                    <strong>Statutory Authority:</strong> LabelLens provides assistive computer-vision and rule-evaluation tools to support authorized Legal Metrology officers in rapid field verifications. All final enforcement determinations, notices, and compounding orders are subject to the officer&apos;s physical examination and statutory authority.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};
