import React, { useState, useMemo } from 'react';
import {
  Users,
  ShieldCheck,
  UserCheck,
  ClipboardList,
  AlertTriangle,
  FileCheck2,
  RotateCcw,
  Search,
  Eye,
  Store,
  CheckCircle2,
  Layers,
  ArrowRight,
  ExternalLink,
  MapPin,
  Calendar,
  Building,
  Mail,
  User,
  LayoutGrid,
  List,
  PlusCircle,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  Activity,
  Check,
  Download,
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';
import { AppShell } from '../components/layout/AppShell';
import { MetricCard } from '../components/ui/MetricCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Inspector } from '../types';
import { generateTechnicalDossierPDF } from '../services/technicalDossierPdf';

export const AdminDashboardPage: React.FC = () => {
  const {
    currentAdmin,
    teamInspectors,
    realInspections,
    demoInspection,
    activityEvents,
    switchInspector,
    switchRole,
    resetAllPrototypeData,
    navigateTo,
    setCurrentInspectionById,
    isSyncing,
    lastSyncTime,
    forceSyncWithServer,
  } = useInspection();

  const [adminTab, setAdminTab] = useState<'TEAM' | 'INSPECTIONS' | 'BENCHMARK'>('TEAM');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');
  const [officerFilter, setOfficerFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedInspectorVisits, setExpandedInspectorVisits] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [storeSearchTerm, setStoreSearchTerm] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedOfficerModal, setSelectedOfficerModal] = useState<Inspector | null>(null);

  const toggleInspectorVisits = (inspectorId: string) => {
    setExpandedInspectorVisits((prev) => ({
      ...prev,
      [inspectorId]: !prev[inspectorId],
    }));
  };

  const handleViewOfficerReports = (inspectorId: string) => {
    setOfficerFilter(inspectorId);
    setStatusFilter('COMPLETED');
    setAdminTab('INSPECTIONS');
  };

  // Compute live statistics strictly from stored prototype data
  const adminStats = useMemo(() => {
    const totalInspectors = teamInspectors.length;
    const inspectorsWithRealInspections = new Set(realInspections.map((i) => i.inspectorId)).size;
    const totalReal = realInspections.length;
    const pendingReviews = realInspections.filter((i) => i.status === 'REVIEW_REQUIRED').length;
    const reportsGenerated = realInspections.filter(
      (i) => i.status === 'REPORT_READY' || i.status === 'VERIFIED'
    ).length;

    return {
      totalInspectors,
      activeInspectors: inspectorsWithRealInspections,
      totalRealInspections: totalReal,
      pendingReviews,
      reportsGenerated,
    };
  }, [teamInspectors, realInspections]);

  // Per-inspector metrics calculated strictly from real prototype visits
  const inspectorPerformance = useMemo(() => {
    return teamInspectors.map((insp) => {
      const inspRealInspections = realInspections.filter((ins) => ins.inspectorId === insp.id);
      const totalCount = inspRealInspections.length;
      const reports = inspRealInspections.filter(
        (ins) => ins.status === 'REPORT_READY' || ins.status === 'VERIFIED'
      ).length;
      const reviews = inspRealInspections.filter((ins) => ins.status === 'REVIEW_REQUIRED').length;
      const lastInspection =
        inspRealInspections.length > 0
          ? inspRealInspections[inspRealInspections.length - 1]
          : null;

      return {
        inspector: insp,
        inspectorId: insp.id,
        inspectorName: insp.name,
        designation: insp.designation,
        avatar: insp.avatar || insp.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
        realInspections: totalCount,
        reports,
        pendingReviews: reviews,
        lastActivityDate: lastInspection ? lastInspection.inspectionDate : 'No visits yet',
        lastStoreName: lastInspection?.business?.name || 'Awaiting first store test',
        status: totalCount > 0 ? 'Active in Field' : 'Awaiting Store Test',
      };
    });
  }, [teamInspectors, realInspections]);

  const filteredInspectors = useMemo(() => {
    if (!searchTerm.trim()) return inspectorPerformance;
    const term = searchTerm.toLowerCase();
    return inspectorPerformance.filter(
      (item) =>
        item.inspectorName.toLowerCase().includes(term) ||
        item.inspectorId.toLowerCase().includes(term) ||
        item.designation.toLowerCase().includes(term)
    );
  }, [inspectorPerformance, searchTerm]);

  // Store visits filtered by search, officer filter, and status filter
  const filteredRealInspections = useMemo(() => {
    let result = realInspections;
    if (officerFilter !== 'ALL') {
      result = result.filter((ins) => ins.inspectorId === officerFilter);
    }
    if (statusFilter === 'COMPLETED') {
      result = result.filter((ins) => ins.status === 'REPORT_READY' || ins.status === 'VERIFIED');
    } else if (statusFilter === 'REVIEW') {
      result = result.filter((ins) => ins.status === 'REVIEW_REQUIRED');
    } else if (statusFilter === 'DRAFT') {
      result = result.filter((ins) => ins.status === 'DRAFT');
    }
    if (storeSearchTerm.trim()) {
      const term = storeSearchTerm.toLowerCase();
      result = result.filter(
        (ins) =>
          ins.id.toLowerCase().includes(term) ||
          ins.business.name.toLowerCase().includes(term) ||
          ins.inspectorName.toLowerCase().includes(term) ||
          ins.product.name.toLowerCase().includes(term) ||
          ins.product.brand.toLowerCase().includes(term)
      );
    }
    return result;
  }, [realInspections, officerFilter, statusFilter, storeSearchTerm]);

  const handleOpenInspection = (id: string, targetTab: string = 'result') => {
    setCurrentInspectionById(id);
    navigateTo(`/inspections/${id}/${targetTab}`);
  };

  const handleSwitchToInspectorWorkspace = (inspectorId: string) => {
    switchInspector(inspectorId);
    switchRole('INSPECTOR');
    navigateTo('/dashboard');
  };

  const handleStartInspectionAsOfficer = (inspectorId: string) => {
    switchInspector(inspectorId);
    switchRole('INSPECTOR');
    navigateTo('/inspections/new');
  };

  const handleFilterOfficerVisits = (inspectorId: string) => {
    setOfficerFilter(inspectorId);
    setAdminTab('INSPECTIONS');
  };

  const handleConfirmReset = () => {
    resetAllPrototypeData();
    setIsResetModalOpen(false);
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Directorate HQ', route: '/admin' },
        { label: 'Inspector Team Supervision' },
      ]}
    >
      <div className="space-y-6">
        {/* Directorate Admin Banner */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-700 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs border border-amber-600/30">
              PG
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 uppercase">
                  Directorate of Legal Metrology
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  State Enforcement Administrator
                </span>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {currentAdmin.id}
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {currentAdmin.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentAdmin.designation} • Supervising 5 Field Inspectors (Navinya, Sudhanshu, Devansh, Nirmiti, Kshitija)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {/* Live Synchronized with Inspector Field Portals */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Inspector Sync</span>
              <button
                type="button"
                onClick={() => forceSyncWithServer()}
                disabled={isSyncing}
                className="p-0.5 hover:bg-emerald-100 rounded text-emerald-700 cursor-pointer ml-1"
                title="Force refresh synchronization"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>

            {/* Technical Research & Architecture PDF */}
            <button
              type="button"
              onClick={() => generateTechnicalDossierPDF()}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download Comprehensive Technical Research & System Architecture Dossier (PDF)"
            >
              <Download className="w-3.5 h-3.5 text-blue-700" />
              <span>Technical Dossier (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="px-3 py-2 bg-slate-50 hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-slate-200 hover:border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Clear field store test ledger"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span>Reset Field Data</span>
            </button>

            <button
              type="button"
              onClick={() => switchRole('INSPECTOR')}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Enter Field Inspector Mode →</span>
            </button>
          </div>
        </div>

        {/* 5 Dynamic Performance Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <MetricCard
            label="Supervised Officers"
            value={adminStats.totalInspectors}
            subtext="5 Authorized Field Accounts"
            icon={Users}
            variant="default"
          />
          <MetricCard
            label="Active In Field"
            value={adminStats.activeInspectors}
            subtext={`${adminStats.activeInspectors} of 5 have logged visits`}
            icon={UserCheck}
            variant={adminStats.activeInspectors > 0 ? 'emerald' : 'default'}
          />
          <MetricCard
            label="Total Store Visits"
            value={adminStats.totalRealInspections}
            subtext="Across all team inspectors"
            icon={ClipboardList}
            variant={adminStats.totalRealInspections > 0 ? 'blue' : 'default'}
            onClick={() => setAdminTab('INSPECTIONS')}
          />
          <MetricCard
            label="Needs Review"
            value={adminStats.pendingReviews}
            subtext="Flagged for statutory audit"
            icon={AlertTriangle}
            variant={adminStats.pendingReviews > 0 ? 'amber' : 'default'}
          />
          <MetricCard
            label="Reports Generated"
            value={adminStats.reportsGenerated}
            subtext="Form 1 statutory memos"
            icon={FileCheck2}
            variant={adminStats.reportsGenerated > 0 ? 'emerald' : 'default'}
          />
        </div>

        {/* Tabbed Directorate Workspace */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
          {/* Navigation Bar */}
          <div className="px-4 sm:px-6 pt-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => setAdminTab('TEAM')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  adminTab === 'TEAM'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Field Inspector Team Progress</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {teamInspectors.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab('INSPECTIONS')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  adminTab === 'INSPECTIONS'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>All Store Visits Ledger</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {realInspections.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab('BENCHMARK')}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  adminTab === 'BENCHMARK'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Reference Benchmark Package</span>
              </button>
            </div>

            {/* Sub-controls */}
            <div className="flex items-center gap-2 pb-2">
              {adminTab === 'TEAM' && (
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('CARDS')}
                    className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'CARDS'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Grid Cards View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('TABLE')}
                    className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'TABLE'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Table Ledger View"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Table</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* TAB 1: FIELD INSPECTOR TEAM PROGRESS */}
          {adminTab === 'TEAM' && (
            <div>
              {/* Header Bar with Search */}
              <div className="p-3.5 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Live Surveillance Status: 5 Authorized Inspector Accounts
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Track field store visits, PCR 2011 compliance memos, and verification queues recorded by each officer.
                  </p>
                </div>
                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search officer..."
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* View 1: Rich Officer Progress Cards */}
              {viewMode === 'CARDS' && (
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredInspectors.map((item) => {
                    const isOfficerActive = item.realInspections > 0;
                    return (
                      <div
                        key={item.inspectorId}
                        className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                      >
                        {/* Top: Avatar, Name & Status */}
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs border border-blue-600/30">
                                {item.avatar}
                              </div>
                              <div>
                                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                                  {item.inspectorName}
                                </h3>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                  <span className="font-mono font-bold text-blue-900 bg-blue-50 px-1 py-0.2 rounded border border-blue-200/60">
                                    {item.inspectorId}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                isOfficerActive
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          {/* Officer Role Info */}
                          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 mb-3 text-xs flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 font-medium">Designation:</span>
                            <span className="font-semibold text-slate-800 text-[11px]">{item.designation}</span>
                          </div>

                          {/* 3 Metric Progress Blocks */}
                          <div className="grid grid-cols-3 gap-2 text-center mb-3">
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-150">
                              <span className="block text-base font-extrabold text-slate-900">
                                {item.realInspections}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">Store Visits</span>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-150">
                              <span className="block text-base font-extrabold text-emerald-700">
                                {item.reports}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">Reports Ready</span>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-150">
                              <span className="block text-base font-extrabold text-amber-700">
                                {item.pendingReviews}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">Needs Review</span>
                            </div>
                          </div>

                          {/* Live Officer Progress Bar */}
                          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 mb-3 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-700">Completion Progress</span>
                              <span
                                className={`font-mono font-bold ${
                                  item.realInspections > 0 && item.reports === item.realInspections
                                    ? 'text-emerald-700'
                                    : 'text-blue-700'
                                }`}
                              >
                                {item.realInspections > 0
                                  ? `${Math.round((item.reports / item.realInspections) * 100)}% (${item.reports}/${item.realInspections})`
                                  : '0% (Ready for test)'}
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  item.realInspections > 0 && item.reports === item.realInspections
                                    ? 'bg-emerald-600'
                                    : 'bg-blue-600'
                                }`}
                                style={{
                                  width: `${
                                    item.realInspections > 0
                                      ? Math.max(10, Math.round((item.reports / item.realInspections) * 100))
                                      : 0
                                  }%`,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                              <span>{item.reports} statutory reports completed</span>
                              <span>{item.pendingReviews} awaiting verification</span>
                            </div>
                          </div>

                          {/* Expandable Section: Inspector's Actual Store Visits & Form 1 Reports */}
                          {item.realInspections > 0 && (
                            <div className="pt-2.5 mt-2 border-t border-slate-150">
                              <button
                                type="button"
                                onClick={() => toggleInspectorVisits(item.inspectorId)}
                                className="w-full flex items-center justify-between text-[11px] font-bold text-slate-700 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                              >
                                <span className="flex items-center gap-1.5">
                                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Inspect Reports &amp; Visits ({item.realInspections})</span>
                                </span>
                                {expandedInspectorVisits[item.inspectorId] ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                                )}
                              </button>

                              {expandedInspectorVisits[item.inspectorId] && (
                                <div className="mt-2 space-y-1.5 max-h-52 overflow-y-auto pr-1">
                                  {realInspections
                                    .filter((ins) => ins.inspectorId === item.inspectorId)
                                    .map((ins) => {
                                      const isDone = ins.status === 'REPORT_READY' || ins.status === 'VERIFIED';
                                      return (
                                        <div
                                          key={ins.id}
                                          className="p-2 bg-slate-50 hover:bg-blue-50/50 rounded-lg border border-slate-200/80 text-xs transition-colors space-y-1"
                                        >
                                          <div className="flex items-center justify-between gap-1">
                                            <span className="font-mono font-bold text-[10px] text-blue-900">
                                              {ins.id}
                                            </span>
                                            <StatusBadge status={ins.status} size="sm" />
                                          </div>
                                          <div className="flex items-center justify-between text-[11px]">
                                            <span className="font-semibold text-slate-900 truncate max-w-[170px]">
                                              {ins.business.name}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                              {ins.inspectionDate}
                                            </span>
                                          </div>
                                          <p className="text-[10px] text-slate-500 truncate">
                                            {ins.product.brand} {ins.product.name}
                                          </p>
                                          <div className="flex items-center gap-1.5 pt-1">
                                            {isDone && (
                                              <button
                                                type="button"
                                                onClick={() => handleOpenInspection(ins.id, 'report')}
                                                className="flex-1 py-1 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1 shadow-2xs"
                                              >
                                                <FileText className="w-3 h-3" />
                                                <span>Form 1 Report</span>
                                              </button>
                                            )}
                                            <button
                                              type="button"
                                              onClick={() => handleOpenInspection(ins.id, 'result')}
                                              className="flex-1 py-1 px-2 bg-white hover:bg-slate-100 text-slate-700 rounded text-[10px] font-semibold border border-slate-200 transition-colors cursor-pointer text-center"
                                            >
                                              Evidence
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Recent Activity Footnote */}
                          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1.5 border-t border-slate-100 mt-2">
                            <span className="text-slate-400">Latest Store Visit:</span>
                            <span className="font-medium text-slate-700 truncate max-w-[180px]">
                              {item.lastStoreName}
                            </span>
                          </div>
                        </div>

                        {/* Actions Bottom Bar */}
                        <div className="pt-3.5 mt-3 border-t border-slate-150 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleFilterOfficerVisits(item.inspectorId)}
                              className="px-2 py-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100/70 border border-blue-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                              title={`View all store visits by ${item.inspectorName}`}
                            >
                              <Store className="w-3.5 h-3.5" />
                              <span>Visits ({item.realInspections})</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleViewOfficerReports(item.inspectorId)}
                              className="px-2 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                              title={`View completed Form 1 statutory reports for ${item.inspectorName}`}
                            >
                              <FileCheck2 className="w-3.5 h-3.5" />
                              <span>Reports ({item.reports})</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => navigateTo(`/admin/inspectors/${item.inspectorId}`)}
                              className="px-2.5 py-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                              title="View Detailed Inspector Profile"
                            >
                              <User className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSwitchToInspectorWorkspace(item.inspectorId)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                              title={`Open ${item.inspectorName}'s Field Workspace`}
                            >
                              <span>Open Account</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* View 2: Compact Tabular Ledger */}
              {viewMode === 'TABLE' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Field Officer</th>
                        <th className="py-3 px-4">Officer ID</th>
                        <th className="py-3 px-4">Designation</th>
                        <th className="py-3 px-4 text-center">Store Visits</th>
                        <th className="py-3 px-4 text-center">Reports Ready</th>
                        <th className="py-3 px-4 text-center">Review Queue</th>
                        <th className="py-3 px-4">Latest Activity</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredInspectors.map((item) => (
                        <tr key={item.inspectorId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-md bg-blue-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                {item.avatar}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{item.inspectorName}</p>
                                <p className="text-[11px] text-slate-500">{item.designation}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-blue-900">
                            {item.inspectorId}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            <p className="font-medium text-xs">{item.designation}</p>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-900">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded text-xs ${
                                item.realInspections > 0
                                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                                  : 'text-slate-400'
                              }`}
                            >
                              {item.realInspections}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-800">
                            {item.reports}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-amber-700">
                            {item.pendingReviews}
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-[11px]">
                            {item.lastStoreName}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.realInspections > 0
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => navigateTo(`/admin/inspectors/${item.inspectorId}`)}
                                className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                              >
                                Profile
                              </button>
                              <button
                                type="button"
                                onClick={() => handleFilterOfficerVisits(item.inspectorId)}
                                className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-semibold text-[11px] border border-blue-200 transition-colors cursor-pointer"
                              >
                                View Visits
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSwitchToInspectorWorkspace(item.inspectorId)}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-[11px] transition-colors cursor-pointer"
                              >
                                Open →
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALL STORE VISITS LEDGER (WITH OFFICER FILTER) */}
          {adminTab === 'INSPECTIONS' && (
            <div>
              {/* Officer Filter Chips & Search Bar */}
              <div className="p-3.5 bg-slate-50/70 border-b border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Central Ledger of Field Store Inspections
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Filter by officer to supervise individual investigation records and statutory memos.
                    </p>
                  </div>
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={storeSearchTerm}
                      onChange={(e) => setStoreSearchTerm(e.target.value)}
                      placeholder="Search store, product, or memo..."
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-600" />
                      Filter by Officer:
                    </span>
                    <button
                      type="button"
                      onClick={() => setOfficerFilter('ALL')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        officerFilter === 'ALL'
                          ? 'bg-blue-700 text-white shadow-2xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      All Officers ({realInspections.length})
                    </button>

                    {teamInspectors.map((insp) => {
                      const count = realInspections.filter((ins) => ins.inspectorId === insp.id).length;
                      const isSelected = officerFilter === insp.id;
                      return (
                        <button
                          key={insp.id}
                          type="button"
                          onClick={() => setOfficerFilter(insp.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-blue-700 text-white font-bold shadow-2xs'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          <span>{insp.name.split(' ')[0]}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                              isSelected
                                ? 'bg-blue-900 text-blue-100'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Status Filter Row */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-200/60">
                    <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Filter by Status:
                    </span>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('ALL')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        statusFilter === 'ALL'
                          ? 'bg-slate-800 text-white shadow-2xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      All Statuses ({realInspections.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('COMPLETED')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                        statusFilter === 'COMPLETED'
                          ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                          : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-300'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>Form 1 Completed ({adminStats.reportsGenerated})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('REVIEW')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                        statusFilter === 'REVIEW'
                          ? 'bg-amber-600 text-white shadow-2xs font-bold'
                          : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-300'
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>Needs Review ({adminStats.pendingReviews})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter('DRAFT')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        statusFilter === 'DRAFT'
                          ? 'bg-blue-700 text-white shadow-2xs font-bold'
                          : 'bg-white text-blue-800 hover:bg-blue-50 border border-blue-200'
                      }`}
                    >
                      Drafts ({realInspections.filter((i) => i.status === 'DRAFT').length})
                    </button>
                  </div>
                </div>
              </div>

              {/* Inspection Ledger Table or Clean Empty State */}
              {filteredRealInspections.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  <Store className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                  <p className="font-bold text-slate-800 text-sm">
                    {officerFilter === 'ALL'
                      ? 'No field store visits recorded yet.'
                      : `No store visits recorded yet for ${
                          teamInspectors.find((t) => t.id === officerFilter)?.name || 'this officer'
                        }.`}
                  </p>
                  <p className="mt-1 text-slate-400 max-w-md mx-auto text-xs leading-relaxed">
                    When inspectors scan packaged commodities or perform retail surveillance audits in the field, all reports sync automatically into this central ledger.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {officerFilter !== 'ALL' ? (
                      <button
                        type="button"
                        onClick={() => handleStartInspectionAsOfficer(officerFilter)}
                        className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>
                          Conduct Test as {teamInspectors.find((t) => t.id === officerFilter)?.name.split(' ')[0]}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartInspectionAsOfficer(teamInspectors[0].id)}
                        className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Launch Test Store Inspection</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenInspection(demoInspection.id, 'result')}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                    >
                      <Eye className="w-4 h-4 text-blue-700" />
                      <span>Review Reference Benchmark ({demoInspection.id})</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-4">Inspection ID</th>
                        <th className="py-2.5 px-4">Officer In-Charge</th>
                        <th className="py-2.5 px-4">Inspection Date</th>
                        <th className="py-2.5 px-4">Retail Outlet & Location</th>
                        <th className="py-2.5 px-4">Commodity / Brand</th>
                        <th className="py-2.5 px-4">Statutory Status</th>
                        <th className="py-2.5 px-4 text-right">Review Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRealInspections.map((ins) => (
                        <tr key={ins.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {ins.id}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              {ins.inspectorId}
                            </span>
                            <p className="text-[11px] text-slate-700 mt-0.5 font-bold">
                              {ins.inspectorName}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            {ins.inspectionDate}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900">
                            <p className="font-bold">{ins.business.name || 'Retail Outlet'}</p>
                            <p className="text-[11px] text-slate-500 truncate max-w-xs">
                              {ins.business.address || 'Field Location'}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-slate-800">
                            <span className="font-bold text-slate-900">{ins.product.brand}</span>{' '}
                            <span>{ins.product.name}</span>
                            <p className="text-[10px] text-slate-500 font-mono">
                              Qty: {ins.product.declaredNetQuantity || '5 kg'} • MRP: {ins.product.mrp || '₹440'}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={ins.status} size="sm" />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              {(ins.status === 'REPORT_READY' || ins.status === 'VERIFIED') && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenInspection(ins.id, 'report')}
                                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                                  title="View Form 1 Statutory Report (Auto-synced from Inspector)"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>Form 1 Report</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleOpenInspection(ins.id, 'result')}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-900 rounded font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                              >
                                Review Memo
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REFERENCE DEMO BENCHMARK */}
          {adminTab === 'BENCHMARK' && (
            <div className="p-6">
              <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase">
                      Reference Benchmark Standard
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {demoInspection.product.brand} {demoInspection.product.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Inspection ID: {demoInspection.id} • Store: {demoInspection.business.name}
                    </p>
                  </div>
                  <StatusBadge status={demoInspection.status} size="sm" />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  This standardized reference model demonstrates complete Rule 13 statutory compliance, bounding box OCR evidence extraction, dual-stage inspection memo generation, and legal non-compliance notices under the Legal Metrology (Packaged Commodities) Rules, 2011.
                </p>

                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Retail Outlet:</span>
                    <span className="font-semibold text-slate-800">{demoInspection.business.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Address:</span>
                    <span className="text-slate-700">{demoInspection.business.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mandatory Violations Flagged:</span>
                    <span className="font-bold text-amber-700">Font Height (1.8mm &lt; 4.0mm required)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenInspection(demoInspection.id, 'result')}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Benchmark Audit Results</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenInspection(demoInspection.id, 'report')}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-blue-700" />
                    <span>View Form 1 Statutory Memo</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Field Directorate Activity & Real-Time Sync Feed */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Live Inspector Activity &amp; Synchronization Feed
                  </h3>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Real-time log of inspections completed, submitted, and synced across all field officers
                </p>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-400 font-mono">
              Server State: <span className="text-emerald-700 font-bold">Synchronized</span>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {activityEvents.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4 italic">
                Awaiting first synchronized field action...
              </p>
            ) : (
              activityEvents.slice(0, 10).map((act) => {
                const isSuccess = act.severity === 'SUCCESS' || act.action === 'INSPECTION_COMPLETED';
                return (
                  <div
                    key={act.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50/50 border border-slate-100 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                          isSuccess
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {isSuccess ? <Check className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-bold text-slate-900">{act.officerName}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200">
                            {act.inspectionId}
                          </span>
                          <span className="text-slate-600 font-medium">{act.details}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <span className="font-mono text-[10px] text-slate-400">
                        {act.timestamp}
                      </span>
                      {act.inspectionId && (
                        <button
                          type="button"
                          onClick={() => handleOpenInspection(act.inspectionId, 'report')}
                          className="px-2 py-0.5 bg-white hover:bg-slate-100 text-blue-700 rounded text-[10px] font-semibold border border-slate-200 transition-colors cursor-pointer"
                        >
                          View Memo →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Officer Dossier Modal */}
        {selectedOfficerModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-700 text-white font-black text-base flex items-center justify-center shrink-0">
                    {selectedOfficerModal.avatar || 'IN'}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {selectedOfficerModal.name}
                    </h3>
                    <p className="font-mono text-xs font-bold text-blue-800">
                      {selectedOfficerModal.id}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOfficerModal(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500">Designation:</span>
                  <span className="font-semibold">{selectedOfficerModal.designation}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500">Official Email:</span>
                  <span className="font-mono">{selectedOfficerModal.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-500">Assignment:</span>
                  <span className="font-medium">Packaged Commodities Compliance</span>
                </div>
              </div>

              {/* Officer Stats */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Active Field Surveillance Records
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="block text-lg font-black text-slate-900">
                      {realInspections.filter((i) => i.inspectorId === selectedOfficerModal.id).length}
                    </span>
                    <span className="text-[10px] text-slate-500">Store Visits</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="block text-lg font-black text-emerald-800">
                      {
                        realInspections.filter(
                          (i) =>
                            i.inspectorId === selectedOfficerModal.id &&
                            (i.status === 'REPORT_READY' || i.status === 'VERIFIED')
                        ).length
                      }
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Reports Ready</span>
                  </div>
                  <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="block text-lg font-black text-amber-800">
                      {
                        realInspections.filter(
                          (i) =>
                            i.inspectorId === selectedOfficerModal.id &&
                            i.status === 'REVIEW_REQUIRED'
                        ).length
                      }
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold">Flagged</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    handleFilterOfficerVisits(selectedOfficerModal.id);
                    setSelectedOfficerModal(null);
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  View Store Visits
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleStartInspectionAsOfficer(selectedOfficerModal.id);
                    setSelectedOfficerModal(null);
                  }}
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Start Inspection as {selectedOfficerModal.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Reset Prototype Data */}
        {isResetModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reset Field Inspection Data?
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  This action will clear all store visits captured during field testing.
                </p>
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>The reference benchmark inspection is permanently preserved.</span>
                  </p>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dashboard counters return to fresh registry baseline state.</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Confirm Reset Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};
