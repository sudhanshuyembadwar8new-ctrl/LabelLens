import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileImage,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Camera,
  Layers,
  Upload,
  Eye,
  Info,
  Smartphone,
} from 'lucide-react';
import { ImageRole, ProductImage } from '../../types';
import { CameraCaptureModal } from './CameraCaptureModal';

interface FileDropzoneProps {
  images: ProductImage[];
  onAddImage: (image: ProductImage) => void;
  onRemoveImage: (imageId: string) => void;
  onLoadSeedPackage: () => void;
}

interface InspectionSlotConfig {
  role: ImageRole;
  title: string;
  requirement: 'Required' | 'Recommended' | 'Optional';
  instruction: string;
  statutoryMarkings: string[];
}

const INSPECTION_SLOTS: InspectionSlotConfig[] = [
  {
    role: 'FRONT',
    title: 'Front of Package',
    requirement: 'Required',
    instruction: 'Principal display panel showing brand name, product descriptor & declared net quantity.',
    statutoryMarkings: ['Brand Name', 'Commodity Title', 'Net Quantity (PCR Rule 11)', 'Font Height'],
  },
  {
    role: 'BACK',
    title: 'Back of Package',
    requirement: 'Recommended',
    instruction: 'Statutory compliance panel showing MRP, manufacturer address, month & year, consumer care.',
    statutoryMarkings: ['MRP (Incl. of all taxes)', 'Pkg Date (Month/Year)', 'Manufacturer Name & Address', 'Consumer Care'],
  },
  {
    role: 'SIDE',
    title: 'Side / Additional Views',
    requirement: 'Optional',
    instruction: 'Supplementary side panel showing unit sale price (USP), batch/lot code, or nutritional declaration.',
    statutoryMarkings: ['Unit Sale Price (USP)', 'Batch Number', 'EAN/UPC Barcode'],
  },
  {
    role: 'PRICE_CLOSEUP',
    title: 'Price / Stamp Closeup',
    requirement: 'Optional',
    instruction: 'Macro or closeup shot of embossed MRP, smudge-free price tag or model approval verification stamp.',
    statutoryMarkings: ['MRP Closeup', 'Model Approval Mark', 'Verification Stamp'],
  },
];

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  images,
  onAddImage,
  onRemoveImage,
  onLoadSeedPackage,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedRoleForUpload, setSelectedRoleForUpload] = useState<ImageRole>('FRONT');

  // Camera modal state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraRole, setCameraRole] = useState<ImageRole>('FRONT');
  const [cameraLabel, setCameraLabel] = useState<string>('Front of Package');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File, role: ImageRole, captureSource: 'camera' | 'upload' = 'upload') => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const now = new Date();
        const timestampStr = now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const newAsset: ProductImage = {
          id: `IMG-${Date.now()}-${role}`,
          filename: file.name || `capture_${role.toLowerCase()}.jpg`,
          role,
          width: img.width || 1200,
          height: img.height || 1600,
          captureSource,
          dataUrl,
          createdAt: timestampStr,
          uploadedAt: timestampStr,
          mimeType: file.type || 'image/jpeg',
        };
        onAddImage(newAsset);
      };
      img.onerror = () => {
        const timestampStr = new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const fallbackAsset: ProductImage = {
          id: `IMG-${Date.now()}-${role}`,
          filename: file.name || `capture_${role.toLowerCase()}.jpg`,
          role,
          width: 1200,
          height: 1600,
          captureSource,
          dataUrl,
          createdAt: timestampStr,
          uploadedAt: timestampStr,
          mimeType: file.type || 'image/jpeg',
        };
        onAddImage(fallbackAsset);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const existingRoles = images.map((i) => i.role);
      const targetRole = existingRoles.includes('FRONT') ? 'BACK' : 'FRONT';
      processFile(file, targetRole, 'upload');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], selectedRoleForUpload, 'upload');
      // Reset input value so same file or consecutive selection triggers change
      e.target.value = '';
    }
  };

  const handleNativeCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], selectedRoleForUpload, 'camera');
      // Reset input value so consecutive shots always trigger change
      e.target.value = '';
    }
  };

  const triggerUploadForRole = (role: ImageRole) => {
    setSelectedRoleForUpload(role);
    fileInputRef.current?.click();
  };

  const triggerNativeCameraForRole = (role: ImageRole) => {
    setSelectedRoleForUpload(role);
    nativeCameraInputRef.current?.click();
  };

  const openCameraForRole = (role: ImageRole, label: string) => {
    setCameraRole(role);
    setCameraLabel(label);
    setIsCameraOpen(true);
  };

  const isMobile = typeof navigator !== 'undefined' && (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
  );

  return (
    <div className="space-y-6">
      {/* Hidden file input for file upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Hidden file input for direct native phone camera snap */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleNativeCameraChange}
      />

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        targetRole={cameraRole}
        targetLabel={cameraLabel}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(image) => onAddImage(image)}
        onFallbackUpload={() => triggerUploadForRole(cameraRole)}
      />

      {/* Real-World Inspection Panel Slots */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Statutory Surface Capture Slots
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            *Front image required to initiate automated rule analysis
          </span>
        </div>

        {/* Mobile Inspector Quick Tip */}
        <div className="mb-3 bg-blue-50/80 border border-blue-200/90 rounded-lg p-2.5 text-[11px] text-blue-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Field Tip:</strong> Tap <strong>Capture with Camera</strong> for live viewfinder, or <strong>Phone Cam</strong> to shoot directly with your phone's native camera app with auto-focus &amp; flash.
            </span>
          </div>
        </div>

        {/* 4 Dedicated Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {INSPECTION_SLOTS.map((slot) => {
            const attachedImage = images.find((img) => img.role === slot.role);

            return (
              <div
                key={slot.role}
                className={`bg-white border rounded-xl p-3.5 sm:p-4 flex flex-col justify-between transition-all ${
                  attachedImage
                    ? 'border-emerald-300 ring-1 ring-emerald-100 shadow-xs'
                    : slot.requirement === 'Required'
                    ? 'border-amber-300 bg-amber-50/20 shadow-xs'
                    : 'border-slate-200 shadow-2xs'
                }`}
              >
                <div>
                  {/* Slot Header */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{slot.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        slot.requirement === 'Required'
                          ? 'bg-amber-100 text-amber-800'
                          : slot.requirement === 'Recommended'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {slot.requirement}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug mb-2 sm:mb-3">
                    {slot.instruction}
                  </p>

                  {/* Statutory Markings Verified */}
                  <div className="flex flex-wrap gap-1 mb-2.5 sm:mb-3">
                    {slot.statutoryMarkings.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Attached State vs Unattached State */}
                {attachedImage ? (
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <div className="relative h-44 sm:aspect-3/4 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group flex items-center justify-center">
                      <img
                        src={attachedImage.dataUrl}
                        alt={attachedImage.filename}
                        className="w-full h-full object-contain p-1"
                      />

                      {/* Source Indicator Badge */}
                      <div className="absolute top-2 left-2">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                            attachedImage.captureSource === 'camera'
                              ? 'bg-blue-900/90 text-blue-200 border border-blue-400/50'
                              : 'bg-slate-900/90 text-slate-200 border border-slate-600'
                          }`}
                        >
                          {attachedImage.captureSource === 'camera' ? (
                            <Camera className="w-3 h-3 text-blue-300" />
                          ) : (
                            <Upload className="w-3 h-3 text-slate-300" />
                          )}
                          <span>
                            {attachedImage.captureSource === 'camera' ? 'Camera' : 'Upload'}
                          </span>
                        </span>
                      </div>

                      <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow-xs">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <p className="font-semibold text-slate-900 truncate" title={attachedImage.filename}>
                        {attachedImage.filename}
                      </p>
                      <p className="text-slate-400 font-mono text-[10px]">
                        {attachedImage.width} × {attachedImage.height} px
                      </p>
                    </div>

                    {/* Retake / Replace / Remove Controls */}
                    <div className="space-y-1.5 pt-1">
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => triggerNativeCameraForRole(slot.role)}
                          className="min-h-[34px] py-1 px-1.5 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-md border border-blue-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Snap with phone camera"
                        >
                          <Camera className="w-3 h-3 text-blue-600" />
                          <span>Retake (Cam)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openCameraForRole(slot.role, slot.title)}
                          className="min-h-[34px] py-1 px-1.5 text-[11px] font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Recapture using camera viewfinder"
                        >
                          <span>Viewfinder</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => triggerUploadForRole(slot.role)}
                          className="min-h-[30px] py-1 px-1.5 text-[10px] font-semibold bg-white hover:bg-slate-50 text-slate-600 rounded-md border border-slate-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Upload replacement image file"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onRemoveImage(attachedImage.id)}
                          className="min-h-[30px] py-1 px-1.5 text-[10px] font-semibold bg-red-50 hover:bg-red-100 text-red-700 rounded-md border border-red-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Remove attached photo"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-44 sm:aspect-3/4 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/60 flex flex-col items-center justify-center p-3 text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-400 flex items-center justify-center">
                      <FileImage className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">
                      No photo attached
                    </span>

                    {/* Action buttons: Direct Phone Camera on Mobile, or Viewfinder */}
                    <div className="w-full space-y-1.5 pt-0.5">
                      {isMobile ? (
                        <>
                          <button
                            type="button"
                            onClick={() => triggerNativeCameraForRole(slot.role)}
                            className="w-full min-h-[42px] py-2 px-2.5 bg-blue-700 hover:bg-blue-800 active:scale-98 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            title="Take photo directly using your phone's native camera"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Take Photo (Phone Camera)</span>
                          </button>

                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => openCameraForRole(slot.role, slot.title)}
                              className="min-h-[34px] py-1 px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              title="Open interactive camera viewfinder"
                            >
                              <span>Viewfinder</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => triggerUploadForRole(slot.role)}
                              className="min-h-[34px] py-1 px-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              title="Select photo from files"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload File</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => openCameraForRole(slot.role, slot.title)}
                            className="w-full min-h-[38px] py-1.5 px-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            title="Open interactive camera viewfinder"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Capture with Camera</span>
                          </button>

                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => triggerNativeCameraForRole(slot.role)}
                              className="min-h-[32px] py-1 px-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              title="Take photo directly using your phone's native camera"
                            >
                              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                              <span>Phone Cam</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => triggerUploadForRole(slot.role)}
                              className="min-h-[32px] py-1 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              title="Select photo from files"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload File</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Fast Drag-and-Drop / Seed Helper (Desktop only to prevent mobile clutter) */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`hidden sm:block border-2 border-dashed rounded-xl p-5 text-center transition-all ${
          dragActive
            ? 'border-blue-600 bg-blue-50/70 scale-[0.99]'
            : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
      >
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>

          <h4 className="text-xs font-bold text-slate-800">
            Batch Drag-and-Drop or Quick Upload
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm">
            You can drop images anywhere here or load benchmark reference packages for calibration testing.
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => triggerUploadForRole('FRONT')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>Browse Device Files</span>
            </button>

            <button
              type="button"
              onClick={onLoadSeedPackage}
              className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Load Reference Package (Annapurna 5kg)</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-400 mt-2 font-mono">
            Accepted: JPG, PNG, WEBP • Max 15MB • Automatic EXIF orientation
          </p>
        </div>
      </div>
    </div>
  );
};
