import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scan,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Eye,
  FileCheck2,
  Tag,
  Scale,
  RefreshCw,
  Sliders,
  Volume2,
  VolumeX,
  Crosshair,
  Maximize2,
  Ruler,
  Layers,
  Activity,
  Flame,
  Check,
  Copy,
  Info,
  ChevronRight,
  HelpCircle,
  BarChart3,
  Award,
} from 'lucide-react';
import { soundFX } from '../../utils/audioFx';

interface BoundingBoxItem {
  id: string;
  label: string;
  ruleCode: string;
  ruleTitle: string;
  value: string;
  status: 'COMPLIANT' | 'FLAGGED' | 'ADVISORY';
  top: string;
  left: string;
  width: string;
  height: string;
  details: string;
  actualVsExpected?: {
    actual: string;
    expected: string;
  };
  fontMeasurement?: {
    actualMm: number;
    requiredMm: number;
    pdpAreaCm2: number;
  };
}

interface SamplePackage {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  pdpArea: string;
  batchCode: string;
  brandColor: string;
  accentGradient: string;
  complianceRating: number;
  boxes: BoundingBoxItem[];
}

const sampleItems: SamplePackage[] = [
  {
    id: 'sample-almonds',
    name: 'Valley Roasted Almond Crunch',
    subtitle: 'Heat-sealed metallized laminated foil pouch',
    category: 'Dry Fruits & Confectionery',
    pdpArea: '185 cm² (Medium PDP)',
    batchCode: 'VR-2026-X8',
    brandColor: '#ea580c',
    accentGradient: 'from-amber-900/40 via-orange-950/60 to-slate-900',
    complianceRating: 40,
    boxes: [
      {
        id: 'box-almond-mrp',
        label: 'Price Declaration (MRP)',
        ruleCode: 'Rule 6(1)(e)',
        ruleTitle: 'Prohibition of Extra Tax Declarations',
        value: 'MRP Rs. 450/- + TAX EXTRA',
        status: 'FLAGGED',
        top: '68%',
        left: '12%',
        width: '76%',
        height: '11%',
        details: 'Unlawful syntax: "TAX EXTRA" is strictly illegal under the Legal Metrology (Packaged Commodities) Rules, 2011. Maximum Retail Price must be inclusive of all taxes.',
        actualVsExpected: {
          actual: 'MRP Rs. 450/- + TAX EXTRA',
          expected: 'MRP ₹450.00 (incl. of all taxes)',
        },
      },
      {
        id: 'box-almond-netqty',
        label: 'Net Weight Unit Symbol',
        ruleCode: 'Rule 11',
        ruleTitle: 'SI Metric Units Compliance',
        value: 'Net Weight: 400 Gms.',
        status: 'FLAGGED',
        top: '48%',
        left: '12%',
        width: '44%',
        height: '11%',
        details: 'Non-standard symbol used: "Gms." with capital G and plural dot is illegal. Standard statutory symbol is strictly lowercase "g".',
        actualVsExpected: {
          actual: '400 Gms.',
          expected: '400 g',
        },
      },
      {
        id: 'box-almond-font',
        label: 'Numeral Font Height',
        ruleCode: 'Rule 13 Table I',
        ruleTitle: 'Minimum Numeral Font Height on PDP',
        value: 'Font Height: 1.8 mm (Deficit: 0.7 mm)',
        status: 'FLAGGED',
        top: '48%',
        left: '58%',
        width: '30%',
        height: '11%',
        details: 'Physical height deficit: For a PDP area of 185 cm² (between 100 cm² and 500 cm²), Rule 13 mandates minimum numeral height of 2.5 mm. Measured font is only 1.8 mm.',
        actualVsExpected: {
          actual: '1.8 mm numeral height',
          expected: '≥ 2.5 mm numeral height',
        },
        fontMeasurement: {
          actualMm: 1.8,
          requiredMm: 2.5,
          pdpAreaCm2: 185,
        },
      },
      {
        id: 'box-almond-origin',
        label: 'Country of Origin',
        ruleCode: 'Rule 6(1)(a)',
        ruleTitle: 'Mandatory Country of Origin',
        value: 'Product of India',
        status: 'COMPLIANT',
        top: '22%',
        left: '12%',
        width: '76%',
        height: '11%',
        details: 'Country of origin is prominently declared in conspicuous typography without ambiguity.',
      },
      {
        id: 'box-almond-care',
        label: 'Consumer Care Redressal',
        ruleCode: 'Rule 6(1)(d)',
        ruleTitle: 'Consumer Grievance Redressal Mechanism',
        value: 'Care: +91-1800-425-9988 | help@valley.in',
        status: 'COMPLIANT',
        top: '82%',
        left: '12%',
        width: '76%',
        height: '11%',
        details: 'Both a valid toll-free telephonic helpline and email address are printed on the consumer declaration panel.',
      },
    ],
  },
  {
    id: 'sample-tea',
    name: 'Himalayan Herbal Green Tea',
    subtitle: 'Hermetically sealed 250 g tin caddy with inner foil barrier',
    category: 'Beverages & Infusions',
    pdpArea: '140 cm² (Medium PDP)',
    batchCode: 'HIM-2026-T4',
    brandColor: '#059669',
    accentGradient: 'from-emerald-950/60 via-teal-950/40 to-slate-900',
    complianceRating: 75,
    boxes: [
      {
        id: 'box-tea-mrp',
        label: 'Maximum Retail Price',
        ruleCode: 'Rule 6(1)(e)',
        ruleTitle: 'Retail Sale Price & Taxes',
        value: 'MRP ₹285.00 (inclusive of all taxes)',
        status: 'COMPLIANT',
        top: '68%',
        left: '12%',
        width: '76%',
        height: '11%',
        details: 'Correct currency prefix (₹) and statutory inclusive tax declaration present.',
      },
      {
        id: 'box-tea-netqty',
        label: 'Net Quantity',
        ruleCode: 'Rule 11 & 13',
        ruleTitle: 'Metric Units & Font Height',
        value: 'Net Qty: 250 g (50 Tea Bags)',
        status: 'COMPLIANT',
        top: '48%',
        left: '12%',
        width: '76%',
        height: '12%',
        details: 'Valid SI symbol "g" without plural suffix. Minimum numeral font height satisfies PDP requirement (3.1 mm ≥ 2.5 mm).',
        fontMeasurement: {
          actualMm: 3.1,
          requiredMm: 2.5,
          pdpAreaCm2: 140,
        },
      },
      {
        id: 'box-tea-packer',
        label: 'Manufacturer / Packer',
        ruleCode: 'Rule 6(1)(a)',
        ruleTitle: 'Full Corporate Name & Address',
        value: 'Himalayan Organic Blends Pvt Ltd, Leh 194101',
        status: 'COMPLIANT',
        top: '18%',
        left: '12%',
        width: '76%',
        height: '14%',
        details: 'Complete registered legal identity with valid Indian PIN code found.',
      },
      {
        id: 'box-tea-care',
        label: 'Consumer Grievance Care',
        ruleCode: 'Rule 6(1)(d)',
        ruleTitle: 'Consumer Grievance Redressal',
        value: 'Support: grievance@himalayan.in (No phone printed)',
        status: 'FLAGGED',
        top: '82%',
        left: '12%',
        width: '76%',
        height: '11%',
        details: 'Email address present, but active telephone helpline number is missing on the PDP. PCR 2011 requires email, address, and telephone number.',
        actualVsExpected: {
          actual: 'Email address only',
          expected: 'Email + Active Telephone Helpline Number',
        },
      },
    ],
  },
  {
    id: 'sample-olive',
    name: 'Cold-Pressed Extra Virgin Olive Oil',
    subtitle: 'Tinted UV-barrier 500 ml glass flacon',
    category: 'Edible Oils & Condiments',
    pdpArea: '220 cm² (Medium PDP)',
    batchCode: 'EVOO-2026-SP',
    brandColor: '#ca8a04',
    accentGradient: 'from-amber-950/60 via-yellow-950/40 to-slate-900',
    complianceRating: 50,
    boxes: [
      {
        id: 'box-olive-mrp',
        label: 'Price Alteration Sticker (Dual MRP)',
        ruleCode: 'Rule 6(1)(e) & Section 18',
        ruleTitle: 'Smudged / Dual MRP Over-stickering',
        value: 'Dual Sticker: ₹540 pasted over ₹490',
        status: 'FLAGGED',
        top: '70%',
        left: '12%',
        width: '76%',
        height: '12%',
        details: 'Illegal upward price revision detected: Secondary price sticker of ₹540 affixed over original printed MRP of ₹490. Prohibited under Rule 18(2).',
        actualVsExpected: {
          actual: 'Secondary adhesive label: ₹540.00',
          expected: 'Original immutable manufacturer print: ₹490.00',
        },
      },
      {
        id: 'box-olive-vol',
        label: 'Liquid Volume Representation',
        ruleCode: 'Rule 11',
        ruleTitle: 'Approved Volume Units',
        value: 'Volume: 500 MLS.',
        status: 'FLAGGED',
        top: '50%',
        left: '12%',
        width: '42%',
        height: '12%',
        details: 'Non-standard abbreviation "MLS." is unlawful. The statutory symbol for millilitre is strictly lowercase "ml" or "mL".',
        actualVsExpected: {
          actual: '500 MLS.',
          expected: '500 ml or 500 mL',
        },
      },
      {
        id: 'box-olive-origin',
        label: 'Country of Origin & Importer',
        ruleCode: 'Rule 6(1)(a) & (4)',
        ruleTitle: 'Imported Commodity Mandates',
        value: 'Origin: Spain | Importer: Mediterra Foods, New Delhi',
        status: 'COMPLIANT',
        top: '20%',
        left: '12%',
        width: '76%',
        height: '14%',
        details: 'Country of origin (Spain) and Indian importer corporate name with city PIN are fully specified.',
      },
      {
        id: 'box-olive-expiry',
        label: 'Month & Year of Packaging',
        ruleCode: 'Rule 6(1)(c)',
        ruleTitle: 'Packaging Date & Best Before',
        value: 'Packed: 01/2026 | Best Before: 18 Months',
        status: 'COMPLIANT',
        top: '84%',
        left: '12%',
        width: '76%',
        height: '10%',
        details: 'Standard numeric date formatting in MM/YYYY format meets statutory requirements.',
      },
    ],
  },
  {
    id: 'sample-saffron',
    name: 'Kashmir Mongra Grade-A1 Saffron',
    subtitle: 'Vacuum-sealed 5 g blister pack with hologram tamper seal',
    category: 'GI-Tagged Spices',
    pdpArea: '65 cm² (Small PDP)',
    batchCode: 'KMS-2026-GI',
    brandColor: '#7c3aed',
    accentGradient: 'from-purple-950/60 via-indigo-950/40 to-slate-900',
    complianceRating: 100,
    boxes: [
      {
        id: 'box-saffron-mrp',
        label: 'Maximum Retail Price',
        ruleCode: 'Rule 6(1)(e)',
        ruleTitle: 'Inclusive Price Declaration',
        value: 'MRP ₹1,250.00 (incl. of all taxes)',
        status: 'COMPLIANT',
        top: '68%',
        left: '12%',
        width: '76%',
        height: '11%',
        details: 'Statutory format followed with Indian Rupee symbol and tax inclusive clause.',
      },
      {
        id: 'box-saffron-qty',
        label: 'Net Quantity',
        ruleCode: 'Rule 11 & 13',
        ruleTitle: 'Standard Gram Symbol & Font Ratio',
        value: 'Net Weight: 5 g',
        status: 'COMPLIANT',
        top: '48%',
        left: '12%',
        width: '76%',
        height: '12%',
        details: 'Compliant SI symbol "g". Measured numeral height 2.2 mm satisfies the small PDP requirement (≥ 1.5 mm for PDP ≤ 50 cm² to 100 cm²).',
        fontMeasurement: {
          actualMm: 2.2,
          requiredMm: 1.5,
          pdpAreaCm2: 65,
        },
      },
      {
        id: 'box-saffron-gi',
        label: 'GI Tag & Farmer Producer Org',
        ruleCode: 'Rule 6(1)(a)',
        ruleTitle: 'Geographical Indication & Origin',
        value: 'Pampore GI Reg: GI-724 | J&K Agri Dept',
        status: 'COMPLIANT',
        top: '18%',
        left: '12%',
        width: '76%',
        height: '14%',
        details: 'Full GI authorization certificate code and agricultural cooperative producer address verified.',
      },
      {
        id: 'box-saffron-care',
        label: 'Consumer Care & Grievance',
        ruleCode: 'Rule 6(1)(d)',
        ruleTitle: 'Multichannel Redressal Helpline',
        value: 'Helpline: 1800-180-7100 | care@saffronjk.gov.in',
        status: 'COMPLIANT',
        top: '82%',
        left: '12%',
        width: '76%',
        height: '11%',
        details: 'Full officer escalation contacts, official state portal email, and toll-free helpline active.',
      },
    ],
  },
];

