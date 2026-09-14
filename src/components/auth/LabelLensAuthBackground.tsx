import React from 'react';

/**
 * LabelLensAuthBackground
 * 
 * An original, lightweight SVG/CSS visual inspection background communicating:
 * - Package wireframes and geometry
 * - Optical scanner / camera viewfinder brackets
 * - Measurement millimeter grids (PCR 2011 Schedule II font calibration)
 * - Label declaration segments (Net Qty, MRP, Packer Address)
 * - Fine regulatory inspection lines and crosshairs
 * 
 * Optimized for high contrast, crisp readability, and zero performance overhead.
 */
export const LabelLensAuthBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Graphic Canvas */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Deep Midnight Gradient Base */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-95" />

        {/* SVG Technical Grid & Inspection Motifs */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Fine 40px grid with crosshairs */}
            <pattern id="labellens-fine-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(59, 130, 246, 0.12)"
                strokeWidth="0.75"
              />
              <circle cx="0" cy="0" r="1" fill="rgba(147, 197, 253, 0.25)" />
              <path
                d="M -3 0 L 3 0 M 0 -3 L 0 3"
                stroke="rgba(96, 165, 250, 0.25)"
                strokeWidth="0.5"
              />
            </pattern>

            {/* Sub-grid 200px major coordinates */}
            <pattern id="labellens-major-grid" width="200" height="200" patternUnits="userSpaceOnUse">
              <rect width="200" height="200" fill="url(#labellens-fine-grid)" />
              <path
                d="M 200 0 L 0 0 0 200"
                fill="none"
                stroke="rgba(96, 165, 250, 0.25)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#labellens-major-grid)" />

          {/* Top-Left Package Wireframe Motif */}
          <g className="opacity-40" transform="translate(60, 80)">
            {/* 3D Package projection */}
            <path
              d="M 0 40 L 90 0 L 180 40 L 90 80 Z"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <path
              d="M 0 40 L 0 160 L 90 200 L 90 80 Z"
              fill="rgba(30, 58, 138, 0.15)"
              stroke="#3B82F6"
              strokeWidth="1.2"
            />
            <path
              d="M 180 40 L 180 160 L 90 200 L 90 80 Z"
              fill="rgba(30, 58, 138, 0.08)"
              stroke="#3B82F6"
              strokeWidth="1.2"
            />
            {/* Viewfinder Target */}
            <path
              d="M 20 100 L 35 100 M 20 100 L 20 115"
              stroke="#60A5FA"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 70 100 L 55 100 M 70 100 L 70 115"
              stroke="#60A5FA"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 20 140 L 35 140 M 20 140 L 20 125"
              stroke="#60A5FA"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 70 140 L 55 140 M 70 140 L 70 125"
              stroke="#60A5FA"
              strokeWidth="2"
              fill="none"
            />
            <text x="25" y="125" fill="#93C5FD" fontSize="8" fontFamily="monospace">
              OCR: 5kg
            </text>
            <text x="2" y="215" fill="#64748B" fontSize="9" fontFamily="monospace">
              FIG 1.0 — COMMODITY ENVELOPE
            </text>
          </g>

          {/* Bottom-Right Measurement & Rule 13 Caliper Motif */}
          <g className="opacity-40 hidden md:block" transform="translate(1100, 480)">
            {/* Millimeter calibration ruler */}
            <rect
              x="0"
              y="0"
              width="240"
              height="80"
              rx="6"
              fill="rgba(15, 23, 42, 0.8)"
              stroke="#3B82F6"
              strokeWidth="1"
            />
            {/* Ticks */}
            <path
              d="M 20 20 L 20 40 M 30 20 L 30 30 M 40 20 L 40 30 M 50 20 L 50 35 M 60 20 L 60 30 M 70 20 L 70 30 M 80 20 L 80 40 M 90 20 L 90 30 M 100 20 L 100 30 M 110 20 L 110 35 M 120 20 L 120 40 M 130 20 L 130 30 M 140 20 L 140 30 M 150 20 L 150 35 M 160 20 L 160 40 M 170 20 L 170 30 M 180 20 L 180 30 M 190 20 L 190 35 M 200 20 L 200 40 M 210 20 L 210 30 M 220 20 L 220 40"
              stroke="#93C5FD"
              strokeWidth="1"
            />
            <text x="20" y="55" fill="#93C5FD" fontSize="9" fontFamily="monospace">
              0mm
            </text>
            <text x="75" y="55" fill="#93C5FD" fontSize="9" fontFamily="monospace">
              10mm
            </text>
            <text x="135" y="55" fill="#93C5FD" fontSize="9" fontFamily="monospace">
              20mm
            </text>
            <text x="195" y="55" fill="#93C5FD" fontSize="9" fontFamily="monospace">
              30mm
            </text>
            <text x="20" y="70" fill="#60A5FA" fontSize="8" fontFamily="monospace">
              RULE 13 FONT HEIGHT VERIFICATION
            </text>
          </g>

          {/* Top-Right Optical Laser Scanline & Barcode Frame */}
          <g className="opacity-35 hidden lg:block" transform="translate(1080, 80)">
            <rect
              x="0"
              y="0"
              width="200"
              height="120"
              rx="4"
              fill="rgba(15, 23, 42, 0.6)"
              stroke="#2563EB"
              strokeWidth="1"
              strokeDasharray="6 3"
            />
            {/* Barcode lines */}
            <path
              d="M 20 25 L 20 75 M 24 25 L 24 75 M 30 25 L 30 75 M 34 25 L 34 75 M 38 25 L 38 75 M 46 25 L 46 75 M 50 25 L 50 75 M 56 25 L 56 75 M 64 25 L 64 75 M 70 25 L 70 75 M 74 25 L 74 75 M 82 25 L 82 75 M 90 25 L 90 75 M 98 25 L 98 75 M 104 25 L 104 75 M 112 25 L 112 75 M 120 25 L 120 75 M 126 25 L 126 75 M 134 25 L 134 75 M 140 25 L 140 75 M 148 25 L 148 75 M 154 25 L 154 75 M 160 25 L 160 75 M 168 25 L 168 75 M 174 25 L 174 75 M 180 25 L 180 75"
              stroke="#60A5FA"
              strokeWidth="2"
            />
            {/* Laser scanning red/blue beam line */}
            <line x1="10" y1="50" x2="190" y2="50" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="20" y="92" fill="#E2E8F0" fontSize="9" fontFamily="monospace" letterSpacing="2">
              8 901030 892341
            </text>
            <text x="20" y="106" fill="#38BDF8" fontSize="8" fontFamily="monospace">
              SCANNER: OPTICAL ALIGNMENT OK
            </text>
          </g>

          {/* Bottom-Left Statutory Declarations Checklist Schematics */}
          <g className="opacity-35 hidden md:block" transform="translate(60, 480)">
            <rect
              x="0"
              y="0"
              width="220"
              height="110"
              rx="4"
              fill="rgba(15, 23, 42, 0.6)"
              stroke="#3B82F6"
              strokeWidth="0.8"
            />
            <text x="15" y="24" fill="#93C5FD" fontSize="9" fontFamily="monospace" fontWeight="bold">
              PCR 2011 MANDATORY CHECK
            </text>
            <path
              d="M 15 36 L 22 43 L 32 32"
              fill="none"
              stroke="#34D399"
              strokeWidth="1.5"
            />
            <text x="40" y="38" fill="#CBD5E1" fontSize="8" fontFamily="monospace">
              [R.6(1)(a)] NAME & ADDRESS
            </text>
            <path
              d="M 15 54 L 22 61 L 32 50"
              fill="none"
              stroke="#34D399"
              strokeWidth="1.5"
            />
            <text x="40" y="56" fill="#CBD5E1" fontSize="8" fontFamily="monospace">
              [R.6(1)(b)] GENERIC COMMODITY
            </text>
            <path
              d="M 15 72 L 22 79 L 32 68"
              fill="none"
              stroke="#34D399"
              strokeWidth="1.5"
            />
            <text x="40" y="74" fill="#CBD5E1" fontSize="8" fontFamily="monospace">
              [R.6(1)(c)] NET QUANTITY (g/kg/ml)
            </text>
            <path
              d="M 15 90 L 22 97 L 32 86"
              fill="none"
              stroke="#34D399"
              strokeWidth="1.5"
            />
            <text x="40" y="92" fill="#CBD5E1" fontSize="8" fontFamily="monospace">
              [R.6(1)(d)] MRP INCL. ALL TAXES
            </text>
          </g>
        </svg>

        {/* Subtle Radial Glow in Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Content Outlet */}
      <div className="relative z-10 flex-1 flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

export const MetrixAuthBackground = LabelLensAuthBackground;
export const LablelensAuthBackground = LabelLensAuthBackground;
