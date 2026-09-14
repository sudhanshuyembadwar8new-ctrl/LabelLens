import React, { useState } from 'react';
import { useInspection } from '../context/InspectionContext';
import { AppShell } from '../components/layout/AppShell';
import { Stepper } from '../components/ui/Stepper';
import { ReportCanvas } from '../components/workflow/ReportCanvas';
import { CheckCircle2, ShieldCheck, ArrowRight, LayoutDashboard, PlusCircle } from 'lucide-react';

export const ReportPreviewPage: React.FC = () => {
  const {
    currentInspection,
    currentUser,
    navigateTo,
    switchRole,
    saveDraftInspection,
    markInspectionComplete,
    showToast,
  } = useInspection();

  const [showSubmitSuccessModal, setShowSubmitSuccessModal] = useState(false);

  const inspection = currentInspection;

  if (!inspection) {
    return (
      <AppShell breadcrumbs={[{ label: 'Inspection Not Found' }]}>
        <div className="p-8 text-center">
          <p className="text-slate-600">Inspection record not found.</p>
          <button
            type="button"
            onClick={() => navigateTo('/inspections')}
            className="mt-4 px-4 py-2 bg-blue-700 text-white rounded text-xs font-semibold"
          >
            Go to Registry
          </button>
        </div>
      </AppShell>
    );
  }

  const handleSaveDraft = () => {
    saveDraftInspection({
      ...inspection,
      status: 'REPORT_READY',
    });
    showToast('Report saved as ready for official sign-off', 'info');
  };

  const handleMarkComplete = () => {
    markInspectionComplete(inspection.id);
    setShowSubmitSuccessModal(true);
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Inspections', route: '/inspections' },
        { label: inspection.id, route: `/inspections/${inspection.id}/result` },
        { label: 'Report Preview' },
      ]}
    >
      <div className="space-y-6">
        {/* Stepper Step 5 Active */}
        <div className="print:hidden">
          <Stepper currentStep="report" />
        </div>

        {/* Paper-Like Report Canvas */}
        <ReportCanvas
          inspection={inspection}
          inspector={currentUser}
          onBackToEvidence={() =>
            navigateTo(`/inspections/${inspection.id}/evidence`)
          }
          onReturnDashboard={() => navigateTo('/dashboard')}
          onSaveDraft={handleSaveDraft}
          onMarkComplete={handleMarkComplete}
        />
      </div>

      {/* Submission Success Modal */}
      {showSubmitSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Statutory Submission Complete</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Inspection Synced to Admin Portal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspection <strong className="font-mono text-slate-800">{inspection.id}</strong> conducted by <strong>{currentUser.name}</strong> for <strong>{inspection.business.name}</strong> has been transmitted directly to the Directorate central database and is now live in the Admin Portal under your officer section.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Officer ID:</span>
                <span className="font-mono font-bold text-slate-900">{currentUser.id}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Commodity:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[200px]">{inspection.product.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status in Admin:</span>
                <span className="text-emerald-700 font-bold">REPORT READY (Verified)</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowSubmitSuccessModal(false);
                  switchRole('ADMIN');
                  navigateTo('/admin');
                }}
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>View on Directorate Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmitSuccessModal(false);
                    navigateTo('/dashboard');
                  }}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>My Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowSubmitSuccessModal(false);
                    navigateTo('/inspections/new');
                  }}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Inspection</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};
