import React, { useEffect } from 'react';
import { useInspection } from '../context/InspectionContext';

export const NewInspectionDetailsPage: React.FC = () => {
  const { startNewInspection } = useInspection();

  useEffect(() => {
    // Automatically initiate zero-fill package scanning inspection
    startNewInspection();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="w-12 h-12 rounded-full border-3 border-blue-500 border-t-transparent animate-spin mb-4" />
      <h2 className="text-base font-bold text-slate-100">Launching Package Scanner...</h2>
      <p className="text-xs text-slate-400 mt-1 max-w-sm">
        Zero pre-filling required: Capture product photos and AI will automatically extract commodity name, brand, net quantity, and manufacturer.
      </p>
    </div>
  );
};
