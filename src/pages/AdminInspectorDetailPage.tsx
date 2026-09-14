import React from 'react';
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Briefcase,
  Calendar,
  FileCheck2,
  Clock,
  AlertTriangle,
  Eye,
  Store,
  FileText,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';
import { AppShell } from '../components/layout/AppShell';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Inspector } from '../types';

export const AdminInspectorDetailPage: React.FC = () => {
  const {
    teamInspectors,
    realInspections,
    routeParams,
    navigateTo,
    setCurrentInspectionById,
    switchInspector,
    showToast,
  } = useInspection();

  const inspectorId = routeParams.inspectorId || teamInspectors[0]?.id;
  const inspector: Inspector =
    teamInspectors.find((i) => i.id === inspectorId) || teamInspectors[0];

  // Derive metrics strictly from real inspections stored in state
  const inspectorInspections = realInspections.filter(
    (ins) => ins.inspectorId === inspector.id
  );

  const totalReal = inspectorInspections.length;
  const completed = inspectorInspections.filter(
    (ins) => ins.status === 'REPORT_READY' || ins.status === 'VERIFIED'
  ).length;
  const drafts = inspectorInspections.filter((ins) => ins.status === 'DRAFT').length;
  const pendingReviews = inspectorInspections.filter(
    (ins) => ins.status === 'REVIEW_REQUIRED'
  ).length;
  const reports = completed;
  const currentWorkload = drafts + pendingReviews;

  const handleOpenInspection = (id: string, sub: string = 'result') => {
    setCurrentInspectionById(id);
    navigateTo(`/inspections/${id}/${sub}`);
  };

  const handleSimulateAsInspector = () => {
    switchInspector(inspector.id);
    showToast(`Switched active session to ${inspector.name} (${inspector.id})`, 'info');
    navigateTo('/dashboard');
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Admin Supervisory', href: '/admin' },
        { label: 'Inspectors', href: '/admin' },
        { label: `${inspector.name} (${inspector.id})` },
      ]}
    >
      <div className="space-y-6">
        {/* Back and Profile Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigateTo('/admin')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Supervisory Ledger</span>
          </button>

          <button
            type="button"
            onClick={handleSimulateAsInspector}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span>Open Inspector Session</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-xs">
                {inspector.avatar || inspector.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">{inspector.name}</h1>
                  <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-semibold text-slate-700">
                    {inspector.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{inspector.designation}</p>
                <p className="text-xs text-slate-400 mt-0.5">{inspector.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Role</span>
                <span className="font-bold text-slate-800">Field Inspector</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Unit</span>
                <span className="font-bold text-slate-800">{inspector.office}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Testing Mode</span>
                <span className="font-bold text-emerald-800">Real Stored Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real Metrics Grid - Strict real data */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Real Visits
            </span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{totalReal}</span>
            <span className="text-[10px] text-slate-400">Actual field inputs</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Completed
            </span>
            <span className="text-2xl font-black text-emerald-700 block mt-1">{completed}</span>
            <span className="text-[10px] text-slate-400">Reports endorsed</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Drafts
            </span>
            <span className="text-2xl font-black text-slate-700 block mt-1">{drafts}</span>
            <span className="text-[10px] text-slate-400">In-progress</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Pending Reviews
            </span>
            <span className="text-2xl font-black text-amber-700 block mt-1">{pendingReviews}</span>
            <span className="text-[10px] text-slate-400">Action required</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Reports Ready
            </span>
            <span className="text-2xl font-black text-blue-700 block mt-1">{reports}</span>
            <span className="text-[10px] text-slate-400">Ready to export</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Active Workload
            </span>
            <span className="text-2xl font-black text-purple-700 block mt-1">{currentWorkload}</span>
            <span className="text-[10px] text-slate-400">Unclosed records</span>
          </div>
        </div>

        {/* Inspection History for This Officer */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Inspection History &amp; Evidence Ledger</h2>
              <p className="text-xs text-slate-500">
                All real inspection visits recorded by {inspector.name}
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
              {inspectorInspections.length} Records
            </span>
          </div>

          {inspectorInspections.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-3">
              <Store className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <p className="text-xs font-semibold text-slate-700">No real inspections recorded yet</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  When {inspector.name} performs field inspections or uploads packaged commodity images,
                  their records and verification status will appear here.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSimulateAsInspector}
                className="px-3 py-1.5 bg-blue-700 text-white rounded text-xs font-bold cursor-pointer"
              >
                Perform Test Visit as {inspector.name}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Reference ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Business / Retailer</th>
                    <th className="p-3">Commodity &amp; Brand</th>
                    <th className="p-3">Images</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inspectorInspections.map((ins) => (
                    <tr key={ins.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-blue-900">{ins.id}</td>
                      <td className="p-3 text-slate-600">{ins.inspectionDate}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{ins.business.name}</div>
                        <div className="text-[11px] text-slate-500">{ins.business.type}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-800">{ins.product.name}</div>
                        <div className="text-[11px] text-slate-500">{ins.product.brand} ({ins.product.declaredQuantity || 'N/A'})</div>
                      </td>
                      <td className="p-3">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                          {ins.images.length}
                        </span>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={ins.status} />
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenInspection(ins.id, 'result')}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded font-semibold transition-colors cursor-pointer"
                        >
                          View File
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};
