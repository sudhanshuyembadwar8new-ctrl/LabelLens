import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  RotateCw,
  Sun,
  Contrast,
  Layers,
  ZoomIn,
  Ruler,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  SplitSquareVertical,
} from 'lucide-react';
import {
  PreprocessingOptions,
  ImageQualityMetrics,
  processPackageImage,
} from '../../services/imageProcessing';

interface ImagePreprocessingToolbarProps {
  originalDataUrl: string;
  onProcessed: (processedDataUrl: string) => void;
  role: string;
}

export const ImagePreprocessingToolbar: React.FC<ImagePreprocessingToolbarProps> = ({
  originalDataUrl,
  onProcessed,
  role,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Preprocessing state
  const [options, setOptions] = useState<PreprocessingOptions>({
    autoEnhance: true,
    brightness: 0,
    contrast: 0,
    sharpen: false,
    sharpenStrength: 0.8,
    isolateText: false,
    unwarpCylinder: false,
    cylinderCurvature: 0.5,
    rotation: 0,
  });

  const [metrics, setMetrics] = useState<ImageQualityMetrics | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(originalDataUrl);

  // Caliper & Loupe state
  const [showCaliper, setShowCaliper] = useState(false);
  const [caliperHeightMm, setCaliperHeightMm] = useState<number>(3.2);
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 4 | 8>(1);

  const applyChanges = async (newOpts: PreprocessingOptions) => {
    setIsProcessing(true);
    try {
      const result = await processPackageImage(originalDataUrl, newOpts);
      setPreviewUrl(result.processedDataUrl);
      setMetrics(result.metrics);
      onProcessed(result.processedDataUrl);
    } catch (e) {
      console.error('Image processing failed', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleAutoEnhance = () => {
    const next = { ...options, autoEnhance: !options.autoEnhance };
    setOptions(next);
    applyChanges(next);
  };

  const handleToggleSharpen = () => {
    const next = { ...options, sharpen: !options.sharpen };
    setOptions(next);
    applyChanges(next);
  };

  const handleToggleTextIsolation = () => {
    const next = { ...options, isolateText: !options.isolateText };
    setOptions(next);
    applyChanges(next);
  };

  const handleToggleCylinder = () => {
    const next = { ...options, unwarpCylinder: !options.unwarpCylinder };
    setOptions(next);
    applyChanges(next);
  };

  const handleRotate = () => {
    const rotations: (0 | 90 | 180 | 270)[] = [0, 90, 180, 270];
    const currentIdx = rotations.indexOf(options.rotation || 0);
    const nextRot = rotations[(currentIdx + 1) % rotations.length];
    const next = { ...options, rotation: nextRot };
    setOptions(next);
    applyChanges(next);
  };

  const handleReset = () => {
    const resetOpts: PreprocessingOptions = {
      autoEnhance: false,
      brightness: 0,
      contrast: 0,
      sharpen: false,
      isolateText: false,
      unwarpCylinder: false,
      rotation: 0,
    };
    setOptions(resetOpts);
    setPreviewUrl(originalDataUrl);
    onProcessed(originalDataUrl);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 border border-slate-800 shadow-md space-y-3">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold flex items-center gap-1.5 text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optical Preprocessing & Quality Suite</span>
          </span>
          <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] px-2 py-0.5 rounded font-mono">
            {role} PANEL
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
              showComparison
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <SplitSquareVertical className="w-3 h-3" />
            <span>Before / After</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-2.5 py-1 rounded text-[11px] font-medium bg-blue-700 hover:bg-blue-600 text-white transition-all cursor-pointer flex items-center gap-1"
          >
            <Sliders className="w-3 h-3" />
            <span>{isOpen ? 'Close Tools' : 'Adjust Optical Tools'}</span>
          </button>
        </div>
      </div>

      {/* Quick 1-Click Toggles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
        {/* 1. Auto-Enhance */}
        <button
          type="button"
          onClick={handleToggleAutoEnhance}
          className={`p-2 rounded-lg border flex items-center gap-2 text-left transition-all cursor-pointer ${
            options.autoEnhance
              ? 'bg-blue-950/80 border-blue-500 text-blue-200'
              : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
          }`}
          title="Auto exposure gain & contrast stretch for dark or dim package photographs"
        >
          <Sun className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="overflow-hidden">
            <div className="font-bold truncate">Auto-Gain & Exposure</div>
            <div className="text-[9px] text-slate-400">Dark / Dim lighting</div>
          </div>
        </button>

        {/* 2. Unsharp Mask Sharpening */}
        <button
          type="button"
          onClick={handleToggleSharpen}
          className={`p-2 rounded-lg border flex items-center gap-2 text-left transition-all cursor-pointer ${
            options.sharpen
              ? 'bg-blue-950/80 border-blue-500 text-blue-200'
              : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
          }`}
          title="Unsharp mask sharpening filter for blurry packaging text"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="overflow-hidden">
            <div className="font-bold truncate">Unsharp Mask (Sharpen)</div>
            <div className="text-[9px] text-slate-400">Blurry / Faint print</div>
          </div>
        </button>

        {/* 3. Cylindrical Unwarp */}
        <button
          type="button"
          onClick={handleToggleCylinder}
          className={`p-2 rounded-lg border flex items-center gap-2 text-left transition-all cursor-pointer ${
            options.unwarpCylinder
              ? 'bg-blue-950/80 border-blue-500 text-blue-200'
              : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
          }`}
          title="Unwrap curved typography on cylindrical cans, bottles, or jars"
        >
          <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="overflow-hidden">
            <div className="font-bold truncate">Cylindrical Unwarp</div>
            <div className="text-[9px] text-slate-400">Bottles / Cans / Jars</div>
          </div>
        </button>

        {/* 4. Text Isolation / Background Removal */}
        <button
          type="button"
          onClick={handleToggleTextIsolation}
          className={`p-2 rounded-lg border flex items-center gap-2 text-left transition-all cursor-pointer ${
            options.isolateText
              ? 'bg-blue-950/80 border-blue-500 text-blue-200'
              : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
          }`}
          title="Sauvola adaptive thresholding isolates text from decorative colorful backgrounds"
        >
          <Contrast className="w-4 h-4 text-purple-400 shrink-0" />
          <div className="overflow-hidden">
            <div className="font-bold truncate">Text Isolation</div>
            <div className="text-[9px] text-slate-400">Decorative packaging</div>
          </div>
        </button>
      </div>

      {/* Expanded Granular Controls */}
      {isOpen && (
        <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Brightness slider */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">Brightness Gain:</span>
                <span className="font-mono text-blue-400">{options.brightness || 0}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="60"
                value={options.brightness || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  const next = { ...options, brightness: val };
                  setOptions(next);
                  applyChanges(next);
                }}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Contrast slider */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">Contrast Equalization:</span>
                <span className="font-mono text-blue-400">{options.contrast || 0}</span>
              </div>
              <input
                type="range"
                min="-40"
                max="70"
                value={options.contrast || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  const next = { ...options, contrast: val };
                  setOptions(next);
                  applyChanges(next);
                }}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Cylinder Arc Curvature */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">Cylinder Curvature Arc:</span>
                <span className="font-mono text-blue-400">
                  {Math.round((options.cylinderCurvature || 0.5) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={options.cylinderCurvature || 0.5}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const next = { ...options, cylinderCurvature: val, unwarpCylinder: true };
                  setOptions(next);
                  applyChanges(next);
                }}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Secondary tool row: Rotation, Caliper, Loupe */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/80">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-blue-400" />
                <span>Rotate 90° ({options.rotation || 0}°)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCaliper(!showCaliper)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer ${
                  showCaliper ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-200'
                }`}
                title="Verify PCR Rule 13 minimum character height with digital millimeter ruler"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Rule 13 Caliper Gauge</span>
              </button>

              <div className="flex items-center gap-1 bg-slate-700 px-2 py-0.5 rounded text-[11px]">
                <ZoomIn className="w-3.5 h-3.5 text-slate-300" />
                <span>Loupe:</span>
                {([1, 2, 4, 8] as const).map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setZoomLevel(z)}
                    className={`px-1 rounded text-[10px] font-mono cursor-pointer ${
                      zoomLevel === z ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
                    }`}
                  >
                    {z}x
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-2 py-1 bg-slate-700 hover:bg-rose-900 text-slate-300 hover:text-rose-200 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Original</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Caliper Gauge Overlay instructions when active */}
      {showCaliper && (
        <div className="bg-amber-950/70 border border-amber-600/70 rounded-lg p-2.5 text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Digital Optical Caliper (Rule 13 Verification):</span>{' '}
              <span>Calibrated scale active. Target character height measured at</span>{' '}
              <span className="font-mono font-bold bg-amber-900 px-1.5 py-0.5 rounded text-amber-100">
                {caliperHeightMm} mm
              </span>{' '}
              <span>(Rule 13 mandate: ≥ 2.0 mm for 100g–500g, ≥ 4.0 mm for &gt; 1kg)</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setCaliperHeightMm(Math.max(1.0, +(caliperHeightMm - 0.2).toFixed(1)))}
              className="px-1.5 py-0.5 bg-amber-900 rounded font-mono text-[11px] cursor-pointer"
            >
              -0.2
            </button>
            <button
              type="button"
              onClick={() => setCaliperHeightMm(+(caliperHeightMm + 0.2).toFixed(1))}
              className="px-1.5 py-0.5 bg-amber-900 rounded font-mono text-[11px] cursor-pointer"
            >
              +0.2
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
