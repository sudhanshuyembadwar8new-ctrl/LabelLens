import React from 'react';
import { useInspection } from '../context/InspectionContext';
import { AppShell } from '../components/layout/AppShell';
import { Stepper } from '../components/ui/Stepper';
import { ProgressChecklist } from '../components/workflow/ProgressChecklist';

export const MockAnalysisPage: React.FC = () => {
  const { currentInspection, runAnalysisOnInspection, navigateTo } = useInspection();
  const inspectionId = currentInspection?.id || 'INS-2026-0043';

  const handleAnalysisComplete = () => {
    runAnalysisOnInspection(inspectionId);
    navigateTo(`/inspections/${inspectionId}/result`);
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Inspections', route: '/inspections' },
        { label: inspectionId, route: `/inspections/${inspectionId}/upload` },
        { label: 'Regulatory Analysis' },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stepper Step 3 Active */}
        <Stepper currentStep="analyze" />

        {/* Processing Panel */}
        <ProgressChecklist
          inspectionId={inspectionId}
          onComplete={handleAnalysisComplete}
        />
      </div>
    </AppShell>
  );
};
