import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: 'default' | 'amber' | 'emerald' | 'blue';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'default',
  onClick,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'amber':
        return {
          iconBg: 'bg-amber-100 text-amber-800',
          border: 'border-amber-200 hover:border-amber-300',
          highlight: 'text-amber-900',
        };
      case 'emerald':
        return {
          iconBg: 'bg-emerald-100 text-emerald-800',
          border: 'border-emerald-200 hover:border-emerald-300',
          highlight: 'text-emerald-900',
        };
      case 'blue':
        return {
          iconBg: 'bg-blue-100 text-blue-800',
          border: 'border-blue-200 hover:border-blue-300',
          highlight: 'text-blue-900',
        };
      default:
        return {
          iconBg: 'bg-slate-100 text-slate-800',
          border: 'border-slate-200 hover:border-slate-300',
          highlight: 'text-slate-900',
        };
    }
  };

  const colors = getColors();

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white border rounded-lg p-5 transition-all ${colors.border} ${
        onClick ? 'cursor-pointer hover:shadow-xs' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className={`mt-2 text-3xl font-bold tracking-tight ${colors.highlight}`}>{value}</p>
          {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
        </div>
        <div className={`p-2.5 rounded-md ${colors.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
