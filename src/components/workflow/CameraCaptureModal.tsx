import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Upload,
  SwitchCamera,
  ShieldAlert,
  Smartphone,
  Zap,
} from 'lucide-react';
import { ImageRole, ProductImage } from '../../types';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (image: ProductImage) => void;
  onFallbackUpload: () => void;
  targetRole: ImageRole;
  targetLabel: string;
}

type CameraStatus =
  | 'requesting'
  | 'loading'
  | 'active'
  | 'captured'
  | 'black_screen'
  | 'denied'
  | 'unavailable';

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  onFallbackUpload,
  targetRole,
  targetLabel,
}) => {
  const [status, setStatus] = useState<CameraStatus>('loading');
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [capturedDimensions, setCapturedDimensions] = useState<{ width: number; height: number }>({
    width: 1280,
    height: 720,
  });
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const isStartingRef = useRef(false);

  // Clean stream shutdown: stops all hardware tracks and safely releases camera HAL
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      try {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => {
          try {
            track.stop();
            track.enabled = false;
          } catch (e) {
            console.warn('Error stopping track:', e);
          }
        });
      } catch (e) {
        console.warn('Error accessing tracks:', e);
      }
      streamRef.current = null;
    }

    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        videoRef.current.onloadedmetadata = null;
        videoRef.current.oncanplay = null;
        videoRef.current.onplaying = null;
      } catch (e) {
        console.warn('Error resetting video element:', e);
      }
    }
  }, []);

  // Progressive camera initialization with hardware fallback
  const startCamera = async (facing: 'environment' | 'user' = facingMode) => {
    if (isStartingRef.current) return;
    isStartingRef.current = true;

    try {
      stopStream();
      setStatus('loading');
      setErrorMessage(null);

      // Brief delay to allow mobile OS camera HAL to release previous session
      await new Promise((resolve) => setTimeout(resolve, 150));

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus('unavailable');
        setErrorMessage(
          'In-browser camera API is not supported in this environment. Please tap "Use Phone Camera" below.'
        );
        return;
      }

      const constraintTiers: MediaStreamConstraints[] = [
        {
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        },
        {
          video: {
            facingMode: { ideal: facing },
          },
          audio: false,
        },
        {
          video: true,
          audio: false,
        },
      ];

      let acquiredStream: MediaStream | null = null;
      let lastError: any = null;

      for (const constraints of constraintTiers) {
        try {
          acquiredStream = await navigator.mediaDevices.getUserMedia(constraints);
          if (acquiredStream && acquiredStream.active) {
            break;
          }
        } catch (err: any) {
          lastError = err;
        }
      }

      if (acquiredStream) {
        streamRef.current = acquiredStream;

        const video = videoRef.current;
        if (video) {
          video.muted = true;
          video.autoplay = true;
          video.playsInline = true;
          video.setAttribute('playsinline', 'true');
          video.setAttribute('webkit-playsinline', 'true');
          video.srcObject = acquiredStream;

          const activate = () => {
            setStatus('active');
          };

          video.onloadedmetadata = () => {
            video.play().then(activate).catch(() => activate());
          };
          video.oncanplay = activate;
          video.onplaying = activate;

          try {
            await video.play();
            activate();
          } catch (playErr) {
            console.warn('Video play resolved with fallback:', playErr);
            activate();
          }
        }
      } else {
        console.warn('Camera acquisition failed:', lastError);
        if (
          lastError?.name === 'NotAllowedError' ||
          lastError?.name === 'PermissionDeniedError' ||
          lastError?.message?.toLowerCase().includes('denied')
        ) {
          setStatus('denied');
          setErrorMessage(
            'Browser camera permission was not granted. Tap "Use Phone Camera" to snap photos directly.'
          );
        } else {
          setStatus('unavailable');
          setErrorMessage(
            'Camera hardware is busy. Tap "Use Phone Camera" to take photos directly using your phone camera app.'
          );
        }
      }
    } finally {
      isStartingRef.current = false;
    }
  };

  // Lifecycle: Re-initialize camera every time modal opens or target changes
  useEffect(() => {
    if (isOpen) {
      setCapturedDataUrl(null);
      setStatus('loading');
      startCamera(facingMode);
    } else {
      stopStream();
      setCapturedDataUrl(null);
    }

    return () => {
      stopStream();
    };
  }, [isOpen, targetRole]);

  // Capture frame from live video
  const handleCaptureFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    const canvas = canvasRef.current || document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedDataUrl(dataUrl);
      setCapturedDimensions({ width, height });
      setStatus('captured');
    }
  };

  const handleRetake = () => {
    setCapturedDataUrl(null);
    startCamera(facingMode);
  };

  const handleSwitchCamera = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  const handleAcceptPhoto = () => {
    if (!capturedDataUrl) return;

    const now = new Date();
    const timestampStr = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newImage: ProductImage = {
      id: `CAM-${Date.now()}-${targetRole}`,
      filename: `capture_${targetRole.toLowerCase()}_${Date.now().toString().slice(-6)}.jpg`,
      role: targetRole,
      width: capturedDimensions.width,
      height: capturedDimensions.height,
      captureSource: 'camera',
      dataUrl: capturedDataUrl,
      createdAt: timestampStr,
      uploadedAt: timestampStr,
      mimeType: 'image/jpeg',
    };

    stopStream();
    onCapture(newImage);
    onClose();
  };

  const handleClose = () => {
    stopStream();
    onClose();
  };

  // 100% Reliable Native Device Camera Trigger (Direct OS Intent)
  const triggerNativePhoneCamera = () => {
    stopStream();
    nativeCameraInputRef.current?.click();
  };

  const handleNativeCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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

          const newImage: ProductImage = {
            id: `PHONE-${Date.now()}-${targetRole}`,
            filename: file.name || `photo_${targetRole.toLowerCase()}.jpg`,
            role: targetRole,
            width: img.width || 1280,
            height: img.height || 720,
            captureSource: 'camera',
            dataUrl,
            createdAt: timestampStr,
            uploadedAt: timestampStr,
            mimeType: file.type || 'image/jpeg',
          };

          stopStream();
          onCapture(newImage);
          onClose();
        };
        img.onerror = () => {
          const timestampStr = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          const fallbackImage: ProductImage = {
            id: `PHONE-${Date.now()}-${targetRole}`,
            filename: file.name || `photo_${targetRole.toLowerCase()}.jpg`,
            role: targetRole,
            width: 1280,
            height: 720,
            captureSource: 'camera',
            dataUrl,
            createdAt: timestampStr,
            uploadedAt: timestampStr,
            mimeType: file.type || 'image/jpeg',
          };
          stopStream();
          onCapture(fallbackImage);
          onClose();
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in">
      {/* Hidden Native Phone Camera file input */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleNativeCameraCapture}
      />

      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                Capture: {targetLabel}
              </h3>
              <p className="text-[10px] text-slate-400 truncate">
                Align statutory declarations clearly
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Direct Phone Camera Button - Always Available */}
            <button
              type="button"
              onClick={triggerNativePhoneCamera}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Open your phone camera app directly"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Use Phone Cam</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close camera modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport / Video Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[320px] sm:min-h-[420px] overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-contain max-h-[55vh] transition-opacity duration-200 ${
              status === 'active' ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Active Viewfinder Framing Overlay */}
          {status === 'active' && (
            <>
              <div className="absolute inset-5 sm:inset-10 pointer-events-none border border-white/30 rounded-xl flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                </div>
                <div className="text-center">
                  <span className="inline-block text-[10px] font-semibold text-white/90 bg-black/60 px-2.5 py-1 rounded backdrop-blur-xs">
                    Align Brand, MRP &amp; Net Quantity within box
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-amber-400" />
                </div>
              </div>

              {/* Camera Switch button (Front/Rear) */}
              <button
                type="button"
                onClick={handleSwitchCamera}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white border border-slate-700 hover:bg-slate-800 transition-colors shadow-md cursor-pointer z-10"
                title="Switch Camera (Front/Rear)"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Black Screen / Hardware Lock Detected State */}
          {status === 'black_screen' && (
            <div className="absolute inset-0 z-20 bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
                <Smartphone className="w-7 h-7 text-blue-400" />
              </div>
              <div className="max-w-xs space-y-1.5">
                <h4 className="text-sm font-bold text-white">
                  Mobile In-Browser Camera Paused
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your phone's browser locked the WebRTC video stream. Tap below to capture with your phone's native camera with auto-focus and flash:
                </p>
              </div>

              <div className="flex flex-col w-full max-w-xs gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={triggerNativePhoneCamera}
                  className="w-full min-h-[46px] px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Photo with Phone Camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onFallbackUpload();
                  }}
                  className="w-full min-h-[38px] px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Select from Gallery</span>
                </button>

                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="text-xs text-slate-400 hover:text-white py-1 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry Viewfinder Stream</span>
                </button>
              </div>
            </div>
          )}

          {/* Captured Preview State */}
          {status === 'captured' && capturedDataUrl && (
            <div className="absolute inset-0 z-20 bg-black flex flex-col items-center justify-center p-3">
              <img
                src={capturedDataUrl}
                alt="Captured Package"
                className="w-full h-full object-contain max-h-[50vh] rounded-lg border border-slate-700 shadow-lg"
              />
              <div className="absolute top-3 left-3 bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Photo Captured ({capturedDimensions.width} × {capturedDimensions.height})</span>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {status === 'loading' && (
            <div className="absolute inset-0 z-10 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <div>
                <p className="text-xs font-bold">Connecting Camera Hardware...</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Starting camera stream. If screen stays dark, tap below:
                </p>
              </div>

              <button
                type="button"
                onClick={triggerNativePhoneCamera}
                className="mt-2 px-3.5 py-2 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Use Phone Camera Directly</span>
              </button>
            </div>
          )}

          {/* Denied / Unavailable States */}
          {(status === 'denied' || status === 'unavailable') && (
            <div className="absolute inset-0 z-20 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center text-white max-w-sm mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                {status === 'denied' ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-300">
                  {status === 'denied' ? 'Camera Permission Needed' : 'Camera Stream Busy'}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {errorMessage || 'You can capture photos directly using your phone\'s native camera.'}
                </p>
              </div>

              <div className="flex flex-col w-full gap-2 pt-2">
                <button
                  type="button"
                  onClick={triggerNativePhoneCamera}
                  className="w-full min-h-[42px] px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Take Photo with Phone Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onFallbackUpload();
                  }}
                  className="w-full min-h-[38px] px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image from Gallery</span>
                </button>
              </div>
            </div>
          )}

          {/* Hidden Canvas for Frame Capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Modal Controls / Bottom Action Bar */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 shrink-0 space-y-2.5">
          {status === 'active' && (
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="min-h-[42px] px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              {/* Shutter Capture Button */}
              <button
                type="button"
                onClick={handleCaptureFrame}
                className="w-14 h-14 rounded-full bg-white hover:bg-slate-200 active:scale-95 text-slate-900 flex items-center justify-center shadow-lg border-4 border-blue-500/80 transition-all cursor-pointer"
                title="Capture Product Photograph"
                aria-label="Capture photograph"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600" />
              </button>

              <button
                type="button"
                onClick={triggerNativePhoneCamera}
                className="min-h-[42px] px-3 py-2 text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 cursor-pointer"
                title="Launch phone camera app"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden xs:inline">Phone Cam</span>
              </button>
            </div>
          )}

          {status === 'captured' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleRetake}
                className="min-h-[44px] px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptPhoto}
                className="min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Attach Photo</span>
              </button>
            </div>
          )}

          {/* Persistent Guarantee Footer */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span className="flex items-center gap-1 text-slate-400">
              <Zap className="w-3 h-3 text-amber-400" />
              Phone camera has autofocus &amp; flash
            </span>
            <button
              type="button"
              onClick={triggerNativePhoneCamera}
              className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 cursor-pointer"
            >
              Open Phone Camera
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
