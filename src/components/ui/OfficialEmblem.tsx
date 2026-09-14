import React from 'react';

interface OfficialEmblemProps {
  type?: 'india' | 'ladakh' | 'maharashtra' | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showCaption?: boolean;
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
};

export const OfficialEmblem: React.FC<OfficialEmblemProps> = ({
  size = 'md',
  className = '',
  showCaption = false,
}) => {
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <img
        src="/assets/emblem-india.svg"
        alt="State Emblem of India - Government of India"
        className={`${sizeClass} object-contain shrink-0`}
        loading="eager"
      />
      {showCaption && (
        <div className="text-center mt-1">
          <span className="block text-[10px] font-black tracking-tight text-slate-800">
            सत्यमेव जयते
          </span>
          <span className="block text-[9px] font-bold text-slate-600 uppercase tracking-wider">
            Government of India
          </span>
        </div>
      )}
    </div>
  );
};
