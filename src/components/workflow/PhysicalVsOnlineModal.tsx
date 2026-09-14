import React, { useState } from 'react';
import {
  X,
  Globe,
  Upload,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  ArrowRightLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Inspection, OnlineComparisonData, OnlineComparisonItem } from '../../types';

interface PhysicalVsOnlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: Inspection;
  onSaveComparison?: (data: OnlineComparisonData) => void;
}

export const PhysicalVsOnlineModal: React.FC<PhysicalVsOnlineModalProps> = ({
  isOpen,
  onClose,
  inspection,
  onSaveComparison,
}) => {
  if (!isOpen) return null;

  const [platform, setPlatform] = useState<
    'Blinkit' | 'Zepto' | 'Amazon' | 'Flipkart' | 'BigBasket' | 'Other'
  >('Blinkit');
  const [listingUrl, setListingUrl] = useState<string>('https://blinkit.com/prn/sample-commodity-item');
  const [listingScreenshot, setListingScreenshot] = useState<string | null>(null);

  // Editable online parameters prefilled with intelligent initial guesses for comparison testing
  const [onlineBrand, setOnlineBrand] = useState<string>(inspection.product.brand || 'Retail Brand');
  const [onlineName, setOnlineName] = useState<string>(inspection.product.name || 'Commodity Package');
  const [onlineMrp, setOnlineMrp] = useState<string>('₹ 450.00'); // deliberate ₹30 discrepancy for testing
  const [onlineQty, setOnlineQty] = useState<string>(inspection.product.declaredQuantity || '5 kg');
  const [onlineUsp, setOnlineUsp] = useState<string>('Not declared on app listing'); // PCR Rule 6(10) check
  const [onlineMfr, setOnlineMfr] = useState<string>(
    inspection.product.brand ? `${inspection.product.brand} Consumer Products Ltd.` : 'Manufacturer Ltd.'
  );
  const [onlineCountry, setOnlineCountry] = useState<string>('India');
  const [onlineDates, setOnlineDates] = useState<string>('Best before 12 months from packing');

  // Compute comparison parameters
  const comparisonItems: OnlineComparisonItem[] = [
    {
      field: 'Product Generic Name',
      physicalValue: inspection.product.name || 'Commodity Package',
      onlineValue: onlineName,
      status:
        onlineName.trim().toLowerCase() === (inspection.product.name || '').trim().toLowerCase()
          ? 'MATCH'
          : 'MISMATCH',
      discrepancyNote:
        onlineName.trim().toLowerCase() === (inspection.product.name || '').trim().toLowerCase()
          ? 'Product descriptions match.'
          : 'Product titles differ between physical pack and platform catalog.',
    },
    {
      field: 'Brand Trademark',
      physicalValue: inspection.product.brand || 'Brand',
      onlineValue: onlineBrand,
      status:
        onlineBrand.trim().toLowerCase() === (inspection.product.brand || '').trim().toLowerCase()
          ? 'MATCH'
          : 'MISMATCH',
    },
    {
      field: 'Maximum Retail Price (MRP)',
      physicalValue: '₹ 420.00 (inclusive of taxes)',
      onlineValue: onlineMrp,
      status: onlineMrp.includes('420') ? 'MATCH' : 'MISMATCH',
      discrepancyNote: onlineMrp.includes('420')
        ? 'Price declarations align.'
        : 'Discrepancy: Online listing displays higher price than physical pack MRP.',
    },
    {
      field: 'Declared Net Quantity',
      physicalValue: inspection.product.declaredQuantity || '5 kg',
      onlineValue: onlineQty,
      status:
        onlineQty.trim().toLowerCase() === (inspection.product.declaredQuantity || '').trim().toLowerCase()
          ? 'MATCH'
          : 'MISMATCH',
    },
    {
      field: 'Unit Sale Price (USP)',
      physicalValue: '₹ 84.00 per kg',
      onlineValue: onlineUsp,
      status: onlineUsp.toLowerCase().includes('per') ? 'MATCH' : 'MISMATCH',
      discrepancyNote: onlineUsp.toLowerCase().includes('per')
        ? 'Unit Sale Price displayed on e-commerce page.'
        : 'Rule 6(10) Non-Compliance: Mandatory Unit Sale Price missing on digital product listing.',
    },
    {
      field: 'Manufacturer / Packer',
      physicalValue: `${inspection.product.brand || 'Brand'} Consumer Products Ltd.`,
      onlineValue: onlineMfr,
      status: 'MATCH',
    },
    {
      field: 'Country of Origin',
      physicalValue: 'India',
      onlineValue: onlineCountry,
      status: onlineCountry.toLowerCase().includes('india') ? 'MATCH' : 'REVIEW',
    },
    {
      field: 'Manufacturing / Best Before Dates',
      physicalValue: 'Mfg: 08/2026',
      onlineValue: onlineDates,
      status: 'REVIEW',
      discrepancyNote: 'Online page shows generic shelf-life statement instead of actual batch date.',
    },
  ];

  const hasMismatches = comparisonItems.some((item) => item.status === 'MISMATCH');
  const overallStatus: 'MATCH' | 'MISMATCH' | 'REVIEW' = hasMismatches ? 'MISMATCH' : 'REVIEW';

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setListingScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (onSaveComparison) {
      onSaveComparison({
        platform,
        listingUrl,
        screenshotUrl: listingScreenshot || undefined,
        comparisonItems,
        overallStatus,
        reviewedAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-4xl w-full overflow-hidden flex flex-col my-auto animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-700 rounded text-white">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Physical Shelf vs. Online Listing Comparison (PCR Rule 6(10))
              </h3>
              <p className="text-[11px] text-slate-400">
                E-Commerce Mandatory Declarations &amp; Pricing Cross-Verification
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="px-5 py-2.5 bg-blue-50/80 border-b border-blue-200 text-blue-900 text-[11px] flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <strong>Rule 6(10) Enforcement:</strong> E-commerce entities are mandated to display all statutory declarations on digital product pages identical to the physical commodity package, including MRP and Unit Sale Price.
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Top Controls: Platform & Screenshot/URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  E-Commerce Marketplace / Quick-Commerce Platform:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Blinkit', 'Zepto', 'Amazon', 'Flipkart', 'BigBasket', 'Other'] as const).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlatform(p)}
                        className={`px-2.5 py-1.5 rounded text-xs font-semibold border transition-all ${
                          platform === p
                            ? 'bg-blue-700 text-white border-blue-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Product Listing URL / Deep-Link:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="url"
                    value={listingUrl}
                    onChange={(e) => setListingUrl(e.target.value)}
                    className="flex-1 text-xs p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    placeholder="https://..."
                  />
                  <a
                    href={listingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg"
                    title="Open listing in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Listing Screenshot / Evidence Image (Optional):
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-white hover:bg-slate-50 transition-colors">
                {listingScreenshot ? (
                  <div className="relative inline-block">
                    <img
                      src={listingScreenshot}
                      alt="Listing screenshot"
                      className="max-h-24 mx-auto rounded border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setListingScreenshot(null)}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs font-semibold text-blue-700 block">
                      Upload Listing Screenshot
                    </span>
                    <span className="text-[10px] text-slate-400">PNG or JPEG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Side-by-Side Verification Matrix */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <span>Discrepancy Cross-Check Matrix</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    overallStatus === 'MISMATCH'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}
                >
                  {overallStatus === 'MISMATCH' ? 'DISCREPANCIES DETECTED' : 'PARAMETERS CONGRUENT'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Platform: {platform}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                    <th className="p-3 w-1/4">Statutory Declaration</th>
                    <th className="p-3 w-1/3">Physical Shelf Package</th>
                    <th className="p-3 w-1/3">Online E-Commerce Listing</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        item.status === 'MISMATCH' ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <td className="p-3 font-semibold text-slate-800">
                        {item.field}
                        {item.discrepancyNote && (
                          <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                            {item.discrepancyNote}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-700 font-mono bg-slate-50/50">
                        {item.physicalValue}
                      </td>
                      <td className="p-3">
                        {/* Interactive inputs for easy testing */}
                        {item.field === 'Maximum Retail Price (MRP)' ? (
                          <input
                            type="text"
                            value={onlineMrp}
                            onChange={(e) => setOnlineMrp(e.target.value)}
                            className="w-full font-mono text-xs p-1 border rounded bg-white text-slate-900 font-bold"
                          />
                        ) : item.field === 'Unit Sale Price (USP)' ? (
                          <input
                            type="text"
                            value={onlineUsp}
                            onChange={(e) => setOnlineUsp(e.target.value)}
                            className="w-full font-mono text-xs p-1 border rounded bg-white text-slate-900"
                          />
                        ) : (
                          <span className="font-mono text-slate-800">{item.onlineValue}</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {item.status === 'MATCH' && (
                          <span className="inline-flex items-center gap-1 font-bold text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            MATCH
                          </span>
                        )}
                        {item.status === 'MISMATCH' && (
                          <span className="inline-flex items-center gap-1 font-bold text-[11px] text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            MISMATCH
                          </span>
                        )}
                        {item.status === 'REVIEW' && (
                          <span className="inline-flex items-center gap-1 font-bold text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <HelpCircle className="w-3 h-3 text-amber-600" />
                            REVIEW
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Attach E-Commerce Audit to Dossier</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
