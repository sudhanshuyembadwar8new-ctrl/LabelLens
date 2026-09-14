import React from 'react';
import { useInspection } from '../context/InspectionContext';
import { AppShell } from '../components/layout/AppShell';
import { EvidenceViewer } from '../components/workflow/EvidenceViewer';
import { ReviewStatus } from '../types';

export const EvidenceReviewPage: React.FC = () => {
  const {
    currentInspection,
    updateFindingReviewStatus,
    updateEvidenceItem,
    navigateTo,
    showToast,
  } = useInspection();

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

  const handleUpdateFindingStatus = (
    findingId: string,
    status: ReviewStatus,
    note?: string
  ) => {
    updateFindingReviewStatus(findingId, status, note);
    showToast(`Finding ${findingId} marked as ${status.replace('_', ' ')}`, 'info');
  };

  const handleUpdateEvidenceStatus = (
    evidenceId: string,
    status: ReviewStatus,
    note: string
  ) => {
    updateEvidenceItem(evidenceId, {
      reviewStatus: status,
      reviewerNote: note,
    });
    showToast(`Evidence ${evidenceId} updated to ${status.replace('_', ' ')}`, 'info');
  };

  const handleGenerateReport = () => {
    navigateTo(`/inspections/${inspection.id}/report`);
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Inspections', route: '/inspections' },
        { label: inspection.id, route: `/inspections/${inspection.id}/result` },
        { label: 'Evidence Review' },
      ]}
    >
      <div className="space-y-4">
        <EvidenceViewer
          inspection={inspection}
          onUpdateFindingStatus={handleUpdateFindingStatus}
          onUpdateEvidenceStatus={handleUpdateEvidenceStatus}
          onGenerateReport={handleGenerateReport}
        />
      </div>
    </AppShell>
  );
};
