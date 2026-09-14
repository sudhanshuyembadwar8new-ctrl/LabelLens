import React from 'react';
import { ExtractedField } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { Tag, CheckCircle2, AlertCircle } from 'lucide-react';

interface ExtractedFieldsPanelProps {
  fields: ExtractedField[];
}

export const ExtractedFieldsPanel: React.FC<ExtractedFieldsPanelProps> = ({ fields }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-blue-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Mock Extracted Markings (PCR 2011 Mandatory Declarations)
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
          {fields.length} Fields Recorded
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-4">Field Name</th>
              <th className="py-2.5 px-4">Observed Value</th>
              <th className="py-2.5 px-4">Source Region</th>
              <th className="py-2.5 px-4">Confidence</th>
              <th className="py-2.5 px-4">Review Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {fields.map((field) => (
              <tr key={field.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-4 font-semibold text-slate-800">
                  {field.name}
                </td>
                <td className="py-2.5 px-4 font-mono text-slate-900 font-medium">
                  {field.value}
                </td>
                <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                  {field.source}
                </td>
                <td className="py-2.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      field.confidence === 'HIGH'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {field.confidence === 'HIGH' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                    )}
                    {field.confidence}
                  </span>
                </td>
                <td className="py-2.5 px-4">
                  <StatusBadge status={field.status} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-slate-50/60 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Extracted statutory fields require inspector verification against physical sample.</span>
        <span className="font-semibold text-slate-700">Inspector verification active</span>
      </div>
    </div>
  );
};
