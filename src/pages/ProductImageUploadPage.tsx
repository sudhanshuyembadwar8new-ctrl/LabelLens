import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';
import { AppShell } from '../components/layout/AppShell';
import { Stepper } from '../components/ui/Stepper';
import { FileDropzone } from '../components/workflow/FileDropzone';
import { ImageAsset } from '../types';
import {
  createMockFrontPackageSvg,
  createMockBackPackageSvg,
} from '../data/seedData';

export const ProductImageUploadPage: React.FC = () => {
  const {
    currentInspection,
    saveDraftInspection,
    navigateTo,
    showToast,
  } = useInspection();

  const inspection = currentInspection;
  const [images, setImages] = useState<ImageAsset[]>(
    inspection?.images && inspection.images.length > 0
      ? inspection.images
      : []
  );

  const hasFrontImage = images.some((img) => img.role === 'FRONT');

  const handleAddImage = (newImage: ImageAsset) => {
    const updated = [...images.filter((i) => i.role !== newImage.role), newImage];
    setImages(updated);
    if (inspection) {
      saveDraftInspection({
        ...inspection,
        images: updated,
      });
    }
    showToast(`Uploaded ${newImage.role} package image`, 'info');
  };

  const handleRemoveImage = (imageId: string) => {
    const updated = images.filter((img) => img.id !== imageId);
    setImages(updated);
    if (inspection) {
      saveDraftInspection({
        ...inspection,
        images: updated,
      });
    }
  };

  const handleLoadSeedPackage = () => {
    const frontData = createMockFrontPackageSvg();
    const backData = createMockBackPackageSvg();

    const seedAssets: ImageAsset[] = [
      {
        id: `IMG-${Date.now()}-FRONT`,
        filename: 'annapurna_rice_front_5kg.png',
        role: 'FRONT',
        width: 1200,
        height: 1600,
        captureSource: 'Direct field camera capture',
        dataUrl: frontData,
        uploadedAt: '31 Aug 2026, 11:24',
        mimeType: 'image/svg+xml',
      },
      {
        id: `IMG-${Date.now()}-BACK`,
        filename: 'annapurna_rice_back_statutory.png',
        role: 'BACK',
        width: 1200,
        height: 1600,
        captureSource: 'Direct field camera capture',
        dataUrl: backData,
        uploadedAt: '31 Aug 2026, 11:25',
        mimeType: 'image/svg+xml',
      },
    ];

    setImages(seedAssets);
    if (inspection) {
      saveDraftInspection({
        ...inspection,
        images: seedAssets,
      });
    }
    showToast('Loaded Annapurna 5kg sample package images (Front & Back)', 'info');
  };

  const handleStartAnalysis = () => {
    if (!hasFrontImage) {
      showToast('Front package image is required before analyzing', 'error');
      return;
    }
    if (inspection) {
      saveDraftInspection({
        ...inspection,
        images,
      });
      navigateTo(`/inspections/${inspection.id}/analyzing`);
    }
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Inspections', route: '/inspections' },
        { label: inspection?.id || 'Inspection', route: `/inspections/${inspection?.id}/result` },
        { label: 'Capture Product' },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Workflow Stepper */}
        <Stepper currentStep="upload" />

        {/* Top Summary Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold border border-slate-200">
                {inspection?.id || 'INS-2026-0001'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Zero Pre-Filling Required
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
              Capture Package Photos for Automatic Inspection
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              No need to fill product or brand details before inspecting. Snap photos of the package — the AI scanner automatically reads the brand name, product name, net quantity, MRP &amp; statutory declarations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSeedPackage}
            className="w-full sm:w-auto px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 min-h-[38px]"
            title="Load sample package images for instant demonstration"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Load Sample Images</span>
          </button>
        </div>

        {/* Evidentiary Privacy Notice */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2.5 sm:p-3 text-[11px] text-blue-950 flex items-start sm:items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-snug">
            <strong>Evidentiary Protocol:</strong> Only capture package surfaces, barcodes, and statutory labels. Do not photograph store personnel or customers.
          </span>
        </div>

        {/* Dropzone & Slot Cards Component */}
        <FileDropzone
          images={images}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
          onLoadSeedPackage={handleLoadSeedPackage}
        />

        {/* Bottom Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigateTo('/dashboard')}
            className="order-2 sm:order-1 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 flex items-center justify-center gap-1.5 transition-colors min-h-[42px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel &amp; Return to Dashboard</span>
          </button>

          <div className="order-1 sm:order-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {!hasFrontImage && (
              <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded font-medium flex items-center justify-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Front image required to enable scanner</span>
              </span>
            )}

            <button
              type="button"
              disabled={!hasFrontImage}
              onClick={handleStartAnalysis}
              className={`px-6 py-2.5 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors min-h-[44px] ${
                hasFrontImage
                  ? 'bg-blue-700 hover:bg-blue-800 text-white cursor-pointer active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <span>Scan Package &amp; Extract Declarations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
