import React, { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  Calendar,
  MapPin,
  FileCheck2,
  RefreshCw,
  FolderX,
  Sparkles,
  ShieldAlert,
  User,
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';
import { AppShell } from '../components/layout/AppShell';
import { StatusBadge } from '../components/ui/StatusBadge';

export const InspectionHistoryPage: React.FC = () => {
  const {
    inspections,
    currentRole,
    currentUser,
    navigateTo,
    startNewInspection,
    setCurrentInspectionById,
  } = useInspection();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredInspections = useMemo(() => {
    return inspections.filter((ins) => {
      // Keyword search over ID, business name, product name, brand, inspector
      const matchesSearch =
        !searchTerm.trim() ||
        ins.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ins.business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ins.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ins.product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ins.inspectorName && ins.inspectorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ins.inspectorId && ins.inspectorId.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter
      const matchesStatus =
        statusFilter === 'ALL' || ins.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inspections, searchTerm, statusFilter]);

  const handleOpenInspection = (id: string, sub: string = 'result') => {
    setCurrentInspectionById(id);
    navigateTo(`/inspections/${id}/${sub}`);
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: currentRole === 'ADMIN' ? 'Statewide Registry' : 'Inspector Registry' },
      ]}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {currentRole === 'ADMIN'
                  ? 'Statewide Surveillance Registry'
                  : `${currentUser.name}'s Inspection Registry`}
              </h1>
              <span className="font-mono text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                {currentUser.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentRole === 'ADMIN'
                ? 'Central repository of all field store inspections logged across team members.'
                : 'Isolated workspace registry. Only your store evaluations and the demo benchmark appear here.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => startNewInspection()}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Inspection</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Keyword Search */}
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, store name, commodity or brand..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-900"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-700 font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="REVIEW_REQUIRED">Review Required</option>
                <option value="REPORT_READY">Report Ready</option>
                <option value="VERIFIED">Inspector Verified</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 border-t border-slate-100">
            <span>
              Showing <strong>{filteredInspections.length}</strong> of{' '}
              <strong>{inspections.length}</strong> available records
            </span>
            {(searchTerm || statusFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
                className="text-blue-700 hover:underline font-semibold cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          {filteredInspections.length === 0 ? (
            <div className="p-12 text-center">
              <FolderX className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">
                No inspections found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No inspection records match your query. Click "New Inspection" to begin testing at a store.
              </p>
            </div>
          ) : (
            <div>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Inspection ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Store / Business</th>
                      <th className="py-3 px-4">Product / Declared Qty</th>
                      {currentRole === 'ADMIN' && <th className="py-3 px-4">Officer</th>}
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Rule Findings</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInspections.map((ins) => {
                      const isDemoRecord = ins.isDemo || ins.id === 'INS-DEMO-001';

                      return (
                        <tr
                          key={ins.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isDemoRecord ? 'bg-amber-50/20' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                            <div>
                              <span>{ins.id}</span>
                              {isDemoRecord && (
                                <span className="block mt-0.5 text-[9px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded w-fit uppercase">
                                  DEMO DATA
                                </span>
                              )}
                            </div>
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
                            <p className="text-[10px] font-mono text-slate-500">
                              {ins.product.declaredQuantity || 'Net Qty Pending'}
                            </p>
                          </td>
                          {currentRole === 'ADMIN' && (
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="font-mono text-[11px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                                {ins.inspectorId || 'OFFICER'}
                              </span>
                            </td>
                          )}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <StatusBadge status={ins.status} size="sm" />
                          </td>
                          <td className="py-3 px-4 text-slate-700 whitespace-nowrap font-medium">
                            {ins.findings.length > 0 ? (
                              <span className="text-amber-800 font-semibold">
                                {ins.findings.length} potential {ins.findings.length === 1 ? 'issue' : 'issues'}
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-semibold">0 issues</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenInspection(ins.id, 'result')}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-900 rounded font-semibold text-[11px] border border-slate-200 transition-colors cursor-pointer"
                              >
                                Review
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenInspection(ins.id, 'evidence')}
                                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 rounded text-[11px] border border-slate-200 cursor-pointer"
                                title="Open Evidence Workspace"
                              >
                                Evidence
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenInspection(ins.id, 'report')}
                                className="px-2 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold text-[11px] shadow-2xs cursor-pointer"
                                title="Preview Report"
                              >
                                Report
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Inspection Card View (Clean & Spacious on Phones) */}
              <div className="md:hidden p-3 space-y-3">
                {filteredInspections.map((ins) => {
                  const isDemoRecord = ins.isDemo || ins.id === 'INS-DEMO-001';

                  return (
                    <div
                      key={ins.id}
                      className={`border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs space-y-2.5 ${
                        isDemoRecord ? 'border-amber-200 bg-amber-50/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {ins.id}
                          </span>
                          {isDemoRecord && (
                            <span className="text-[9px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded uppercase">
                              DEMO
                            </span>
                          )}
                        </div>
                        <StatusBadge status={ins.status} size="sm" />
                      </div>

                      <div>
                        <p className="font-bold text-slate-900 text-xs">{ins.business.name || 'Store Visit'}</p>
                        <p className="text-[11px] text-slate-500">{ins.business.type} &bull; {ins.inspectionDate}</p>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-slate-800">{ins.product.brand} {ins.product.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Declared: {ins.product.declaredQuantity || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          {ins.findings.length > 0 ? (
                            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {ins.findings.length} issues
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              0 issues
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleOpenInspection(ins.id, 'result')}
                          className="min-h-[36px] py-1 px-2 bg-slate-100 hover:bg-blue-50 text-blue-800 rounded-lg font-semibold text-xs border border-slate-200 text-center transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenInspection(ins.id, 'evidence')}
                          className="min-h-[36px] py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs border border-slate-200 text-center transition-colors cursor-pointer"
                        >
                          Evidence
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenInspection(ins.id, 'report')}
                          className="min-h-[36px] py-1 px-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-xs text-center shadow-2xs transition-colors cursor-pointer"
                        >
                          Report
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};
