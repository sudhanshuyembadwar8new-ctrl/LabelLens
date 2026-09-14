import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ClipboardList,
  FileCheck2,
  AlertTriangle,
  FileText,
  PlusCircle,
  Eye,
  Camera,
  Store,
  Sparkles,
  Search,
  Users,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  RotateCcw,
  Check,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Layers,
  Scale,
  Ruler,
  Send,
  Download,
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';
import { AppShell } from '../components/layout/AppShell';
import { MetricCard } from '../components/ui/MetricCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { InspectorProfileBanner } from '../components/ui/InspectorProfileBanner';
import { FirstTimeInspectorGuideModal } from '../components/workflow/FirstTimeInspectorGuideModal';
import { generateTechnicalDossierPDF } from '../services/technicalDossierPdf';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    teamInspectors,
    userRealInspections,
    demoInspection,
    loadReferenceBenchmark,
    switchRole,
    switchInspector,
    navigateTo,
    startNewInspection,
    setCurrentInspectionById,
    markInspectionComplete,
    isSyncing,
    lastSyncTime,
    forceSyncWithServer,
  } = useInspection();

  const [activeTab, setActiveTab] = useState<'INSPECTIONS' | 'DEMO' | 'GUIDE'>('INSPECTIONS');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Metrics: Derived strictly from actual prototype records for this inspector
  const totalRealInspections = userRealInspections.length;
  const draftCount = userRealInspections.filter((i) => i.status === 'DRAFT').length;
  const reviewRequiredCount = userRealInspections.filter((i) => i.status === 'REVIEW_REQUIRED').length;
  const reportReadyCount = userRealInspections.filter(
    (i) => i.status === 'REPORT_READY' || i.status === 'VERIFIED'
  ).length;

  const filteredInspections = useMemo(() => {
    if (!searchTerm.trim()) return userRealInspections;
    const term = searchTerm.toLowerCase();
    return userRealInspections.filter(
      (ins) =>
        ins.id.toLowerCase().includes(term) ||
        ins.business.name.toLowerCase().includes(term) ||
        ins.product.name.toLowerCase().includes(term) ||
        ins.product.brand.toLowerCase().includes(term)
    );
  }, [userRealInspections, searchTerm]);

  const handleOpenInspection = (id: string, targetTab: string = 'result') => {
    setCurrentInspectionById(id);
    navigateTo(`/inspections/${id}/${targetTab}`);
  };

  const handleStartNewInspection = () => {
    startNewInspection();
  };

  return (
    <AppShell breadcrumbs={[{ label: 'Inspector Workspace' }]}>
      <div className="space-y-6">
        {/* Officer Identity & Quick Action Header */}
        <InspectorProfileBanner />

        {/* Clean Teammate Switcher & Live HQ Sync Indicator */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-2xs flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
            <span className="font-semibold text-slate-500 flex items-center gap-1.5 shrink-0">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Inspector Account:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {teamInspectors.map((insp) => (
                <button
                  key={insp.id}
                  type="button"
                  onClick={() => switchInspector(insp.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    insp.id === currentUser.id
                      ? 'bg-blue-700 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title={`${insp.name} (${insp.id})`}
                >
                  {insp.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto pt-2 xl:pt-0 border-t border-slate-100 xl:border-t-0">
            {/* First-Time Inspector Induction Button */}
            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              title="View First-Time Inspector Step-by-Step SOP"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Inspector Guide (6 Steps)</span>
            </button>

            {/* Technical Research Whitepaper PDF */}
            <button
              type="button"
              onClick={() => generateTechnicalDossierPDF()}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              title="Download Full Technical Research & System Architecture Dossier (PDF)"
            >
              <Download className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span>Technical Whitepaper (PDF)</span>
            </button>

            {/* Real-time Link with Admin Portal */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium whitespace-nowrap">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="shrink-0">Linked to Admin Portal</span>
              <button
                type="button"
                onClick={() => forceSyncWithServer()}
                disabled={isSyncing}
                className="p-0.5 hover:bg-emerald-100 rounded text-emerald-700 cursor-pointer shrink-0"
                title="Force refresh synchronization"
              >
                <RotateCcw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => switchRole('ADMIN')}
              className="px-2.5 py-1 rounded-md bg-blue-50/60 hover:bg-blue-100 border border-blue-200 text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer transition-colors text-xs whitespace-nowrap"
            >
              <span>Directorate Admin View →</span>
            </button>
          </div>
        </div>

        {/* Inspector Personal Inspection Progress & Admin Synchronization Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                {currentUser.avatar || 'IN'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {currentUser.name}'s Personal Inspection Progress
                  </h3>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {currentUser.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Enforcement completion rate &amp; automatic live synchronization with Directorate Admin Portal
                </p>
              </div>
            </div>

            {/* Live Admin Linkage Tag */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Auto-Synced to Admin Prasad Gajulwar</span>
            </div>
          </div>

          {/* Visual Multi-Segment Progress Bar */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="font-bold text-slate-700">
                Overall Personal Enforcement Rate:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-sm text-slate-900">
                  {totalRealInspections > 0
                    ? `${Math.round((reportReadyCount / totalRealInspections) * 100)}% Complete`
                    : '0% (Ready for store scan)'}
                </span>
                <span className="text-slate-500 text-xs">
                  ({reportReadyCount} of {totalRealInspections} store inspections Form 1 completed)
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex border border-slate-200/80">
              {/* Completed portion (Green) */}
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{
                  width: totalRealInspections > 0 ? `${(reportReadyCount / totalRealInspections) * 100}%` : '0%',
                }}
                title={`${reportReadyCount} Completed & Endorsed`}
              />
              {/* Review Required portion (Amber) */}
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{
                  width: totalRealInspections > 0 ? `${(reviewRequiredCount / totalRealInspections) * 100}%` : '0%',
                }}
                title={`${reviewRequiredCount} Awaiting Review`}
              />
              {/* Draft portion (Blue) */}
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{
                  width: totalRealInspections > 0 ? `${(draftCount / totalRealInspections) * 100}%` : '0%',
                }}
                title={`${draftCount} In Draft`}
              />
            </div>

            {/* Breakdown Legend & Admin Linkage Callout */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <strong className="text-slate-700">{reportReadyCount}</strong> Completed &amp; Synced
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <strong className="text-slate-700">{reviewRequiredCount}</strong> Needs Review
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <strong className="text-slate-700">{draftCount}</strong> Drafts
                </span>
              </div>

              <div className="flex items-center gap-1 text-blue-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Admin portal reflects this progress automatically</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 Clean Metric Cards with Staggered Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          <MetricCard
            label="Store Visits"
            value={totalRealInspections}
            subtext="Recorded by your account"
            icon={ClipboardList}
            variant="default"
            onClick={() => navigateTo('/inspections')}
          />
          <MetricCard
            label="Needs Review"
            value={reviewRequiredCount}
            subtext="Rule compliance checks"
            icon={AlertTriangle}
            variant="amber"
            onClick={() => navigateTo('/inspections')}
          />
          <MetricCard
            label="Reports Ready"
            value={reportReadyCount}
            subtext="Verified statutory memos"
            icon={FileCheck2}
            variant="emerald"
            onClick={() => navigateTo('/inspections')}
          />
          <MetricCard
            label="Draft Records"
            value={draftCount}
            subtext="Visits in progress"
            icon={FileText}
            variant="blue"
            onClick={() => navigateTo('/inspections')}
          />
        </motion.div>

        {/* Organized Tabs for Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="px-3 sm:px-6 pt-2 sm:pt-3 border-b border-slate-200 flex items-center justify-between gap-3 overflow-x-auto bg-slate-50/50">
            <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('INSPECTIONS')}
                className={`py-2 sm:py-2.5 px-2.5 sm:px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'INSPECTIONS'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Store Inspections</span>
                <span className="ml-0.5 sm:ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {userRealInspections.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('DEMO')}
                className={`py-2 sm:py-2.5 px-2.5 sm:px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'DEMO'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Reference Benchmark</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('GUIDE')}
                className={`py-2 sm:py-2.5 px-2.5 sm:px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'GUIDE'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Guidelines</span>
              </button>
            </div>

            {activeTab === 'INSPECTIONS' && userRealInspections.length > 0 && (
              <div className="relative pb-2 w-44 sm:w-56 shrink-0 hidden sm:block">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter store records..."
                  className="w-full pl-8 pr-2.5 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            )}
          </div>

          {/* Tab 1: Real Store Inspections */}
          {activeTab === 'INSPECTIONS' && (
            <div>
              {userRealInspections.length === 0 ? (
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Induction Header */}
                  <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div className="space-y-2 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-blue-100 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          Official Field Induction
                        </span>
                        <span className="text-xs text-blue-200">
                          PCR 2011 SOP • Officer {currentUser.name}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        First-Time Field Inspector Guide: 6 Steps to Complete an Inspection
                      </h3>
                      <p className="text-xs text-blue-100/90 leading-relaxed">
                        Welcome to LabelLens. As a Legal Metrology officer, each inspection you complete will be automatically compiled into an official Form 1 Statutory Report and directly transmitted to the Directorate Admin Portal under your officer profile.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => setShowGuideModal(true)}
                        className="px-4 py-2.5 bg-white hover:bg-slate-100 text-blue-900 text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4 text-blue-700" />
                        <span>Interactive SOP Guide</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleStartNewInspection}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Start 1st Inspection Now</span>
                      </button>
                    </div>
                  </div>

                  {/* 6 Step Interactive Cards */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>Your 6 Steps as a Field Officer</span>
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Follow sequentially from field entry to HQ synchronization
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {/* Step 1 */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                            1
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                            Intake
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900">
                          Establishment &amp; Commodity Intake
                        </h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Enter the commercial store name, address, GSTIN, commodity category, and retail packaging format (pouch, bottle, carton).
                        </p>
                        <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block">
                          Act Sec 15 • PCR Rule 3
                        </span>
                      </div>

                      {/* Step 2 */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                            2
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                            Optics
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900">
                          Multi-Angle Photography &amp; Preprocessing
                        </h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Capture Front (PDP) and Back panel. Use optical tools: Auto-Gain (exposure), Unsharp Sharpening, and Cylindrical Unwarping for bottles.
                        </p>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                          PCR Rule 6 &amp; Rule 7
                        </span>
                      </div>

                      {/* Step 3 */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">
                            3
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                            Extraction
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900">
                          Multimodal Indian Script OCR
                        </h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Click "Run Regulatory Analysis". The multimodal engine reads English, Hindi, and Marathi label text with coordinate bounding boxes.
                        </p>
                        <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded inline-block">
                          PCR Rule 9 Devanagari/Eng
                        </span>
                      </div>

                      {/* Step 4 */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
                            4
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                            Audit
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900">
                          PCR 2011 Statutory Compliance Audit
                        </h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Verifies "inclusive of all taxes" syntax, calculates dynamic Unit Sale Price (USP per g/kg), and audits Rule 26 statutory exemptions.
                        </p>
                        <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block">
                          Rule 6(1)(e) • Rule 26
                        </span>
                      </div>

                      {/* Step 5 */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold flex items-center justify-center">
                            5
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                            Calibration
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900">
                          Digital Millimeter Caliper Gauge
                        </h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Use the on-screen digital caliper to verify Rule 13 minimum font heights (e.g. ≥ 4.0 mm for &gt; 1kg) and detect sticker tampering.
                        </p>
                        <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded inline-block">
                          Schedule II Font Height
                        </span>
                      </div>

                      {/* Step 6 */}
                      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 hover:border-blue-400 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                            6
                          </span>
                          <span className="text-[10px] font-mono text-blue-700 uppercase font-bold">
                            Direct Sync
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-blue-950">
                          Direct Directorate Admin Submission
                        </h5>
                        <p className="text-[11px] text-slate-700 leading-relaxed">
                          Click "Complete &amp; Submit". Form 1 Statutory Memo is finalized and instantly transferred to the Directorate Admin Portal under your profile!
                        </p>
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block font-semibold">
                          Live HQ Dossier Link
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Optional Reference Benchmark Loader */}
                  <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-800">
                        Want to test the workflow with standard reference sample data first?
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Loads the standard Annapurna Packaged Rice (5 kg) sample package with pre-captured imagery for inspection rehearsal.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => loadReferenceBenchmark()}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
                    >
                      Load Reference Sample
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase">
                          <th className="py-3 px-4">Inspection ID</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Establishment / Store</th>
                          <th className="py-3 px-4">Commodity / Package</th>
                          <th className="py-3 px-4">Inspection Progress</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredInspections.map((ins) => {
                          const isComplete = ins.status === 'REPORT_READY' || ins.status === 'VERIFIED';
                          const progressPercent = isComplete ? 100 : ins.status === 'REVIEW_REQUIRED' ? 75 : 35;

                          return (
                            <tr key={ins.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-slate-900">
                                {ins.id}
                              </td>
                              <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                                {ins.inspectionDate}
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-semibold text-slate-900">{ins.business.name || 'Store Visit'}</p>
                                <p className="text-[11px] text-slate-500">{ins.business.type}</p>
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-semibold text-slate-800">
                                  {ins.product.brand} {ins.product.name}
                                </p>
                                <p className="text-[10px] font-mono text-slate-400">
                                  Declared: {ins.product.declaredQuantity || 'N/A'}
                                </p>
                              </td>
                              <td className="py-3 px-4">
                                <div className="w-36 space-y-1">
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-bold text-slate-700">
                                      {isComplete ? 'Form 1 Ready' : ins.status === 'REVIEW_REQUIRED' ? 'Reviewing' : 'Drafting'}
                                    </span>
                                    <span className={`font-mono font-bold ${isComplete ? 'text-emerald-700' : 'text-blue-700'}`}>
                                      {progressPercent}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        isComplete ? 'bg-emerald-600' : 'bg-blue-600'
                                      }`}
                                      style={{ width: `${progressPercent}%` }}
                                    />
                                  </div>
                                  <span className="text-[9px] text-slate-400 block truncate">
                                    {isComplete ? '🟢 Updated on Admin Portal' : 'Pending Admin completion'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <StatusBadge status={ins.status} size="sm" />
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {isComplete ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenInspection(ins.id, 'report')}
                                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                                        title="View Form 1 Statutory Report (Synced to Admin)"
                                      >
                                        <FileText className="w-3 h-3" />
                                        <span>Form 1 Report</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenInspection(ins.id, 'result')}
                                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-900 rounded font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                                      >
                                        Audit
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => markInspectionComplete(ins.id)}
                                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                                        title="Mark completed and sync progress to Admin Portal"
                                      >
                                        <Check className="w-3 h-3" />
                                        <span>Submit</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenInspection(ins.id, 'result')}
                                        className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-900 rounded font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                                      >
                                        Open
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Inspection Cards (Clean & Organized on Phones!) */}
                  <div className="md:hidden p-3 space-y-2.5">
                    {filteredInspections.map((ins) => {
                      const isComplete = ins.status === 'REPORT_READY' || ins.status === 'VERIFIED';
                      const progressPercent = isComplete ? 100 : ins.status === 'REVIEW_REQUIRED' ? 75 : 35;

                      return (
                        <div
                          key={ins.id}
                          className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono font-bold text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {ins.id}
                            </span>
                            <StatusBadge status={ins.status} size="sm" />
                          </div>

                          <div>
                            <p className="font-bold text-slate-900 text-xs">{ins.business.name || 'Store Visit'}</p>
                            <p className="text-[11px] text-slate-500">{ins.business.type}</p>
                          </div>

                          <div className="bg-slate-50 rounded-md p-2 border border-slate-100 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-semibold text-slate-800">{ins.product.brand} {ins.product.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">Qty: {ins.product.declaredQuantity || 'N/A'}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">{ins.inspectionDate}</span>
                          </div>

                          {/* Progress bar on mobile */}
                          <div className="p-2 bg-slate-50 rounded-md border border-slate-200/70 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-slate-700">
                                {isComplete ? '✅ Inspection Completed' : 'Progress'}
                              </span>
                              <span className={`font-mono font-bold ${isComplete ? 'text-emerald-700' : 'text-blue-700'}`}>
                                {progressPercent}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isComplete ? 'bg-emerald-600' : 'bg-blue-600'
                                }`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {isComplete ? 'Automatically updated to Directorate Admin Portal' : 'Completing updates Admin Portal automatically'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            {isComplete ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenInspection(ins.id, 'report')}
                                  className="flex-1 min-h-[38px] py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Form 1 Report</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenInspection(ins.id, 'result')}
                                  className="flex-1 min-h-[38px] py-2 bg-slate-100 hover:bg-blue-50 text-blue-800 rounded-md font-bold text-xs border border-slate-200 text-center transition-colors cursor-pointer"
                                >
                                  Audit &rarr;
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => markInspectionComplete(ins.id)}
                                  className="flex-1 min-h-[38px] py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Complete &amp; Submit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenInspection(ins.id, 'result')}
                                  className="flex-1 min-h-[38px] py-2 bg-slate-100 hover:bg-blue-50 text-blue-800 rounded-md font-bold text-xs border border-slate-200 text-center transition-colors cursor-pointer"
                                >
                                  Open &rarr;
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Reference Demo Package */}
          {activeTab === 'DEMO' && (
            <div className="p-6 sm:p-8">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300 uppercase">
                      Reference Benchmark Sample
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      ID: {demoInspection.id}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {demoInspection.product.brand} {demoInspection.product.name} ({demoInspection.product.declaredQuantity})
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Standard baseline package for evaluation and demonstration. Contains pre-processed high-resolution front and back label imagery, extracted Schedule II declarations, Rule 13 font height analysis, and printable Form 1 inspection record.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Retailer: {demoInspection.business.name} • {demoInspection.business.address}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenInspection(demoInspection.id, 'result')}
                  className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs shadow-2xs flex items-center gap-2 shrink-0 cursor-pointer transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Reference Inspection</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Field Guidelines */}
          {activeTab === 'GUIDE' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                      Legal Metrology SOP
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Under PCR 2011 &amp; Enforcement Directives
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Standard 6-Step Field Inspection &amp; Admin Submission Workflow
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Designed for newly appointed Legal Metrology field inspectors conducting market surveillance at retail grocery, hypermarket, and commercial establishments.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuideModal(true)}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-2 cursor-pointer transition-colors shrink-0"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open Full Interactive Modal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* Step 1 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">1</span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Intake</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">1. Store &amp; Commodity Intake</h4>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Record the retail outlet name, commercial locality, state, GSTIN, and package format (rigid container, flexible pouch, bottle, carton).
                  </p>
                  <div className="text-[10px] font-mono text-blue-700 bg-blue-50/80 p-1.5 rounded">
                    <strong>Rule:</strong> Metrology Act Sec 15 (Powers of Inspection &amp; Seizure)
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">2</span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Optics</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">2. Multi-Angle Package Photography</h4>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Capture Principal Display Panel (PDP) and statutory back panel. Use Auto-Gain (exposure), Unsharp Sharpening, and Cylindrical Unwarping for bottles.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50/80 p-1.5 rounded">
                    <strong>Rule:</strong> PCR 2011 Rule 6 (Mandatory Declarations)
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">3</span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">OCR</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">3. Multimodal Indian Script OCR</h4>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Execute the AI analysis pipeline. The multimodal engine reads English, Hindi, and Marathi label declarations with spatial coordinate bounding boxes.
                  </p>
                  <div className="text-[10px] font-mono text-purple-700 bg-purple-50/80 p-1.5 rounded">
                    <strong>Rule:</strong> PCR 2011 Rule 9 (Language of Declarations)
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">4</span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Audit</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">4. Statutory Compliance Audit</h4>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Audits mandatory tax inclusion syntax, unit sale price (USP per g/kg), manufacturing date chronology, and Rule 26 statutory exemptions.
                  </p>
                  <div className="text-[10px] font-mono text-amber-700 bg-amber-50/80 p-1.5 rounded">
                    <strong>Rule:</strong> Rule 6(1)(e) &amp; Rule 26 Exemption Checks
                  </div>
                </div>

                {/* Step 5 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold flex items-center justify-center">5</span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Caliper</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">5. Digital Millimeter Caliper Gauge</h4>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Calibrate pixel-to-millimeter ratio and use the digital caliper to measure numeral heights against Schedule II minimum legal dimensions.
                  </p>
                  <div className="text-[10px] font-mono text-cyan-700 bg-cyan-50/80 p-1.5 rounded">
                    <strong>Rule:</strong> PCR Schedule II (Minimum Font Heights)
                  </div>
                </div>

                {/* Step 6 */}
                <div className="p-4 rounded-xl bg-blue-50/90 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">6</span>
                    <span className="text-[10px] font-mono text-blue-700 font-bold uppercase">Submission</span>
                  </div>
                  <h4 className="font-bold text-blue-950 text-xs">6. Direct Directorate Admin Submission</h4>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    Sign off on observations. The Form 1 Statutory Report is instantly compiled and automatically pushed to the Directorate Admin Portal under your officer profile!
                  </p>
                  <div className="text-[10px] font-mono text-emerald-800 bg-emerald-100/90 p-1.5 rounded font-semibold">
                    <strong>Sync:</strong> Direct HQ Server Transmission
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartNewInspection}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Start Store Inspection</span>
                </button>

                <button
                  type="button"
                  onClick={() => switchRole('ADMIN')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>View Directorate Admin Section &rarr;</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Interactive 6-Step Guide Modal for New Inspectors */}
      <FirstTimeInspectorGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onStartInspection={() => {
          setShowGuideModal(false);
          handleStartNewInspection();
        }}
      />
    </AppShell>
  );
};