type InspectionViewMode = 'HUD_SCAN' | 'CALIPER_RULE13' | 'HEATMAP' | 'DIAGNOSTICS';

export const InteractiveInspectionShowcase: React.FC = () => {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [selectedBoxId, setSelectedBoxId] = useState<string>('box-almond-mrp');
  const [isScanning, setIsScanning] = useState(true);
  const [viewMode, setViewMode] = useState<InspectionViewMode>('HUD_SCAN');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copiedRule, setCopiedRule] = useState(false);
  const [tiltDeg, setTiltDeg] = useState({ x: 0, y: 0 });
  const [caliperSliderMm, setCaliperSliderMm] = useState<number>(1.8);
  const packageRef = useRef<HTMLDivElement>(null);

  const currentSample = sampleItems[sampleIndex];
  const activeBox =
    currentSample.boxes.find((b) => b.id === selectedBoxId) ||
    currentSample.boxes[0];

  // Synchronize box when sample package changes
  useEffect(() => {
    setSelectedBoxId(currentSample.boxes[0].id);
    if (currentSample.boxes[0].fontMeasurement) {
      setCaliperSliderMm(currentSample.boxes[0].fontMeasurement.actualMm);
    } else {
      setCaliperSliderMm(2.0);
    }
  }, [sampleIndex, currentSample.boxes]);

  // Update caliper slider when active box changes
  useEffect(() => {
    if (activeBox?.fontMeasurement) {
      setCaliperSliderMm(activeBox.fontMeasurement.actualMm);
    }
  }, [activeBox]);

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundFX.enabled = newState;
    if (newState) {
      soundFX.playScanPing();
    }
  };

  const handleSelectBox = (box: BoundingBoxItem) => {
    setSelectedBoxId(box.id);
    if (soundEnabled) {
      if (box.status === 'COMPLIANT') {
        soundFX.playSuccessChime();
      } else {
        soundFX.playFlagWarning();
      }
    }
  };

  const handleNextSample = () => {
    setSampleIndex((prev) => (prev + 1) % sampleItems.length);
    if (soundEnabled) soundFX.playScanPing();
  };

  const handleToggleScan = () => {
    setIsScanning((prev) => !prev);
    if (soundEnabled) soundFX.playScanPing();
  };

  const handleCopyNoticeCitation = () => {
    if (!activeBox) return;
    const text = `METROLOGY NOTICE CITATION:\nPackage: ${currentSample.name}\nBatch: ${currentSample.batchCode}\nRule Violated: ${activeBox.ruleCode} (${activeBox.ruleTitle})\nDeclared Text: "${activeBox.value}"\nInspector Reason: ${activeBox.details}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedRule(true);
      setTimeout(() => setCopiedRule(false), 2000);
    });
  };

  // 3D Perspective Tilt on Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!packageRef.current) return;
    const rect = packageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;
    setTiltDeg({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTiltDeg({ x: 0, y: 0 });
  };

  const compliantCount = currentSample.boxes.filter((b) => b.status === 'COMPLIANT').length;
  const flaggedCount = currentSample.boxes.filter((b) => b.status === 'FLAGGED').length;

  return (
    <div className="w-full bg-slate-950 border border-slate-800 text-white rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Futuristic Command Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-950/80 backdrop-blur-md">
        {/* Title & Status */}
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Scan className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-extrabold text-base text-white tracking-tight">
                LabelLens Autonomous Inspection Simulator
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                NEURAL VISION PCR-2011
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Interactive diagnostic rig &bull; Switch modes to test font calipers, thermal OCR heatmaps, or rule compliance
            </p>
          </div>
        </div>

        {/* Action Controls & Sound Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Cyber Audio Feedback'}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Scanner Active/Pause Toggle */}
          <button
            type="button"
            onClick={handleToggleScan}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              isScanning
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 shadow-2xs'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isScanning ? 'text-cyan-400 animate-spin' : ''}`} />
            <span>{isScanning ? 'Laser Active' : 'Laser Paused'}</span>
          </button>

          {/* Switch Sample Package */}
          <button
            type="button"
            onClick={handleNextSample}
            className="px-3.5 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 border border-blue-500/40 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Next Sample ({sampleIndex + 1}/{sampleItems.length})</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs (HUD, Caliper, Heatmap, Telemetry) */}
      <div className="px-4 sm:px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-xs scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase mr-1">
            Display Mode:
          </span>

          <button
            type="button"
            onClick={() => {
              setViewMode('HUD_SCAN');
              if (soundEnabled) soundFX.playScanPing();
            }}
            className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'HUD_SCAN'
                ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>HUD / Vision Boxes</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('CALIPER_RULE13');
              if (soundEnabled) soundFX.playScanPing();
            }}
            className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'CALIPER_RULE13'
                ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(217,119,6,0.4)]'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-amber-300" />
            <span>Rule 13 Font Caliper</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('HEATMAP');
              if (soundEnabled) soundFX.playScanPing();
            }}
            className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'HEATMAP'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.4)]'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-purple-300" />
            <span>Attention Heatmap</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('DIAGNOSTICS');
              if (soundEnabled) soundFX.playScanPing();
            }}
            className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'DIAGNOSTICS'
                ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(5,150,105,0.4)]'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-300" />
            <span>Neural Telemetry</span>
          </button>
        </div>

        {/* Live package compliance summary badge */}
        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400">Score:</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
            <div
              className={`w-2 h-2 rounded-full ${
                currentSample.complianceRating >= 80
                  ? 'bg-emerald-400 animate-pulse'
                  : currentSample.complianceRating >= 50
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-xs font-mono font-black text-white">
              {currentSample.complianceRating}% Valid
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Simulated Package Visual Canvas (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center relative select-none overflow-hidden min-h-[480px]">
          {/* Cyber Grid Background */}
          <div className="absolute inset-0 bg-gov-dark-pattern opacity-70 pointer-events-none" />

          {/* High-tech Corner Reticles */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none" />

          {/* Telemetry watermark tag */}
          <div className="absolute top-4 left-14 font-mono text-[9px] text-cyan-400/70 tracking-widest pointer-events-none">
            FPS: 60 &bull; LATENCY: 38ms &bull; DPI: 300 &bull; TARGET: {currentSample.batchCode}
          </div>

          {/* Package 3D Perspective Container */}
          <div
            ref={packageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tiltDeg.x}deg) rotateY(${tiltDeg.y}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="relative w-full max-w-md aspect-3/4 rounded-2xl border-2 border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between group"
          >
            {/* Glossy holographic shimmer sheen on package corner */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl pointer-events-none" />

            {/* Top Package Branding Header with Hologram Stamp */}
            <div className="relative z-10 space-y-2 border-b border-slate-700/60 pb-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700 text-[10px] uppercase font-mono tracking-wider font-bold text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  {currentSample.category}
                </div>

                {/* Simulated Holographic Security Seal */}
                <div className="relative px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-purple-500/20 border border-white/20 text-[9px] font-mono font-black text-slate-200 tracking-wider overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
                  HOLOGRAM SEAL
                </div>
              </div>

              <div>
                <h4 className="font-display font-black text-xl text-white tracking-tight leading-tight">
                  {currentSample.name}
                </h4>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  {currentSample.subtitle}
                </p>
              </div>
            </div>

            {/* Center Package Body / Overlays based on viewMode */}
            <div className="relative w-full h-full my-3">
              {/* Animated Laser Scanner Line */}
              {isScanning && viewMode === 'HUD_SCAN' && (
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#38bdf8] z-30 animate-scanline pointer-events-none">
                  <div className="w-full h-8 bg-cyan-400/10 blur-sm pointer-events-none" />
                </div>
              )}

              {/* MODE 1: HUD_SCAN (Interactive Bounding Boxes) */}
              {viewMode === 'HUD_SCAN' && (
                <div className="relative w-full h-full">
                  {currentSample.boxes.map((box) => {
                    const isSelected = selectedBoxId === box.id;
                    const isCompliant = box.status === 'COMPLIANT';

                    return (
                      <motion.div
                        key={box.id}
                        onClick={() => handleSelectBox(box)}
                        style={{
                          top: box.top,
                          left: box.left,
                          width: box.width,
                          height: box.height,
                        }}
                        whileHover={{ scale: 1.02 }}
                        className={`absolute rounded-lg cursor-pointer transition-all duration-200 z-20 p-2 flex flex-col justify-between ${
                          isSelected
                            ? isCompliant
                              ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                              : 'bg-rose-500/20 border-2 border-rose-400 shadow-[0_0_20px_rgba(251,113,133,0.4)]'
                            : 'bg-slate-800/40 border border-dashed border-slate-600 hover:border-cyan-400 hover:bg-cyan-500/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
                              isSelected
                                ? isCompliant
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                  : 'bg-rose-950 text-rose-300 border border-rose-700'
                                : 'bg-slate-900/90 text-slate-300'
                            }`}
                          >
                            {box.ruleCode}
                          </span>

                          {isCompliant ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
                          )}
                        </div>

                        <div className="truncate text-xs font-mono text-slate-100 font-bold tracking-tight">
                          {box.value}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* MODE 2: CALIPER_RULE13 (Interactive Digital Font Caliper Tool) */}
              {viewMode === 'CALIPER_RULE13' && (
                <div className="relative w-full h-full flex flex-col justify-center items-center bg-slate-950/70 border border-amber-500/30 rounded-xl p-4">
                  {/* Caliper HUD Top Readout */}
                  <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-xs font-mono">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <Ruler className="w-4 h-4" />
                      Digital Optical Caliper
                    </span>
                    <span className="text-slate-400">Rule 13 Table I</span>
                  </div>

                  {/* Simulated Zoomed Numeral Under Vernier Caliper */}
                  <div className="relative w-full py-6 px-4 bg-slate-900 border-2 border-slate-700 rounded-xl text-center overflow-hidden">
                    {/* Measurement Grid Lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:10px_10px] opacity-30" />

                    {/* Caliper Upper & Lower Jaw Bars */}
                    <div className="absolute top-2 left-0 right-0 h-1 bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                    <div
                      className="absolute left-0 right-0 h-1 bg-amber-400 shadow-[0_0_8px_#f59e0b] transition-all"
                      style={{ top: `${Math.min(90, 20 + caliperSliderMm * 18)}%` }}
                    />

                    {/* Magnified Text Display */}
                    <div className="relative z-10 space-y-1">
                      <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                        Inspected Numeral Field:
                      </div>
                      <div
                        className="font-mono font-black text-white tracking-wider transition-all"
                        style={{ fontSize: `${caliperSliderMm * 13}px` }}
                      >
                        400 g
                      </div>
                      <div className="text-[10px] font-mono text-cyan-400 font-bold">
                        Digital Reading: {caliperSliderMm.toFixed(1)} mm
                      </div>
                    </div>
                  </div>

                  {/* Interactive Slider to simulate adjusting the caliper */}
                  <div className="w-full mt-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Adjust Caliper Jaws:</span>
                      <span
                        className={`font-bold ${
                          caliperSliderMm >= 2.5 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {caliperSliderMm.toFixed(1)} mm ({caliperSliderMm >= 2.5 ? 'COMPLIANT' : 'DEFICIT'})
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1.0"
                      max="4.0"
                      step="0.1"
                      value={caliperSliderMm}
                      onChange={(e) => setCaliperSliderMm(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />

                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>1.0 mm</span>
                      <span className="text-amber-400 font-bold">Min 2.5 mm req.</span>
                      <span>4.0 mm</span>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 3: HEATMAP (Attention / OCR Neural Heatmap) */}
              {viewMode === 'HEATMAP' && (
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-4">
                  {/* Pseudo Thermal Colors */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/60 via-cyan-900/40 to-emerald-900/50 mix-blend-screen pointer-events-none" />

                  {/* Hotspots over detected areas */}
                  <div className="absolute top-[20%] left-[20%] w-36 h-12 bg-rose-500/40 rounded-full blur-xl animate-pulse" />
                  <div className="absolute top-[50%] left-[30%] w-48 h-14 bg-cyan-400/40 rounded-full blur-xl animate-pulse" />
                  <div className="absolute top-[70%] left-[20%] w-40 h-12 bg-amber-500/40 rounded-full blur-xl animate-pulse" />

                  <div className="relative z-10 text-center space-y-2 p-4 bg-slate-900/90 border border-slate-700 rounded-xl">
                    <Flame className="w-8 h-8 text-purple-400 mx-auto animate-bounce" />
                    <div className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                      OCR Attention Heatmap Active
                    </div>
                    <p className="text-[11px] text-slate-300 max-w-xs font-sans">
                      Neural vision filters isolate text regions from background illustrations and embossed packaging foil.
                    </p>
                  </div>
                </div>
              )}

              {/* MODE 4: DIAGNOSTICS (Real-Time Vision Model Telemetry) */}
              {viewMode === 'DIAGNOSTICS' && (
                <div className="relative w-full h-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4" />
                      Hardware Telemetry
                    </span>
                    <span>ONLINE</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">Model Architecture</span>
                      <span className="text-slate-200 font-bold">LabelLensOCR v3.2</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">PDP Area Computed</span>
                      <span className="text-cyan-300 font-bold">{currentSample.pdpArea}</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">Confidence Score</span>
                      <span className="text-emerald-400 font-bold">99.4% Validated</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">OCR Tokens</span>
                      <span className="text-slate-200 font-bold">42 Tokens Extracted</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      Deterministic Statutory Rules Codified:
                    </span>
                    <div className="text-[10px] text-slate-300 leading-relaxed">
                      &bull; Rule 6(1)(a): Manufacturer & Importer Names<br />
                      &bull; Rule 6(1)(c): Date of Packaging & Month<br />
                      &bull; Rule 6(1)(d): Customer Grievance Contacts<br />
                      &bull; Rule 6(1)(e): Inclusive Retail MRP Syntax<br />
                      &bull; Rule 11 & 13: SI Metric Units & Numeral Height
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Package Barcode Stamp & Principal Display Area Footer */}
            <div className="relative z-10 flex items-center justify-between border-t border-slate-700/60 pt-3 text-[10px] font-mono text-slate-400">
              <div className="space-y-0.5">
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                  Principal Display Area (PDP)
                </div>
                <div className="text-cyan-300 font-bold">{currentSample.pdpArea}</div>
              </div>

              {/* Faux Barcode Graphic */}
              <div className="flex items-center gap-2">
                <div className="flex h-5 items-center gap-0.5 bg-white p-1 rounded">
                  <span className="w-0.5 h-full bg-black inline-block" />
                  <span className="w-1 h-full bg-black inline-block" />
                  <span className="w-0.5 h-full bg-black inline-block" />
                  <span className="w-1.5 h-full bg-black inline-block" />
                  <span className="w-0.5 h-full bg-black inline-block" />
                  <span className="w-1 h-full bg-black inline-block" />
                  <span className="w-0.5 h-full bg-black inline-block" />
                </div>
                <div className="text-right">
                  <div className="text-[9px] uppercase text-slate-500 font-bold">Batch ID</div>
                  <div className="text-slate-300 font-bold">{currentSample.batchCode}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Bottom Instruction Hint */}
          <div className="mt-4 text-center">
            <span className="text-xs text-slate-400 inline-flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Click any highlighted box above or switch tabs to examine specific legal requirements</span>
            </span>
          </div>
        </div>

        {/* Right Dynamic Rule Evaluation Ledger (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header / Engine ID */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
                  Rule Evaluation Ledger
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded">
                PCR 2011 Engine
              </span>
            </div>

            <AnimatePresence mode="wait">
              {activeBox && (
                <motion.div
                  key={activeBox.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Status Banner */}
                  <div
                    className={`p-3.5 rounded-2xl border flex items-center justify-between shadow-lg ${
                      activeBox.status === 'COMPLIANT'
                        ? 'bg-emerald-950/60 border-emerald-700/80 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-700/80 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {activeBox.status === 'COMPLIANT' ? (
                        <div className="p-1.5 rounded-lg bg-emerald-900/80 border border-emerald-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-lg bg-rose-900/80 border border-rose-600">
                          <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                        </div>
                      )}
                      <div>
                        <div className="font-display font-bold text-xs sm:text-sm">
                          {activeBox.status === 'COMPLIANT'
                            ? 'Statutory Requirement Satisfied'
                            : 'Potential Statutory Defect Flagged'}
                        </div>
                        <div className="text-[11px] opacity-80 font-mono">{activeBox.ruleCode}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase font-mono px-2.5 py-1 rounded-full ${
                        activeBox.status === 'COMPLIANT'
                          ? 'bg-emerald-800 text-emerald-100'
                          : 'bg-rose-800 text-rose-100'
                      }`}
                    >
                      {activeBox.status}
                    </span>
                  </div>

                  {/* Declaration Details */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px] font-mono">
                        Target Field Declaration:
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {activeBox.label}
                      </h4>
                    </div>

                    {/* Extracted Text (OCR Readout) */}
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Extracted Text (OCR Readout):</span>
                        <span className="text-emerald-400">99.4% Match</span>
                      </div>
                      <p className="font-mono text-xs text-cyan-300 font-bold">
                        &ldquo;{activeBox.value}&rdquo;
                      </p>
                    </div>

                    {/* Actual vs Expected (If Flagged) */}
                    {activeBox.actualVsExpected && (
                      <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-rose-400">
                          <span>Statutory Discrepancy:</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div>
                            <span className="text-slate-400 text-[10px] block">Actual Declared:</span>
                            <span className="text-rose-300 line-through">
                              {activeBox.actualVsExpected.actual}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Mandatory Rule:</span>
                            <span className="text-emerald-400 font-bold">
                              {activeBox.actualVsExpected.expected}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Legal Metrology Citation */}
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[11px] font-mono block">
                        Legal Metrology Rule Citation:
                      </span>
                      <p className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{activeBox.ruleTitle} &bull; PCR 2011</span>
                      </p>
                    </div>

                    {/* Legal Reason & Analysis */}
                    <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
                      <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block font-bold">
                        Statutory Analysis &amp; Case Notes:
                      </span>
                      <p className="text-slate-300 leading-relaxed text-xs font-sans">
                        {activeBox.details}
                      </p>
                    </div>

                    {/* Copy Citation Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleCopyNoticeCitation}
                        className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-mono text-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {copiedRule ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Citation Copied to Clipboard</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copy Citation for Official Notice</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Stats / Ledger Footer */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-mono">Parameters</span>
              <span className="font-mono font-black text-white text-base">
                {currentSample.boxes.length} Fields
              </span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-mono">Compliant</span>
              <span className="font-mono font-black text-emerald-400 text-base">
                {compliantCount}
              </span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] font-mono">Flagged</span>
              <span className="font-mono font-black text-rose-400 text-base">
                {flaggedCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
