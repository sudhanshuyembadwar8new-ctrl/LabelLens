import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      id="labellens-system-banner"
      role="region"
      aria-label="System Compliance Notice"
      className="hidden sm:flex bg-blue-50/90 border-b border-blue-200/80 px-4 py-1.5 text-xs text-blue-950 items-center justify-between gap-3 shadow-2xs"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="inline-flex items-center gap-1 font-bold bg-blue-200 text-blue-950 px-2 py-0.5 rounded text-[10px] tracking-wide uppercase shrink-0">
          <ShieldCheck className="w-3 h-3 text-blue-900" />
          AI-Assisted Engine
        </span>
        <span className="text-[11px] font-medium text-slate-700 truncate">
          Legal Metrology Enforcement System • PCR 2011 compliance check • Officer verification required
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="font-mono text-[10px] text-blue-900/80 bg-blue-100/70 px-1.5 py-0.5 rounded border border-blue-200">
          PCR-2011-V2.1
        </span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-blue-800/70 hover:text-blue-950 p-0.5 rounded hover:bg-blue-100 transition-colors cursor-pointer"
          title="Dismiss notice"
          aria-label="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
