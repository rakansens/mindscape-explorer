import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  text, 
  children, 
  position = 'top' 
}) => {
  const positionClasses = {
    top: '-top-10 left-1/2 -translate-x-1/2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  const arrowClasses = {
    top: '-bottom-1 left-1/2 -translate-x-1/2 border-t-gray-900/90',
    bottom: '-top-1 left-1/2 -translate-x-1/2 border-b-gray-900/90',
    left: '-right-1 top-1/2 -translate-y-1/2 border-l-gray-900/90',
  };

  return (
    <div className="group relative">
      {children}
      <div className={`absolute ${positionClasses[position]} px-3 py-1.5 
        bg-gray-900/90 text-white text-sm rounded-lg opacity-0 invisible
        group-hover:opacity-100 group-hover:visible transition-all duration-200
        whitespace-nowrap backdrop-blur-sm shadow-lg z-50`}
      >
        {text}
        <div className={`absolute ${arrowClasses[position]} 
          border-4 border-transparent`}
        />
      </div>
    </div>
  );
};