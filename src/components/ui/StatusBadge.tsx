import React from 'react';
import { CheckCircle, Clock, AlertTriangle, FileText, XCircle, HelpCircle } from 'lucide-react';
import { InspectionStatus, ReviewStatus, SeverityLevel } from '../../types';

interface StatusBadgeProps {
  status: InspectionStatus | ReviewStatus | SeverityLevel | string;
  size?: 'sm' | 'md';
  id?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', id }) => {
  const norm = status?.toUpperCase() || '';

  const getStyleAndIcon = () => {
    switch (norm) {
      case 'REPORT_READY':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          label: 'Report ready',
          icon: <CheckCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
        };
      case 'VERIFIED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          label: 'Inspector verified',
          icon: <CheckCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
        };
      case 'REVIEW_REQUIRED':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          label: 'Review required',
          icon: <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
        };
      case 'PENDING':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          label: 'Pending review',
          icon: <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
        };
      case 'NEEDS_MORE_EVIDENCE':
        return {
          bg: 'bg-sky-50 text-sky-800 border-sky-300',
          label: 'Needs more evidence',
          icon: <HelpCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
        };
      case 'NOT_APPLICABLE':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          label: 'Not applicable',
          icon: <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
        };
      case 'DRAFT':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          label: 'Draft inspection',
          icon: <FileText className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
        };
      case 'PROCESSING':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          label: 'Processing',
          icon: <Clock className={`animate-spin ${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />,
        };
      case 'HIGH':
        return {
          bg: 'bg-red-50 text-red-800 border-red-300',
          label: 'High severity',
          icon: <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          label: 'Medium severity',
          icon: <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
        };
      case 'LOW':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          label: 'Low severity',
          icon: <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          label: status,
          icon: null,
        };
    }
  };

  const { bg, label, icon } = getStyleAndIcon();

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md select-none whitespace-nowrap ${bg} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};
