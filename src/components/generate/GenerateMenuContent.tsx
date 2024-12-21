import React from 'react';
import { GenerateMenuButtons } from './GenerateMenuButtons';

interface GenerateMenuContentProps {
  isLoading: boolean;
  onGenerate: (mode: 'quick' | 'detailed' | 'why' | 'how' | 'regenerate' | 'ideas') => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const GenerateMenuContent: React.FC<GenerateMenuContentProps> = ({
  isLoading,
  onGenerate,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className="absolute left-full top-0 bg-white rounded-lg shadow-lg p-2 min-w-[120px] z-[60] ml-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex flex-col gap-2">
        <GenerateMenuButtons
          isLoading={isLoading}
          onGenerate={onGenerate}
        />
      </div>
    </div>
  );
};